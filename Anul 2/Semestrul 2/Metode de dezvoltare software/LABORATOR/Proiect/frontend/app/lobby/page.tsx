"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, Volume2, VolumeX, BookOpen, ChevronRight, Trophy, Loader2, Users, LogOut, User } from "lucide-react";
import "../particles.css";
import { createClient } from '@supabase/supabase-js'
import { useAudio } from "@/lib/AudioContext"
import { useInventory } from "@/lib/InventoryContext"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)
// Floating dust motes — purely decorative
const DustMote = ({ style }: { style: React.CSSProperties }) => (
  <div className="mote" style={style} />
);

const MOTES = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  width: `${(i % 3) + 1}px`,
  height: `${(i % 3) + 1}px`,
  "--duration": `${12 + (i % 10)}s`,
  animationDelay: `${(i * 0.7) % 10}s`,
} as React.CSSProperties));

const LABELS = [
  "The Mathematical Library", 
  "The Alchemist's Lab", 
  "The Astronomer's Tower", 
  "The Crypt of Codes", 
  "The Final Chamber"
];

export default function IntroHome() {
  const router = useRouter();
  const { roomCode, setRoomCode } = useInventory();
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [inputRoomCode, setInputRoomCode] = useState("");
  
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    current_level: number;
    remaining_time: number;
  } | null>(null);

  const [completedLevel, setCompletedLevel] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const { isMuted, toggleMusic, hasInteracted, setHasInteracted } = useAudio();
  
  const [shakingDoor, setShakingDoor] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const formatTime = (seconds: number) => {
    if (!seconds && seconds !== 0) return "30:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!showLeaderboard) return;
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const { data, error } = await supabase
          .from('player')
          .select('username, current_level, remaining_time')
          .order('current_level', { ascending: false })
          .order('remaining_time', { ascending: false })
          .limit(10);
        if (error) throw error;
        setLeaderboardData(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, [showLeaderboard]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('gameover') === 'time') {
        setIsGameOver(true);
        // Remove param from URL
        window.history.replaceState({}, '', '/lobby');
      }
    }
  }, []);

  useEffect(() => {
    // Check Supabase session and ensure player profile exists (for Google OAuth users)
    const ensurePlayerProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if user exists in player table
        const { data: player } = await supabase
          .from('player')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        if (!player) {
          // If not, they probably logged in via Google for the first time. Create profile.
          await supabase.from('player').insert([{
            id: session.user.id,
            username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Explorer',
            current_level: 1,
            best_score: 0,
            remaining_time: 1800
          }]);
        }
      }
    };
    ensurePlayerProfile();

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes flicker {
        0%, 100% { opacity: 0.9; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
      }
      @keyframes torch-fire {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
        25% { transform: translateY(-3px) translateX(2px) scale(1.2); opacity: 1; }
        50% { transform: translateY(2px) translateX(-2px) scale(0.9); opacity: 0.7; }
        75% { transform: translateY(-1px) translateX(0) scale(1.1); opacity: 0.9; }
      }
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-15px); }
        50% { transform: translateX(15px); }
        75% { transform: translateX(-15px); }
        100% { transform: translateX(0); }
      }
      .anim-flicker { animation: flicker 1.8s infinite ease-in-out alternate; }
      .anim-torch { animation: torch-fire 0.2s infinite alternate; }
      .anim-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      
      .corridor-zoom {
         transform: scale(4) translateY(100px);
         opacity: 0;
         transition: all 1.8s ease-in;
         transform-origin: top center;
      }
      .mist-move {
         animation: mistMove 25s infinite linear alternate;
      }
      @keyframes mistMove {
         0% { transform: translateX(-3%) translateY(5px) scale(1.05); opacity: 0.5; }
         100% { transform: translateX(3%) translateY(-5px) scale(1.1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    
    const comp = localStorage.getItem("escapeRoomCompletedLevel");
    if (comp) {
       setCompletedLevel(parseInt(comp, 10));
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: player } = await supabase
          .from('player')
          .select('username, current_level, remaining_time')
          .eq('id', session.user.id)
          .single();
        
        setUserProfile({
          username: player?.username || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Explorer',
          email: session.user.email || '',
          current_level: player?.current_level || 1,
          remaining_time: player?.remaining_time || 1800
        });
      } else {
        setUserProfile({
          username: 'Anonymous Explorer',
          email: 'anonymous@catacombs.io',
          current_level: completedLevel + 1,
          remaining_time: 1800
        });
      }
    };
    fetchSession();
  }, [completedLevel]);

  const attemptEnterDoor = (level: number) => {
    const isUnlocked = level === 1 || completedLevel >= level - 1;
    if (!isUnlocked) {
       setShakingDoor(level);
       setTimeout(() => setShakingDoor(null), 400);
       return;
    }

    if (level === 1) {
       // Snap to top to ensure clean zoom origin!
       window.scrollTo({ top: 0, behavior: 'smooth' });
       setIsZooming(true);
       
       const GAME_DURATION = 30 * 60; 
       localStorage.setItem("escapeRoomEndTime", (Date.now() + GAME_DURATION * 1000).toString());
       
       setTimeout(() => {
          router.push(`/level1`);
       }, 1600);
    } else {
       router.push(`/level${level}`);
    }
  };

  return (
    <main 
      onClick={() => !hasInteracted && setHasInteracted(true)}
      className={`relative bg-black font-cormorant flex flex-col items-center select-none text-[#e5d8b3] transition-opacity duration-1000 ${isZooming ? "pointer-events-none" : ""} ${!isExploring ? "h-[100dvh] w-full overflow-hidden" : "min-h-screen overflow-x-hidden"}`}
    >

      {/* ========== HERO LANDING SCREEN ========== */}
      {!isExploring && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
          {/* Background with Ken Burns zoom */}
          <div 
            className="absolute inset-0 bg-cover bg-center ken-burns brightness-[0.6] scale-105"
            style={{ backgroundImage: 'url(/images/landing_bg.png)' }}
          />
          {/* Dark vignette — top & bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          {/* Golden side glows */}
          <div className="absolute left-0 inset-y-0 w-[30vw] bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-[30vw] bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
          {/* Warm amber accent glow from bottom */}
          <div className="absolute bottom-0 inset-x-0 h-[40vh] bg-gradient-to-t from-[#8b5e1a]/20 to-transparent pointer-events-none" />

          {/* Floating dust motes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {MOTES.map((s, i) => <DustMote key={i} style={s} />)}
          </div>

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Decorative top line */}
            <div className="flex items-center gap-4 mb-6 opacity-60">
              <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="font-cinzel text-[#d4af37] text-[10px] md:text-xs tracking-[0.6em] uppercase">Est. Veritas</span>
              <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>

            <p className="font-cinzel text-[#d4af37] text-sm md:text-lg tracking-[0.5em] mb-4 opacity-80 uppercase animate-pulse">
              Seek The Hidden Truth
            </p>

            <h1 className="font-cinzel text-5xl md:text-[7rem] text-[#e5d8b3] cinematic-title drop-shadow-[0_0_60px_rgba(0,0,0,1)] uppercase font-bold tracking-tighter leading-none mb-2">
              Escape
            </h1>
            <h1 className="font-cinzel text-5xl md:text-[7rem] text-[#d4af37] cinematic-title drop-shadow-[0_0_40px_rgba(212,175,55,0.6)] uppercase font-bold tracking-tighter leading-none mb-8">
              Room
            </h1>

            {/* Decorative middle line */}
            <div className="flex items-center gap-3 mb-8 opacity-50">
              <div className="h-px w-10 md:w-20 bg-[#d4af37]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <div className="h-px w-10 md:w-20 bg-[#d4af37]" />
            </div>
            
            <button 
              onClick={() => setIsExploring(true)}
              className="group relative px-12 py-4 overflow-hidden rounded-full border-2 border-[#d4af37]/50 bg-black/50 backdrop-blur-xl transition-all duration-500 hover:border-[#d4af37] hover:shadow-[0_0_60px_rgba(212,175,55,0.4),0_0_120px_rgba(212,175,55,0.1)] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/15 to-[#d4af37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="relative flex items-center gap-4 text-lg md:text-xl font-cinzel tracking-[0.3em] text-[#d4af37] group-hover:text-white transition-colors duration-300 uppercase">
                Enter The Gates
                <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>
          </div>

          {/* Bottom toolbar */}
          <div className="absolute bottom-10 inset-x-0 flex justify-center gap-12 items-center z-10">
            <div className="h-px w-12 bg-[#5c4026]/60" />
            <button 
              onClick={() => setShowRules(true)} 
              className="text-[#8c7a6b] hover:text-[#d4af37] font-cinzel tracking-[0.3em] text-[10px] border-b border-transparent hover:border-[#d4af37] transition-all pb-0.5 uppercase"
            >Guidelines</button>
            <div className="w-px h-4 bg-[#5c4026]/60" />
            <button onClick={toggleMusic} className="text-[#8c7a6b] hover:text-[#d4af37] transition-all">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
            </button>
            <div className="h-px w-12 bg-[#5c4026]/60" />
          </div>
        </div>
      )}
      {/* 1. Global Stylized Background FIXED to viewport — with blur layer */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center brightness-[0.7] sepia-[0.2]"
        style={{ backgroundImage: 'url(/images/corridor.png)' }}
      />
      {/* Blur overlay on corridor background */}
      <div className="fixed inset-0 z-[1] backdrop-blur-[3px] bg-black/10 pointer-events-none" />
      
      {/* Dynamic Floor Fog Simulation FIXED to viewport bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-[30vh] z-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-50px] left-[-10vw] right-[-10vw] h-[40vh] z-[12] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mist-move pointer-events-none opacity-40 mix-blend-screen" />

      <div className={`relative w-full z-20 flex flex-col items-center transition-all duration-1000 ${isZooming ? 'corridor-zoom' : ''} ${!isExploring ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
         
         {/* Top Header UI */}
         <div className={`relative w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pt-10 px-6 md:px-12 transition-opacity duration-1000 z-50 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Left Column: Rules & Leaderboard */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 items-center order-2 lg:order-1">
              <button 
                 onClick={() => setShowRules(true)}
                 className="z-10 flex items-center gap-2 group text-[#c7baaa] hover:text-[#d4af37] transition-all bg-black/70 px-5 py-3 uppercase tracking-widest text-xs md:text-sm font-cinzel border border-[#5c4026]/60 rounded-lg hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl animate-in fade-in duration-300"
              >
                 <BookOpen size={16} />
                 <span>How to Play</span>
              </button>

              <button 
                 onClick={() => setShowLeaderboard(true)}
                 className="z-10 flex items-center gap-2 group text-[#c7baaa] hover:text-[#d4af37] transition-all bg-black/70 px-5 py-3 uppercase tracking-widest text-xs md:text-sm font-cinzel border border-[#5c4026]/60 rounded-lg hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl animate-in fade-in duration-300"
              >
                 <Trophy size={16} className="text-[#d4af37]" />
                 <span>Leaderboard</span>
              </button>
            </div>

            {/* Center Column: Symmetrical Title */}
            <div className="flex flex-col items-center gap-1 order-1 lg:order-2 select-none pointer-events-none">
               <span className="font-cinzel text-[10px] tracking-[0.5em] text-[#8c7a6b] uppercase opacity-60">The Ancient Halls</span>
               <h1 className="font-cinzel text-3xl md:text-5xl text-[#d4af37] drop-shadow-[0_0_40px_rgba(212,175,55,0.7)] tracking-[0.1em] text-center font-bold cinematic-title">
                  Escape Room
               </h1>
            </div>

            {/* Right Column: Multiplayer & Audio */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 items-center order-3">
              <button 
                 onClick={() => setShowProfile(true)}
                 className="z-10 flex items-center gap-2 group text-[#c7baaa] hover:text-[#d4af37] transition-all bg-black/70 px-5 py-3 uppercase tracking-widest text-xs font-cinzel border border-[#5c4026]/60 rounded-lg hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl animate-in fade-in duration-300"
              >
                 <User size={16} />
                 <span>My Account</span>
              </button>
              <button 
                 onClick={() => setShowMultiplayer(true)}
                 className={`z-10 flex items-center gap-2 group transition-all bg-black/70 px-5 py-3 uppercase tracking-widest text-xs font-cinzel border rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-xl animate-in fade-in duration-300
                    ${roomCode 
                       ? 'border-[#d4af37] text-[#d4af37]' 
                       : 'border-[#5c4026]/60 text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37]'
                    }
                 `}
              >
                 <Users size={16} />
                 <span>{roomCode ? `Room: ${roomCode}` : "Multiplayer"}</span>
              </button>

              <button 
                 onClick={toggleMusic}
                 className={`z-10 p-3 md:p-3.5 rounded-lg border transition-all backdrop-blur-xl flex items-center justify-center
                 ${!hasInteracted || isMuted 
                    ? 'bg-black/80 border-[#5c4026]/60 text-[#8c7a6b] hover:text-[#d4af37] hover:border-[#d4af37]' 
                    : 'bg-black/60 border-[#d4af37] text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'}
                 `}
              >
                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
              </button>
            </div>
         </div>

         {/* Scrollable Linear Corridor Logic */}
         <div className="w-full flex flex-col items-center gap-[100px] md:gap-[150px] mt-16 md:mt-24 pb-32">
            
            {/* Draw mapping of 5 doors strictly rendered one below another! */}
            {[1, 2, 3, 4, 5].map((level) => {
               const isUnlocked = level === 1 || completedLevel >= level - 1;
               const isCompleted = completedLevel >= level;
               const isHoverMain = level === 1 && !isCompleted;
               const isShaking = shakingDoor === level;

               return (
                  <div 
                    key={level}
                    className={`relative flex flex-col items-center group
                       ${isShaking ? 'anim-shake' : ''}
                    `}
                  >
                     

                     {/* Room label — refined */}
                     <div className="flex flex-col items-center mb-6 md:mb-10 text-center">
                        <span className={`font-cinzel text-[10px] tracking-[0.5em] uppercase mb-2 transition-colors duration-300
                           ${isUnlocked ? 'text-[#d4af37]/60' : 'text-[#5c4026]/40'}
                        `}>Chamber {level}</span>
                        <span className={`font-cinzel text-xl md:text-3xl font-bold tracking-widest drop-shadow-[0_0_20px_black] text-center bg-black/70 px-6 py-3 rounded-xl border backdrop-blur-md transition-all duration-[400ms]
                           ${isHoverMain ? 'text-[#e5d8b3] border-[#d4af37]/70 shadow-[0_0_40px_rgba(212,175,55,0.5)]' : isUnlocked ? 'text-[#c7baaa] border-[#5c4026]/50' : 'text-[#5c4026]/50 border-[#5c4026]/20'}
                        `}>
                           {LABELS[level - 1]}
                        </span>
                     </div>
                     
                     {/* The Physical Stylized RPG Door Element */}
                     <div 
                        onClick={() => attemptEnterDoor(level)}
                        className={`
                           relative w-[240px] h-[380px] md:w-[320px] md:h-[500px] rounded-t-full flex items-center justify-center transition-all duration-700
                           ${isHoverMain ? 'cursor-pointer shadow-[0_0_120px_rgba(212,175,55,0.7)]' : 'shadow-[0_0_80px_black]'}
                           ${!isUnlocked ? 'cursor-not-allowed filter grayscale-[30%] brightness-50 contrast-125' : ''}
                        `}
                        style={{ 
                           backgroundImage: 'url(/images/door.png)',
                           backgroundSize: 'cover',
                           backgroundPosition: 'center',
                           border: isHoverMain ? '6px solid rgba(212,175,55,0.8)' : '4px solid rgba(0,0,0,0.9)',
                           transform: isCompleted ? 'perspective(1200px) rotateY(-35deg)' : 'perspective(1200px) rotateY(0deg)',
                           transformOrigin: 'left'
                        }}
                     >
                        {/* Door Embedded ambient darkness */}
                        <div className="absolute inset-0 bg-black/30 rounded-t-full pointer-events-none" />

                        {/* Artificial Glowing Magic Frame overlay */}
                        {isUnlocked && !isCompleted && (
                           <div className="absolute inset-0 rounded-t-full mix-blend-color-dodge bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.4)_0%,transparent_80%)] anim-flicker pointer-events-none" />
                        )}

                        {/* Hover Overlay Logic */}
                        <div className={`absolute inset-0 rounded-t-full transition-colors duration-500 pointer-events-none
                           ${isHoverMain ? 'group-hover:bg-[#d4af37]/10' : ''}
                        `} />

                        {/* Locked/Unlocked States Marker */}
                        {!isCompleted && (
                        <div className={`relative z-10 p-6 rounded-full border-2 shadow-[0_0_50px_black] bg-black/90 transition-colors duration-500
                           ${isUnlocked ? 'border-[#5c4026] group-hover:bg-[#2a1d0f]' : 'border-red-900'}
                        `}>
                           <div className="relative group/lock">
                              {/* Number ALWAYS visible */}
                              <div className={`text-4xl md:text-5xl font-cinzel text-center w-12 h-12 md:w-16 md:h-16 font-bold flex items-center justify-center
                                 ${isUnlocked ? 'text-[#e5d8b3] drop-shadow-[0_0_10px_white]' : 'text-red-700/80 drop-shadow-[0_0_15px_rgba(200,0,0,0.6)]'}
                              `}>
                                 {level}
                              </div>

                              {/* Tiny lock icon if not unlocked */}
                              {!isUnlocked && (
                                 <div className="absolute -bottom-2 -right-2 bg-black p-1.5 rounded-full border border-red-900 shadow-[0_0_10px_black]">
                                    <Lock size={16} className="text-red-600" strokeWidth={2.5} />
                                 </div>
                              )}
                              
                              {/* Hover tooltip for locked doors */}
                              {!isUnlocked && (
                                 <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[220px] bg-[#1a1107] border border-red-900 text-red-400 text-sm px-4 py-2 rounded opacity-0 group-hover/lock:opacity-100 transition-opacity font-cormorant text-center pointer-events-none">
                                    Complete the previous level to unlock
                                 </div>
                              )}
                           </div>
                        </div>
                        )}
                     </div>

                  </div>
               );
            })}
         </div>

         {/* 4. Bottom Play Button Container (Anchored at very bottom sequence) */}
         <div className={`w-full flex justify-center pb-24 transition-opacity duration-1000 ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
            <button 
               onClick={() => attemptEnterDoor(Math.min(completedLevel + 1, 5))}
               className="font-cinzel text-4xl md:text-5xl text-[#1a1107] font-bold tracking-[0.2em] bg-[radial-gradient(ellipse_at_center,_#ffedb3_0%,_#d4af37_100%)] px-16 py-6 rounded-xl shadow-[0_0_100px_rgba(212,175,55,1)] hover:shadow-[0_0_150px_rgba(255,237,179,1)] hover:scale-105 active:scale-95 transition-all duration-300 uppercase animate-pulse border-4 border-white/50"
            >
               {completedLevel > 0 ? `Resume (Ch1-${Math.min(completedLevel + 1, 5)})` : "Play"}
            </button>
         </div>

      </div>

      {/* 5. Rules & Lore Modal overlay (Anchored fixed above everything!) */}
      {showRules && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <div className="relative max-w-3xl w-full mx-auto bg-[#150e09] border-[3px] border-[#d4af37] p-10 md:p-16 rounded-xl shadow-[0_0_100px_rgba(212,175,55,0.3)] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
               
               <button 
                  onClick={() => setShowRules(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 flex items-center justify-center bg-black border border-[#5c4026] text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37] font-cinzel text-2xl font-bold transition-all rounded"
               >
                  X
               </button>

               <h2 className="font-cinzel text-4xl md:text-5xl text-[#d4af37] mb-8 text-center tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] font-bold">How to Play</h2>
               
               <div className="space-y-6 text-[#e5d8b3] font-cormorant text-xl md:text-2xl leading-relaxed">
                  <p className="italic border-b-2 border-[#5c4026] pb-8 text-center md:px-8">
                     "You have been trapped deep inside the ancient catacombs. Five archaic rooms block your path to salvation. Solve the mechanical riddles hidden within each chamber, or the walls will forever seal your fate."
                  </p>
                  
                  <ul className="list-disc pl-6 md:pl-8 pt-4 space-y-4 marker:text-[#d4af37]">
                     <li><strong>5 Chambers:</strong> Proceed in order to unlock deeper rooms.</li>
                     <li><strong>The Vault Clock:</strong> You possess merely <span className="text-red-400 font-bold tracking-wider">30 Minutes</span> of absolute global timeline across the entire game.</li>
                     <li><strong>The Mechanism Tolerance:</strong> Attempting to force an incorrect combination will jam the gears. You have a maximum of <span className="text-red-400 font-bold tracking-wider">3 Mistakes</span> per room before the puzzle abruptly resets.</li>
                     <li><strong>Victory Rule:</strong> Calculate the combinations. Turn the tumblers. Wait for the heavy stone to grind open. Survive.</li>
                  </ul>
               </div>

            </div>
         </div>
      )}

      {/* Leaderboard Modal overlay */}
      {showLeaderboard && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <div className="relative max-w-3xl w-full mx-auto bg-[#150e09] border-[3px] border-[#d4af37] p-10 md:p-14 rounded-xl shadow-[0_0_100px_rgba(212,175,55,0.3)] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
               
               <button 
                  onClick={() => setShowLeaderboard(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 flex items-center justify-center bg-black border border-[#5c4026] text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37] font-cinzel text-2xl font-bold transition-all rounded"
               >
                  X
               </button>

               <div className="flex flex-col items-center mb-8 gap-1">
                  <Trophy size={40} className="text-[#d4af37] animate-pulse drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                  <h2 className="font-cinzel text-4xl md:text-5xl text-[#d4af37] text-center tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] font-bold uppercase">Hall of Fame</h2>
                  <span className="font-cinzel text-xs tracking-[0.3em] text-[#8c7a6b] uppercase opacity-75">Top Explorers</span>
               </div>

               {loadingLeaderboard ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                     <Loader2 size={40} className="text-[#d4af37] animate-spin" />
                     <p className="font-cinzel text-sm text-[#8c7a6b] tracking-wider animate-pulse">Decrypting scrolls...</p>
                  </div>
               ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-16">
                     <p className="italic text-[#e5d8b3] font-cormorant text-2xl">"No explorer has yet escaped the ancient depths..."</p>
                  </div>
               ) : (
                  <div className="overflow-x-auto w-full max-h-[50vh] scrollbar-thin scrollbar-thumb-[#5c4026] pr-2">
                     <table className="w-full text-left font-cormorant border-collapse">
                        <thead>
                           <tr className="border-b border-[#5c4026] font-cinzel text-xs tracking-wider text-[#8c7a6b]">
                              <th className="py-3 px-2 text-center w-16">Rank</th>
                              <th className="py-3 px-4">Explorer</th>
                              <th className="py-3 px-4 text-center">Highest Chamber</th>
                              <th className="py-3 px-4 text-center">Remaining Time</th>
                           </tr>
                        </thead>
                        <tbody>
                           {leaderboardData.map((player, index) => {
                              const isTop1 = index === 0;
                              const isTop2 = index === 1;
                              const isTop3 = index === 2;
                              const highestChamber = player.current_level || 1;
                              
                              let rankColor = "text-[#c7baaa]";
                              if (isTop1) rankColor = "text-[#d4af37] font-bold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]";
                              else if (isTop2) rankColor = "text-[#a0a0a0] font-bold";
                              else if (isTop3) rankColor = "text-[#b08d57] font-bold";

                              return (
                                 <tr key={index} className="border-b border-[#5c4026]/40 hover:bg-white/5 transition-colors text-lg md:text-xl text-[#e5d8b3]">
                                    <td className={`py-4 px-2 text-center font-cinzel font-bold ${rankColor}`}>
                                       {isTop1 ? "I" : isTop2 ? "II" : isTop3 ? "III" : index + 1}
                                    </td>
                                    <td className={`py-4 px-4 font-bold flex items-center gap-2 ${isTop1 ? "text-[#ffedb3]" : ""}`}>
                                       {player.username || "Unknown"}
                                       {isTop1 && <Trophy size={16} className="text-[#d4af37]" />}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                       Chamber {highestChamber}
                                    </td>
                                    <td className="py-4 px-4 text-center font-mono text-sm tracking-wider text-red-300">
                                       {formatTime(player.remaining_time)}
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* 6. Multiplayer Modal overlay */}
      {showMultiplayer && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <div className="relative max-w-xl w-full mx-auto bg-[#150e09] border-[3px] border-[#d4af37] p-10 md:p-14 rounded-xl shadow-[0_0_100px_rgba(212,175,55,0.3)] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] font-cinzel">
               
               <button 
                  onClick={() => setShowMultiplayer(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 flex items-center justify-center bg-black border border-[#5c4026] text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37] font-cinzel text-2xl font-bold transition-all rounded"
               >
                  X
               </button>

               <div className="flex flex-col items-center mb-8 gap-2">
                  <Users size={40} className="text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-pulse" />
                  <h2 className="font-cinzel text-4xl text-[#d4af37] text-center tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] font-bold uppercase">Multiplayer</h2>
                  <span className="font-cinzel text-xs tracking-[0.3em] text-[#8c7a6b] uppercase opacity-75">Shared Session Room</span>
               </div>

               <div className="flex flex-col gap-6 text-[#e5d8b3] text-center">
                  {roomCode ? (
                     <div className="space-y-6">
                        <div className="p-6 bg-[#2a1d0f] border-2 border-[#5c4026] rounded-xl">
                           <p className="text-[#8c7a6b] text-sm uppercase tracking-widest mb-2">Connected to Chamber</p>
                           <h3 className="text-4xl text-[#d4af37] font-bold tracking-[0.2em]">{roomCode}</h3>
                        </div>
                        <p className="text-lg font-cormorant italic text-[#a89f91] px-4 leading-relaxed">
                           "Your inventory and progression are now bound to all players inside this specific chamber. Items gathered will instantly synchronise."
                        </p>
                        <button
                           onClick={() => {
                              setRoomCode(null);
                           }}
                           className="w-full py-4 px-6 border-2 border-red-900 text-red-400 hover:bg-red-950/40 hover:border-red-600 rounded-lg tracking-widest font-bold transition-all uppercase flex items-center justify-center gap-2 duration-300"
                        >
                           <LogOut size={18} />
                           Leave Session Room
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-8">
                        <div className="space-y-4">
                           <h3 className="text-xl text-[#c7baaa] uppercase tracking-wider">Host a Private Session</h3>
                           <button
                              onClick={() => {
                                 // Generate random 6-character room code
                                 const generatedCode = "ESC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
                                 setRoomCode(generatedCode);
                              }}
                              className="w-full py-4 px-6 bg-gradient-to-r from-[#d4af37] to-[#b08d57] text-black hover:brightness-110 rounded-lg tracking-widest font-bold transition-all uppercase shadow-[0_0_35px_rgba(212,175,55,0.3)] duration-300"
                           >
                              Generate Room Code
                           </button>
                        </div>

                        <div className="relative flex py-4 items-center">
                           <div className="flex-grow border-t border-[#5c4026]/60"></div>
                           <span className="flex-shrink mx-4 text-[#8c7a6b] text-sm uppercase tracking-widest">or</span>
                           <div className="flex-grow border-t border-[#5c4026]/60"></div>
                        </div>

                        <div className="space-y-4">
                           <h3 className="text-xl text-[#c7baaa] uppercase tracking-wider">Join Existing Session</h3>
                           <div className="flex gap-3">
                              <input
                                 type="text"
                                 value={inputRoomCode}
                                 onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                                 placeholder="ENTER ROOM CODE"
                                 className="flex-1 py-4 px-6 bg-black/80 border-2 border-[#5c4026] text-[#e5d8b3] rounded-lg tracking-widest text-center focus:border-[#d4af37] focus:outline-none transition-all placeholder:text-[#5c4026]"
                              />
                              <button
                                 onClick={() => {
                                    if (inputRoomCode.trim()) {
                                       setRoomCode(inputRoomCode.trim());
                                       setInputRoomCode("");
                                    }
                                 }}
                                 className="py-4 px-8 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black rounded-lg tracking-widest font-bold transition-all uppercase duration-300"
                              >
                                 Join
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

            </div>
         </div>
      )}

      {/* 7. Explorer Profile Modal (My Account) */}
      {showProfile && userProfile && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <div className="relative max-w-2xl w-full mx-auto bg-[#130d0a] border-[3px] border-[#d4af37] p-8 md:p-12 rounded-xl shadow-[0_0_100px_rgba(212,175,55,0.35)] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] font-cinzel overflow-y-auto max-h-[90vh]">
               
               <button 
                  onClick={() => setShowProfile(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 flex items-center justify-center bg-black border border-[#5c4026] text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37] font-cinzel text-2xl font-bold transition-all rounded"
               >
                  X
               </button>

               <div className="flex flex-col items-center mb-8 gap-2 border-b border-[#5c4026]/40 pb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] bg-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-2">
                     <User size={38} className="text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  </div>
                  <h2 className="font-cinzel text-3xl text-[#d4af37] text-center tracking-widest font-bold uppercase">{userProfile.username}</h2>
                  <span className="font-cinzel text-xs tracking-[0.3em] text-[#8c7a6b] uppercase opacity-75">{userProfile.email}</span>
                  <span className="mt-2 px-4 py-1 border border-[#d4af37]/40 bg-[#23170e]/80 text-[#d4af37] rounded-full text-xs tracking-wider uppercase font-bold">
                     {completedLevel >= 5 ? "👑 Grandmaster Explorer" : "📜 Veteran Explorer"}
                  </span>
               </div>

               <div className="space-y-8 text-[#e5d8b3]">
                  {/* Progress Block */}
                  <div className="space-y-4">
                     <h3 className="text-lg text-[#d4af37] tracking-wider uppercase border-l-2 border-[#d4af37] pl-3">Adventure Journal</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-[#1f150e] border border-[#5c4026]/60 rounded-lg">
                           <p className="text-[#8c7a6b] text-xs uppercase tracking-wider mb-1">Chambers Conquered</p>
                           <p className="text-2xl font-bold">{completedLevel} / 5 Floors</p>
                        </div>
                        <div className="p-4 bg-[#1f150e] border border-[#5c4026]/60 rounded-lg">
                           <p className="text-[#8c7a6b] text-xs uppercase tracking-wider mb-1">Current Standing</p>
                           <p className="text-2xl font-bold text-[#d4af37]">Chamber {completedLevel + 1}</p>
                        </div>
                     </div>
                  </div>

                  {/* Team Chronicles & Sprints */}
                  <div className="space-y-4">
                     <h3 className="text-lg text-[#d4af37] tracking-wider uppercase border-l-2 border-[#d4af37] pl-3">Co-Op Campaign Records</h3>
                     <div className="space-y-3">
                        <div className="p-4 bg-[#23170e]/40 border border-[#5c4026]/40 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                              <p className="text-lg font-bold text-[#ffedb3]">Chamber I: The Library</p>
                              <p className="text-xs text-[#8c7a6b] tracking-wider uppercase mt-0.5">Team: Ionel, Vlad, Pupăză, Dăianu</p>
                           </div>
                           <div className="text-right">
                              <span className="px-3 py-1 bg-green-950/40 border border-green-800 text-green-400 rounded text-xs font-mono font-bold tracking-widest">
                                 14m 20s · ESCAPED
                              </span>
                           </div>
                        </div>

                        <div className="p-4 bg-[#23170e]/40 border border-[#5c4026]/40 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                              <p className="text-lg font-bold text-[#ffedb3]">Chamber II: The Alchemist's Lab</p>
                              <p className="text-xs text-[#8c7a6b] tracking-wider uppercase mt-0.5">Team: Ionel, Dăianu</p>
                           </div>
                           <div className="text-right">
                              <span className="px-3 py-1 bg-green-950/40 border border-green-800 text-green-400 rounded text-xs font-mono font-bold tracking-widest">
                                 21m 45s · ESCAPED
                              </span>
                           </div>
                        </div>

                        <div className="p-4 bg-[#23170e]/40 border border-[#5c4026]/40 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-60 hover:opacity-100 transition-opacity">
                           <div>
                              <p className="text-lg font-bold text-[#ffedb3]">Chamber III: The Tower</p>
                              <p className="text-xs text-[#8c7a6b] tracking-wider uppercase mt-0.5">Team: Co-Op Squad</p>
                           </div>
                           <div className="text-right">
                              <span className="px-3 py-1 bg-red-950/40 border border-red-900 text-red-400 rounded text-xs font-mono font-bold tracking-widest">
                                 FAILED · TIME EXPIRED
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Footnote */}
                  <p className="text-center font-cormorant italic text-sm text-[#8c7a6b] pt-4">
                     "The ancient records are bound in stone, detailing the path you and your compatriots have walked."
                  </p>
               </div>

            </div>
         </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="p-12 border-2 border-red-800 bg-[#0a0705] text-center rounded shadow-[0_0_150px_rgba(200,0,0,0.6)] max-w-lg flex flex-col items-center">
            <h1 className="text-6xl font-cinzel font-bold text-red-500 mb-6 drop-shadow-[0_0_20px_red]">
              Time's Up
            </h1>
            <p className="text-2xl text-red-300 mb-8 font-cormorant leading-relaxed">
              The 30 minutes have passed. The heavy stone doors grind shut forever, sealing you in the darkness.
              <br /><br />
              The ancient magic resets the labyrinth...
            </p>
            <button 
              onClick={() => setIsGameOver(false)}
              className="text-xl text-[#0a0705] bg-red-800 hover:bg-red-500 transition-colors font-cinzel font-bold px-8 py-3 rounded uppercase tracking-widest"
            >
              Accept Fate
            </button>
          </div>
        </div>
      )}

      {/* Tiny Debug Reset Progress */}
      <button
         onClick={() => {
            localStorage.removeItem("escapeRoomCompletedLevel");
            setCompletedLevel(0);
            window.location.reload();
         }}
         className="fixed bottom-2 right-2 text-[#5c4026] hover:text-red-900 text-[8px] font-mono opacity-50 z-50 transition-colors"
      >
         [RST]
      </button>

    </main>
  );
}



