"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GameStage, BlankId, FragmentWord, PipeType, PipeCell } from "@/types/level2";
import CollectibleItem from "@/components/CollectibleItem";
import { useInventory } from "@/lib/InventoryContext";

// ----------------------------------------------------------------------------
// STAGE 0: INTRO CONSTANTS
// ----------------------------------------------------------------------------
const DIALOGUE_LINES = [
  "You should not be here.",
  "This laboratory existed before your grandfather's grandfather drew breath — when the Sun and Moon still argued over which one of them deserved to touch the Earth at dawn.",
  "I have spent forty years learning what the Sun gives freely and what the Moon hoards in silence.",
  "My ring has all the knowledge. My journal keeps all the secrets in the world. And my globe... my globe can show me the future.",
  "The moment your shadow crossed this threshold, the door behind you became stone. There is only one direction left to you now — forward, through the Work.",
  "Find my three artifacts hidden within the shadows. Only then will the Work reveal itself.",
  "Solve what is written. Do not guess. The Work does not forgive guessing.",
  "Fail... and you keep me company. I have been alone here for a very long time."
];

// ----------------------------------------------------------------------------
// STAGE 1: JOURNAL CONSTANTS
// ----------------------------------------------------------------------------
const CORRECT_BLANKS: Record<BlankId, FragmentWord> = { 
  b1: 'calcinate', 
  b2: 'conjoin', 
  b3: 'sublime' 
};

const FRAGMENTS: { word: FragmentWord, hint: string }[] = [
  { word: "dissolve",  hint: "break all bonds" },
  { word: "conjoin",   hint: "unite opposites" },
  { word: "purify",    hint: "remove the corrupt" },
  { word: "calcinate", hint: "burn to white ash" },
  { word: "ferment",   hint: "transform through decay" },
  { word: "sublime",   hint: "rise without burning" }
];



// ----------------------------------------------------------------------------
// STAGE 3: PIPES CONSTANTS
// ----------------------------------------------------------------------------
const PIPE_SIDES: Record<PipeType, {n:boolean,s:boolean,e:boolean,w:boolean}> = {
  'straight-h':  {n:false, s:false, e:true, w:true},
  'straight-v':  {n:true, s:true, e:false, w:false},
  'corner-ne':   {n:true, s:false, e:true, w:false},
  'corner-nw':   {n:true, s:false, e:false, w:true},
  'corner-se':   {n:false, s:true, e:true, w:false},
  'corner-sw':   {n:false, s:true, e:false, w:true},
  'empty':       {n:false, s:false, e:false, w:false},
};

const INITIAL_GRID_DATA: PipeType[][] = [
  ['straight-h', 'corner-sw', 'empty', 'straight-v', 'corner-se', 'empty'],
  ['empty', 'straight-v', 'corner-se', 'corner-sw', 'straight-v', 'straight-h'],
  ['corner-se', 'corner-ne', 'corner-sw', 'straight-v', 'corner-sw', 'empty'],
  ['straight-v', 'empty', 'straight-v', 'corner-ne', 'corner-nw', 'straight-v'],
  ['corner-ne', 'corner-sw', 'corner-nw', 'corner-se', 'corner-se', 'corner-sw'],
  ['empty', 'corner-ne', 'straight-h', 'corner-ne', 'straight-h', 'corner-nw']
];

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------
export default function Level2() {
  const router = useRouter();
  
  const [stage, setStage] = useState<GameStage | 'hidden_objects'>('intro');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const { items, equippedItem, removeItem, onRoomEvent, broadcastRoomEvent } = useInventory();

  // --- STAGE 0 STATE ---
  const [lineIndex, setLineIndex] = useState(0);

  // --- HIDDEN OBJECTS STATE ---
  const [foundObjects, setFoundObjects] = useState<string[]>([]);

  // --- STAGE 3 (PIPES) EXTRA STATE ---
  const [keySpawned, setKeySpawned] = useState(false);
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);

  // --- STAGE 1 STATE ---
  const [filled, setFilled] = useState<Record<BlankId, FragmentWord | null>>({ b1:null, b2:null, b3:null });
  const [selectedFrag, setSelectedFrag] = useState<FragmentWord | null>(null);
  const [riddle1, setRiddle1] = useState("");
  const [riddle2, setRiddle2] = useState("");
  const [riddle3, setRiddle3] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [jFeedback, setJFeedback] = useState<{type: "ok"|"err", msg: string} | null>(null);

  // --- STAGE 3 STATE ---
  const [grid, setGrid] = useState<PipeCell[][]>(() => 
    INITIAL_GRID_DATA.map(row => row.map(type => ({
      type, rotation: Math.floor(Math.random() * 4), hasLiquid: false
    })))
  );

  // Real-time Multiplayer Sync for Level 2 Room States
  useEffect(() => {
    const unsubStage = onRoomEvent("STAGE_ADVANCED", (payload: any) => {
      setFadeState('out');
      setTimeout(() => {
        setStage(payload.stage);
        setFadeState('in');
      }, 800);
    });

    const unsubObject = onRoomEvent("OBJECT_FOUND", (payload: any) => {
      setFoundObjects(prev => {
        if (prev.includes(payload.id)) return prev;
        return [...prev, payload.id];
      });
    });

    const unsubRiddles = onRoomEvent("RIDDLES_SYNC", (payload: any) => {
      if (payload.filled) setFilled(payload.filled);
      if (payload.riddle1 !== undefined) setRiddle1(payload.riddle1);
      if (payload.riddle2 !== undefined) setRiddle2(payload.riddle2);
      if (payload.riddle3 !== undefined) setRiddle3(payload.riddle3);
    });

    const unsubPipe = onRoomEvent("PIPE_ROTATED", (payload: any) => {
      setGrid(prevGrid => {
        const ng = [...prevGrid];
        ng[payload.r] = [...ng[payload.r]];
        ng[payload.r][payload.c] = { ...ng[payload.r][payload.c], rotation: payload.rotation };
        setTimeout(() => runBFS(ng), 50);
        return ng;
      });
    });

    const unsubUnlock = onRoomEvent("DOOR_UNLOCKED_LVL2", () => {
      setIsDoorUnlocked(true);
      setFadeState('out');
      setTimeout(() => {
        setStage('victory');
        setFadeState('in');
      }, 800);
    });

    return () => {
      unsubStage();
      unsubObject();
      unsubRiddles();
      unsubPipe();
      unsubUnlock();
    };
  }, [onRoomEvent]);

  // --- GLOBAL CSS INJECTION ---
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes smokeRise {
        0%   { transform: translateY(0) scaleX(1); opacity: 0.22; }
        100% { transform: translateY(-180px) scaleX(2.2); opacity: 0; }
      }
      @keyframes floatWiz {
        0%,100% { transform: translateX(-50%) translateY(0); }
        50%     { transform: translateX(-50%) translateY(-6px); }
      }
      @keyframes moonRise {
        from { opacity:0; transform:translateY(10px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes wizAppear {
        from { opacity:0; transform:translateX(-50%) translateY(30px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
      @keyframes wandPulse {
        0%,100% { fill:#d4a017; opacity:0.9; }
        50%     { fill:#fff8c0; opacity:1; }
      }
      @keyframes robeFloat {
        0%,100% { transform:skewX(0deg); }
        50%     { transform:skewX(1deg); }
      }
      @keyframes eyeGlow {
        0%,100% { opacity:0.7; }
        50%     { opacity:1; }
      }
      @keyframes blink {
        0%,100% { opacity:1; }
        50%     { opacity:0; }
      }
      @keyframes shake {
        0%,100% { transform:translateX(0); }
        25%     { transform:translateX(-5px); }
        75%     { transform:translateX(5px); }
      }
      @keyframes bottleShatter {
        0%   { opacity:1; transform:scale(1); }
        100% { opacity:0; transform:scale(0.8) rotate(15deg); }
      }
      @keyframes liquidFlow {
        from { background-color: transparent; }
        to   { background-color: #d4a017; }
      }
      @keyframes goldPulse {
        0%,100% { box-shadow:0 0 8px rgba(212,160,23,0.4); }
        50%     { box-shadow:0 0 20px rgba(212,160,23,0.9); }
      }
      @keyframes flicker {
        0%,100% { opacity: 0.3; }
        50% { opacity: 0.9; }
      }
      .anim-flicker { animation: flicker 3s step-end infinite; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // --- STAGE TRANSITION HELPER ---
  const advanceTo = (newStage: GameStage | 'hidden_objects', fromRemote = false) => {
    setFadeState('out');
    setTimeout(() => {
      setStage(newStage);
      setFadeState('in');
    }, 800);
    if (!fromRemote) {
      broadcastRoomEvent("STAGE_ADVANCED", { stage: newStage });
    }
  };

  // ----------------------------------------------------------------------------
  // STAGE 0 LOGIC
  // ----------------------------------------------------------------------------
  // Intro logic simplified to just lineIndex state


  // ----------------------------------------------------------------------------
  // STAGE 1 LOGIC
  // ----------------------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, w: FragmentWord) => e.dataTransfer.setData('text', w);
  const handleDrop = (e: React.DragEvent, id: BlankId) => {
    e.preventDefault();
    const w = e.dataTransfer.getData('text') as FragmentWord;
    if (w) placeWord(id, w);
  };
  const placeWord = (id: BlankId, w: FragmentWord) => {
    setFilled(p => {
      const n = {...p};
      (Object.keys(n) as BlankId[]).forEach(k => { if(n[k] === w) n[k] = null; });
      n[id] = w;
      broadcastRoomEvent("RIDDLES_SYNC", { filled: n });
      return n;
    });
  };
  const validateJournal = () => {
    const isB1 = filled.b1 === CORRECT_BLANKS.b1;
    const isB2 = filled.b2 === CORRECT_BLANKS.b2;
    const isB3 = filled.b3 === CORRECT_BLANKS.b3;
    
    const isR1 = riddle1.toLowerCase().trim() === 'au';
    const isR2 = riddle2.toLowerCase().trim() === 'silver' || riddle2.toLowerCase().trim() === 'ag';
    const isR3 = riddle3.toLowerCase().trim() === 'distill';
    const rOk = isR1 && isR2 && isR3;

    if (isB1 && isB2 && isB3 && rOk) {
      setJFeedback({type: 'ok', msg: "At last... you have read between the lines."});
      setTimeout(() => advanceTo('pipes'), 2000);
    } else {
      let wr = 0;
      if (!isB1) wr++; if (!isB2) wr++; if (!isB3) wr++;
      setJFeedback({type: 'err', msg: `The elements reject your arrangement... (${wr} gate(s) failed${!rOk ? ', riddle incorrect' : ''})`});
    }
  };

  // ----------------------------------------------------------------------------
  // STAGE 3 LOGIC (BFS)
  // ----------------------------------------------------------------------------
  const runBFS = (currentGrid: PipeCell[][]) => {
    const visited = Array(6).fill(0).map(() => Array(6).fill(false));
    const q: [number, number][] = [[0,0]];
    visited[0][0] = true;

    // Check if cell [r,c] connects to neighbor [nr,nc]
    const connects = (r:number, c:number, nr:number, nc:number) => {
      if (nr<0||nr>5||nc<0||nc>5) return false;
      const c1 = currentGrid[r][c];
      const c2 = currentGrid[nr][nc];
      if (c1.type==='empty' || c2.type==='empty') return false;

      // get absolute openings after rotation
      const getOpenings = (cell: PipeCell) => {
        const sides = PIPE_SIDES[cell.type];
        const arr = [sides.n, sides.e, sides.s, sides.w];
        const rot = cell.rotation % 4;
        const shifted = [...arr.slice(4-rot), ...arr.slice(0, 4-rot)];
        return { n: shifted[0], e: shifted[1], s: shifted[2], w: shifted[3] };
      };

      const o1 = getOpenings(c1);
      const o2 = getOpenings(c2);

      if (nr === r - 1 && nc === c) return o1.n && o2.s;
      if (nr === r + 1 && nc === c) return o1.s && o2.n;
      if (nc === c + 1 && nr === r) return o1.e && o2.w;
      if (nc === c - 1 && nr === r) return o1.w && o2.e;
      return false;
    };

    let reachedEnd = false;

    // Since grid is 6x6, we actually want to find the connected component from [0,0]
    // But wait, if [0,0] is not connected to its left entrance, does it start?
    // Let's assume [0,0] always receives liquid if its West is open.
    const startOpenings = (() => {
        const sides = PIPE_SIDES[currentGrid[0][0].type];
        const arr = [sides.n, sides.e, sides.s, sides.w];
        const rot = currentGrid[0][0].rotation % 4;
        const shifted = [...arr.slice(4-rot), ...arr.slice(0, 4-rot)];
        return { n: shifted[0], e: shifted[1], s: shifted[2], w: shifted[3] };
    })();
    
    if (!startOpenings.w) return; // Cauldron enters from West

    while(q.length > 0) {
      const [r, c] = q.shift()!;
      if (r===5 && c===5) {
        // Check if [5,5] exits to South or East (let's say South)
        const endOpenings = (() => {
            const sides = PIPE_SIDES[currentGrid[5][5].type];
            const arr = [sides.n, sides.e, sides.s, sides.w];
            const rot = currentGrid[5][5].rotation % 4;
            const shifted = [...arr.slice(4-rot), ...arr.slice(0, 4-rot)];
            return { n: shifted[0], e: shifted[1], s: shifted[2], w: shifted[3] };
        })();
        if (endOpenings.s) {
            reachedEnd = true;
        }
      }

      const dirs = [[-1,0],[1,0],[0,1],[0,-1]];
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (connects(r,c,nr,nc) && !visited[nr]?.[nc]) {
          visited[nr][nc] = true;
          q.push([nr, nc]);
        }
      }
    }

    if (reachedEnd) {
      // Animate filling
      const ng = [...currentGrid];
      for(let i=0; i<6; i++) {
        for(let j=0; j<6; j++) {
          if(visited[i][j]) ng[i][j] = {...ng[i][j], hasLiquid: true};
        }
      }
      setGrid(ng);
      // Spawn key after liquid fills
      setTimeout(() => setKeySpawned(true), 2000);
    }
  };

  const handlePipeClick = (r:number, c:number) => {
    if (grid[r][c].type === 'empty') return;
    const ng = [...grid];
    ng[r] = [...ng[r]];
    ng[r][c] = { ...ng[r][c], rotation: (ng[r][c].rotation + 1) % 4 };
    setGrid(ng);
    runBFS(ng);
    broadcastRoomEvent("PIPE_ROTATED", { r, c, rotation: ng[r][c].rotation });
  };

  const handleDoorClick = () => {
    if (equippedItem === "key_lvl2" && keySpawned) {
      setIsDoorUnlocked(true);
      removeItem("key_lvl2");
      advanceTo('victory');
      broadcastRoomEvent("DOOR_UNLOCKED_LVL2", {});
    }
  };

  // ----------------------------------------------------------------------------
  // RENDERERS
  // --------------------------------------------------------------------------
  
  if (stage === 'intro') {
    return (
      <main className={`min-h-screen relative overflow-hidden transition-opacity duration-800 flex flex-col items-center justify-center ${fadeState==='in'?'opacity-100':'opacity-0'}`}>
        <div className="absolute top-0 w-full z-20"><LevelHeader /></div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/images/level2_bg.png)',
            filter: 'brightness(0.5) sepia(0.2) hue-rotate(-5deg) contrast(1.2)',
            transform: 'scale(1.05)'
          }}
        />
        
        {/* Mystical Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#110820]/80 via-transparent to-[#06030f]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />

        <button onClick={() => advanceTo('hidden_objects')} className="absolute top-4 right-6 z-50 font-cinzel text-[10px] md:text-xs text-[#c8aa6e] hover:text-[#d4a017] uppercase tracking-widest cursor-pointer border border-[#c8aa6e]/30 px-3 py-1 bg-black/50 backdrop-blur-sm rounded">
          Skip Intro ›
        </button>

        {/* Dialogue Box */}
        <div onClick={() => {
            if (lineIndex < DIALOGUE_LINES.length - 1) {
              setLineIndex(l => l + 1);
            } else {
              advanceTo('hidden_objects');
            }
          }} 
          className="relative z-10 max-w-3xl w-full mx-4 bg-[#0a0603]/80 backdrop-blur-md border border-[#a06414]/40 p-8 md:p-12 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#a06414]/70 transition-colors duration-500 flex flex-col items-center text-center">
          
          <div className="font-cinzel text-[10px] md:text-xs tracking-[0.3em] text-[#d4a017] mb-6 uppercase border-b border-[#d4a017]/30 pb-2">
            — ALDRIC THE GREY, KEEPER OF THE ETERNAL LABORATORY —
          </div>
          
          <div className="font-cormorant italic text-[20px] md:text-[26px] text-[#e5d8b3] leading-[1.8] min-h-[120px] flex items-center justify-center">
            {DIALOGUE_LINES[lineIndex]}
          </div>
          
          <div className="flex gap-3 mt-8">
            {DIALOGUE_LINES.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${i === lineIndex ? 'bg-[#d4a017] shadow-[0_0_10px_#d4a017]' : 'bg-[#5c4026]/50'}`} />
            ))}
          </div>

          {lineIndex < DIALOGUE_LINES.length - 1 ? (
            <div className="absolute bottom-4 right-6 font-cinzel text-[10px] md:text-xs text-[#887040] animate-pulse">Click to continue ›</div>
          ) : (
            <div className="absolute bottom-4 right-6 font-cinzel text-[10px] md:text-xs text-[#d4a017] animate-pulse">Click to Enter ›</div>
          )}
        </div>
      </main>
    );
  }

  if (stage === 'hidden_objects') {
    if (foundObjects.length === 3 && fadeState === 'in') {
      setTimeout(() => advanceTo('journal'), 1500);
    }

    return (
      <main className={`min-h-screen relative overflow-hidden transition-opacity duration-800 flex flex-col ${fadeState==='in'?'opacity-100':'opacity-0'}`}>
        <div className="absolute top-0 w-full z-20"><LevelHeader /></div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ 
            backgroundImage: 'url(/images/level2_bg.png)',
            filter: 'brightness(0.5) sepia(0.2) hue-rotate(-5deg) contrast(1.2)',
            transform: 'scale(1.05)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110820]/80 via-transparent to-[#06030f]/90 pointer-events-none -z-10" />

        <div className="relative z-20 flex flex-col items-center mt-32">
            <p className="font-cinzel text-xl text-[#d4a017] tracking-widest animate-pulse drop-shadow-[0_0_10px_black] text-center px-4">
                Find the 3 hidden artifacts to begin your work ({foundObjects.length}/3)
            </p>
        </div>

        {/* Clickable objects */}
        {!foundObjects.includes('globe') && (
            <div onClick={() => { setFoundObjects(prev => [...prev, 'globe']); broadcastRoomEvent("OBJECT_FOUND", { id: 'globe' }); }}
                 className="absolute top-[60%] left-[20%] w-16 h-16 cursor-pointer hover:drop-shadow-[0_0_20px_#d4af37] transition-all flex items-center justify-center z-30 opacity-50 hover:opacity-100 scale-75">
               <img src="/images/globe.png" alt="Globe" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
        )}
        {!foundObjects.includes('ring') && (
            <div onClick={() => { setFoundObjects(prev => [...prev, 'ring']); broadcastRoomEvent("OBJECT_FOUND", { id: 'ring' }); }}
                 className="absolute top-[40%] right-[25%] w-12 h-12 cursor-pointer hover:drop-shadow-[0_0_20px_#d4af37] transition-all flex items-center justify-center z-30 opacity-40 hover:opacity-100 scale-75">
               <img src="/images/ring.png" alt="Ring" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
        )}
        {!foundObjects.includes('journal') && (
            <div onClick={() => { setFoundObjects(prev => [...prev, 'journal']); broadcastRoomEvent("OBJECT_FOUND", { id: 'journal' }); }}
                 className="absolute bottom-[20%] left-[50%] w-24 h-16 cursor-pointer hover:drop-shadow-[0_0_20px_#d4af37] transition-all flex items-center justify-center z-30 opacity-40 hover:opacity-100 scale-75">
               <img src="/images/journal.png" alt="Journal" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
        )}
      </main>
    );
  }

  if (stage === 'journal') {
    return (
      <main className={`min-h-screen bg-[#0d0a14] transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'} p-6 flex flex-col`}>
        <LevelHeader />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 mt-4 w-full">
          
          {/* LEFT: JOURNALS */}
          <div className="flex flex-col gap-6">
            
            {/* Parchment 1 */}
            <div className="bg-[#f0e0b8] text-[#1e0e04] relative p-8 shadow-2xl"
                 style={{clipPath: 'polygon(0 0, 97% 0, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0 97%, 0 0)'}}>
              <div className="absolute left-0 top-0 bottom-0 w-[26px] bg-[#dfc898] border-r border-[#b89050]" />
              <div className="absolute top-0 right-0 w-0 h-0 border-[20px] border-solid border-transparent border-t-[#0d0a14] border-r-[#0d0a14]" />
              <div className="absolute top-0 right-[40px] w-0 h-0 border-[20px] border-solid border-transparent border-t-[#c0a878] border-l-[#c0a878] shadow-[-2px_2px_4px_rgba(0,0,0,0.1)]" />
              
              <div className="pl-6 font-cormorant italic text-[16px] md:text-[18px] leading-[2]">
                <h2 className="font-cinzel text-[11px] text-[#9a6018] mb-4 tracking-widest uppercase border-b border-[#b89050]/30 pb-2">
                  ☽ The Night Formula — written under a blood eclipse ☉
                </h2>
                <div className="mb-4">
                  The Elixir demands three sacred acts, each guarded by a celestial gate. The Sun gives freely. The Moon withholds. Between them lives the truth.
                </div>
                
                <div className="mb-4">
                  ☉ First Gate — Solar Calcination:<br/>
                  When Sol stands at his zenith, the number of his sacred metal is LXXIX. From this, subtract the atomic weight of common salt's metal (XI), then add the legs of a spider (VIII). The result names the flame's intensity. One must 
                  <Blank id="b1" val={filled.b1} onDrop={handleDrop} onRem={() => placeWord('b1',null as any)} /> 
                  the base matter at precisely this degree until only the white ash remains — no more, no less, lest the Sun's gift turns to poison.
                </div>

                <div className="mb-4">
                  ☽ Second Gate — Lunar Conjunction:<br/>
                  The Moon rules silver, whose number is XLVII. Divide this by the sacred proportion of the trinity (III), round to the nearest whole. This is the number of nights one must 
                  <Blank id="b2" val={filled.b2} onDrop={handleDrop} onRem={() => placeWord('b2',null as any)} /> 
                  fire and water — Sol and Luna — under open sky, neither vessel covered, neither flame extinguished.
                </div>

                <div className="mb-4">
                  ♄ Third Gate — Saturnine Rest:<br/>
                  Saturn's lead bears the number LXXXII. Halve it, then subtract the fingers of one hand (V). The residue must 
                  <Blank id="b3" val={filled.b3} onDrop={handleDrop} onRem={() => placeWord('b3',null as any)} /> 
                  in sealed obsidian for precisely this count of moons, untouched by light, unmoved by hand — Saturn demands patience as the Moon demands silence.
                </div>
              </div>
            </div>

            {/* Parchment 2 */}
            <div className="bg-[#f0e0b8] text-[#1e0e04] relative p-8 shadow-2xl"
                 style={{clipPath: 'polygon(0 0, 97% 0, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0 97%, 0 0)'}}>
              <div className="absolute left-0 top-0 bottom-0 w-[26px] bg-[#dfc898] border-r border-[#b89050]" />
              
              <div className="pl-6 font-cormorant italic text-[16px] md:text-[18px] leading-[2]">
                <h2 className="font-cinzel text-[11px] text-[#9a6018] mb-4 tracking-widest uppercase border-b border-[#b89050]/30 pb-2">
                  ☽ The Cipher of Elements — torn from the facing page ☉
                </h2>
                
                <div className="mb-4">
                  I. 'I am born in the belly of stars and die in the palm of kings. The Sun wears me as a crown. The Moon borrows my reflection to seem worthy. Alchemists chase me for a lifetime and find me only when they stop looking. What element am I?' — write the symbol, not the name.
                  <input type="text" value={riddle1} onChange={e => { setRiddle1(e.target.value); broadcastRoomEvent("RIDDLES_SYNC", { riddle1: e.target.value }); }} className="w-full bg-[#dfc898]/30 border-b border-[#b89050] outline-none font-cormorant italic text-lg text-center py-1 mt-2 text-[#1e0e04]" />
                </div>
                <div className="mb-4">
                  II. The Moon's sacred metal, rearranged by a mad scholar. Unscramble the letters to find the element that rules tides and dreams: V I L R E S.
                  <input type="text" value={riddle2} onChange={e => { setRiddle2(e.target.value); broadcastRoomEvent("RIDDLES_SYNC", { riddle2: e.target.value }); }} className="w-full bg-[#dfc898]/30 border-b border-[#b89050] outline-none font-cormorant italic text-lg text-center py-1 mt-2 text-[#1e0e04]" />
                </div>
                <div className="mb-4">
                  III. Decode this: GLVWLOO<br/>
                  (Caesar shift: each letter moved forward by III — the trinity again). This word is the Third Gate's true name.
                  <input type="text" value={riddle3} onChange={e => { setRiddle3(e.target.value); broadcastRoomEvent("RIDDLES_SYNC", { riddle3: e.target.value }); }} className="w-full bg-[#dfc898]/30 border-b border-[#b89050] outline-none font-cormorant italic text-lg text-center py-1 mt-2 text-[#1e0e04]" />
                </div>

                <div className="mt-6 text-sm">
                  <button onClick={() => setShowHint(!showHint)} className="text-[#9a6018] hover:underline">
                    ☽ reveal one hint
                  </button>
                  {showHint && (
                    <div className="mt-2 text-[#7a5010] bg-[#dfc898]/30 p-3 rounded">
                      Hint I: The Sun's metal on the periodic table is element 79.<br/>
                      Hint II: The scrambled letters V I L R E S form a word meaning the metal of the moon. It's not gold.<br/>
                      Hint III: Caesar +3 means A→D, B→E... reverse it: D→A, E→B, H→E...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-4 h-16">
              {filled.b1 && filled.b2 && filled.b3 && riddle1 && riddle2 && riddle3 && !jFeedback && (
                <button onClick={validateJournal} className="font-cinzel bg-[#1a0e04] border border-[#7a5010] text-[#c8922a] px-8 py-3 w-full max-w-md hover:bg-[#c8922a] hover:text-[#1a0e04] transition-colors">
                  ⚗ Attempt the Great Work
                </button>
              )}
              {jFeedback?.type === 'ok' && <div className="font-cinzel text-[#d4a017] text-xl drop-shadow-[0_0_8px_rgba(212,160,23,0.6)]">{jFeedback.msg}</div>}
              {jFeedback?.type === 'err' && <div className="font-cormorant italic text-red-500 text-xl font-bold">{jFeedback.msg}</div>}
            </div>

          </div>

          {/* RIGHT: FRAGMENTS */}
          <div className="flex flex-col gap-4">
            {FRAGMENTS.map(f => {
              const used = Object.values(filled).includes(f.word);
              const sel = selectedFrag === f.word;
              return (
                <div key={f.word}
                     draggable={!used}
                     onDragStart={e => handleDragStart(e, f.word)}
                     onClick={() => { if(!used) setSelectedFrag(f.word); }}
                     className={`bg-[#e2c88a] border ${sel ? 'border-[#d4af37] shadow-[0_0_8px_#d4af37]' : 'border-[#b89040]'} p-2 text-center transition-all ${used ? 'opacity-30 pointer-events-none' : 'cursor-grab hover:-translate-y-1'}`}>
                  <div className="font-cinzel text-[12px] font-bold text-[#1e0e04]">{f.word.toUpperCase()}</div>
                  <div className="font-cormorant italic text-[11px] text-[#5c4427]">{f.hint}</div>
                </div>
              )
            })}

            <div className="mt-8 bg-[rgba(212,160,23,0.06)] border border-[rgba(212,160,23,0.15)] p-4 text-center font-cinzel text-[10px] text-[#c8922a] leading-loose">
              I=1 · V=5 · X=10<br/>L=50 · C=100<br/>
              <hr className="border-[rgba(212,160,23,0.2)] my-2" />
              LXXIX=79<br/>XLVII=47<br/>LXXXII=82
            </div>
          </div>

        </div>
      </main>
    );
  }


  if (stage === 'pipes') {
    return (
      <main className={`min-h-screen relative flex flex-col items-center justify-center transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'}`}>
        <div className="absolute top-0 w-full z-20"><LevelHeader /></div>

        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/images/level2_bg.png)',
            filter: 'brightness(0.5) sepia(0.2) hue-rotate(-5deg) contrast(1.2)',
            transform: 'scale(1.05)'
          }}
        />
        {/* Mystical Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#110820]/80 via-transparent to-[#06030f]/90 pointer-events-none" />

        {/* Papyrus Container */}
        <div className="relative z-10 flex flex-col items-center px-16 py-20 md:px-20 md:py-24 max-w-[90vw] bg-[length:100%_100%] bg-no-repeat bg-center"
             style={{backgroundImage: 'url(/images/papyrus.png)', filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.8))'}}>
          <h1 className="font-cinzel text-xl md:text-2xl text-[#5a3a18] font-light mb-8 uppercase tracking-[0.3em] border-b border-[#c09a5b]/40 pb-3">The Distillation Apparatus</h1>
          
          <div className="relative mt-2">
            {/* Potion (Virtual Start) */}
            <div className="absolute -left-12 md:-left-16 top-0 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center z-20">
              <img src="/images/potion.png" alt="Potion" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(212,160,23,0.5)]" />
            </div>

            <div className="grid grid-cols-6 gap-1 p-2 bg-[#fdf5e6]/10 border border-[#8b6d4b]/60 rounded-lg shadow-[inset_0_4px_15px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              {grid.map((row, r) => row.map((cell, c) => (
                <div key={`${r}-${c}`} 
                     onClick={() => handlePipeClick(r,c)}
                     className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#fdf5e6]/30 relative cursor-pointer border border-[#8b6d4b]/40 hover:bg-[#fdf5e6]/60 hover:border-[#8b6d4b]/90 transition-all rounded-md overflow-hidden shadow-sm">
                  <PipeVisual cell={cell} />
                </div>
              )))}
            </div>

            {/* Door (Virtual End) */}
            <div onClick={handleDoorClick} className={`absolute -right-16 md:-right-20 bottom-0 w-12 h-20 md:w-16 md:h-24 flex items-center justify-center z-20 transition-all duration-[2000ms] ${grid[5][5].hasLiquid && keySpawned ? 'cursor-pointer hover:scale-105' : 'pointer-events-none'}`} 
                 style={{filter: grid[5][5].hasLiquid ? 'brightness(1.3) drop-shadow(0 0 20px rgba(212,160,23,0.8))' : 'brightness(0.6) sepia(0.3)'}}>
               <img src="/images/door_exit.png" alt="Exit Door" className="w-full h-full object-contain" />
            </div>

            {/* Spawned Key */}
            {keySpawned && !isDoorUnlocked && !items.find(i => i.id === "key_lvl2") && (
              <CollectibleItem 
                item={{
                  id: "key_lvl2",
                  name: "Golden Key",
                  description: "Forged from the successfully distilled elixir. Unlocks the final seal.",
                  iconSrc: "/images/key.png"
                }}
                className="absolute -right-4 bottom-32 animate-bounce"
              />
            )}
          </div>
        </div>
      </main>
    );
  }

  if (stage === 'victory') {
    return (
      <main className={`min-h-screen bg-[#0d0a14] flex flex-col items-center justify-center text-center transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'}`}>
        <div className="text-[48px] text-[#d4a017] mb-6" style={{animation: 'goldPulse 2s infinite rounded-full'}}>◈</div>
        <h1 className="font-cinzel text-2xl md:text-4xl text-[#c8922a] tracking-[0.2em] mb-8">The Great Work is revealed.</h1>
        <div className="font-cormorant italic text-xl md:text-2xl text-[#a89070] leading-loose max-w-2xl px-6">
          Calcinate at 76° · Conjoin for 16 nights · Sublime for 36 moons<br/>
          Au · ☉ · DISTILL<br/><br/>
          The journal seals itself. The laboratory door groans open.
        </div>
        <button onClick={() => {
            const completed = parseInt(localStorage.getItem("escapeRoomCompletedLevel") || "0", 10);
            if (completed < 2) localStorage.setItem("escapeRoomCompletedLevel", "2");
            router.push('/level3');
          }}
          className="mt-12 font-cinzel px-8 py-3 border border-[#d4a017] text-[#d4a017] hover:bg-[#d4a017] hover:text-black transition-colors uppercase tracking-widest">
          Proceed to Level 3
        </button>
      </main>
    );
  }

  return null;
}

// ----------------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------------

function LevelHeader() {
  return (
      <div className="relative z-20 mt-5 mb-2 flex flex-col items-center w-full pointer-events-none">
        <div className="flex items-center gap-3 mb-1 opacity-40">
          <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="font-cinzel text-[9px] tracking-[0.5em] text-[#d4af37] uppercase">Chamber II</span>
          <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-[#d4af37]" />
        </div>
        <h1 className="font-cinzel text-3xl md:text-5xl text-[#d4af37] text-center drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] tracking-widest">
          The Alchemist's Lab
        </h1>
      </div>
  );
}

function Blank({ id, val, onDrop, onRem }: { id:BlankId, val:string|null, onDrop:any, onRem:any }) {
  const isFilled = !!val;
  return (
    <span className={`inline-flex relative min-w-[80px] h-[24px] mx-2 align-bottom transition-all ${isFilled ? 'border-b-2 border-solid border-[#4a7a10]' : 'border-b-2 border-dashed border-[#9a6018]'}`}
          onDrop={(e) => onDrop(e, id)}
          onDragOver={(e) => e.preventDefault()}>
      <div className="absolute inset-0 flex items-center justify-center font-cinzel text-[11px] font-bold text-[#2a1004] pt-1 tracking-widest uppercase">
        {val}
      </div>

      {isFilled && (
        <div onClick={onRem} className="absolute -top-3 -right-3 w-4 h-4 bg-[#7a1010] text-[#f5e6c8] rounded-full text-[10px] flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity z-10">✕</div>
      )}
    </span>
  );
}

function PipeVisual({ cell }: { cell: PipeCell }) {
  if (cell.type === 'empty') return null;
  const col = cell.hasLiquid ? '#d4a017' : '#8b6d4b';
  
  // Base pipe div covers center
  const center = <div className="absolute inset-[35%] bg-current z-10 rounded-[1px]" style={{color: col}} />;
  
  const arms = [];
  const s = PIPE_SIDES[cell.type];
  if (s.n) arms.push(<div key="n" className="absolute top-0 bottom-[35%] left-[35%] right-[35%] bg-current" style={{color: col}} />);
  if (s.s) arms.push(<div key="s" className="absolute top-[35%] bottom-0 left-[35%] right-[35%] bg-current" style={{color: col}} />);
  if (s.e) arms.push(<div key="e" className="absolute top-[35%] bottom-[35%] left-[35%] right-0 bg-current" style={{color: col}} />);
  if (s.w) arms.push(<div key="w" className="absolute top-[35%] bottom-[35%] left-0 right-[35%] bg-current" style={{color: col}} />);

  return (
    <div className="w-full h-full transition-all duration-500 ease-in-out" 
         style={{
           transform: `rotate(${cell.rotation * 90}deg)`,
           filter: cell.hasLiquid ? 'drop-shadow(0 0 6px rgba(212,160,23,0.8))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
         }}>
      {center}
      {arms}
    </div>
  );
}
