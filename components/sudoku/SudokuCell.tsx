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
      w-12 h-12 flex items-center justify-center
      border border-gray-200 text-xl
      ${isAlternateBox ? 'bg-gray-50' : ''}
      ${isOriginal ? 'font-bold text-black' : 'text-blue-600'}
      ${borderRight ? 'border-r-2 border-r-gray-400' : ''}
      ${borderBottom ? 'border-b-2 border-b-gray-400' : ''}
      ${isSelected ? 'bg-blue-100 border-purple-800 border-2' : ''}
      ${!isValid ? 'bg-red-200' : ''}
      ${isPlayable ? 'hover:bg-blue-50 cursor-pointer' : ''}
    `}
  >
    {value !== 0 ? value : ''}
  </div>
);