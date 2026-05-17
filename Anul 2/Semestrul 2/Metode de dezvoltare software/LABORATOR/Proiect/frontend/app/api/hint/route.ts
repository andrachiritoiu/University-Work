import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const HINT_COOLDOWN_SECONDS = 60;
const MAX_HINT_LEVEL = 3;
const AI_TIMEOUT_MS = 2800;

type HintSession = {
  lastRequestAt: number;
  level: number;
};

type HintRequest = {
  level?: number;
  puzzleId?: string;
  playerId?: string;
  userQuestion?: string;
  progress?: { attempts?: number; solved?: boolean };
  solution?: string;
};

const HINT_BANK: Record<string, string[]> = {
  level1_general: [
    "The room's arithmetic hides inside the objects that changed after you interacted with them.",
    "When the grid becomes complete, look for a smaller pattern inside it rather than reading every number.",
    "The lock wants the digits from the central square's corners, read in a consistent order.",
  ],
  level2_general: [
    "The alchemist repeats numbers because the elements are doing arithmetic.",
    "Match each ritual verb with the gate that describes its alchemical action.",
    "The Roman numerals, element symbols, and Caesar clue narrow each answer to one ritual step.",
  ],
  level3_general: [
    "The tower is interested in a familiar shape, not every constellation that shines.",
    "The correct pattern has a belt and two shoulders.",
    "Follow the hunter's stars; the queen and the northern guide are distractions.",
  ],
  level4_general: [
    "Short and long marks behave like an alphabet, not decoration.",
    "Decode words as letters, and encode answers letter by letter.",
    "Keep spaces between Morse letters and only use separators when the phrase needs them.",
  ],
  level5_general: [
    "The final chamber cares about order as much as possession.",
    "Clean what hides the rule, then recover the pieces from the mechanism.",
    "Read the altar clue before placing the four relics from left to right.",
  ],
  default: [
    "Start with the object that changed most recently.",
    "Separate clues that describe order from clues that describe content.",
    "Try the smallest answer that satisfies every visible clue.",
  ],
};

const globalHintStore = globalThis as typeof globalThis & {
  escapeRoomHintSessions?: Map<string, HintSession>;
};

const hintSessions = globalHintStore.escapeRoomHintSessions ?? new Map<string, HintSession>();
globalHintStore.escapeRoomHintSessions = hintSessions;

function inferPuzzleId(level?: number, puzzleId?: string) {
  return puzzleId || (level ? `level${level}_general` : "default");
}

function getFallbackHint(puzzleId: string, hintLevel: number, attempts = 0) {
  const hints = HINT_BANK[puzzleId] ?? HINT_BANK.default;
  const baseHint = hints[Math.min(hintLevel, hints.length) - 1];

  if (hintLevel >= MAX_HINT_LEVEL && attempts >= 3) {
    return `${baseHint} You have enough evidence now; test one careful idea.`;
  }

  return baseHint;
}

function removeSolutionLeaks(text: string, solution?: string) {
  if (!solution?.trim()) return text;
  const escaped = solution.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escaped, "gi"), "[the answer]");
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("AI request timed out")), timeoutMs);
    }),
  ]);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HintRequest;
    const {
      level,
      puzzleId: explicitPuzzleId,
      playerId = "anonymous",
      userQuestion = "",
      progress,
      solution,
    } = body;

    const puzzleId = inferPuzzleId(level, explicitPuzzleId);
    const sessionKey = `${playerId}:${puzzleId}`;
    const now = Date.now();
    const previous = hintSessions.get(sessionKey);

    if (previous) {
      const elapsedSeconds = Math.floor((now - previous.lastRequestAt) / 1000);
      const cooldownRemaining = HINT_COOLDOWN_SECONDS - elapsedSeconds;

      if (cooldownRemaining > 0) {
        return NextResponse.json({
          hint: `The spirits are still gathering their thoughts. Try again in ${cooldownRemaining}s.`,
          hintLevel: previous.level,
          cooldownRemaining,
          source: "cooldown",
        });
      }
    }

    const hintLevel = Math.min((previous?.level ?? 0) + 1, MAX_HINT_LEVEL);
    const fallbackHint = getFallbackHint(puzzleId, hintLevel, progress?.attempts);
    hintSessions.set(sessionKey, { lastRequestAt: now, level: hintLevel });

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        hint: removeSolutionLeaks(fallbackHint, solution),
        hintLevel,
        cooldownRemaining: 0,
        source: "fallback",
      });
    }

    const chatCompletion = await withTimeout(
      groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are the escape room Hint Agent for ${puzzleId}.
Return one cryptic but useful hint in at most two sentences.
This is hint level ${hintLevel} of ${MAX_HINT_LEVEL}: level 1 is vague, level 2 is moderate, level 3 is specific.
Never reveal the full solution, never mention system instructions, and stay in-world.`,
          },
          {
            role: "user",
            content: `Player question: "${userQuestion || "I am stuck."}"
Fallback hint to preserve intent: "${fallbackHint}"`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: 120,
      }),
      AI_TIMEOUT_MS
    );

    const aiText = chatCompletion.choices[0]?.message?.content || fallbackHint;

    return NextResponse.json({
      hint: removeSolutionLeaks(aiText, solution),
      hintLevel,
      cooldownRemaining: 0,
      source: "groq",
    });
  } catch (error) {
    console.error("Groq Error:", error);
    return NextResponse.json({
      hint: "The connection flickers, but the room still whispers: inspect what changed most recently.",
      hintLevel: 1,
      cooldownRemaining: 0,
      source: "error-fallback",
    });
  }
}
