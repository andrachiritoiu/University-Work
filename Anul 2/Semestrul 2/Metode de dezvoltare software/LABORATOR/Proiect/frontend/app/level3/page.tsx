"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/lib/InventoryContext";
import CollectibleItem from "@/components/CollectibleItem";
import confetti from "canvas-confetti";

const GAME_DURATION = 30 * 60;

// ─── Twinkling background stars ──────────────────────────────────────────────
const STAR_COUNT = 80;
const BG_STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  x: Math.abs(Math.sin(i * 7.3 + 1) * 100),
  y: Math.abs(Math.sin(i * 3.7 + 2) * 100),
  size: (Math.abs(Math.sin(i * 11.1)) * 2.5) + 0.5,
  delay: (Math.abs(Math.sin(i * 5.9)) * 5).toFixed(1),
  duration: ((Math.abs(Math.sin(i * 2.3)) * 3) + 2).toFixed(1),
}));

function TwinklingStars() {
  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
      {BG_STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0,
            animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.05; transform: scale(1); }
          100% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes comet {
          0% { transform: translateX(-5vw) translateY(-5vh) rotate(-35deg); opacity: 0; }
          10% { opacity: 0.6; }
          40% { opacity: 0.4; }
          70% { opacity: 0.2; }
          100% { transform: translateX(120vw) translateY(80vh) rotate(-35deg); opacity: 0; }
        }
        @keyframes nebula-pulse {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.18; transform: scale(1.05); }
        }
        @keyframes constellation-glow {
          0% { filter: drop-shadow(0 0 2px #d4af37); }
          50% { filter: drop-shadow(0 0 25px #d4af37) drop-shadow(0 0 50px #fff8dc); }
          100% { filter: drop-shadow(0 0 2px #d4af37); }
        }
      `}</style>
    </div>
  );
}

function ShootingComet() {
  const [comets, setComets] = useState<{id:number, x:number, y:number, scale:number}[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const fire = () => {
      const id = nextId.current++;
      const scale = 0.5 + Math.random() * 0.7;
      setComets(prev => [...prev, { id, x: 2 + Math.random() * 40, y: 2 + Math.random() * 30, scale }]);
      // Sync timeout with the 12s animation duration
      setTimeout(() => setComets(prev => prev.filter(c => c.id !== id)), 12000);
    };
    fire();
    const interval = setInterval(fire, 10000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {comets.map(comet => (
        <div key={comet.id}
          className="fixed z-[5] pointer-events-none"
          style={{
            left: `${comet.x}%`,
            top: `${comet.y}%`,
            animation: 'comet 12s cubic-bezier(0.1, 0.2, 0.7, 1.0) forwards',
            transform: `scale(${comet.scale})`,
          }}
        >
          {/* Comet tail — three gradient layers, very subtle and fading */}
          <div className="relative flex items-center">
            {/* Outer diffuse trail */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 h-[1.5px] w-32 rounded-full"
              style={{ background: 'linear-gradient(to left, rgba(180,220,255,0.15), rgba(107,159,212,0.03), transparent)' }} />
            {/* Mid trail */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 h-[1px] w-20 rounded-full"
              style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.3), rgba(200,230,255,0.1), transparent)' }} />
            {/* Core trail */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 h-[1px] w-12 rounded-full"
              style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.5), transparent)' }} />
            {/* Comet nucleus */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-4 h-4 rounded-full bg-blue-100/5 blur-md" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_3px_1px_rgba(180,220,255,0.3)]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Constellation Data ───────────────────────────────────────────────────────
// Three constellations are displayed. Only ONE is the correct ancient pattern.
// The player must identify and connect the stars of the CORRECT constellation.

const CONSTELLATIONS = [
  {
    id: "orion",
    name: "Orion — The Hunter",
    isCorrect: true,
    stars: [
      { id: 0, x: 50, y: 12, label: "Betelgeuse" },
      { id: 1, x: 35, y: 30, label: "Bellatrix*" },
      { id: 2, x: 65, y: 30, label: "Mintaka" },
      { id: 3, x: 50, y: 50, label: "Alnilam" },
      { id: 4, x: 38, y: 68, label: "Saiph" },
      { id: 5, x: 62, y: 68, label: "Rigel" },
    ],
    // The correct connections: pairs of star indices
    correctConnections: [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]] as [number,number][],
    clue: "The belt of three, the shoulders broad\u2014a giant stands guard in the sky.",
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia — The Queen",
    isCorrect: false,
    stars: [
      { id: 0, x: 15, y: 40, label: "Schedar" },
      { id: 1, x: 30, y: 20, label: "Caph" },
      { id: 2, x: 50, y: 40, label: "Cih" },
      { id: 3, x: 70, y: 20, label: "Ruchbah" },
      { id: 4, x: 85, y: 40, label: "Segin" },
    ],
    correctConnections: [[0,1],[1,2],[2,3],[3,4]] as [number,number][],
    clue: "She sits upon her throne\u2014a W etched in silver.",
  },
  {
    id: "ursamajor",
    name: "Ursa Major — The Bear",
    isCorrect: false,
    stars: [
      { id: 0, x: 20, y: 30, label: "Dubhe" },
      { id: 1, x: 35, y: 22, label: "Merak" },
      { id: 2, x: 50, y: 28, label: "Phecda" },
      { id: 3, x: 65, y: 22, label: "Megrez" },
      { id: 4, x: 78, y: 35, label: "Alioth" },
      { id: 5, x: 72, y: 55, label: "Mizar" },
      { id: 6, x: 58, y: 65, label: "Alkaid" },
    ],
    correctConnections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] as [number,number][],
    clue: "The Great Plough\u2014seven stars marking the north.",
  },
];

const CORRECT_CONSTELLATION = CONSTELLATIONS.find(c => c.isCorrect)!;

// ─── Single Constellation Board ──────────────────────────────────────────────
function ConstellationBoard({
  constellation,
  active,
  onConnectionMade,
  solvedConnections,
  wrongFlash,
}: {
  constellation: typeof CONSTELLATIONS[0];
  active: boolean;
  onConnectionMade: (isCorrect: boolean, pair: [number, number]) => void;
  solvedConnections: [number, number][];
  wrongFlash: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const alreadySolved = (a: number, b: number) =>
    solvedConnections.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

  const isCorrectPair = (a: number, b: number) =>
    constellation.correctConnections.some(
      ([x, y]) => (x === a && y === b) || (x === b && y === a)
    );

  const handleClick = (id: number) => {
    if (!active) return;
    if (selected === null) { setSelected(id); return; }
    if (selected === id) { setSelected(null); return; }
    if (alreadySolved(selected, id)) { setSelected(id); return; }

    onConnectionMade(isCorrectPair(selected, id), [selected, id] as [number, number]);
    setSelected(null);
  };

  const allSolved =
    constellation.correctConnections.length > 0 &&
    constellation.correctConnections.every(([a, b]) => alreadySolved(a, b));

  return (
    <div
      className={`relative w-full aspect-square rounded-lg border overflow-hidden transition-all duration-500
        ${active ? (wrongFlash ? "border-red-500 shadow-[0_0_30px_rgba(255,50,50,0.5)]" :
            allSolved ? "border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.45)]" :
            "border-[#5f8fc4]/70 shadow-[0_0_24px_rgba(43,80,112,0.25)]")
          : "border-[#24344a]/70 opacity-60 grayscale-[0.35]"}
      `}
      style={{ background: "radial-gradient(ellipse at center, #091833 0%, #020611 78%)" }}
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#6b9fd4]/10 to-transparent pointer-events-none" />

      {/* SVG lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {solvedConnections.map(([a, b], i) => {
          const sa = constellation.stars[a];
          const sb = constellation.stars[b];
          if (!sa || !sb) return null;
          return (
            <line key={i}
              x1={`${sa.x}%`} y1={`${sa.y}%`}
              x2={`${sb.x}%`} y2={`${sb.y}%`}
              stroke={allSolved ? "#d4af37" : "#6b9fd4"}
              strokeWidth="2" opacity="0.85"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Stars */}
      {constellation.stars.map(star => {
        const isSel = selected === star.id;
        const isConnected = solvedConnections.some(([a, b]) => a === star.id || b === star.id);
        return (
          <button key={star.id}
            onClick={() => handleClick(star.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            disabled={!active}
          >
            {isSel && <div className="absolute w-10 h-10 rounded-full bg-blue-300/20 animate-ping -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />}
            <div className={`rounded-full transition-all duration-200 relative z-10
              ${isSel ? "w-5 h-5 bg-white shadow-[0_0_20px_white]" :
                isConnected ? "w-4 h-4 bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" :
                "w-3 h-3 bg-blue-100 shadow-[0_0_8px_rgba(150,200,255,0.6)] group-hover:w-4 group-hover:h-4"}
            `} />
            <span className={`absolute top-4 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap font-cinzel
              ${isSel ? "text-white" : isConnected ? "text-[#d4af37]/80" : "text-blue-200/40"}
            `}>{star.label}</span>
          </button>
        );
      })}

      {allSolved && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <p className="font-cinzel text-[#d4af37] text-sm tracking-[0.3em] drop-shadow-[0_0_15px_rgba(212,175,55,1)]">✦ ALIGNED ✦</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Level 3 ─────────────────────────────────────────────────────────────
export default function Level3() {
  const router = useRouter();
  const { removeItem, equippedItem, setEquippedItem, items } = useInventory();

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<"time" | "mistakes" | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lensInserted, setLensInserted] = useState(false);
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null);
  const [solvedConnections, setSolvedConnections] = useState<Record<string, [number, number][]>>({});
  const [wrongFlash, setWrongFlash] = useState(false);
  const [wrongPicks, setWrongPicks] = useState(0);
  const [gameId, setGameId] = useState(0);

  const hasLens = items.some(i => i.id === "lens_stellar");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const endTimeStr = localStorage.getItem("escapeRoomEndTime");
    if (!endTimeStr) { router.push("/"); return; }
  }, [router]);

  useEffect(() => {
    if (equippedItem) {
      const item = items.find(i => i.id === equippedItem);
      if (item?.iconSrc) document.body.style.cursor = `url(${item.iconSrc}), auto`;
    } else {
      document.body.style.cursor = "auto";
    }
    return () => { document.body.style.cursor = "auto"; };
  }, [equippedItem, items]);

  useEffect(() => {
    if (isGameOver || showLevelComplete) return;
    const interval = setInterval(() => {
      const endTimeStr = localStorage.getItem("escapeRoomEndTime");
      if (!endTimeStr) return;
      const remaining = Math.max(0, Math.floor((parseInt(endTimeStr, 10) - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setGameOverReason("time");
        setIsGameOver(true);
        setTimeout(() => restartGame(), 4000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, showLevelComplete, gameId]);

  const handleTelescopeClick = () => {
    if (lensInserted) return;
    if (equippedItem === "lens_stellar") {
      setLensInserted(true);
      removeItem("lens_stellar");
      setEquippedItem(null);
      showNotification("The lens clicks into place. The star map flickers to life...");
    } else {
      showNotification("The telescope lacks its focusing lens. Search the observatory carefully.");
    }
  };

  const handleConnectionMade = (constellationId: string, isCorrect: boolean, pair: [number, number]) => {
    if (!isCorrect) {
      // Wrong pair: flash red, count mistake
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 600);
      const newWrong = wrongPicks + 1;
      setWrongPicks(newWrong);
      showNotification(newWrong >= 3
        ? "Too many wrong connections. The star map resets..."
        : `That connection is wrong. Try again. (${3 - newWrong} attempts left)`
      );
      if (newWrong >= 3) {
        setTimeout(() => {
          setSolvedConnections({});
          setWrongPicks(0);
          setActiveConstellation(null);
        }, 1500);
      }
      return;
    }

    // Correct pair
    const prev = solvedConnections[constellationId] || [];
    const updated = { ...solvedConnections, [constellationId]: [...prev, pair] };
    setSolvedConnections(updated);

    const con = CONSTELLATIONS.find(c => c.id === constellationId)!;
    const done = con.correctConnections.every(([a, b]) =>
      updated[constellationId]?.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
    );

    if (done) {
      if (con.isCorrect) {
        // WIN!
        const savedLevel = parseInt(localStorage.getItem("escapeRoomCompletedLevel") || "0", 10);
        if (savedLevel < 3) localStorage.setItem("escapeRoomCompletedLevel", "3");
        confetti({ particleCount: 200, spread: 160, origin: { y: 0.5 }, colors: ["#b8d4f0", "#d4af37", "#ffffff"] });
        setTimeout(() => setShowLevelComplete(true), 1800);
      } else {
        // Wrong constellation completed: reset it
        showNotification(`That is ${con.name}, not the lost constellation. Study the clue again.`);
        setTimeout(() => setSolvedConnections(prev => ({ ...prev, [constellationId]: [] })), 1200);
      }
    }
  };

  const restartGame = () => {
    setIsGameOver(false);
    setGameOverReason(null);
    setLensInserted(false);
    setActiveConstellation(null);
    setSolvedConnections({});
    setWrongPicks(0);
    setShowLevelComplete(false);
    setGameId(prev => prev + 1);
  };

  const formatElapsed = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#05060a] font-cormorant flex flex-col items-center select-none">

      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center brightness-[0.55]"
        style={{ backgroundImage: "url(/images/observatory.png)" }} />
      <div className="fixed inset-0 z-[1] bg-[#02050f]/55 pointer-events-none" />
      <div className="fixed inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_22%,rgba(2,5,15,0.76)_72%,#02050f_100%)] pointer-events-none" />
      <div className="fixed inset-0 z-[2] opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
      <div className="fixed inset-x-0 top-0 h-32 z-[3] bg-gradient-to-b from-[#02050f] via-[#02050f]/70 to-transparent pointer-events-none" />
      <div className="fixed inset-x-0 bottom-0 h-32 z-[3] bg-gradient-to-t from-[#02050f] via-[#02050f]/70 to-transparent pointer-events-none" />
      <div className="fixed inset-x-0 top-24 h-px z-[3] bg-gradient-to-r from-transparent via-[#6b9fd4]/25 to-transparent pointer-events-none" />
      <TwinklingStars />
      <ShootingComet />

      {/* Title — moved slightly lower to clear inventory overlap */}
      <div className="relative z-20 mt-5 mb-2 flex flex-col items-center w-full">
        <div className="flex items-center gap-3 mb-1 opacity-40">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#6b9fd4]" />
          <span className="font-cinzel text-[9px] tracking-[0.5em] text-[#6b9fd4] uppercase">Chamber III</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#6b9fd4]" />
        </div>
        <h1 className="font-cinzel text-2xl md:text-4xl text-[#d9ecff] text-center drop-shadow-[0_0_18px_rgba(107,159,212,0.45)] tracking-[0.22em] leading-normal">
          The Astronomer's Tower
        </h1>
        <div className="mt-2 h-px w-48 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      </div>



      {/* ─── Game Layout — shifted down slightly ─── */}
      <div className="relative z-10 w-full max-w-[1500px] flex flex-col lg:flex-row items-start justify-center gap-5 px-4 md:px-10 mt-3 pb-8">

        {/* LEFT PANEL: Story, Clue, Telescope — spaced out to fill height */}
        <div className="flex flex-col gap-3 w-full lg:max-w-md shrink-0">

          {/* Story / Lore */}
          <div className="bg-[#030914]/70 backdrop-blur-sm border border-[#294766]/80 rounded-lg p-4 md:p-5 shadow-[inset_0_0_24px_rgba(30,53,80,0.2),0_12px_34px_rgba(0,0,0,0.32)]">
            <h2 className="font-cinzel text-[#6b9fd4] text-[11px] tracking-[0.4em] uppercase mb-2">The Archivist's Note</h2>
            <p className="text-[#8aa1b8] text-sm md:text-lg leading-relaxed italic">
              "The passage opens only when the Ancients' lost constellation is traced in full upon the celestial sphere.
              Study the <span className="text-[#d4af37] not-italic font-bold">clue on the scroll</span>, then insert the lens."
            </p>
          </div>

          {/* Clue scroll */}
          <div className="bg-[#0a0e1a]/75 border border-[#d4af37]/35 rounded-lg p-5 md:p-6 shadow-[0_0_34px_rgba(212,175,55,0.1)] bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
            <h2 className="font-cinzel text-[#d4af37] text-[11px] tracking-[0.4em] uppercase mb-2">Ancient Scroll</h2>
            <p className="text-lg md:text-2xl text-[#e5d8b3] italic leading-tight font-medium">
              "{CORRECT_CONSTELLATION.clue}"
            </p>
          </div>

          {/* Telescope */}
          <div
            onClick={handleTelescopeClick}
            className={`flex items-center gap-5 p-4 md:p-5 rounded-lg border cursor-pointer transition-all duration-500
              ${lensInserted
                ? "border-[#6b9fd4] bg-[#091628]/80 shadow-[0_0_25px_rgba(107,159,212,0.3)]"
                : "border-[#1e3550]/60 bg-black/40 hover:border-[#2b5070]"}
              backdrop-blur-sm
            `}
          >
            <img
              src="/images/telescope.png"
              alt="Telescope"
              className={`w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-500
                ${lensInserted ? "brightness-125 scale-110" : "brightness-75 opacity-50"}
              `}
            />
            <div>
              <p className="font-cinzel text-[#b8d4f0] text-base md:text-lg tracking-[0.1em] uppercase">Great Telescope</p>
              {!lensInserted
                ? <p className="text-xs text-red-400 mt-1 font-cinzel">⚠ Lens missing</p>
                : <p className="text-xs text-[#6b9fd4] mt-1 font-cinzel tracking-widest">✦ Lens installed</p>
              }
            </div>
          </div>

          {/* Instructions */}
          {lensInserted && (
            <div className="bg-black/40 border border-[#1e3550]/50 rounded-lg p-4 md:p-5 animate-in fade-in duration-500">
              <h2 className="font-cinzel text-[#6b9fd4] text-[11px] tracking-[0.4em] uppercase mb-2">How to Play</h2>
              <ul className="text-[#8aa1b8] text-sm md:text-base space-y-1 list-none">
                <li>◈ Select constellation charts below</li>
                <li>◈ Connect stars with your cursor</li>
                <li>◈ Complete the pattern to unlock</li>
              </ul>
            </div>
          )}
        </div>

        {/* Constellation grid — adjusted lower, full width */}
        <div className={`flex-1 transition-all duration-700 ${!lensInserted ? "invisible pointer-events-none" : "opacity-100"}`}>
          <div className="flex items-center justify-between mb-4 mt-8 md:mt-12 lg:mt-6">
            <p className="font-cinzel text-[#6b9fd4]/50 text-xs tracking-[0.4em] uppercase">
              {lensInserted ? "◈ Select a constellation to trace ◈" : ""}
            </p>
            {/* Progress counter for Orion */}
            {lensInserted && (
              <div className="flex items-center gap-2">
                <span className="text-[#6b9fd4]/40 text-xs font-cinzel tracking-widest uppercase">Connections:</span>
                <div className="flex gap-1">
                  {Array.from({ length: CORRECT_CONSTELLATION.correctConnections.length }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500
                      ${i < (solvedConnections["orion"]?.length || 0)
                        ? "bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                        : "bg-[#1e3550]"}
                    `} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            {CONSTELLATIONS.map(con => {
              const isWinning = con.isCorrect && (solvedConnections[con.id]?.length || 0) === con.correctConnections.length;
              return (
                <div key={con.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => lensInserted && setActiveConstellation(activeConstellation === con.id ? null : con.id)}
                    className={`font-cinzel text-xs tracking-widest uppercase py-2 px-4 rounded-lg border transition-all duration-300
                      ${activeConstellation === con.id
                        ? "border-[#6b9fd4] bg-[#0a1828] text-[#b8d4f0] shadow-[0_0_15px_rgba(107,159,212,0.3)]"
                        : "border-[#1e3550]/50 bg-black/30 text-[#6b9fd4]/50 hover:border-[#2b5070] hover:text-[#8aa1b8]"}
                    `}
                    disabled={!lensInserted}
                  >
                    {con.name}
                  </button>

                  <div style={isWinning ? { animation: 'constellation-glow 2s ease-in-out infinite' } : {}}>
                    <ConstellationBoard
                      constellation={con}
                      active={activeConstellation === con.id}
                      solvedConnections={solvedConnections[con.id] || []}
                      wrongFlash={wrongFlash && activeConstellation === con.id}
                      onConnectionMade={(isCorrect, pair) => handleConnectionMade(con.id, isCorrect, pair)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collectible: Stellar Lens — circular display */}
      {!hasLens && !lensInserted && (
        <div className="fixed bottom-[18%] right-[13%] z-20 scale-[0.58] opacity-[0.14] brightness-[0.55] saturate-[0.55] transition-all duration-500 hover:scale-75 hover:opacity-80 hover:brightness-110 hover:saturate-100">
          <CollectibleItem
            item={{
              id: "lens_stellar",
              name: "Stellar Lens",
              description: "A finely cut brass lens. It refracts starlight in unusual patterns.",
              iconSrc: "/images/stellar_lens.png"
            }}
          />
        </div>
      )}

      {/* Level Complete */}
      {showLevelComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-1000">
          <div className="p-12 border-4 border-[#6b9fd4] bg-[#05101e]/95 text-center rounded-2xl shadow-[0_0_150px_rgba(107,159,212,0.4)] max-w-2xl flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-[#b8d4f0] mb-6">Chamber Unlocked</h1>
            <p className="text-xl text-[#8aa1b8] mb-6 font-cormorant leading-relaxed">
              Orion blazes across the dome. The ancient seal hums and releases with a deep resonant tone.
            </p>
            <div className="bg-black/60 p-6 rounded-lg border border-[#2b4a7e] mb-8 w-full">
              <p className="text-2xl text-[#6b9fd4] font-bold mb-2">Escaped in {formatElapsed(GAME_DURATION - timeLeft)}!</p>
              <p className="text-lg text-[#8aa1b8]">Time remaining: {formatElapsed(timeLeft)}</p>
            </div>
            <button onClick={() => router.push("/level4")}
              className="text-xl text-[#05060a] bg-[#b8d4f0] hover:bg-white transition-colors font-cinzel font-bold px-8 py-4 rounded-xl uppercase tracking-widest animate-pulse">
              Proceed to Level 4
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-lg animate-in fade-in duration-500">
          <div className="p-12 border-2 border-red-800 bg-black/90 text-center rounded shadow-[0_0_150px_rgba(200,0,0,0.6)] max-w-lg">
            <h1 className="text-6xl font-cinzel font-bold text-red-500 mb-6 drop-shadow-[0_0_20px_red]">
              {gameOverReason === "time" ? "Time's Up" : "Game Over"}
            </h1>
            <p className="text-2xl text-red-300 font-cormorant leading-relaxed">
              {gameOverReason === "time"
                ? "The stars fade. The observatory grows cold. Restarting..."
                : "The star map goes dark. Restarting..."}
            </p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[80] bg-[#05101e]/95 border border-[#6b9fd4] px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(107,159,212,0.4)] animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none max-w-lg">
          <p className="text-[#b8d4f0] font-cinzel text-base tracking-widest text-center">{notification}</p>
        </div>
      )}

      {/* Equipped HUD */}
      {equippedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-black/60 backdrop-blur border border-[#6b9fd4]/50 px-6 py-2 rounded-full flex items-center gap-3">
          <span className="text-[#8aa1b8] text-xs font-cinzel tracking-widest uppercase">Equipped:</span>
          <span className="text-[#b8d4f0] text-sm font-bold font-cinzel uppercase">
            {items.find(i => i.id === equippedItem)?.name}
          </span>
        </div>
      )}

    </main>
  );
}
