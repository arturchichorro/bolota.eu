interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onCheckedChange, className = "" }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`relative h-5 w-10 cursor-pointer rounded-full border border-border bg-surface-2 p-0 ${className}`}
      onClick={() => onCheckedChange(!checked)}
    ><span className={`absolute top-0.5 left-0.5 size-3.5 rounded-full transition-transform ${checked ? "translate-x-5 bg-accent" : "bg-muted"}`} /></button>
  );
}
