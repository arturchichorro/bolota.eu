"use client"

import React, { useState, useRef } from 'react';
import { SudokuControls } from './SudokuControls';
import { SudokuGrid } from './SudokuGrid';
import { createBacktrackingSolver } from '@/lib/sudoku/sudokuSolverBacktracking';
import type { SolverRef } from '@/lib/sudoku/types';
import { speedToDelay } from '@/lib/sudoku/sudokuUtils';

interface SudokuProps {
  initialGrid: number[][];
}

const SudokuBacktrack: React.FC<SudokuProps> = ({ initialGrid }) => {
  const [grid, setGrid] = useState<number[][]>(JSON.parse(JSON.stringify(initialGrid)));
  const [solving, setSolving] = useState(false);
  const [speed, setSpeed] = useState(50);
  const solverRef = useRef<SolverRef>({
    pause: false,
    abort: false,
    currentDelay: speedToDelay(50) 
  });

  async function solveSudokuBacktracking() {
    setSolving(true);
    solverRef.current.abort = false;
    solverRef.current.currentDelay = speedToDelay(speed);
    const sudokuGrid = JSON.parse(JSON.stringify(grid));
    
    const backtrack = createBacktrackingSolver(setGrid, solverRef);
    await backtrack(sudokuGrid);
    
    if (!solverRef.current.abort) {
      setSolving(false);
    }
  }

  const toggleSolving = () => {
    if (solving) {
      solverRef.current.pause = !solverRef.current.pause;
    } else {
      solverRef.current.pause = false;
      solveSudokuBacktracking();
    }
  };

  const resetGrid = () => {
    solverRef.current.abort = true;
    solverRef.current.pause = false;
    setGrid(JSON.parse(JSON.stringify(initialGrid)));
    setSolving(false);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    solverRef.current.currentDelay = speedToDelay(newSpeed);
  };

  return (
    <div className="p-6 rounded-lg shadow-md max-w-fit">
      <SudokuControls
        solving={solving}
        isPaused={solverRef.current.pause}
        speed={speed}
        onToggleSolving={toggleSolving}
        onReset={resetGrid}
        onSpeedChange={handleSpeedChange}
      />
      <SudokuGrid grid={grid} initialGrid={initialGrid} isPlayable={false} />
    </div>
  );
};

export default SudokuBacktrack;