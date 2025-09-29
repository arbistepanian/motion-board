"use client";

import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Heading from "@/app/ui/components/Heading";
import Button from "@/app/ui/components/Button";
import SortableCard from "./SortableCard";
import { List } from "@/app/lib/types/board";

export default function ListColumn({
    list,
    onAddCard,
}: {
    list: List;
    onAddCard: () => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: list.id });

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <Heading level={3} style={{ marginBottom: 8 }}>
                    {list.title}
                </Heading>
                <Button variation="primary" icon="add" onClick={onAddCard}>
                    Add card
                </Button>
            </div>

            <SortableContext
                items={list.cards.map((c) => c.id)}
                strategy={rectSortingStrategy}>
                <div
                    ref={setNodeRef}
                    // id not required anymore for DnD, but harmless to keep
                    id={list.id}
                    className={`flex flex-col gap-2 mb-3 rounded-md transition-colors ${
                        isOver ? "bg-[var(--color-surface)]/40" : ""
                    }`}
                    style={{ minHeight: 16 }} // small target even when empty
                >
                    {list.cards.map((c) => (
                        <SortableCard key={c.id} card={c} />
                    ))}
                </div>
            </SortableContext>
        </>
    );
}
