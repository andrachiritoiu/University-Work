"use client";

import { useInventory, InventoryItem } from "@/lib/InventoryContext";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface CollectibleItemProps {
  item: InventoryItem;
  className?: string; // For positioning and styling (absolute, top, left, etc.)
}

export default function CollectibleItem({ item, className = "" }: CollectibleItemProps) {
  const { addItem, hasItem } = useInventory();
  const [isCollecting, setIsCollecting] = useState(false);

  // If we already have the item in inventory, don't render it in the scene anymore
  if (hasItem(item.id)) {
    return null;
  }

  const handleCollect = () => {
    setIsCollecting(true);
    // Add brief animation delay before actually putting it in context and unmounting
    setTimeout(() => {
      addItem(item);
    }, 600);
  };

  return (
    <button
      onClick={handleCollect}
      disabled={isCollecting}
      className={`
        group relative transition-all duration-500 hover:scale-110 focus:outline-none
        ${isCollecting ? 'opacity-0 scale-150 rotate-12 drop-shadow-[0_0_50px_rgba(212,175,55,1)]' : 'opacity-80 hover:opacity-100'}
        ${className}
      `}
      title={item.name}
    >
      {/* Item rendered clipped to its natural shape; rounded-full clips white PNG backgrounds */}
      <div className="relative z-10 flex items-center justify-center text-4xl sm:text-5xl transition-all group-hover:brightness-125">
        {item.iconSrc ? (
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            <img src={item.iconSrc} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          item.emojiFallback || "❓"
        )}
      </div>

      {/* Optional floating icon for collection feedback */}
      {isCollecting && (
        <Sparkles className="absolute inset-0 m-auto text-[#d4af37] animate-ping" size={40} />
      )}
    </button>
  );
}
