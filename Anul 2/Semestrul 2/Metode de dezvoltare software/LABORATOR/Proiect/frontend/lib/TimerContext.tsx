"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const GAME_DURATION = 30 * 60; // 30 minutes

interface TimerContextType {
  timeLeft: number;
  isGameOver: boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Activate timer ONLY when inside a level (not lobby or root)
  useEffect(() => {
    if (pathname && pathname.startsWith("/level")) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname]);

  const syncGameProgress = async (remaining: number) => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;
    
    // Extragem nivelul din pathname (ex: /level2 -> 2)
    const levelMatch = pathname.match(/level(\d+)/);
    const currentLevel = levelMatch ? parseInt(levelMatch[1], 10) : 1;

    const { error } = await supabase
      .from("player")
      .update({ remaining_time: remaining, current_level: currentLevel })
      .eq("id", authData.user.id);
      
    if (error) {
      console.error("Error syncing progress:", error);
    }
  };

  // On mount or active state change, fetch from DB
  useEffect(() => {
    async function initTimer() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data, error } = await supabase
        .from("player")
        .select("remaining_time")
        .eq("id", authData.user.id)
        .single();

      if (!error && data && data.remaining_time !== null) {
        setTimeLeft(data.remaining_time);
      } else {
        setTimeLeft(GAME_DURATION);
      }
    }
    
    if (isActive && !isGameOver) {
      initTimer();
    }
  }, [isActive, isGameOver]);

  // The countdown loop
  useEffect(() => {
    if (!isActive || isGameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isGameOver]);

  // Supabase Heartbeat
  useEffect(() => {
    if (!isActive || isGameOver) return;

    const syncInterval = setInterval(() => {
       syncGameProgress(timeLeftRef.current);
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [isActive, isGameOver]);

  const handleTimeUp = async () => {
    setIsGameOver(true);
    
    // Reset global state
    localStorage.setItem("escapeRoomCompletedLevel", "0");
    localStorage.removeItem("escapeRoomInventory");
    await syncGameProgress(GAME_DURATION);
    
    // Redirect to lobby with a query parameter for game over
    router.push("/lobby?gameover=time");
    
    // Give some time to redirect then reset
    setTimeout(() => {
      setIsGameOver(false);
      setTimeLeft(GAME_DURATION);
    }, 2000);
  };

  return (
    <TimerContext.Provider value={{ timeLeft, isGameOver }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
