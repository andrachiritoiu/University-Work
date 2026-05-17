"use client";

import { useState } from "react";

interface CombinationLockProps {
  onUnlock: () => void;
  correctCode: string;
}

export default function CombinationLock({ onUnlock, correctCode }: CombinationLockProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === correctCode) {
      setSuccess(true);
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="bg-[#1f150b] p-6 rounded-lg shadow-2xl border-4 border-[#3c2a1a] flex flex-col items-center w-full max-w-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <h3 className="font-cinzel text-2xl font-bold text-[#a89f91] mb-6 border-b border-[#3c2a1a] pb-2 w-full text-center">Ancient Mechanism</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          <input
            type="text"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="____"
            className={`bg-[#0a0705] border-2 ${error ? 'border-red-800' : success ? 'border-[#d4af37] text-white shadow-[0_0_40px_rgba(212,175,55,0.8)] glow-pulse' : 'border-[#3c2a1a]'} 
              text-[#d4af37] text-center text-3xl md:text-5xl tracking-[0.3em] md:tracking-[0.5em] font-cormorant font-bold w-full p-4 rounded mb-6 focus:outline-none focus:border-[#d4af37] transition-all duration-700`}
          />
          
          <button 
            type="submit"
            disabled={success}
            className={`font-cinzel py-3 px-8 text-xl font-bold rounded border-2 transition-all duration-700
              ${success ? 'bg-[#d4af37] border-white text-[#0a0705] shadow-[0_0_50px_rgba(212,175,55,1)] animate-pulse' : 'bg-[#3c2a1a] border-[#5c4026] text-[#e5d8b3] hover:bg-[#4a3420] hover:border-[#d4af37] hover:text-[#d4af37] shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'}
            `}
          >
            {success ? "MECHANISM UNLOCKED" : "TURN CYLINDERS"}
          </button>

          {error && (
            <p className="text-red-500 font-cinzel mt-4 animate-bounce">The mechanism resists.</p>
          )}
        </form>
      </div>
    </div>
  );
}
