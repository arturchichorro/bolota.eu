interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "aria-label": string;
}

export function Switch({ checked, onCheckedChange, className = "", "aria-label": label }: Props) {
  return (
    <label className={`relative block h-5 w-10 cursor-pointer rounded-full border border-border bg-surface-2 p-0 ${className}`}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        checked={checked}
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-checked={checked ? "" : undefined}
        className="pointer-events-none absolute top-0.5 left-0.5 size-3.5 rounded-full bg-muted transition-transform data-[checked]:translate-x-5 data-[checked]:bg-accent"
      />
      <span aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background" />
    </label>
  );
}
