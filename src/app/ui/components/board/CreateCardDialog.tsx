"use client";

import Button from "@/app/ui/components/Button";
import Label from "../Label";

export default function CreateCardDialog({
    titleRef,
    descRef,
    creating,
    onCancel,
    onSubmit,
}: {
    titleRef: React.RefObject<HTMLInputElement | null>;
    descRef: React.RefObject<HTMLInputElement | null>;
    creating: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="flex flex-col gap-3">
            <Label className="text-sm opacity-80">Title</Label>
            <input
                ref={titleRef}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2"
                placeholder="Card title"
                autoFocus
            />
            <Label className="text-sm opacity-80">Description (optional)</Label>
            <input
                ref={descRef}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2"
                placeholder="Description"
            />
            <div className="flex justify-end gap-2 mt-2">
                <Button variation="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variation="primary" type="submit" disabled={creating}>
                    {creating ? "Adding…" : "Add card"}
                </Button>
            </div>
        </form>
    );
}
