"use client";

import { useInventory } from "@/lib/InventoryContext";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Briefcase, X } from "lucide-react";

export default function Inventory() {
  const { items, clearInventory, equippedItem, setEquippedItem } = useInventory();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const pathname = usePathname();

  const activeItem = items.find((i) => i.id === selectedItem);

  // Hide inventory button on the home/corridor page
  if (pathname === '/' || pathname === '/lobby') return null;

  return (
    <>
      {/* Inventory Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-28 right-4 lg:top-28 lg:right-6 p-3 bg-black/80 border-2 border-[#5c4026] text-[#c7baaa] hover:text-[#d4af37] hover:border-[#d4af37] transition-all rounded-lg shadow-[0_0_15px_black] z-[60] flex items-center gap-2 group"
      >
        <Briefcase size={24} className="group-hover:animate-pulse" />
        <span className="font-cinzel tracking-widest hidden md:inline">
          Inventory ({items.length})
        </span>
      </button>

      {/* Inventory Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-4xl h-[70vh] flex flex-col md:flex-row bg-[#150e09] border-[3px] border-[#d4af37] rounded-xl shadow-[0_0_80px_rgba(212,175,55,0.2)] overflow-hidden font-cormorant bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
            
            {/* Header & Close Mobile */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center bg-black/50 border border-[#5c4026] text-[#c7baaa] hover:text-red-500 hover:border-red-500 font-cinzel rounded transition-all z-10"
            >
              <X size={24} />
            </button>

            {/* Items Grid (Left side) */}
            <div className="w-full md:w-3/5 p-6 md:p-10 border-b md:border-b-0 md:border-r-2 border-[#5c4026] overflow-y-auto flex flex-col">
              <h2 className="text-4xl font-cinzel font-bold text-[#d4af37] mb-8 border-b border-[#5c4026] pb-4">
                Your Collection
              </h2>
              
              {items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[#8c7a6b] italic text-2xl">
                  Your pockets are empty...
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-4xl cursor-pointer transition-all shadow-lg
                        ${selectedItem === item.id 
                          ? 'bg-[#2a1d0f] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105' 
                          : 'bg-black/80 border-[#5c4026] hover:border-[#a89f91] hover:bg-[#1a1107]'}
                      `}
                    >
                      {item.iconSrc ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                          <img src={item.iconSrc} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        item.emojiFallback || "❓"
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Inspection details (Right side) */}
            <div className="w-full md:w-2/5 p-6 md:p-10 bg-gradient-to-b from-[#0a0705] to-[#150e09] flex flex-col justify-center">
              {activeItem ? (
                <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#5c4026] bg-black/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center text-6xl mb-6 overflow-hidden">
                     {activeItem.iconSrc ? (
                        <img src={activeItem.iconSrc} alt={activeItem.name} className="w-full h-full object-cover" />
                      ) : (
                        activeItem.emojiFallback || "❓"
                      )}
                  </div>
                  <h3 className="font-cinzel text-3xl font-bold text-[#e5d8b3] mb-4">
                    {activeItem.name}
                  </h3>
                  <p className="text-xl text-[#a89f91] leading-relaxed px-4 italic border-t border-b border-[#3c2a1a] py-6 mb-6">
                    {activeItem.description}
                  </p>
                  
                  <button 
                    onClick={() => {
                        if (equippedItem === activeItem.id) {
                            setEquippedItem(null);
                        } else {
                            setEquippedItem(activeItem.id);
                        }
                    }}
                    className={`px-8 py-3 rounded-full font-cinzel font-bold tracking-widest transition-all ${
                        equippedItem === activeItem.id 
                        ? 'bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.6)]' 
                        : 'bg-transparent border-2 border-[#5c4026] text-[#c7baaa] hover:border-[#d4af37] hover:text-[#d4af37]'
                    }`}
                  >
                    {equippedItem === activeItem.id ? 'UNEQUIP' : 'EQUIP ITEM'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-[#5c4026] opacity-70">
                  <Briefcase size={64} className="mb-4" />
                  <p className="font-cinzel text-2xl">Select an item to inspect</p>
                </div>
              )}
            </div>

            {/* <button 
                onClick={() => { clearInventory(); setIsOpen(false); }}
                className="absolute bottom-4 right-4 text-xs text-red-900 hover:text-red-600 uppercase tracking-widest font-cinzel opacity-40 hover:opacity-100"
            >
                [Debug: Clear Storage]
            </button> */}
          </div>
        </div>
      )}
    </>
  );
}
