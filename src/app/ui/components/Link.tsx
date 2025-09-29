import { cn } from "@/app/lib/utils/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface LinkProps {
    href: string;
    children: ReactNode;
    variant?: "link" | "button";
    target?: "_blank" | "_self" | "_parent" | "_top";
    className?: string;
}

export default function LinkCompponent({
    href,
    children,
    variant = "link",
    target,
    className,
}: LinkProps) {
    const base = "px-4 py-2 rounded font-medium transition cursor-pointer";

    const styles = {
        link: "text-[var(--primary)] hover:underline",
        button: cn(
            base,
            "bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-110",
            "disabled:bg-[var(--disabled)] disabled:text-[var(--on-primary)]"
        ),
    };

    return (
        <Link
            href={href}
            target={target}
            className={cn(styles[variant], className)}>
            {children}
        </Link>
    );
}
