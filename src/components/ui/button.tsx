import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm";
  unstyled?: boolean;
};

export function Button({ className = "", variant = "default", size = "default", unstyled = false, type = "button", ...props }: Props) {
  const variants = {
    default: "border-accent bg-accent text-background hover:brightness-110",
    secondary: "border-accent bg-surface-2 text-accent-soft hover:brightness-110",
    outline: "border-border bg-transparent text-foreground hover:border-accent hover:text-accent",
  };
  const sizes = { default: "min-h-9 px-3.5 py-2", sm: "min-h-8 px-2.5 py-1.5" };
  if (unstyled) return <button type={type} className={className} {...props} />;
  return <button type={type} className={`cursor-pointer rounded-sm border font-semibold disabled:cursor-wait disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
