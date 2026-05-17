"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function RouteGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.startsWith("/level")) {
      const levelMatch = pathname.match(/level(\d+)/);
      if (levelMatch) {
        const targetLevel = parseInt(levelMatch[1], 10);
        const completedLevel = parseInt(localStorage.getItem("escapeRoomCompletedLevel") || "0", 10);
        
        // If the user tries to access a level that is locked
        if (targetLevel > 1 && completedLevel < targetLevel - 1) {
          router.replace("/lobby");
        }
      }
    }
  }, [pathname, router]);

  return null;
}
