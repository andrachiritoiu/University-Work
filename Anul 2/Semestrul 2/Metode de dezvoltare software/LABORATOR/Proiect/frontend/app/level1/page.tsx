"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SudokuGrid from "@/components/SudokuGrid";
import CombinationLock from "@/components/CombinationLock";
import Timer from "@/components/Timer";
import CollectibleItem from "@/components/CollectibleItem";
import confetti from "canvas-confetti";
import { useInventory } from "@/lib/InventoryContext";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

const GAME_DURATION = 30 * 60;

export default function Level1() {
  const router = useRouter();
  const { hasItem, items, equippedItem, setEquippedItem, removeItem, onRoomEvent, broadcastRoomEvent } = useInventory();
  const hasCompass = hasItem("brass_compass_lvl1");
  const hasEraser = hasItem("chalk_eraser_lvl1");
  const [gameId, setGameId] = useState(0);
  const [extractedCode, setExtractedCode] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [isBlackboardCleaned, setIsBlackboardCleaned] = useState(false);
  const [isLockUnjammed, setIsLockUnjammed] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Game Over states
  const [isGameOver, setIsGameOver] = useState(false);

  // Real-time Multiplayer Sync for Room States
  useEffect(() => {
    const unsubClean = onRoomEvent("BLACKBOARD_CLEANED", () => {
      setIsBlackboardCleaned(true);
      showNotification("Teammate wiped the blackboard clean!");
    });
    const unsubUnjam = onRoomEvent("LOCK_UNJAMMED", () => {
      setIsLockUnjammed(true);
      showNotification("Teammate unjammed the rusted lock!");
    });
    const unsubUnlock = onRoomEvent("DOOR_UNLOCKED", (payload: any) => {
      setIsUnlocked(true);
      if (payload?.code) {
        setExtractedCode(payload.code);
      }
      showNotification("Teammate unlocked the heavy door! Escaping...");
      
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#8c7a6b', '#ffffff', '#e5d8b3']
      });

      setTimeout(() => {
        setShowLevelComplete(true);
      }, 3000);
    });

    return () => {
      unsubClean();
      unsubUnjam();
      unsubUnlock();
    };
  }, [onRoomEvent]);

  // Custom Mouse Cursor when Item Equipped!
  useEffect(() => {
    if (equippedItem) {
      const item = items.find(i => i.id === equippedItem);
      if (item && item.iconSrc) {
        document.body.style.cursor = `url(${item.iconSrc}), auto`;
      }
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [equippedItem, items]);

  const handleBlackboardClick = () => {
    if (isBlackboardCleaned) return;
    if (equippedItem === "chalk_eraser_lvl1") {
      setIsBlackboardCleaned(true);
      showNotification("You wiped the blackboard clean.");
      removeItem("chalk_eraser_lvl1");
      setEquippedItem(null);
      broadcastRoomEvent("BLACKBOARD_CLEANED", {});
    } else {
      showNotification("The blackboard is covered in thick dust. You need to use something to wipe it clean.");
    }
  };

  const handleLockClick = () => {
    if (isLockUnjammed) return;
    if (equippedItem === "brass_compass_lvl1") {
      setIsLockUnjammed(true);
      showNotification("You used the sturdy brass compass to force the rusted gears open!");
      removeItem("brass_compass_lvl1");
      setEquippedItem(null);
      broadcastRoomEvent("LOCK_UNJAMMED", {});
    } else {
      showNotification("The mechanism is jammed and rusted. You need a sturdy tool to force it open.");
    }
  };

  const handleSudokuSolved = (code: string) => {
    // Păstrăm numerele din colțurile pătratului central (ex: 9 elemente -> index 0, 2, 6, 8)
    if (code.length === 9) {
       setExtractedCode(code[0] + code[2] + code[6] + code[8]);
    } else {
       setExtractedCode(code);
    }
  };

  const handleDoorUnlocked = async () => {
    setIsUnlocked(true);

    // Mark as completed in persistent storage!
    const savedLevel = parseInt(localStorage.getItem("escapeRoomCompletedLevel") || "0", 10);
    if (savedLevel < 1) {
      localStorage.setItem("escapeRoomCompletedLevel", "1");
    }

    broadcastRoomEvent("DOOR_UNLOCKED", { code: extractedCode || "7391" });


    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#8c7a6b', '#ffffff', '#e5d8b3']
    });

    setTimeout(() => {
      setShowLevelComplete(true);
    }, 3000);
  };

  const handleMistakesGameOver = () => {
    setIsGameOver(true);
    setTimeout(() => restartGame(), 4000);
  };

  const restartGame = () => {
    setIsGameOver(false);
    setExtractedCode(null);
    setIsUnlocked(false);
    setShowLevelComplete(false);
    setGameId((prev) => prev + 1);
  };

  const formatElapsed = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveAndExit = async () => {
    router.push("/lobby");
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0a0705] font-cormorant flex flex-col items-center select-none">

      {/* Background */}
      <div
        className="fixed inset-0 z-0 opacity-40 mix-blend-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/library.png)' }}
      />

      {/* Top Header with Save & Exit */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={handleSaveAndExit}
          className="flex items-center gap-2 group text-[#c7baaa] hover:text-[#d4af37] transition-all bg-black/70 px-4 py-2 uppercase tracking-widest text-xs font-cinzel border border-[#5c4026]/60 rounded-lg hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl"
        >
          Save & Exit
        </button>
      </div>

      {/* Title */}
      <div className="relative z-20 mt-5 mb-2 flex flex-col items-center w-full">
        <div className="flex items-center gap-3 mb-1 opacity-40">
          <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="font-cinzel text-[9px] tracking-[0.5em] text-[#d4af37] uppercase">Chamber I</span>
          <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-[#d4af37]" />
        </div>
        <h1 className="font-cinzel text-3xl md:text-5xl text-[#d4af37] text-center drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] tracking-widest">
          The Mathematical Library
        </h1>
      </div>

      {/* Timer is now rendered in layout.tsx globally */}

      <div className="relative z-10 flex flex-col md:flex-row w-full h-full max-h-[calc(100vh-100px)] px-4 md:px-12 items-center justify-center gap-12 md:gap-24 overflow-hidden mt-6">

        {/* Central Desk Area - Sudoku */}
        <div className="flex flex-col items-center justify-center w-full max-w-xl xl:max-w-2xl relative shrink-0 translate-x-6 md:translate-x-12 xl:translate-x-20 z-20">
          <div className="relative p-6 md:p-10 w-full flex flex-col items-center justify-center rounded-2xl shadow-2xl"
            style={{
              backgroundImage: 'url(/images/desk.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            {/* Overlay for desk readability */}
            <div className="absolute inset-0 bg-yellow-950/30 pointer-events-none rounded-2xl mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-black/50 pointer-events-none rounded-2xl"></div>

            <div className="relative z-10 w-full flex flex-col items-center">
              <SudokuGrid key={`sudoku-${gameId}`} onReady={(code) => { if (code.length === 9) setExtractedCode(code[0] + code[2] + code[6] + code[8]); }} onSolved={handleSudokuSolved} onGameOver={handleMistakesGameOver} />
            </div>
          </div>
        </div>

        {/* Floor-standing styled Blackboard with partial legs */}
        <div 
          onClick={handleBlackboardClick}
          className="flex flex-col items-center justify-center w-full max-w-[180px] md:max-w-[240px] xl:max-w-[280px] relative shrink-0 z-10 my-8 md:my-0 cursor-pointer self-end mb-[-60px] md:mb-[-140px] xl:mb-[-200px]"
        >
           {/* Detailed Molded Frame and Slate */}
           <div className="w-full relative z-10 shadow-[0_40px_60px_rgba(0,0,0,0.95)] rounded-sm border-[2px] border-[#0a0502] outline outline-2 outline-[#000]">
              <div 
                className="w-full aspect-[4/3] rounded-sm p-[12px] md:p-[16px] shadow-[inset_0_0_50px_rgba(0,0,0,1)] relative bg-[#1c1815] border-[3px] border-[#0a0806]"
              >
                 <div 
                   className="w-full h-full bg-[#050505] relative overflow-hidden transition-all duration-1000 shadow-[inset_0_5px_40px_rgba(0,0,0,1)] border border-black/90 brightness-50 contrast-[0.80] sepia-[0.3] opacity-80"
                   style={{
                     backgroundImage: `url(${isBlackboardCleaned ? '/images/slate_clean.png' : '/images/slate_dirty.png'})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                   }}
                 ></div>
                 
                 {/* Subtle Bottom Ledge */}
                 <div className="absolute bottom-[2px] left-[6px] right-[6px] h-2 bg-gradient-to-b from-[#3a2618] to-[#120a06] rounded-sm shadow-[0_5px_10px_rgba(0,0,0,0.8)] border-t border-[#4a3220] z-20 opacity-80 mt-1 pointer-events-none"></div>
              </div>
           </div>
           
           {/* Solid Wooden Legs Going Down */}
           <div className="flex justify-between w-[85%] z-0 relative -translate-y-4 pointer-events-none">
              <div className="w-[18px] h-[350px] bg-[#0a0806] border-x border-[#000] shadow-[inset_0_0_8px_black,5px_10px_15px_black]"></div>
              <div className="w-[18px] h-[350px] bg-[#0a0806] border-x border-[#000] shadow-[inset_0_0_8px_black,5px_10px_15px_black]"></div>
           </div>
        </div>

        {/* Door and Lock Area - Side by Side */}
        <div className="flex flex-col items-center justify-center w-full max-w-sm xl:max-w-md h-full space-y-8 relative perspective-[1200px] shrink-0">

          <div
            className={`w-[280px] md:w-[380px] aspect-[2/3] rounded-t-full shadow-2xl relative flex items-center justify-center mt-auto
              ${isUnlocked ? 'animate-door-open pointer-events-none' : ''} transition-all duration-[3000ms] origin-left
            `}
            style={{
              backgroundImage: 'url(/images/door.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: isUnlocked ? 'none' : 'inset 0 0 100px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.9)'
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-t-full pointer-events-none"></div>

            {isUnlocked && (
              <div className="absolute inset-0 bg-white shadow-[0_0_100px_white] -z-10 rounded-t-full animate-pulse blur-3xl"></div>
            )}

            <div className={`transition-opacity duration-1000 ${isUnlocked ? 'opacity-0' : 'opacity-100'} relative`}>
               <div onClick={handleLockClick} className={`transition-all duration-700 ${!isLockUnjammed ? "opacity-60 blur-sm brightness-50 cursor-pointer" : ""}`}>
                 <div className={!isLockUnjammed ? "pointer-events-none" : ""}>
                    <CombinationLock key={`lock-${gameId}`} onUnlock={handleDoorUnlocked} correctCode={extractedCode || "0000"} />
                 </div>
               </div>
               
              
              {/* Compass near the door lock */}
              {/* Compass near the door lock */}
              {!isLockUnjammed && (
                <CollectibleItem 
                  item={{
                    id: "brass_compass_lvl1",
                    name: "Brass Compass",
                    description: "An old drafting compass. One of its needles is sharply bent.",
                    iconSrc: "/images/brass_compass.png"
                  }}
                  className="absolute -bottom-[80px] -left-12 opacity-30 hover:opacity-90 transition-opacity"
                />
              )}
            </div>
          </div>
          
          {/* Eraser and Compass logically placed away from the puzzle targets */}
          {/* Eraser and Compass logically placed away from the puzzle targets */}
          {!isBlackboardCleaned && (
            <CollectibleItem 
               item={{
                 id: "chalk_eraser_lvl1",
                 name: "Chalk Eraser",
                 description: "A vintage wooden chalk eraser.",
                 iconSrc: "/images/chalk_eraser.png"
               }}
               className="fixed bottom-12 left-12 z-20 scale-75 opacity-30 hover:opacity-90 transition-all"
            />
          )}
        </div>

      </div>

      {showLevelComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-1000">
          <div className="p-12 border-4 border-[#d4af37] bg-[#1a1107]/95 text-center rounded shadow-[0_0_150px_rgba(212,175,55,0.4)] max-w-2xl flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-[#e5d8b3] mb-6 drop-shadow-[0_0_10px_rgba(229,216,179,0.5)]">Level Complete</h1>
            <p className="text-xl md:text-2xl text-[#a89f91] mb-6 font-cormorant leading-relaxed">
              The ancient mechanism clicks into place, and the heavy door groans open. The secrets of the mathematical library have been unlocked.
            </p>

            <div className="bg-black/60 p-6 rounded-lg border border-[#3c2a1a] mb-8 w-full shadow-[inset_0_0_30px_black]">
              <p className="text-2xl text-[#d4af37] font-bold mb-2">You escaped the Mathematical Library!</p>
            </div>

            <button
              onClick={() => router.push('/level2')}
              className="text-xl text-[#0a0705] bg-[#d4af37] hover:bg-[#e5d8b3] transition-colors font-cinzel font-bold px-8 py-4 rounded uppercase tracking-widest animate-pulse"
            >
              Proceed to Level 2
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-lg animate-in fade-in duration-500">
          <div className="p-12 border-2 border-red-800 bg-black/90 text-center rounded shadow-[0_0_150px_rgba(200,0,0,0.6)] max-w-lg flex flex-col items-center">
            <h1 className="text-6xl font-cinzel font-bold text-red-500 mb-6 drop-shadow-[0_0_20px_red]">
              Game Over
            </h1>
            <p className="text-2xl text-red-300 mb-8 font-cormorant leading-relaxed">
              The mechanism has locked up due to too many errors. The puzzle resets...
            </p>
          </div>
        </div>
      )}

      {/* Custom Notification Popup */}
      {notification && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[80] bg-[#1a1208]/95 border border-[#d4af37] px-8 py-4 rounded shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
           <p className="text-[#e5d8b3] font-cinzel text-lg md:text-xl tracking-widest text-center">{notification}</p>
        </div>
      )}

      {/* Equipped Item HUD Overlay */}
      {equippedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-black/60 backdrop-blur border border-[#d4af37]/50 px-6 py-2 rounded-full shadow-[0_0_15px_black] animate-in slide-in-from-bottom-2 flex items-center gap-3">
           <span className="text-[#a89f91] text-xs font-cinzel tracking-widest uppercase">Equipped:</span>
           <span className="text-[#e5d8b3] text-sm font-bold font-cinzel uppercase">
             {items.find(i => i.id === equippedItem)?.name}
           </span>
        </div>
      )}

    </main>
  );
}
