interface Props {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onValueChange, max = 100, step = 1, className = "" }: Props) {
  const progress = max > 0 ? Math.min(100, Math.max(0, value[0] / max * 100)) : 0;
  return (
    <div className={`w-24 ${className}`}>
      <div className="relative flex h-5 touch-none items-center select-none">
        <div aria-hidden="true" className="relative h-1 w-full rounded-full bg-border">
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
        <input
          type="range"
          aria-label="Speed"
          min={0}
          max={max}
          step={step}
          value={value[0]}
          onChange={(event) => onValueChange([event.currentTarget.valueAsNumber])}
          className="native-slider"
        />
      </div>
    </div>
  );
}
