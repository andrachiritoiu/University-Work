"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMusic: (e?: React.MouseEvent) => void;
  hasInteracted: boolean;
  setHasInteracted: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We expect the user to have placed their ambient track here:
    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.15; // Set volume low ("sa se auda incet")
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    
    if (!hasInteracted) setHasInteracted(true);

    if (isMuted) {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser:", err));
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  // If there's a global interaction and music isn't explicitly muted, we could auto-play here.
  // For now, we wait for the user to explicitly toggle the music.

  return (
    <AudioContext.Provider value={{ isMuted, toggleMusic, hasInteracted, setHasInteracted }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
