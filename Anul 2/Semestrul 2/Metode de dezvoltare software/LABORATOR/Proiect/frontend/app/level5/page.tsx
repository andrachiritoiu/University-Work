"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/lib/InventoryContext";
import { usePersistentState } from "@/lib/usePersistentState";
import CollectibleItem from "@/components/CollectibleItem";
import confetti from "canvas-confetti";

const RELIC_LION = { id: "relic_lion", name: "Stone Lion", description: "An ancient stone carving of a lion.", iconSrc: "/images/relic_lion.png" };
const RELIC_CROSS = { id: "relic_cross", name: "Stone Cross", description: "An ancient stone carving of a cross.", iconSrc: "/images/relic_cross.png" };
const RELIC_EAGLE = { id: "relic_eagle", name: "Stone Eagle", description: "An ancient stone carving of an eagle.", iconSrc: "/images/relic_eagle.png" };
const RELIC_CROWN = { id: "relic_crown", name: "Stone Crown", description: "An ancient stone carving of a crown.", iconSrc: "/images/relic_crown.png" };

const SPONGE_ITEM = { id: "level5_sponge", name: "Old Sponge", description: "A damp sponge.", iconSrc: "/images/level5_sponge.png" };

const GAME_DURATION = 30 * 60;

type VictoryStats = {
  elapsedSeconds: number;
  remainingSeconds: number;
  score: number;
};

export default function Level5Page() {
  const router = useRouter();
  const { items, addItem, removeItem, equippedItem, setEquippedItem } = useInventory();

  // Scene state
  const [view, setView] = useState<"main" | "levers" | "altar" | "chest">("main");
  const [leverPositions, setLeverPositions] = usePersistentState<("u" | "d")[]>("escapeRoomLevel5LeverPositions", ["u", "u", "u"]);
  const [leversSolved, setLeversSolved] = usePersistentState("escapeRoomLevel5LeversSolved", false);
  const [isAltarCleaned, setIsAltarCleaned] = usePersistentState("escapeRoomLevel5AltarCleaned", false);
  const [showNote, setShowNote] = useState(false);
  
  // Rotation Puzzle State - BACK TO 3 RINGS
  const [ringRotations, setRingRotations] = usePersistentState<number[]>("escapeRoomLevel5RingRotations", [90, 0, 270]);
  const [chestOpen, setChestOpen] = usePersistentState("escapeRoomLevel5ChestOpen", false);
  
  const [altarSlots, setAltarSlots] = usePersistentState<(string | null)[]>("escapeRoomLevel5AltarSlots", [null, null, null, null]);
  const [doorOpen, setDoorOpen] = usePersistentState("escapeRoomLevel5DoorOpen", false);
  const [victoryStats, setVictoryStats] = usePersistentState<VictoryStats | null>("escapeRoomVictoryStats", null);
  const [notification, setNotification] = useState<string | null>(null);

  const dialRef = useRef<HTMLDivElement>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const rest = safeSeconds % 60;
    return `${minutes}:${rest.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (victoryStats) return;
      const endTimeStr = localStorage.getItem("escapeRoomEndTime");
      if (!endTimeStr) return;
      const remaining = Math.max(0, Math.floor((parseInt(endTimeStr, 10) - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setIsGameOver(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [victoryStats]);

  const toggleLever = (index: number) => {
    if (leversSolved) return;
    setLeverPositions(prev => {
      const next = [...prev];
      next[index] = next[index] === "u" ? "d" : "u";
      return next;
    });
  };

  useEffect(() => {
    if (leverPositions[0] === "d" && leverPositions[1] === "u" && leverPositions[2] === "d") {
      setLeversSolved(true);
      showNotification("The mechanism clicks into place.");
    }
  }, [leverPositions]);

  const handleDialClick = (e: React.MouseEvent) => {
    if (chestOpen || !dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    const relativeRadius = (distance / (rect.width / 2)) * 100;

    let ringIdx = -1;
    if (relativeRadius < 35) ringIdx = 2; // Inner
    else if (relativeRadius < 70) ringIdx = 1; // Middle
    else if (relativeRadius < 100) ringIdx = 0; // Outer

    if (ringIdx !== -1) {
      setRingRotations(prev => {
        const next = [...prev];
        next[ringIdx] = (next[ringIdx] + 30) % 360;
        return next;
      });
    }
  };

  useEffect(() => {
    // Solution: Outer=0, Middle=180, Inner=0
    if (ringRotations[0] % 360 === 0 && ringRotations[1] % 360 === 180 && ringRotations[2] % 360 === 0) {
      setChestOpen(true);
      showNotification("The celestial rings align. The chest is open.");
    }
  }, [ringRotations]);

  const handleAltarClean = () => {
    if (isAltarCleaned) return;
    if (equippedItem === SPONGE_ITEM.id) {
      setIsAltarCleaned(true);
      showNotification("The dust clears, revealing the final puzzle.");
    } else {
      showNotification("The altar is covered in dust.");
    }
  };

  const handleAltarClick = (index: number) => {
    if (doorOpen || !isAltarCleaned) return;
    if (altarSlots[index]) {
      const itemId = altarSlots[index]!;
      const item = [RELIC_LION, RELIC_CROSS, RELIC_EAGLE, RELIC_CROWN].find(i => i.id === itemId);
      if (item) addItem(item);
      setAltarSlots(prev => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    } else if (equippedItem) {
      const relicIds = [RELIC_LION.id, RELIC_CROSS.id, RELIC_EAGLE.id, RELIC_CROWN.id];
      if (relicIds.includes(equippedItem)) {
        setAltarSlots(prev => {
          const next = [...prev];
          next[index] = equippedItem;
          return next;
        });
        removeItem(equippedItem);
        setEquippedItem(null);
      }
    }
  };

  useEffect(() => {
    if (altarSlots[0] === RELIC_LION.id && altarSlots[1] === RELIC_CROSS.id && 
        altarSlots[2] === RELIC_EAGLE.id && altarSlots[3] === RELIC_CROWN.id) {
      setDoorOpen(true);
      showNotification("The exit is open. Freedom awaits!");
    }
  }, [altarSlots]);

  const currentLeverImage = `/images/levers_${leverPositions.join("")}.png`;

  const completeEscapeRoom = () => {
    const remainingSeconds = Math.max(0, timeLeft);
    const elapsedSeconds = GAME_DURATION - remainingSeconds;
    const score = Math.max(100, 1000 + remainingSeconds * 2);
    const stats = { elapsedSeconds, remainingSeconds, score };

    localStorage.setItem("escapeRoomCompletedLevel", "5");
    localStorage.setItem("escapeRoomVictoryStats", JSON.stringify(stats));
    localStorage.removeItem("escapeRoomEndTime");
    setVictoryStats(stats);

    confetti({
      particleCount: 220,
      spread: 150,
      origin: { y: 0.55 },
      colors: ["#d4af37", "#ffffff", "#8b5e1a", "#f7e7a6"],
    });
  };

  if (victoryStats) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black font-cinzel text-[#e5d8b3] flex items-center justify-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/images/level5_main_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),rgba(0,0,0,0.9)_65%)]" />

        <section className="relative z-10 w-full max-w-3xl text-center border-y border-[#d4af37]/50 py-12">
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase text-[#d4af37]/70 mb-5">
            The Final Door Has Opened
          </p>
          <h1 className="text-4xl md:text-6xl text-[#d4af37] tracking-[0.16em] drop-shadow-[0_0_30px_rgba(212,175,55,0.45)]">
            You Escaped
          </h1>
          <p className="mt-6 font-serif text-lg md:text-xl italic text-[#cdbf9f] leading-relaxed">
            The last mechanism falls silent behind you. The room keeps its secrets, but it no longer keeps you.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-[#5c4026] bg-black/60 px-6 py-5">
              <div className="text-[10px] tracking-[0.35em] uppercase text-[#8c7a6b]">Time</div>
              <div className="mt-3 text-3xl text-[#d4af37]">{formatTime(victoryStats.elapsedSeconds)}</div>
            </div>
            <div className="border border-[#5c4026] bg-black/60 px-6 py-5">
              <div className="text-[10px] tracking-[0.35em] uppercase text-[#8c7a6b]">Remaining</div>
              <div className="mt-3 text-3xl text-[#d4af37]">{formatTime(victoryStats.remainingSeconds)}</div>
            </div>
            <div className="border border-[#5c4026] bg-black/60 px-6 py-5">
              <div className="text-[10px] tracking-[0.35em] uppercase text-[#8c7a6b]">Score</div>
              <div className="mt-3 text-3xl text-[#d4af37]">{victoryStats.score}</div>
            </div>
          </div>

          <button
            onClick={() => router.push("/lobby")}
            className="mt-10 px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors uppercase tracking-[0.3em] text-xs"
          >
            Return to Lobby
          </button>
        </section>
      </main>
    );
  }

  if (isGameOver) {
    return (
      <main className="min-h-screen bg-black font-cinzel text-[#d4af37] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl tracking-[0.2em] mb-6">Time Has Run Out</h1>
        <p className="font-serif italic text-[#c7baaa] max-w-xl">
          The chamber seals itself again. Return to the lobby and begin another attempt.
        </p>
        <button
          onClick={() => router.push("/lobby?gameover=time")}
          className="mt-10 px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors uppercase tracking-[0.3em] text-xs"
        >
          Return to Lobby
        </button>
      </main>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-cinzel">

      
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url('/images/level5_${leversSolved ? "main" : "levers"}_bg.jpg')`,
          filter: (view !== "main" || showNote) ? "blur(15px) brightness(0.2)" : "none",
        }}
      />

      {view === "main" && !showNote && (
        <>
          <button onClick={() => setView(leversSolved ? "chest" : "levers")} className="absolute left-[8%] top-[35%] w-[18%] h-[40%] z-10" />
          <button onClick={() => setView("altar")} className="absolute right-[8%] bottom-[8%] w-[25%] h-[40%] z-10" />
          <button onClick={() => setShowNote(true)} className="absolute left-[20%] bottom-[15%] w-14 h-14 bg-amber-100/10 rounded-sm rotate-12 hover:bg-amber-100/30 transition-all border border-amber-900/10 z-10" />
          {doorOpen && (
            <div className="absolute left-[42%] top-[30%] w-[16%] h-[50%] flex items-center justify-center z-20">
              <button onClick={completeEscapeRoom} className="px-10 py-5 bg-yellow-700/60 text-white font-bold rounded shadow-[0_0_80px_rgba(255,215,0,0.4)] hover:bg-yellow-600 transition-all tracking-[0.6em] animate-pulse">EXIT</button>
            </div>
          )}
          {!items.find(i => i.id === SPONGE_ITEM.id) && !isAltarCleaned && (
             <div className="absolute left-[45%] bottom-[5%] z-30 scale-75"><CollectibleItem item={SPONGE_ITEM} /></div>
          )}
        </>
      )}

      {showNote && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/50">
          <div className="relative w-[400px] bg-[#fdf2d0] p-12 rounded-sm shadow-2xl border-2 border-[#e0d0a0]">
             <h3 className="text-stone-900 text-xl mb-6 font-serif underline decoration-stone-800/20">The Celestial Alignment</h3>
             <p className="text-stone-800 text-sm font-serif italic leading-loose">
               "To unlock the celestial path, align the fates:<br/><br/>
               The **Outer Heavens** must seek the Zenith (XII).<br/>
               The **Middle Earth** must sink to the Nadir (VI).<br/>
               The **Inner Heart** must follow the Heavens (XII)."
             </p>
             <button onClick={() => setShowNote(false)} className="mt-10 text-stone-600 hover:text-stone-900 text-xs tracking-widest uppercase font-bold">Close</button>
          </div>
        </div>
      )}

      {view === "levers" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/98">
          <div className="relative max-w-4xl w-full aspect-video rounded-sm overflow-hidden">
            <img src={currentLeverImage} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex justify-around px-[15%]">
               {[0, 1, 2].map(i => (
                 <div key={i} onClick={() => toggleLever(i)} className="w-[20%] h-full cursor-pointer z-20" />
               ))}
            </div>
            <button onClick={() => setView("main")} className="absolute top-8 right-8 text-white/20 hover:text-white text-7xl font-thin">×</button>
          </div>
        </div>
      )}

      {view === "altar" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/98">
          <div className="relative max-w-4xl w-full aspect-video rounded-sm overflow-hidden">
            <img src="/images/level5_altar_zoom.jpg" className="w-full h-full object-cover" />
            {!isAltarCleaned ? (
              <div onClick={handleAltarClean} className="absolute inset-0 bg-stone-950/70 backdrop-blur-3xl flex items-center justify-center cursor-pointer">
                <p className="text-amber-500/30 text-sm tracking-[0.6em] uppercase">{equippedItem === SPONGE_ITEM.id ? "[ Use Sponge ]" : "[ Buried in Dust ]"}</p>
              </div>
            ) : (
              <div className="absolute inset-0">
                <div className="absolute left-[20%] bottom-[15%] w-[30%] h-[20%] flex items-center justify-center text-center px-4">
                  <p className="text-stone-900/90 text-xs font-serif italic leading-tight">The lion was first,<br/>the crown was last.</p>
                </div>
                <div className="absolute top-[25%] right-[25%] w-[45%] h-[40%] flex items-center justify-center gap-10">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} onClick={() => handleAltarClick(i)} className="w-24 h-24 rounded-full border border-stone-800/50 bg-black/40 hover:bg-white/5 cursor-pointer flex items-center justify-center transition-all shadow-inner">
                      {altarSlots[i] && <img src={`/images/${altarSlots[i]}.png`} className="w-16 h-16 object-contain" alt="Relic" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => setView("main")} className="absolute top-8 right-8 text-white/20 hover:text-white text-7xl font-thin">×</button>
          </div>
        </div>
      )}

      {view === "chest" && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/98">
          <div 
            ref={dialRef}
            onClick={handleDialClick}
            className="relative w-[500px] h-[500px] rounded-full overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] bg-black"
          >
            {!chestOpen ? (
              <div className="relative w-full h-full pointer-events-none">
                <div 
                  className="absolute inset-0 transition-transform duration-500"
                  style={{ transform: `rotate(${ringRotations[0]}deg)` }}
                >
                  <img src="/images/level5_chest_dial.png" className="w-full h-full object-cover opacity-90" />
                </div>
                <div 
                  className="absolute inset-0 transition-transform duration-500"
                  style={{ transform: `rotate(${ringRotations[1]}deg)`, clipPath: 'circle(35% at 50% 50%)' }}
                >
                  <img src="/images/level5_chest_dial.png" className="w-full h-full object-cover" />
                </div>
                <div 
                  className="absolute inset-0 transition-transform duration-500"
                  style={{ transform: `rotate(${ringRotations[2]}deg)`, clipPath: 'circle(17% at 50% 50%)' }}
                >
                  <img src="/images/level5_chest_dial.png" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-16 bg-amber-500/60 z-[60]" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center gap-16 bg-black/60 backdrop-blur-sm">
                 {[RELIC_LION, RELIC_CROSS, RELIC_EAGLE, RELIC_CROWN].map(rel => (
                   !items.find(i => i.id === rel.id) && <CollectibleItem key={rel.id} item={rel} />
                 ))}
              </div>
            )}
          </div>
          <button onClick={() => setView("main")} className="absolute top-12 right-12 text-white/30 hover:text-white text-6xl font-thin z-[100]">×</button>
        </div>
      )}

      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-stone-900/95 border border-amber-900/30 px-16 py-5 text-amber-500 text-[12px] tracking-[0.5em] uppercase z-[200] shadow-2xl">
          {notification}
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
      `}</style>
    </div>
  );
}
