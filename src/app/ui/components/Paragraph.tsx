import { HTMLAttributes } from "react";
import { cn } from "@/app/lib/utils/utils";

interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
    variant?: "default" | "muted" | "subtle";
}

export default function Paragraph({
    children,
    className,
    variant = "default",
    ...props
}: ParagraphProps) {
    const variants = {
        default: "text-[var(--color-text)]",
        muted: "text-[var(--color-subtext)]",
        subtle: "text-sm text-[var(--color-disabled)]",
    };

    return (
        <p
            className={cn("leading-relaxed", variants[variant], className)}
            {...props}>
            {children}
        </p>
    );
}
