import os

content = r'''"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GameStage, BlankId, FragmentWord, PipeType, PipeCell } from "@/types/level2";

// ----------------------------------------------------------------------------
// STAGE 0: INTRO CONSTANTS
// ----------------------------------------------------------------------------
const DIALOGUE_LINES = [
  "You should not be here.",
  "This laboratory existed before your grandfather's grandfather drew breath — when the Sun and Moon still argued over which one of them deserved to touch the Earth at dawn. They never agreed. That argument is why we have twilight.",
  "I have spent forty years learning what the Sun gives freely and what the Moon hoards in silence. The Sun burns everything it touches and calls it generosity. The Moon reflects borrowed light and calls it wisdom. Neither is wrong. Neither is enough.",
  "The moment your shadow crossed this threshold, the door behind you became stone. There is only one direction left to you now — forward, through the Work.",
  "The Elixir of Life is not gold. Fools chase gold. The Elixir is the marriage of everything that refuses to coexist: fire that heals, water that burns, a night so complete it illuminates, a sun that finally learns to hold still.",
  "My journal lies before you. Its pages are scattered as all true knowledge is scattered — hidden in numbers, buried in symbols, encrypted in the language the Sun and Moon use when they think no one is listening.",
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
  { word: "calcinate", hint: "burn to white ash" },
  { word: "conjoin",   hint: "unite opposites" },
  { word: "sublime",   hint: "rise without burning" },
  { word: "purify",    hint: "remove the corrupt" },
  { word: "ferment",   hint: "transform through decay" },
  { word: "dissolve",  hint: "break all bonds" }
];

function validateRiddle(ans: string): boolean {
  const a = ans.toLowerCase();
  const hasAu = a.includes('au');
  const hasSun = a.includes('☉') || a.includes('sol') || a.includes('sun') || a.includes('gold');
  const hasDistill = a.includes('distill') || a.includes('destil');
  return hasAu && hasSun && hasDistill;
}

// ----------------------------------------------------------------------------
// STAGE 2: POTIONS CONSTANTS
// ----------------------------------------------------------------------------
const BOTTLES = [
  { id: 'A', color: '#8b0000', name: "Sanguis Draconis", clue: "Power without wisdom devours its host" },
  { id: 'B', color: '#556b2f', name: "Venenum Serpentis", clue: "What heals in drops drowns in floods" },
  { id: 'C', color: '#d4af37', name: "Aurum Potabile", clue: "Liquid gold fills the purse, not the soul" },
  { id: 'D', color: '#191970', name: "Lacryma Lunae", clue: "The Moon's tears cool what the Sun cannot reach" },
  { id: 'E', color: '#f8f8ff', name: "Essentia Aurorae", clue: "Only light that does not burn can mend", correct: true },
  { id: 'F', color: '#8b4513', name: "Limus Primordialis", clue: "Origins are not destinations" }
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
  ['straight-h', 'straight-h', 'corner-sw', 'corner-ne', 'straight-v', 'corner-se'],
  ['corner-ne', 'empty', 'straight-v', 'straight-h', 'corner-nw', 'straight-v'],
  ['empty', 'corner-sw', 'corner-ne', 'straight-h', 'corner-sw', 'corner-se'],
  ['straight-v', 'straight-v', 'corner-se', 'empty', 'straight-v', 'corner-nw'],
  ['corner-nw', 'corner-sw', 'straight-h', 'straight-h', 'corner-ne', 'corner-sw'],
  ['straight-h', 'corner-ne', 'corner-se', 'straight-v', 'corner-se', 'straight-v']
];

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------
export default function Level2() {
  const router = useRouter();
  
  const [stage, setStage] = useState<GameStage>('intro');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // --- STAGE 0 STATE ---
  const [lineIndex, setLineIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [stars, setStars] = useState<{id:number, t:number, l:number, o:number, f:boolean}[]>([]);
  const [smokes, setSmokes] = useState<{id:number, s:number, t:string, l:number, d:number, dur:number}[]>([]);

  // --- STAGE 1 STATE ---
  const [filled, setFilled] = useState<Record<BlankId, FragmentWord | null>>({ b1:null, b2:null, b3:null });
  const [selectedFrag, setSelectedFrag] = useState<FragmentWord | null>(null);
  const [riddleInput, setRiddleInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [jFeedback, setJFeedback] = useState<{type: "ok"|"err", msg: string} | null>(null);

  // --- STAGE 2 STATE ---
  const [shatteredB, setShatteredB] = useState<string[]>([]);
  const [burstB, setBurstB] = useState<string | null>(null);

  // --- STAGE 3 STATE ---
  const [grid, setGrid] = useState<PipeCell[][]>(() => 
    INITIAL_GRID_DATA.map(row => row.map(type => ({
      type, rotation: Math.floor(Math.random() * 4), hasLiquid: false
    })))
  );

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
  const advanceTo = (newStage: GameStage) => {
    setFadeState('out');
    setTimeout(() => {
      setStage(newStage);
      setFadeState('in');
    }, 800);
  };

  // ----------------------------------------------------------------------------
  // STAGE 0 LOGIC
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'intro') return;

    // Generate effects
    setStars(Array.from({length: 65}, (_, i) => ({
      id: i, t: Math.random()*65, l: Math.random()*100, 
      o: 0.3 + Math.random()*0.6, f: Math.random() > 0.7
    })));
    
    setSmokes([...Array.from({length: 11}, (_, i) => ({
      id: i, s: 30 + Math.random()*40, t: 'rgba(60,20,80,0.14)',
      l: Math.random()*100, d: Math.random()*4, dur: 4 + Math.random()*3
    })), ...Array.from({length: 5}, (_, i) => ({
      id: 11+i, s: 20, t: 'rgba(180,80,10,0.08)',
      l: Math.random()*100, d: Math.random()*4, dur: 4 + Math.random()*3
    }))]);

  }, [stage]);

  useEffect(() => {
    if (stage !== 'intro') return;
    
    const textToType = DIALOGUE_LINES[lineIndex];
    setTypedText("");
    setIsTyping(true);
    let i = 0;
    
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    
    typeIntervalRef.current = setInterval(() => {
      setTypedText(textToType.substring(0, i + 1));
      i++;
      if (i >= textToType.length) {
        clearInterval(typeIntervalRef.current!);
        setIsTyping(false);
      }
    }, 22);

    return () => {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    };
  }, [lineIndex, stage]);

  const handleDialogueClick = () => {
    if (isTyping) {
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      setTypedText(DIALOGUE_LINES[lineIndex]);
      setIsTyping(false);
    } else {
      if (lineIndex < DIALOGUE_LINES.length - 1) {
        setLineIndex(l => l + 1);
      }
    }
  };

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
      n[id] = w; return n;
    });
  };
  const validateJournal = () => {
    const isB1 = filled.b1 === CORRECT_BLANKS.b1;
    const isB2 = filled.b2 === CORRECT_BLANKS.b2;
    const isB3 = filled.b3 === CORRECT_BLANKS.b3;
    const rOk = validateRiddle(riddleInput);

    if (isB1 && isB2 && isB3 && rOk) {
      setJFeedback({type: 'ok', msg: "At last... you have read between the lines."});
      setTimeout(() => advanceTo('potions'), 2000);
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
      setTimeout(() => advanceTo('victory'), 2000);
    }
  };

  const handlePipeClick = (r:number, c:number) => {
    if (grid[r][c].type === 'empty') return;
    const ng = [...grid];
    ng[r] = [...ng[r]];
    ng[r][c] = { ...ng[r][c], rotation: (ng[r][c].rotation + 1) % 4 };
    setGrid(ng);
    runBFS(ng);
  };

  // ----------------------------------------------------------------------------
  // RENDERERS
  // ----------------------------------------------------------------------------
  
  if (stage === 'intro') {
    return (
      <main className={`min-h-screen relative overflow-hidden transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'}`}
            style={{background: 'linear-gradient(180deg, #06030f 0%, #110820 55%, #1a0e05 100%)'}}>
        
        <button onClick={() => advanceTo('journal')} className="absolute top-4 right-6 z-50 font-cinzel text-[8px] text-[#888] hover:text-[#d4a017] uppercase tracking-widest cursor-pointer">
          skip intro ›
        </button>

        {/* Stars */}
        {stars.map(s => (
          <div key={s.id} className={`absolute bg-white rounded-full ${s.f?'anim-flicker':''}`} 
               style={{top:`${s.t}%`, left:`${s.l}%`, width:'2px', height:'2px', opacity:s.o, animationDelay: `${Math.random()*3}s`}} />
        ))}

        {/* Moon */}
        <div className="absolute top-[32px] right-[70px] w-[52px] h-[52px] rounded-full bg-[#ddd5a8] shadow-[0_0_30px_#ddd5a8]" 
             style={{animation: 'moonRise 2s ease-out 0.8s both'}} />
        <div className="absolute top-[14px] right-[52px] w-[88px] h-[88px] rounded-full bg-[rgba(221,213,168,0.07)]" 
             style={{animation: 'moonRise 2s ease-out 1.3s both'}} />

        {/* Sun bleed */}
        <div className="absolute -top-[60px] -left-[60px] w-[160px] h-[160px] rounded-full bg-[rgba(180,80,0,0.12)] blur-2xl" 
             style={{animation: 'moonRise 4s ease-out 1s both'}} />

        {/* Smoke */}
        {smokes.map(s => (
          <div key={s.id} className="absolute bottom-0" 
               style={{
                 left:`${s.l}%`, width:`${s.s}px`, height:`${s.s}px`, background:s.t, 
                 borderRadius:'50% 50% 20% 20%', filter:'blur(10px)',
                 animation: `smokeRise ${s.dur}s linear ${s.d}s infinite`
               }} />
        ))}

        {/* Wizard */}
        <div className="absolute bottom-[145px] left-1/2" style={{animation: 'wizAppear 1.2s ease-out 2s both'}}>
          <div style={{animation: 'floatWiz 5s ease-in-out infinite'}}>
            <svg width="140" height="240" viewBox="0 0 140 240" fill="none">
              <ellipse cx="70" cy="235" rx="40" ry="5" fill="rgba(0,0,0,0.5)"/>
              <path d="M40 230 C 40 100, 50 80, 70 80 C 90 80, 100 100, 100 230 Z" fill="#2d1b4e" style={{animation:'robeFloat 4s ease-in-out infinite'}}/>
              <path d="M55 230 L 55 120 M 85 230 L 85 120" stroke="#1a0f33" strokeWidth="2" style={{animation:'robeFloat 4s ease-in-out infinite'}}/>
              <ellipse cx="70" cy="80" rx="35" ry="8" fill="#1a0f33"/>
              <path d="M35 80 L 70 10 L 105 80 Z" fill="#2d1b4e"/>
              <circle cx="70" cy="10" r="4" style={{animation:'wandPulse 2s infinite'}}/>
              <circle cx="60" cy="40" r="1.5" fill="#a885d8"/>
              <circle cx="80" cy="55" r="1.5" fill="#a885d8"/>
              <circle cx="70" cy="70" r="1.5" fill="#a885d8"/>
              <ellipse cx="70" cy="88" rx="12" ry="15" fill="#e2c6a8"/>
              <ellipse cx="65" cy="85" rx="2" ry="1" fill="#111" style={{animation:'eyeGlow 3s infinite'}}/>
              <ellipse cx="75" cy="85" rx="2" ry="1" fill="#111" style={{animation:'eyeGlow 3s infinite'}}/>
              <path d="M62 82 Q 65 80 68 82 M 72 82 Q 75 80 78 82" stroke="#fff" strokeWidth="1.5" fill="none"/>
              <polygon points="58,95 82,95 70,130" fill="#f4f4f4"/>
              <path d="M60 95 Q 70 105 80 95" stroke="#ddd" fill="none"/>
              <path d="M45 100 Q 30 150 25 180" stroke="#1a0f33" strokeWidth="10" strokeLinecap="round"/>
              <path d="M95 100 Q 110 150 115 180" stroke="#1a0f33" strokeWidth="10" strokeLinecap="round"/>
              <rect x="25" y="150" width="15" height="20" fill="#4a2e15" rx="2"/>
              <line x1="115" y1="90" x2="115" y2="240" stroke="#5c4033" strokeWidth="4"/>
              <circle cx="115" cy="90" r="8" style={{animation:'wandPulse 2s infinite'}}/>
              <circle cx="115" cy="90" r="14" fill="rgba(212,160,23,0.2)" style={{animation:'wandPulse 2s infinite 0.3s'}}/>
              <text x="20" y="60" fill="#a885d8" fontSize="10" style={{animation:'eyeGlow 4s infinite'}}>☽</text>
              <text x="110" y="50" fill="#a885d8" fontSize="10" style={{animation:'eyeGlow 4s infinite 1s'}}>☉</text>
            </svg>
          </div>
        </div>

        {/* Dialogue Box */}
        <div onClick={handleDialogueClick} className="absolute bottom-0 left-0 right-0 bg-[rgba(6,3,12,0.95)] border-t border-[rgba(160,100,20,0.4)] px-6 py-[18px] pb-5 min-h-[148px] cursor-pointer z-50">
          <div className="font-cinzel text-[9px] tracking-[0.2em] text-[#7a4e0e] mb-2 uppercase">
            — ALDRIC THE GREY, KEEPER OF THE ETERNAL LABORATORY —
          </div>
          <div aria-live="polite" className="font-cormorant italic text-[16px] md:text-[18px] text-[#c8aa6e] leading-[1.9]">
            {typedText}
            {isTyping && <span className="inline-block w-[2px] h-[13px] bg-[#b87e20] ml-1 align-middle" style={{animation:'blink 0.85s step-end infinite'}} />}
          </div>
          
          <div className="absolute bottom-4 left-6 flex gap-2">
            {DIALOGUE_LINES.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${i <= lineIndex ? 'bg-[#d4a017]' : 'bg-[#333]'}`} />
            ))}
          </div>

          {!isTyping && lineIndex < DIALOGUE_LINES.length - 1 && (
            <div className="absolute bottom-4 right-6 font-cinzel text-[9px] text-[#887040]">click to continue ›</div>
          )}

          {!isTyping && lineIndex === DIALOGUE_LINES.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); advanceTo('journal'); }} 
                    className="absolute bottom-4 right-6 font-cinzel bg-transparent border border-[#7a5010] text-[#c8922a] px-4 py-1 text-xs hover:bg-[#7a5010]/20 transition-colors">
              Enter the Laboratory
            </button>
          )}
        </div>
      </main>
    );
  }

  if (stage === 'journal') {
    return (
      <main className={`min-h-screen bg-[#0d0a14] transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'} p-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
          
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
                  <Blank id="b1" val={filled.b1} onDrop={handleDrop} onRem={(e)=>placeWord('b1',null as any)} /> 
                  the base matter at precisely this degree until only the white ash remains — no more, no less, lest the Sun's gift turns to poison.
                </div>

                <div className="mb-4">
                  ☽ Second Gate — Lunar Conjunction:<br/>
                  The Moon rules silver, whose number is XLVII. Divide this by the sacred proportion of the trinity (III), round to the nearest whole. This is the number of nights one must 
                  <Blank id="b2" val={filled.b2} onDrop={handleDrop} onRem={(e)=>placeWord('b2',null as any)} /> 
                  fire and water — Sol and Luna — under open sky, neither vessel covered, neither flame extinguished.
                </div>

                <div className="mb-4">
                  ♄ Third Gate — Saturnine Rest:<br/>
                  Saturn's lead bears the number LXXXII. Halve it, then subtract the fingers of one hand (V). The residue must 
                  <Blank id="b3" val={filled.b3} onDrop={handleDrop} onRem={(e)=>placeWord('b3',null as any)} /> 
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
                </div>
                <div className="mb-4">
                  II. The number 76 + 3 on the ancient wheel — which celestial body does this element serve? Write its alchemical symbol.
                </div>
                <div className="mb-4">
                  III. Decode this: GLVWLOO<br/>
                  (Caesar shift: each letter moved forward by III — the trinity again). This word is the Third Gate's true name.
                </div>
                
                <input 
                  type="text" 
                  value={riddleInput} 
                  onChange={e => setRiddleInput(e.target.value)}
                  placeholder="e.g.  Au · ☉ · DISTILL"
                  className="w-full bg-[#dfc898]/30 border-b border-[#b89050] outline-none font-cormorant italic text-lg text-center py-2 mt-4 text-[#1e0e04] placeholder:text-[#1e0e04]/40"
                />

                <div className="mt-6 text-sm">
                  <button onClick={() => setShowHint(!showHint)} className="text-[#9a6018] hover:underline">
                    ☽ reveal one hint
                  </button>
                  {showHint && (
                    <div className="mt-2 text-[#7a5010] bg-[#dfc898]/30 p-3 rounded">
                      Hint I: The Sun's metal on the periodic table is element 79.<br/>
                      Hint II: 79 is also the atomic number of that same metal — ☉ rules it.<br/>
                      Hint III: Caesar +3 means A→D, B→E... reverse it: D→A, E→B, H→E...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-4 h-16">
              {filled.b1 && filled.b2 && filled.b3 && riddleInput.length > 2 && !jFeedback && (
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

  if (stage === 'potions') {
    return (
      <main className={`min-h-screen bg-[#0d0a14] flex flex-col items-center justify-center transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'}`}>
        <h1 className="font-cinzel text-3xl text-[#d4af37] mb-16">The Potion Shelf</h1>
        
        <div className="w-full max-w-4xl h-8 bg-[#3b2f1f] border-t-4 border-[#2a2015] shadow-[0_20px_30px_rgba(0,0,0,0.8)] relative flex justify-around items-end px-12">
          {BOTTLES.map((b) => {
            const isShattered = shatteredB.includes(b.id);
            const isBurst = burstB === b.id;
            
            if (isShattered) return <div key={b.id} className="w-16" />; // space

            return (
              <div key={b.id} 
                   onClick={() => {
                     if (b.correct) {
                       setBurstB(b.id);
                       setTimeout(() => advanceTo('pipes'), 1500);
                     } else {
                       setShatteredB(prev => [...prev, b.id]);
                     }
                   }}
                   className={`group relative w-12 h-24 mb-0 cursor-pointer transition-transform hover:scale-110 ${isBurst ? 'scale-125 -translate-y-20 z-50 pointer-events-none' : ''}`}
                   style={isBurst ? { animation: 'goldPulse 1s infinite' } : {}}>
                
                {/* Bottle body */}
                <div className="absolute bottom-0 w-full h-[60%] rounded-[40%_40%_10%_10%] border-2 border-white/20"
                     style={{background: b.color, boxShadow: `0 0 15px ${b.color}80`}} />
                {/* Bottle neck */}
                <div className="absolute bottom-[58%] left-1/4 w-1/2 h-[40%] rounded-t-sm border-x-2 border-t-2 border-white/20"
                     style={{background: b.color}} />
                {/* Cork */}
                <div className="absolute top-[-5px] left-[20%] w-[60%] h-[10px] bg-[#8b5a2b] rounded-t-sm" />

                {isBurst && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[200%] h-[200%] bg-white/50 blur-xl rounded-full animate-ping" />
                  </div>
                )}

                {!isBurst && (
                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-[#d4af37]/40 p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="font-cinzel text-xs text-[#d4af37] border-b border-[#d4af37]/30 pb-1 mb-1 text-center">{b.name}</div>
                    <div className="font-cormorant italic text-xs text-[#ccc] text-center">{b.clue}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    );
  }

  if (stage === 'pipes') {
    return (
      <main className={`min-h-screen bg-[#0e1018] flex flex-col items-center justify-center transition-opacity duration-800 ${fadeState==='in'?'opacity-100':'opacity-0'}`}>
        <h1 className="font-cinzel text-3xl text-[#d4af37] mb-8">The Distillation Apparatus</h1>
        
        <div className="relative">
          {/* Cauldron (Virtual Start) */}
          <div className="absolute -left-20 top-0 w-16 h-16 bg-[#2a2a2a] border-4 border-[#111] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,160,23,0.3)]">
            <span className="text-2xl">🍲</span>
          </div>

          <div className="grid grid-cols-6 gap-1 p-2 bg-[#1a1c23] border-4 border-[#333] rounded-lg shadow-2xl">
            {grid.map((row, r) => row.map((cell, c) => (
              <div key={`${r}-${c}`} 
                   onClick={() => handlePipeClick(r,c)}
                   className="w-12 h-12 md:w-16 md:h-16 bg-[#252830] relative cursor-pointer border border-[#111] hover:bg-[#2a2d36] transition-colors overflow-hidden">
                <PipeVisual cell={cell} />
              </div>
            )))}
          </div>

          {/* Flask (Virtual End) */}
          <div className="absolute -right-20 bottom-0 w-12 h-16 bg-white/10 border-2 border-white/30 rounded-[50%_50%_10%_10%] flex items-end justify-center overflow-hidden">
             <div className="w-full bg-[#d4a017] transition-all duration-[2000ms]" style={{height: grid[5][5].hasLiquid ? '100%' : '0%'}} />
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

function Blank({ id, val, onDrop, onRem }: { id:BlankId, val:string|null, onDrop:any, onRem:any }) {
  const isFilled = !!val;
  return (
    <span className={`inline-flex relative min-w-[80px] h-[24px] mx-2 align-bottom transition-all ${isFilled ? 'border-b-2 border-solid border-[#4a7a10]' : 'border-b-2 border-dashed border-[#9a6018]'}`}
          onDrop={(e) => onDrop(e, id)}
          onDragOver={(e) => e.preventDefault()}>
      <div className="absolute inset-0 flex items-center justify-center font-cinzel text-[11px] font-bold text-[#2a1004] pt-1 tracking-widest uppercase">
        {val}
      </div>
      <div className="absolute -bottom-4 left-0 right-0 text-center font-cinzel text-[9px] text-[#2a1004]/50">
        [ {id.toUpperCase().replace('B','')} ]
      </div>
      {isFilled && (
        <div onClick={onRem} className="absolute -top-3 -right-3 w-4 h-4 bg-[#7a1010] text-[#f5e6c8] rounded-full text-[10px] flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer transition-opacity z-10">✕</div>
      )}
    </span>
  );
}

function PipeVisual({ cell }: { cell: PipeCell }) {
  if (cell.type === 'empty') return null;
  const col = cell.hasLiquid ? '#d4a017' : '#555';
  
  // Base pipe div covers center
  const center = <div className="absolute inset-[30%] bg-current z-10" style={{color: col}} />;
  
  const arms = [];
  const s = PIPE_SIDES[cell.type];
  if (s.n) arms.push(<div key="n" className="absolute top-0 bottom-[30%] left-[30%] right-[30%] bg-current" style={{color: col}} />);
  if (s.s) arms.push(<div key="s" className="absolute top-[30%] bottom-0 left-[30%] right-[30%] bg-current" style={{color: col}} />);
  if (s.e) arms.push(<div key="e" className="absolute top-[30%] bottom-[30%] left-[30%] right-0 bg-current" style={{color: col}} />);
  if (s.w) arms.push(<div key="w" className="absolute top-[30%] bottom-[30%] left-0 right-[30%] bg-current" style={{color: col}} />);

  return (
    <div className="w-full h-full transition-transform duration-300" style={{transform: `rotate(${cell.rotation * 90}deg)`}}>
      {center}
      {arms}
    </div>
  );
}
'''

with open('app/level2/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("page.tsx created")
