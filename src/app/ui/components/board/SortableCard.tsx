"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Card } from "@/app/lib/types/board";

export default function SortableCard({ card }: { card: Card }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isSorting,
    } = useSortable({
        id: card.id,
        // 👇 Prevent Framer-style layout animations from kicking in during sort
        animateLayoutChanges: () => false,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        // 👇 Disable CSS transition while dragging to avoid “rubber band” effect
        transition: isDragging || isSorting ? undefined : transition,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        willChange: "transform",
    };

    return (
        <motion.div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            layout={false}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3"
            whileHover={{ scale: 1.01 }}
            style={style}>
            <div className="text-sm font-medium">{card.title}</div>
            {card.description && (
                <div className="text-xs opacity-70 mt-1">
                    {card.description}
                </div>
            )}
        </motion.div>
    );
}
