import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface SudokuControlsProps {
  solving: boolean;
  isPaused: boolean;
  speed: number;
  onToggleSolving: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SudokuControls: React.FC<SudokuControlsProps> = ({
  solving,
  isPaused,
  speed,
  onToggleSolving,
  onReset,
  onSpeedChange,
}) => (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
    <div className="flex gap-2 sm:gap-4">
      <Button
        onClick={onToggleSolving}
        variant="secondary"
        size="sm"
        className="sm:size-default text-sm sm:text-base"
      >
        {solving ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="sm:size-default text-sm sm:text-base"
      >
        Reset
      </Button>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs sm:text-sm">Speed:</span>
      <Slider
        value={[speed]} 
        onValueChange={(value) => onSpeedChange(value[0])}
        max={100}
        step={1}
        className="w-16 sm:w-24 text-accent"
      />
    </div>
  </div>
);