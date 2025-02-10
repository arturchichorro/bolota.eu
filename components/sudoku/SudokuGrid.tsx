import React from 'react';
import { SudokuCell } from './SudokuCell';

interface SudokuGridProps {
  grid: number[][];
  initialGrid: number[][];
  selectedCell?: [number, number] | null;
  onCellClick?: (rowIndex: number, colIndex: number) => void;
  isPlayable?: boolean;
  checkValidity?: boolean;
  isValidMove?: (row: number, col: number, value: number) => boolean;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  initialGrid,
  selectedCell = null,
  onCellClick,
  isPlayable = true,
  checkValidity = false,
  isValidMove = () => true,
}) => (
  <div className="border-2 border-gray-400">
    {grid.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((_, colIndex) => {
          const value = grid[rowIndex][colIndex];
          const isOriginal = initialGrid[rowIndex][colIndex] !== 0;
          const boxRow = Math.floor(rowIndex / 3);
          const boxCol = Math.floor(colIndex / 3);
          const isAlternateBox = (boxRow + boxCol) % 2 === 0;
          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
          const isValid = !checkValidity || value === 0 || isValidMove(rowIndex, colIndex, value);

          return (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              isOriginal={isOriginal}
              isAlternateBox={isAlternateBox}
              borderRight={(colIndex + 1) % 3 === 0 && colIndex !== 8}
              borderBottom={(rowIndex + 1) % 3 === 0 && rowIndex !== 8}
              isSelected={isSelected}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
              isValid={isValid}
              isPlayable={isPlayable}
            />
          );
        })}
      </div>
    ))}
  </div>
);