"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SudokuGrid } from './SudokuGrid';
import SudokuNumberPad from './SudokuNumberPad';

interface PlayableSudokuProps {
  initialGrid: number[][];
  solutionGrid: number[][];
}

const PlayableSudoku: React.FC<PlayableSudokuProps> = ({ initialGrid, solutionGrid }) => {
  const [grid, setGrid] = useState<number[][]>(initialGrid.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);

  const isValidMove = (row: number, col: number, value: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value || i !== row && grid[i][col] === value) return false;
    }
    
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boxRow + i !== row || boxCol + j !== col) {
          if (grid[boxRow + i][boxCol + j] === value) return false;
        }
      }
    }
    return true;
  };

  const checkCompletion = useCallback((currentGrid: number[][]) => {
    const complete = currentGrid.every(row => row.every(cell => cell !== 0));
    if (!complete) return;

    if (complete) {
      const correct = currentGrid.every((row, i) =>
        row.every((val, j) => val === solutionGrid[i][j])
      );
      setIsCorrect(correct);
      setSelectedCell(null);
    }
  }, [solutionGrid]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isCorrect) return;
    if (initialGrid[rowIndex][colIndex] === 0) {
      setSelectedCell([rowIndex, colIndex]);
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!selectedCell || isCorrect) return;

    const num = parseInt(e.key);
    if (num >= 0 && num <= 9) {
      const [row, col] = selectedCell;
      
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[row][col] = num;
        return newGrid;
      });
    }
  }, [selectedCell, isCorrect]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      gridRef.current 
      && !gridRef.current.contains(event.target as Node)
      && padRef.current 
      && !padRef.current.contains(event.target as Node)
    ) {
      setSelectedCell(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousedown', handleClickOutside);
    return () => { 
      window.removeEventListener('keydown', handleKeyPress); 
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [handleKeyPress, handleClickOutside]);

  useEffect(() => {
    checkCompletion(grid);
  }, [grid, checkCompletion]);

  const handleReset = () => {
    setGrid(initialGrid.map(row => [...row]));
    setIsCorrect(false);
    setSelectedCell(null);
  };

  const handleNumberSelect = (num: number) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    if (initialGrid[row][col] === 0) {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[row][col] = num;
        return newGrid;
      });
    }
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <div ref={gridRef}>
        <SudokuGrid
          grid={grid}
          initialGrid={initialGrid}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          isPlayable={!isCorrect}
          checkValidity={true}
          isValidMove={isValidMove}
        />
      </div>
      <SudokuNumberPad 
        onNumberSelect={handleNumberSelect}
        onReset={handleReset}
        disabled={!selectedCell || isCorrect}
        isCorrect={isCorrect}
        padRef={padRef}
      />
    </div>
  );
};

export default PlayableSudoku;