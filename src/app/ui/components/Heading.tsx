import { HTMLAttributes } from "react";
import { cn } from "@/app/lib/utils/utils";

type HeadingLevel = 1 | 2 | 3 | 4;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    level?: HeadingLevel;
    className?: string;
    children: React.ReactNode;
}

const baseStyles = "text-[var(--color-text)] font-bold tracking-tight";

const levelClasses: Record<HeadingLevel, string> = {
    1: "text-xl md:text-2xl mb-4",
    2: "text-lg md:text-xl mb-4",
    3: "text-md md:text-lg mb-4",
    4: "text-md md:text-md mb-4",
};

export default function Heading({
    level = 1,
    className,
    children,
    ...props
}: HeadingProps) {
    const Tag: React.ElementType = `h${level}`;

    return (
        <Tag
            className={cn([baseStyles, levelClasses[level], className])}
            {...props}>
            {children}
        </Tag>
    );
}
