"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url, title } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col) => [randomFruit(), ...col.slice(0, 2)]);
        return newGrid;
      });
      if (Date.now() - start >= 2000) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSpinning(false);
      }
    }, 200);
  };

  // Check win condition directly in render
  const hasWin =
    !spinning &&
    (grid.some(
      (col) => col.every((f) => f === col[0])
    ) ||
      grid[0].every((f, i) => f === grid[1][i] && f === grid[2][i]));

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={`/${fruit.toLowerCase()}.png`}
              alt={fruit}
              width={64}
              height={64}
            />
          ))
        )}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {hasWin && (
        <div className="mt-4 text-green-600 font-semibold">
          🎉 You won! 🎉
          <Share
            text={`I just won a ${grid[0][0]} in the Fruit Slot Machine! ${url}`}
          />
        </div>
      )}
    </div>
  );
}
