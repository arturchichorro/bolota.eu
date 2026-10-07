import { Slider as BaseSlider } from "@base-ui/react/slider";

interface Props {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onValueChange, max = 100, step = 1, className = "" }: Props) {
  return (
    <BaseSlider.Root
      value={value}
      onValueChange={(nextValue) => onValueChange([...nextValue])}
      max={max}
      step={step}
      className={`w-24 ${className}`}
    >
      <BaseSlider.Control className="flex h-5 touch-none items-center select-none">
        <BaseSlider.Track className="relative h-1 w-full rounded-full bg-border">
          <BaseSlider.Indicator className="rounded-full bg-accent" />
          <BaseSlider.Thumb aria-label="Speed" className="size-3.5 rounded-full border border-accent bg-surface shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
