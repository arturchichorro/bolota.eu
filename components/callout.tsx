import { cn } from "@/lib/utils";
import { ReactNode } from "react";


interface CalloutProps {
    children?: ReactNode,
    type?: "default" | "warning" | "danger";
}

export function Callout({
    children,
    type = "default",
    ...props
}: CalloutProps) {
    return (
        <div className={
            cn("items-start rounded-md border border-l-4 px-4 w-full",
                {
                    "border-red-900 bg-red-50": type === "danger",
                    "border-yellow-900 bg-yellow-50": type === "warning",
                }
            )}
            {...props}
        >
            <div>
                {children}
            </div>
        </div>
    )
}