"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      try {
        setValue(JSON.parse(saved) as T);
      } catch {
        localStorage.removeItem(key);
      }
    }

    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [isLoaded, key, value]);

  return [value, setValue];
}
