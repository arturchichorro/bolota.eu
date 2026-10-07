import { Switch as BaseSwitch } from "@base-ui/react/switch";

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onCheckedChange, className = "" }: Props) {
  return (
    <BaseSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={`relative h-5 w-10 cursor-pointer rounded-full border border-border bg-surface-2 p-0 ${className}`}
    >
      <BaseSwitch.Thumb className="absolute top-0.5 left-0.5 size-3.5 rounded-full bg-muted transition-transform data-[checked]:translate-x-5 data-[checked]:bg-accent" />
    </BaseSwitch.Root>
  );
}
