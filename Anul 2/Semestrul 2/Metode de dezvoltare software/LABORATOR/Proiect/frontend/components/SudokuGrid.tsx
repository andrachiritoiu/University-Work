"use client";

import { useState, useEffect, useMemo } from "react";
import { generateSudoku } from "@/lib/sudoku";

interface SudokuGridProps {
  onReady: (code: string) => void;
  onSolved: (code: string) => void;
  onGameOver: () => void;
}

export default function SudokuGrid({ onReady, onSolved, onGameOver }: SudokuGridProps) {
  const [initialGrid, setInitialGrid] = useState<number[][] | null>(null);
  const [userGrid, setUserGrid] = useState<number[][] | null>(null);
  const [solutionGrid, setSolutionGrid] = useState<number[][] | null>(null);
  
  const [mistakes, setMistakes] = useState(0);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [hoveredNum, setHoveredNum] = useState<number | null>(null);
  
  const [flashCell, setFlashCell] = useState<{r: number, c: number, type: 'red' | 'green'} | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const { puzzle, solution } = generateSudoku();
    setSolutionGrid(solution);
    setInitialGrid(puzzle);
    setUserGrid(puzzle.map(row => [...row]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNumberClick = (num: number) => {
    if (!selectedCell || !userGrid || !solutionGrid || isCompleted) return;
    const [r, c] = selectedCell;

    // Check if cell is pre-filled or already correct
    if (initialGrid && initialGrid[r][c] !== 0) return;
    if (userGrid[r][c] !== 0) return; // already correctly filled by user

    const isCorrect = solutionGrid[r][c] === num;

    if (isCorrect) {
      const newGrid = [...userGrid];
      newGrid[r] = [...newGrid[r]];
      newGrid[r][c] = num;
      setUserGrid(newGrid);
      
      setFlashCell({ r, c, type: 'green' });
      setTimeout(() => setFlashCell(null), 500);

      // Check entire board for completion
      let complete = true;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (newGrid[i][j] !== solutionGrid[i][j]) {
            complete = false;
            break;
          }
        }
      }
      
      if (complete) {
        setIsCompleted(true);
        // Extract center block
        let code = "";
        for (let ir = 3; ir <= 5; ir++) {
          for (let ic = 3; ic <= 5; ic++) {
             code += solutionGrid[ir][ic];
          }
        }
        onSolved(code);
      }
    } else {
      setMistakes(m => {
        const newMistakes = m + 1;
        if (newMistakes >= 3) {
           setTimeout(onGameOver, 500);
        }
        return newMistakes;
      });
      
      setFlashCell({ r, c, type: 'red' });
      setTimeout(() => setFlashCell(null), 800);
    }
  };

  const numberCounts = useMemo(() => {
    const counts = Array(10).fill(0);
    if (!userGrid) return counts;
    for (let r = 0; r < 9; r++) {
       for (let c = 0; c < 9; c++) {
          const val = userGrid[r][c];
          if (val !== 0) counts[val]++;
       }
    }
    return counts;
  }, [userGrid]);

  if (!userGrid) return <div className="text-[#a89f91] animate-pulse">Summoning Ancient Grid...</div>;

  return (
    <div className="bg-[#1f150b] p-4 md:p-6 rounded-lg shadow-2xl border-4 border-[#3c2a1a] flex flex-col items-center w-full max-w-[450px]">
      
      <div className="w-full flex justify-between items-center mb-4">
         <h2 className="font-cinzel text-xl font-bold text-[#e5d8b3] tracking-widest uppercase">The Cipher Grid</h2>
         <div className="flex gap-1 text-red-500 text-lg">
            {[1, 2, 3].map(i => (
              <span key={i} className={i <= mistakes ? "opacity-100 font-bold" : "text-[#3c2a1a]"}>X</span>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-9 gap-0 border-collapse w-full aspect-square bg-black shadow-[inset_0_0_20px_black]">
        {userGrid.map((row, r) =>
          row.map((val, c) => {
            const isInitial = initialGrid && initialGrid[r][c] !== 0;
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isCenterBox = r >= 3 && r <= 5 && c >= 3 && c <= 5;
            const isFlashRed = flashCell?.r === r && flashCell?.c === c && flashCell?.type === 'red';
            const isFlashGreen = flashCell?.r === r && flashCell?.c === c && flashCell?.type === 'green';
            const isHoverMatch = hoveredNum !== null && val === hoveredNum;
            
            // Highlight the exact cell correctly based on logic
            let bgClass = "bg-[#150e07] cursor-pointer hover:bg-[#2a1d0f]";
            if (isInitial) bgClass = "bg-[#0a0705] cursor-not-allowed";
            if (isSelected && !isInitial) bgClass = "bg-[#3d2c1c]";
            
            if (isHoverMatch) bgClass = isInitial ? "bg-[#4a3a20] cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-[#7a5a22]/70 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.4)]";

            if (isCenterBox && !isInitial && !isHoverMatch) bgClass = isSelected ? "bg-[#4a3420]" : "bg-[#2a1d0f]";
            if (isCenterBox && isInitial && !isHoverMatch) bgClass = "bg-[#1a1107] cursor-not-allowed";

            if (isFlashRed) bgClass = "bg-red-800 transition-colors duration-150";
            if (isFlashGreen) bgClass = "bg-green-800 transition-colors duration-150";

            let textClass = isInitial ? "text-[#8c7a6b]" : "text-[#d4af37]";

            const borderRight = (c === 2 || c === 5) ? 'border-r-[#d4af37] border-r-2 z-10' : 'border-r border-r-black/50';
            const borderBottom = (r === 2 || r === 5) ? 'border-b-[#d4af37] border-b-2 z-10' : 'border-b border-b-black/50';
            
            // special gold highlight for center box boundaries
            let boxHighlight = '';
            if (isCenterBox) {
                if (r === 3) boxHighlight += ' border-t-2 border-t-[#d4af37] shadow-[inset_0_5px_10px_rgba(212,175,55,0.1)]';
                if (r === 5) boxHighlight += ' shadow-[inset_0_-5px_10px_rgba(212,175,55,0.1)]';
                if (c === 3) boxHighlight += ' border-l-2 border-l-[#d4af37] shadow-[inset_5px_0_10px_rgba(212,175,55,0.1)]';
                if (c === 5) boxHighlight += ' shadow-[inset_-5px_0_10px_rgba(212,175,55,0.1)]';
            }

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => (!isInitial && val === 0) && setSelectedCell([r, c])}
                onMouseEnter={() => { if (val !== 0) setHoveredNum(val); }}
                onMouseLeave={() => setHoveredNum(null)}
                className={`flex items-center justify-center font-cormorant font-bold text-xl md:text-2xl 
                  ${bgClass} ${textClass} ${borderRight} ${borderBottom} ${boxHighlight} select-none transition-colors duration-200`}
              >
                {val !== 0 ? val : ""}
              </div>
            );
          })
        )}
      </div>

      {isCompleted && (
        <div className="mt-4 text-[#d4af37] font-cinzel text-lg animate-pulse text-center">
          The grid resonates...<br/>The center box reveals its secret.
        </div>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-9 gap-2 mt-6 w-full">
         {[1,2,3,4,5,6,7,8,9].map(num => {
            const isUsedUp = numberCounts[num] >= 9;

            return (
              <button
                 key={num}
                 disabled={isUsedUp || isCompleted || !selectedCell}
                 onClick={() => handleNumberClick(num)}
                 className={`py-2 rounded font-cormorant font-bold text-xl transition-all
                   ${isUsedUp 
                      ? 'bg-transparent text-transparent pointer-events-none' 
                      : 'bg-[#3c2a1a] text-[#e5d8b3] hover:bg-[#5c4026] hover:text-[#d4af37] border border-[#5c4026] border-b-4 active:border-b active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_10px_rgba(0,0,0,0.5)]'}
                 `}
              >
                 {num}
              </button>
            )
         })}
      </div>

    </div>
  );
}
