import React, { useState, useRef } from 'react';
import { SudokuControls } from './SudokuControls';
import { SudokuGrid } from './SudokuGrid';
import { createAlgorithmXSolver } from '@/lib/sudoku/sudokuSolverAlgX';
import type { SolverRef } from '@/lib/sudoku/types';

interface SudokuProps {
  initialGrid: number[][];
}

const SudokuAlgX: React.FC<SudokuProps> = ({ initialGrid }) => {
  const [grid, setGrid] = useState<number[][]>(JSON.parse(JSON.stringify(initialGrid)));
  const [solving, setSolving] = useState(false);
  const [delay, setDelay] = useState(100);
  const solverRef = useRef<SolverRef>({
    pause: false,
    abort: false,
    currentDelay: delay
  });

  async function solveSudoku() {
    setSolving(true);
    solverRef.current.abort = false;
    solverRef.current.currentDelay = delay;
    
    const solver = createAlgorithmXSolver(setGrid, solverRef);
    await solver(initialGrid);
    
    if (!solverRef.current.abort) {
      setSolving(false);
    }
  }

  const toggleSolving = () => {
    if (solving) {
      solverRef.current.pause = !solverRef.current.pause;
    } else {
      solverRef.current.pause = false;
      solveSudoku();
    }
  };

  const resetGrid = () => {
    solverRef.current.abort = true;
    solverRef.current.pause = false;
    setGrid(JSON.parse(JSON.stringify(initialGrid)));
    setSolving(false);
  };

  const handleDelayChange = (newDelay: number) => {
    setDelay(newDelay);
    solverRef.current.currentDelay = newDelay;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-fit">
      <SudokuControls
        solving={solving}
        isPaused={solverRef.current.pause}
        delay={delay}
        onToggleSolving={toggleSolving}
        onReset={resetGrid}
        onDelayChange={handleDelayChange}
      />
      <SudokuGrid grid={grid} initialGrid={initialGrid} />
    </div>
  );
};

export default SudokuAlgX;