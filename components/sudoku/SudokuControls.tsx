import React from 'react';

interface SudokuControlsProps {
  solving: boolean;
  isPaused: boolean;
  delay: number;
  onToggleSolving: () => void;
  onReset: () => void;
  onDelayChange: (delay: number) => void;
}

export const SudokuControls: React.FC<SudokuControlsProps> = ({
  solving,
  isPaused,
  delay,
  onToggleSolving,
  onReset,
  onDelayChange,
}) => (
  <div className="flex gap-4 mb-6">
    <button
      onClick={onToggleSolving}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      {solving ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
    </button>
    <button
      onClick={onReset}
      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
    >
      Reset
    </button>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Delay:</span>
      <input
        type="range"
        min="1"
        max="200"
        value={delay}
        onChange={(e) => onDelayChange(parseInt(e.target.value))}
        className="w-24"
      />
    </div>
  </div>
);