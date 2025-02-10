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
  <div className="flex gap-4 justify-center">
    <Button
      onClick={onToggleSolving}
      variant="secondary"
    >
      {solving ? (isPaused ? 'Resume' : 'Pause') : 'Start'}
    </Button>
    <Button
      onClick={onReset}
      variant="outline"
    >
      Reset
    </Button>
    <div className="flex items-center gap-2">
      <span className="text-sm">Speed:</span>
      <Slider
        value={[speed]} 
        onValueChange={(value) => onSpeedChange(value[0])}
        max={100}
        step={1}
        className="w-24 text-accent"
      />
    </div>
  </div>
);