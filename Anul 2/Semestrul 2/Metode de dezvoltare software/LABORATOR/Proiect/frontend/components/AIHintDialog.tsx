"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send, Eye } from "lucide-react";

interface Message {
  role: "user" | "spirit";
  content: string;
}

export default function AIHintDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "spirit", content: "I am the spirit of the library... what do you seek?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Hide on lobby or root
  if (!pathname || !pathname.startsWith('/level')) return null;

  const currentLevel = parseInt(pathname.match(/level(\d+)/)?.[1] || "1", 10);
  const currentPuzzleId = `level${currentLevel}_general`;
  const oracleButtonPosition = currentLevel === 3
    ? "bottom-24 left-4 lg:bottom-8 lg:left-6"
    : "top-28 left-4 lg:top-28 lg:left-6";

  const getPlayerId = () => {
    const existing = localStorage.getItem("escapeRoomPlayerId");
    if (existing) return existing;

    const created = crypto.randomUUID();
    localStorage.setItem("escapeRoomPlayerId", created);
    return created;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: currentLevel,
          puzzleId: currentPuzzleId,
          playerId: getPlayerId(),
          userQuestion: userMsg,
        }),
      });

      if (!res.ok) throw new Error("Failed to contact the spirit");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "spirit", content: data.hint }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "spirit", content: "The spirits are silent... check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Eye Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${oracleButtonPosition} p-3 bg-black/80 border-2 border-[#5c4026] text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-full shadow-[0_0_15px_black] z-[60] flex items-center justify-center group`}
        title="Consult the Spirits"
      >
        <Eye size={24} className="group-hover:animate-pulse" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-md h-[60vh] flex flex-col bg-[#150e09] border-[3px] border-[#5c4026] rounded-xl shadow-[0_0_80px_rgba(212,175,55,0.15)] overflow-hidden font-cormorant bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#5c4026] bg-[#0a0705]">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Eye size={20} className="animate-pulse" />
                <h3 className="font-cinzel font-bold tracking-widest uppercase">The Oracle</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#8c7a6b] hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg border ${
                    msg.role === 'user' 
                    ? 'bg-[#2a1d0f] border-[#5c4026] text-[#e5d8b3]' 
                    : 'bg-black/60 border-[#3c2a1a] text-[#c7baaa] italic'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-lg border bg-black/60 border-[#3c2a1a] text-[#8c7a6b] italic flex items-center gap-2">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 border-t border-[#5c4026] bg-[#0a0705] flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for guidance..."
                className="flex-1 bg-black border border-[#5c4026] rounded-lg px-4 py-2 text-[#e5d8b3] focus:outline-none focus:border-[#d4af37] font-cormorant transition-colors placeholder:text-[#5c4026]"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#2a1d0f] border border-[#5c4026] text-[#d4af37] p-2 rounded-lg hover:border-[#d4af37] hover:bg-[#3c2a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
