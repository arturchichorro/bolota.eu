import React, { Ref } from 'react';
import { Button } from '../ui/button';

interface SudokuNumberPadProps {
  onNumberSelect: (num: number) => void;
  onReset: () => void;
  isCorrect?: boolean;
  padRef?: Ref<HTMLDivElement>;
}

const SudokuNumberPad: React.FC<SudokuNumberPadProps> = ({ onNumberSelect, onReset, isCorrect = false, padRef = null }) => {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-3 max-w-40">
        {isCorrect && (
        <div className={'text-center p-2 rounded bg-green-100 text-green-800 border border-green-200'}>
            Puzzle solved!
        </div>
      )}
      <div ref= {padRef} className="grid grid-cols-3 gap-2 max-w-md">
        <Button 
                onClick={onReset}
                className="col-span-3 h-10" size="sm" variant="secondary"
            >
                Reset Game
        </Button>
        {numbers.map((num) => (
          <Button
            variant="outline"
            className="w-12 h-12 p-2 text-md font-semibold rounded"
            key={num}
            onClick={() => onNumberSelect(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="w-12 h-12 p-2 text-md font-semibold rounded col-start-2"
          onClick={() => onNumberSelect(0)}
        >
          ⌫
        </Button>
      </div>
    </div>
  );
};

export default SudokuNumberPad;