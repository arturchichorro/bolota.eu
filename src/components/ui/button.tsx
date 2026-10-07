import { Button as BaseButton } from "@base-ui/react/button";

type Props = BaseButton.Props & {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm";
  unstyled?: boolean;
};

export function Button({ className = "", variant = "default", size = "default", unstyled = false, ...props }: Props) {
  const variants = {
    default: "border-accent bg-accent text-background hover:brightness-110",
    secondary: "border-accent bg-surface-2 text-accent-soft hover:brightness-110",
    outline: "border-border bg-transparent text-foreground hover:border-accent hover:text-accent",
  };
  const sizes = { default: "min-h-9 px-3.5 py-2", sm: "min-h-8 px-2.5 py-1.5" };
  if (unstyled) return <BaseButton className={className} {...props} />;
  return <BaseButton className={`cursor-pointer rounded-sm border font-semibold disabled:cursor-wait disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
