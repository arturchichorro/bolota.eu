import React from 'react';
import { SudokuCell } from './SudokuCell';

interface SudokuGridProps {
  grid: number[][];
  initialGrid: number[][];
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({ grid, initialGrid }) => (
  <div className="border-2 border-gray-400">
    {grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((_, colIndex) => {
          const value = grid[rowIndex][colIndex];
          const isOriginal = initialGrid[rowIndex][colIndex] !== 0;
          const boxRow = Math.floor(rowIndex / 3);
          const boxCol = Math.floor(colIndex / 3);
          const isAlternateBox = (boxRow + boxCol) % 2 === 0;

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              isOriginal={isOriginal}
              isAlternateBox={isAlternateBox}
              borderRight={(colIndex + 1) % 3 === 0 && colIndex !== 8}
              borderBottom={(rowIndex + 1) % 3 === 0 && rowIndex !== 8}
            />
          );
        })}
      </div>
    ))}
  </div>
);