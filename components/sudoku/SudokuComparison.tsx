"use client"

import React, { useState, useRef } from 'react';
import { SudokuGrid } from './SudokuGrid';
import { SudokuControls } from './SudokuControls';
import { createBacktrackingSolver } from '@/lib/sudoku/sudokuSolverBacktracking';
import { createAlgorithmXSolver } from '@/lib/sudoku/sudokuSolverAlgX';
import type { SolverRef } from '@/lib/sudoku/types';
import { speedToDelay } from '@/lib/sudoku/sudokuUtils';

interface SudokuComparisonProps {
  initialGrid: number[][];
}

const SudokuComparison: React.FC<SudokuComparisonProps> = ({ initialGrid }) => {
  const [speed, setSpeed] = useState(50); // Default speed of 50%
  const [solving, setSolving] = useState(false);
  
  const [backtrackGrid, setBacktrackGrid] = useState<number[][]>(
    JSON.parse(JSON.stringify(initialGrid))
  );
  const [algXGrid, setAlgXGrid] = useState<number[][]>(
    JSON.parse(JSON.stringify(initialGrid))
  );

  const solverRef = useRef<SolverRef>({
    pause: false,
    abort: false,
    currentDelay: speedToDelay(50) // Initialize with default speed
  });

  async function solveWithBothAlgorithms() {
    setSolving(true);
    solverRef.current.abort = false;
    solverRef.current.currentDelay = speedToDelay(speed);

    await Promise.all([
      (async () => {
        const backtrackSolver = createBacktrackingSolver(setBacktrackGrid, solverRef);
        await backtrackSolver(JSON.parse(JSON.stringify(initialGrid)));
      })(),
      (async () => {
        const algXSolver = createAlgorithmXSolver(setAlgXGrid, solverRef);
        await algXSolver(initialGrid);
      })()
    ]);

    if (!solverRef.current.abort) {
      setSolving(false);
    }
  }

  const toggleSolving = () => {
    if (solving) {
      solverRef.current.pause = !solverRef.current.pause;
    } else {
      solverRef.current.pause = false;
      solveWithBothAlgorithms();
    }
  };

  const resetGrids = () => {
    solverRef.current.abort = true;
    solverRef.current.pause = false;
    setBacktrackGrid(JSON.parse(JSON.stringify(initialGrid)));
    setAlgXGrid(JSON.parse(JSON.stringify(initialGrid)));
    setSolving(false);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    solverRef.current.currentDelay = speedToDelay(newSpeed);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8 items-start">
        <SudokuGrid grid={backtrackGrid} initialGrid={initialGrid} isPlayable={false} />
        <SudokuGrid grid={algXGrid} initialGrid={initialGrid} isPlayable={false} />
      </div>
      <SudokuControls
        solving={solving}
        isPaused={solverRef.current.pause}
        speed={speed}
        onToggleSolving={toggleSolving}
        onReset={resetGrids}
        onSpeedChange={handleSpeedChange}
      />
    </div>
  );
};

export default SudokuComparison;