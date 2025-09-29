import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/app/lib/utils/utils";
import Tooltip from "./Tooltip";
import { IconType } from "@/app/lib/types/types";
import Icon from "./Icon";

interface LinkButtonProps {
    href: string;
    variation?: "icon" | "primary" | "secondary" | "ghost";
    className?: string;
    iconClasses?: string;
    tooltip?: string;
    icon?: IconType;
    children?: ReactNode;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

export default function LinkButton({
    href,
    variation = "primary",
    className,
    iconClasses,
    tooltip,
    icon,
    children,
    target,
}: LinkButtonProps) {
    const variationClass = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        icon: "",
    }[variation];

    const linkClass = cn("btn", variationClass, className);

    const iconColorClass =
        variation === "primary"
            ? "text-[var(--color-on-primary)]"
            : "text-[var(--color-text)]";

    const iconClass = cn("w-5 h-5", iconColorClass, iconClasses);

    const iconNode = icon ? (
        <Icon size={5} icon={icon} className={iconClass} />
    ) : null;

    const linkNode = (
        <Link href={href} className={linkClass} target={target}>
            {iconNode}
            {children}
        </Link>
    );

    return tooltip ? <Tooltip content={tooltip}>{linkNode}</Tooltip> : linkNode;
}
