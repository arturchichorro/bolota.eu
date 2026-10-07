import type { ReactNode } from "react";

export function Callout({ children, type = "default" }: { children?: ReactNode; type?: "default" | "warning" | "danger" }) {
  const border = type === "danger" ? "border-l-red-400" : type === "warning" ? "border-l-yellow-300" : "border-l-accent";
  return <aside className={`my-7 w-full rounded border border-border border-l-4 bg-surface px-4 ${border}`}>{children}</aside>;
}
