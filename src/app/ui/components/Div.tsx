import { cn } from "@/app/lib/utils/utils";
import { ReactNode } from "react";

type SectionProps = {
    children: ReactNode;
    type?: "light" | "dark";
    className?: string;
};

export default function Div({
    children,
    type = "light",
    className = "",
}: SectionProps) {
    const customClassName =
        type == "light"
            ? "text-md p-4 rounded-md bg-[var(--color-surface)] text-[var(--color-text)]"
            : "text-md p-4 rounded-md bg-[var(--color-surface-alt)] text-[var(--color-text)]";

    return <div className={cn([customClassName, className])}>{children}</div>;
}
