"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/lib/InventoryContext";
import CollectibleItem from "@/components/CollectibleItem";

// 1. MORSE_MAP și PUZZLES rămân aici (sunt constante, e ok să fie afară)
const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  4: "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
};

function textToMorse(text: string): string {
  return text.toUpperCase().split("").map((c) => (c === " " ? "/" : (MORSE_MAP[c] ?? "?"))).join(" ");
}

interface Puzzle {
  id: number; title: string; flavor: string; type: "morse-decode" | "morse-encode";
  encoded: string; answer: string; successMsg: string;
}

const PUZZLES: Puzzle[] = [
  { id: 1, title: "The Riddle of the Crypt", flavor: "A voice echoes from the darkness: 'I am tall when I am young, and short when I am old. What am I?' Encode your answer in Morse code.", type: "morse-encode", encoded: "I am tall when I am young, and short when I am old. What am I?", answer: "-.-. .- -. -.. .-.. .", successMsg: "The candle flickers. A passage opens in the stone wall...", },
  { id: 2, title: "The Crypt Inscription", flavor: "Upon the stone wall, encrypted in ancient signs, a word lies hidden. Decipher it to unlock the first bolt.", type: "morse-decode", encoded: textToMorse("OPEN"), answer: "OPEN", successMsg: "The first bolt yields. An echo reverberates through the crypt...", },
  { id: 3, title: "The Archivist's Message", flavor: "A yellowed parchment holds the archivist's final instructions. Only those who know the code may proceed.", type: "morse-decode", encoded: textToMorse("CIPHER"), answer: "CIPHER", successMsg: "Correct! The crypt door swings open — the exit lies ahead!", },
];

const SCISSORS_ITEM = { id: "crypt-scissors", name: "Ancient Scissors", description: "Rusted scissors...", iconSrc: "/images/scissors.png" };
const QUILL_ITEM = { id: "crypt-quill", name: "Archivist's Quill", description: "A delicate quill...", iconSrc: "/images/feather_pen.jpg" };

const HINT_COOLDOWN = 60;
const GAME_DURATION = 30 * 60;

export default function Level4Page() {
  const router = useRouter();
  const { equippedItem, setEquippedItem, removeItem, items } = useInventory();

  // --- STATE-URI (Toate în interiorul funcției!) ---
  const [hintQuestion, setHintQuestion] = useState(""); 
  const [stage, setStage] = useState<"intro" | "puzzle" | "complete">("intro");
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isParchmentUnsealed, setIsParchmentUnsealed] = useState(false);
  const [isQuillUsed, setIsQuillUsed] = useState(false);

  const currentPuzzle = PUZZLES[puzzleIndex];
  const hasScissorsInInventory = items.some(i => i.id === SCISSORS_ITEM.id);
  const hasQuillInInventory = items.some(i => i.id === QUILL_ITEM.id);
  const showScissorsOnScreen = stage === "puzzle" && !hasScissorsInInventory && !isParchmentUnsealed;
  const showQuillOnScreen = isParchmentUnsealed && !hasQuillInInventory && !isQuillUsed;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (equippedItem) {
      const item = items.find((i) => i.id === equippedItem);
      if (item?.iconSrc) document.body.style.cursor = `url(${item.iconSrc}), auto`;
    } else {
      document.body.style.cursor = "auto";
    }
    return () => { document.body.style.cursor = "auto"; };
  }, [equippedItem, items]);

  useEffect(() => {
    const endTimeStr = localStorage.getItem("escapeRoomEndTime");
    if (!endTimeStr) { router.push("/"); }
  }, [router]);

  useEffect(() => {
    if (stage === "complete" || isGameOver) return;
    const interval = setInterval(() => {
      const endTimeStr = localStorage.getItem("escapeRoomEndTime");
      if (!endTimeStr) return;
      const remaining = Math.max(0, Math.floor((parseInt(endTimeStr, 10) - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) { clearInterval(interval); setIsGameOver(true); }
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, isGameOver]);

  useEffect(() => {
    if (cooldown > 0) {
      intervalRef.current = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            setHint(null); // <--- ADAUGĂ ACEASTĂ LINIE: Șterge hint-ul când cooldown-ul expiră
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [cooldown]);

  const handleParchmentClick = () => {
    if (isParchmentUnsealed) return;
    if (equippedItem === SCISSORS_ITEM.id) {
      setIsParchmentUnsealed(true);
      removeItem(SCISSORS_ITEM.id);
      setEquippedItem(null);
      showNotification("You cut the ancient seal...");
    } else {
      showNotification("The parchment is sealed. Find the scissors.");
    }
  };

  const handleInputAreaClick = () => {
    if (isQuillUsed) return;
    if (equippedItem === QUILL_ITEM.id) {
      setIsQuillUsed(true);
      removeItem(QUILL_ITEM.id);
      setEquippedItem(null);
      showNotification("The quill hums with power...");
    } else {
      showNotification("You need the Archivist's Quill.");
    }
  };

  const handleSubmit = useCallback(() => {
    const isEncode = currentPuzzle.type === "morse-encode";
    const trimmed = isEncode ? input.trim().replace(/\s+/g, " ") : input.trim().toUpperCase();

    if (trimmed === currentPuzzle.answer) {
      setSuccessFlash(true); setHint(null);
      setTimeout(() => {
        setSuccessFlash(false);
        if (puzzleIndex + 1 < PUZZLES.length) {
          setPuzzleIndex((i) => i + 1); setInput("");
        } else {
          localStorage.setItem("escapeRoomCompletedLevel", "4"); setStage("complete");
        }
      }, 1800);
    } else {
      setShake(true); setTimeout(() => setShake(false), 500); setInput("");
    }
  }, [input, currentPuzzle, puzzleIndex]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleHint = async () => {
    if (cooldown > 0 || hintLoading || !hintQuestion.trim()) return;
    setHintLoading(true); setCooldown(HINT_COOLDOWN);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: 4, userQuestion: hintQuestion }),
      });
      const data = await res.json();
      setHint(data.hint ?? "The spirits are cryptic.");
      setHintQuestion("");
    } catch {
      setHint("Connection lost.");
    } finally { setHintLoading(false); }
  };

  if (!mounted) return null;

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0705; --stone: #1a1510; --border: #3d2f1e;
          --gold: #c9a84c; --gold-dim: #7a5e28; --rust: #8b3a2a;
          --green: #4a7c59; --text: #d4c4a8; --muted: #6b5a44;
          --glow: 0 0 18px rgba(201,168,76,0.35);
        }
        body { background: var(--bg); }
        .crypt-root {
          min-height: 100vh; background: var(--bg);
          background-image: url('/images/level4_background.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          font-family: 'Crimson Pro', serif; color: var(--text);
          display: flex; flex-direction: column; align-items: center;
          padding: 1rem; position: relative; overflow-x: hidden;
          justify-content: center; 
        }
        .header { text-align: center; margin-bottom: 0.5rem; }
        .level-badge { font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 0.3em; color: var(--gold-dim); text-transform: uppercase; margin-bottom: 0.6rem; }
        .level-title { font-family: 'Cinzel', serif; font-size: clamp(1.2rem, 4vw, 3rem); font-weight: 900; color: var(--gold); text-shadow: var(--glow); line-height: 1.1; letter-spacing: 0.05em; }
        .level-subtitle { font-size: 1rem; font-style: italic; color: var(--text); margin-top: 5px; font-weight: 300;}
        .divider { width: 200px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-dim), transparent); margin: 1rem auto 0; }
        .card { background: var(--stone); border: 1px solid var(--border); border-radius: 4px; padding: 2.5rem 2rem; max-width: 680px; width: 100%; position: relative; box-shadow: 0 8px 40px rgba(0,0,0,0.6); }
        .card-title { font-family: 'Cinzel', serif; font-size: 1.1rem; color: var(--gold); letter-spacing: 0.1em; margin-bottom: 1rem; }
        .card-body { font-size: 1.05rem; line-height: 1.8; color: var(--text); font-weight: 300; }
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.8rem; padding: 0.75rem 2rem; background: transparent; border: 1px solid var(--gold-dim); color: var(--gold); font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 0.2em; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
        .btn:hover { background: rgba(201,168,76,0.08); border-color: var(--gold); box-shadow: var(--glow); }
        .puzzle-wrap { width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 0.75rem; }
        .progress-row { display: flex; gap: 0.5rem; justify-content: center; }
        .pip { width: 32px; height: 4px; border-radius: 2px; background: var(--border); transition: background 0.4s; }
        .pip.done { background: var(--gold); }
        .pip.active { background: var(--gold-dim); }
        .puzzle-columns { display: flex; gap: 1.8rem; align-items: flex-start; }
        @media (max-width: 768px) { .puzzle-columns { flex-direction: column; } .parchment-col, .morsemap-col { width: 100% !important; } }
        
        .parchment-col {
          width: 65%; position: relative;
          background: rgba(26, 20, 10, 0.4);
          border-radius: 3px; padding: 1.2rem 1.5rem; transform: rotate(-0.6deg);
          box-shadow: 0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(90,70,40,0.3);
          overflow: hidden;
        }
        .parchment-col::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('/images/pergament.png');
          background-size: cover; background-position: center; background-repeat: no-repeat;
          opacity: 0.75; z-index: 0; pointer-events: none;
        }
        .parchment-col > * { position: relative; z-index: 1; }
        .parchment-col .card-body { font-size: 1.05rem; line-height: 1.85; color: #ffffff; font-weight: 400; }
        .parchment-col .card-title { font-family: 'Cinzel', serif; font-size: 1.15rem; color: #f5e8d0; letter-spacing: 0.1em; margin-bottom: 1rem; }

        .morse-display { background: rgba(6,4,2,0.55); border: 1px solid rgba(185, 180, 173, 0.5); border-left: 3px solid var(--rust); border-radius: 2px; padding: 0.6rem 1.4rem; font-family: 'Courier New', monospace; font-size: clamp(0.95rem, 2.5vw, 1.1rem); color: #e8d8a0; letter-spacing: 0.15em; word-break: break-all; line-height: 2; text-shadow: 0 0 8px rgba(232,216,160,0.4); }
        .morse-label { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.25em; color: white; text-transform: uppercase; margin-bottom: 0.5rem; }
        .input-row { display: flex; gap: 0.75rem; }
        .decode-input { flex: 1; background: rgba(10,7,4,0.5); border: 1px solid rgba(61,47,30,0.6); border-radius: 2px; padding: 0.8rem 1.2rem; color: #ffffff; font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 0.15em; text-transform: uppercase; outline: none; transition: border-color 0.2s; }
        .decode-input::placeholder { color: rgba(255, 255, 255, 0.7); font-size: 0.85rem; }
        
        .btn-submit { padding: 0.8rem 1.6rem; background: var(--rust); border: none; color: #f5e8d0; font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.2em; cursor: pointer; border-radius: 2px; transition: background 0.2s; }
        .btn-submit:hover { background: #a3452f; }
        
        @keyframes shake { 0%,100% { transform: rotate(-0.6deg) translateX(0); } 20% { transform: rotate(-0.6deg) translateX(-8px); } 40% { transform: rotate(-0.6deg) translateX(8px); } 60% { transform: rotate(-0.6deg) translateX(-5px); } 80% { transform: rotate(-0.6deg) translateX(5px); } }
        .parchment-col.shake { animation: shake 0.45s ease; }
        @keyframes flashGold { 0% { box-shadow: 0 8px 40px rgba(0,0,0,0.7); } 50% { box-shadow: 0 0 50px rgba(201,168,76,0.5); } 100% { box-shadow: 0 8px 40px rgba(0,0,0,0.7); } }
        .parchment-col.flash-success { animation: flashGold 1.8s ease; }

        .hint-section {border-top: 1px solid rgba(61,47,30,0.4); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .hint-section input::placeholder {
            color: #ece9e0ff; 
            opacity: 0.8;  
          }
        .btn-hint { padding: 0.55rem 1.2rem; background: transparent; border: 1px solid rgba(90, 70, 40, 1); color: #ece9e0ff; font-family: 'Cinzel', serif; font-size: 0.68rem; letter-spacing: 0.2em; cursor: pointer; border-radius: 2px; }
        .hint-bubble { background: rgba(74,124,89,0.1); border: 1px solid rgba(74,124,89,0.3); border-radius: 2px; padding: 0.9rem 1.1rem; font-size: 0.95rem; font-style: italic; color: #9dcaab; line-height: 1.7; }
        
        .morsemap-col { width: 35%; background: #1a150e; border: 1px solid var(--border); border-radius: 3px; padding: 0.8rem 1.2rem; position: relative; transform: rotate(0.8deg); box-shadow: 0 6px 30px rgba(0,0,0,0.6); }
        .morsemap-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.25rem 0.8rem; font-family: 'Courier New', monospace; font-size: 0.70rem; }
        .morsemap-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.2rem 0; border-bottom: 1px solid rgba(61,47,30,0.2); }
        .morsemap-letter { color: var(--gold-dim); font-weight: bold; width: 18px; font-family: 'Cinzel', serif; font-size: 0.75rem; }
        .morsemap-code { color: #b19477ff; font-size: 14px; letter-spacing: 0.1em; }

        .sealed-area, .write-area { border: 2px dashed rgba(61,47,30,0.6); border-radius: 4px; padding: 2.5rem 1.8rem; text-align: center; cursor: pointer; transition: all 0.3s; }
        .sealed-area:hover { border-color: var(--rust); background: rgba(139,58,42,0.05); }
        .write-area:hover { border-color: var(--gold-dim); background: rgba(201,168,76,0.03); }
        
        .complete-wrap { text-align: center; max-width: 540px; animation: fadeInUp 0.7s ease; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="crypt-root">


        <header className="header">
          <p className="level-badge">Level IV · Escape Room</p>
          <h1 className="level-title">The Crypt of Codes</h1>
          <p className="level-subtitle">&ldquo;Light does not reach this place. Only the mind can pierce the darkness.&rdquo;</p>
          <div className="divider" />
        </header>

        {stage === "intro" && (
          <div className="card">
            <p className="card-title">⚰ Welcome to the Crypt</p>
            <p className="card-body">
              The Archivist has concealed messages encrypted in Morse code. Find the tools to proceed.
            </p>
            <button className="btn" onClick={() => setStage("puzzle")}>▶ &nbsp; ENTER THE CRYPT</button>
          </div>
        )}

        {stage === "puzzle" && (
          <div className="puzzle-wrap">
            <div className="progress-row">
              {PUZZLES.map((p, i) => (
                <div key={p.id} className={`pip ${i < puzzleIndex ? "done" : i === puzzleIndex ? "active" : ""}`} />
              ))}
            </div>

            <div className="puzzle-columns">
              <div className={`parchment-col ${shake ? "shake" : ""} ${successFlash ? "flash-success" : ""}`}>
                <p className="card-title">Puzzle {currentPuzzle.id} — {currentPuzzle.title}</p>

                {!isParchmentUnsealed ? (
                  <div className="sealed-area" onClick={handleParchmentClick}>
                    <p style={{ fontSize: "2.5rem" }}>📜</p>
                    <p className="sealed-text">Sealed Parchment</p>
                    <p className="sealed-hint">
                      {equippedItem === SCISSORS_ITEM.id ? "Click here to cut the seal" : "Find the Scissors to unseal it"}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="card-body" style={{ marginBottom: "1.5rem" }}>{currentPuzzle.flavor}</p>
                    <div className="morse-display">{currentPuzzle.encoded}</div>
                  </>
                )}

                {isParchmentUnsealed && (
                  isQuillUsed ? (
                    <div className="input-row" style={{ marginTop: "1.2rem" }}>
                      <input
                        className="decode-input"
                        placeholder="Type answer..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                      />
                      <button className="btn-submit" onClick={handleSubmit}>SUBMIT</button>
                    </div>
                  ) : (
                    <div className="write-area" onClick={handleInputAreaClick}>
                      <p className="write-area-text">
                        {equippedItem === QUILL_ITEM.id ? "Click to inscribe answer" : "Find the Quill to write"}
                      </p>
                    </div>
                  )
                )}
                              
              <div className="hint-section">
                {/* Afișăm input-ul doar dacă NU suntem în cooldown și nu se încarcă deja un răspuns */}
                {cooldown === 0 && !hintLoading && (
                    <input 
                      type="text"
                      placeholder="Ask the spirits..."
                      value={hintQuestion}
                      onChange={(e) => setHintQuestion(e.target.value)}
                      className="decode-input"
                      style={{ color: 'var(--text)', marginBottom: '0.5rem' }}
                    />
                )}

                <button 
                  className="btn-hint" 
                  onClick={handleHint} 
                  disabled={cooldown > 0 || hintLoading || !hintQuestion.trim()}
                >
                  {cooldown > 0 ? `WAIT (${cooldown}s)` : "🕯 ASK THE SPIRITS"}
                </button>

                {/* Hint-ul va fi vizibil doar cât timp cooldown-ul este activ */}
                {hint && cooldown > 0 && (
                  <div className="hint-bubble">
                    <strong>Spirit Voice:</strong> {hint}
                  </div>
                )}
              </div>
            </div>

              <div className="morsemap-col">
                <p className="morsemap-title">Morse Code Key</p>
                <div className="morsemap-grid">
                  {Object.entries(MORSE_MAP).filter(([k]) => isNaN(Number(k))).map(([letter, code]) => (
                    <div className="morsemap-row" key={letter}>
                      <span className="morsemap-letter">{letter}</span>
                      <span className="morsemap-code">{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "complete" && (
          <div className="complete-wrap">
            <h2 className="complete-title">The Crypt Is Unsealed!</h2>
            <button className="btn" onClick={() => router.push("/level5")}>▶ &nbsp; NEXT LEVEL</button>
          </div>
        )}
      </div>

      {/* Collectibles */}
      {showScissorsOnScreen && (
        <div style={{ position: 'fixed', bottom: '24%', right: '2%', zIndex: 100 }}>
          <CollectibleItem item={SCISSORS_ITEM} />
        </div>
      )}

      {showQuillOnScreen && (
        <div style={{ position: 'fixed', bottom: '85%', left: '3%', zIndex: 100 }}>
          <CollectibleItem item={QUILL_ITEM} />
        </div>
      )}
    </>
  );
}
