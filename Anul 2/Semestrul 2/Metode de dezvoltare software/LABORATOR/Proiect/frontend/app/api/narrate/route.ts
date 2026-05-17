import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AI_TIMEOUT_MS = 2800;

type NarrationRequest = {
  targetId?: string;
  level?: number;
  state?: { solved?: boolean };
};

const DESCRIPTION_BANK: Record<string, string[]> = {
  library: [
    "The library breathes dust and candle smoke, its shelves leaning like witnesses afraid to speak.",
    "Between the desks and blackboard, the room feels arranged by a mind that trusted numbers more than people.",
  ],
  alchemy_lab: [
    "Glass vessels crowd the laboratory, each one stained by experiments that ended before dawn.",
    "A bitter mineral scent hangs over the lab, as if the stones themselves remember the formula.",
  ],
  observatory: [
    "The tower opens toward a sky pricked with cold stars, every constellation waiting to be accused.",
    "Brass instruments sleep beneath moonlight, their needles trembling at patterns older than the room.",
  ],
  crypt: [
    "The crypt answers each footstep with a hollow delay, then swallows the sound completely.",
    "Carved stone and old wax surround you, stern as judges in a forgotten trial.",
  ],
  final_chamber: [
    "The final chamber is quiet in the way locked doors are quiet: patient, certain, almost amused.",
    "Ancient dust softens every edge, but the mechanisms beneath it still feel awake.",
  ],
  default: [
    "The object seems ordinary until the light catches it, and then it becomes impossible to ignore.",
    "There is a deliberate quality to its placement, as though someone expected you to notice.",
  ],
};

const levelTargets: Record<number, string> = {
  1: "library",
  2: "alchemy_lab",
  3: "observatory",
  4: "crypt",
  5: "final_chamber",
};

const globalNarrationStore = globalThis as typeof globalThis & {
  escapeRoomNarrationCounts?: Map<string, number>;
};

const narrationCounts = globalNarrationStore.escapeRoomNarrationCounts ?? new Map<string, number>();
globalNarrationStore.escapeRoomNarrationCounts = narrationCounts;

function fallbackDescription(targetId: string, solved = false) {
  const descriptions = DESCRIPTION_BANK[targetId] ?? DESCRIPTION_BANK.default;
  const count = narrationCounts.get(targetId) ?? 0;
  narrationCounts.set(targetId, count + 1);

  const base = descriptions[count % descriptions.length];
  return solved ? `${base} Whatever secret it guarded has already been disturbed.` : base;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Narration timed out")), timeoutMs);
    }),
  ]);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NarrationRequest;
    const targetId = body.targetId || (body.level ? levelTargets[body.level] : undefined) || "default";
    const fallback = fallbackDescription(targetId, body.state?.solved);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        targetId,
        description: fallback,
        style: "victorian mystery",
        source: "fallback",
      });
    }

    const completion = await withTimeout(
      groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are the Narrator Agent for a Victorian mystery escape room. Describe the target in one or two immersive sentences. Stay in-world and do not reveal puzzle solutions.",
          },
          {
            role: "user",
            content: `Target: ${targetId}. Current state: ${JSON.stringify(body.state ?? {})}. Reference tone: ${fallback}`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_tokens: 140,
      }),
      AI_TIMEOUT_MS
    );

    return NextResponse.json({
      targetId,
      description: completion.choices[0]?.message?.content || fallback,
      style: "victorian mystery",
      source: "groq",
    });
  } catch (error) {
    console.error("Narration Error:", error);
    return NextResponse.json({
      targetId: "default",
      description: DESCRIPTION_BANK.default[0],
      style: "victorian mystery",
      source: "error-fallback",
    });
  }
}
