import type { Metadata } from "next";
import "./globals.css";
import { InventoryProvider } from "@/lib/InventoryContext";
import { TimerProvider } from "@/lib/TimerContext";
import { AudioProvider } from "@/lib/AudioContext";
import Inventory from "@/components/Inventory";
import Timer from "@/components/Timer";
import AIHintDialog from "@/components/AIHintDialog";
import RouteGuard from "@/components/RouteGuard";

export const metadata: Metadata = {
  title: "Escape Room",
  description: "MDS Escape Room interactive puzzle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:wght@400;600&family=Roboto+Slab:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-cormorant">
        <AudioProvider>
          <TimerProvider>
            <InventoryProvider>
              <RouteGuard />
              {children}
              <Inventory />
              <Timer />
              <AIHintDialog />
            </InventoryProvider>
          </TimerProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
