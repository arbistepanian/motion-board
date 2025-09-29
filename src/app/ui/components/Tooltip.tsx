"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    delayDuration?: number;
}

export default function Tooltip({
    content,
    children,
    side = "top",
    sideOffset = 6,
    delayDuration = 100,
}: TooltipProps) {
    return (
        <RadixTooltip.Provider delayDuration={delayDuration}>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        side={side}
                        sideOffset={sideOffset}
                        className="z-60 max-w-xs rounded-md px-3 py-1.5 text-sm shadow-md border bg-[var(--color-accent)] text-[var(--color-on-accent)] border-[var(--color-accent)] dark:shadow-black/40">
                        {content}
                        <RadixTooltip.Arrow className="fill-[var(--color-accent)]" />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
}
