interface Props {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onValueChange, max = 100, step = 1, className = "" }: Props) {
  return <input aria-label="Speed" className={`w-24 accent-accent ${className}`} type="range" value={value[0]} max={max} step={step} onChange={(event) => onValueChange([Number(event.target.value)])} />;
}
