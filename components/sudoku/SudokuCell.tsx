import React from 'react';

interface SudokuCellProps {
  value: number;
  isOriginal: boolean;
  isAlternateBox: boolean;
  borderRight: boolean;
  borderBottom: boolean;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isOriginal,
  isAlternateBox,
  borderRight,
  borderBottom,
}) => (
  <div
    className={`
      w-12 h-12 flex items-center justify-center
      border border-gray-200 text-xl
      ${isAlternateBox ? 'bg-gray-50' : 'bg-white'}
      ${isOriginal ? 'font-bold text-black' : 'text-blue-600'}
      ${borderRight ? 'border-r-2 border-r-gray-400' : ''}
      ${borderBottom ? 'border-b-2 border-b-gray-400' : ''}
    `}
  >
    {value !== 0 ? value : ''}
  </div>
);