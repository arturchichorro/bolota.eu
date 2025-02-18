import React from 'react';

interface SudokuCellProps {
  value: number;
  isOriginal: boolean;
  isAlternateBox: boolean;
  borderRight: boolean;
  borderBottom: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  isValid?: boolean;
  isPlayable?: boolean;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isOriginal,
  isAlternateBox,
  borderRight,
  borderBottom,
  isSelected,
  onClick,
  isValid = true,
  isPlayable = false,
}) => (
  <div
    onClick={onClick}
    className={`
      w-10 h-10 text-xl flex items-center justify-center
      border border-sudoku-borders
      ${isAlternateBox ? 'bg-sudoku' : 'bg-sudoku-foreground'}
      ${isOriginal ? 'font-bold text-primary' : 'text-sudoku-text'}
      ${borderRight && 'border-r-2 border-r-sudoku-highlight'}
      ${borderBottom && 'border-b-2 border-b-sudoku-highlight'}
      ${isSelected && '!border-sudoku-highlight border-2'}
      ${!isValid && '!bg-sudoku-warning'}
      ${!isValid && !isOriginal && '!text-sudoku-textwarning'}
      ${isPlayable && 'hover:!bg-accent cursor-pointer'}
    `}
  >
    {value !== 0 ? value : ''}
  </div>
);