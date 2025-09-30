"use client";

import { useMemo, useRef, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";

import {
    DndContext,
    DragOverlay,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

import { BOARD, CREATE_CARD, CREATE_LIST } from "@/app/lib/graphql/board.gql";
import { useBoardDnd } from "@/app/lib/hooks/useBoardDnd";
import { sortByPosition } from "@/app/lib/utils/boardUtils";
import type {
    BoardData,
    BoardVars,
    Card,
    List,
    CreateCardData,
    CreateCardVars,
} from "@/app/lib/types/board";

import ListColumn from "@/app/ui/components/board/ListColumn";
import CreateCardDialog from "@/app/ui/components/board/CreateCardDialog";
import DialogBox from "@/app/ui/components/DialogBox";
import Page from "../Page";

/* --------------------- Motion Variants ------------------ */
const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const listVariant = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

/* --------------------- Local Types ---------------------- */
type CreateListData = { createList: List };
type CreateListVars = { boardId: string; title: string };

/* ------------------------ Component --------------------- */
export default function BoardView() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const boardId = params?.id ?? "";

    const client = useApolloClient();

    const { data, loading, error } = useQuery<BoardData, BoardVars>(BOARD, {
        variables: { id: boardId },
        skip: !boardId,
        fetchPolicy: "cache-and-network",
    });

    const board = data?.board ?? null;

    const lists: List[] = useMemo(() => {
        if (!board?.lists) return [];
        return board.lists.map((l) => ({
            ...l,
            cards: sortByPosition(l.cards),
        }));
    }, [board?.lists]);

    /* ---------- Create List ---------- */
    const listInputRef = useRef<HTMLInputElement>(null);
    const [creatingList, setCreatingList] = useState<boolean>(false);

    const [createList] = useMutation<CreateListData, CreateListVars>(
        CREATE_LIST,
        {
            optimisticResponse: (vars) => ({
                createList: {
                    __typename: "List",
                    id: `temp-${Date.now()}`,
                    title: vars.title,
                    position: (lists?.length ?? 0) + 1,
                    createdAt: new Date().toISOString(),
                    cards: [],
                },
            }),
            update: (cache, result) => {
                const newList = result.data?.createList;
                if (!newList || !board) return;
                cache.updateQuery<BoardData, BoardVars>(
                    { query: BOARD, variables: { id: board.id } },
                    (prev) => {
                        if (!prev?.board) return prev;
                        if (prev.board.lists.some((l) => l.id === newList.id))
                            return prev;
                        return {
                            board: {
                                ...prev.board,
                                lists: [...prev.board.lists, newList],
                            },
                        };
                    }
                );
            },
        }
    );

    const onAddList = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!board?.id) return;
        const val = (listInputRef.current?.value ?? "").trim();
        if (!val) return;
        setCreatingList(true);
        try {
            await createList({ variables: { boardId: board.id, title: val } });
            if (listInputRef.current) listInputRef.current.value = "";
        } finally {
            setCreatingList(false);
        }
    };

    /* ---------- Create Card (Dialog) ---------- */
    const [cardDialogOpen, setCardDialogOpen] = useState<boolean>(false);
    const [targetList, setTargetList] = useState<List | null>(null);
    const [creatingCard, setCreatingCard] = useState<boolean>(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    const [mutateCreateCard] = useMutation<CreateCardData, CreateCardVars>(
        CREATE_CARD
    );

    function openCardDialog(list: List) {
        setTargetList(list);
        setCardDialogOpen(true);
    }
    function closeCardDialog() {
        setCardDialogOpen(false);
        setTargetList(null);
        if (titleRef.current) titleRef.current.value = "";
        if (descRef.current) descRef.current.value = "";
    }

    async function createCardForList() {
        if (!board || !targetList) return;
        const title = (titleRef.current?.value ?? "").trim();
        const description = (descRef.current?.value ?? "").trim() || undefined;
        if (!title) return;

        const optimistic: Card = {
            __typename: "Card",
            id: `temp-card-${Date.now()}`,
            title,
            description: description ?? null,
            position: (targetList.cards?.length ?? 0) + 1,
            createdAt: new Date().toISOString(),
            listId: targetList.id,
        };

        setCreatingCard(true);
        try {
            await mutateCreateCard({
                variables: { listId: targetList.id, title, description },
                optimisticResponse: { createCard: optimistic },
                update: (cache, result) => {
                    const newCard = result.data?.createCard;
                    if (!newCard || !board) return;

                    cache.updateQuery<BoardData, BoardVars>(
                        { query: BOARD, variables: { id: board.id } },
                        (prev) => {
                            if (!prev?.board) return prev;
                            return {
                                board: {
                                    ...prev.board,
                                    lists: prev.board.lists.map((l) =>
                                        l.id === targetList.id
                                            ? {
                                                  ...l,
                                                  cards: sortByPosition([
                                                      ...l.cards,
                                                      newCard,
                                                  ]),
                                              }
                                            : l
                                    ),
                                },
                            };
                        }
                    );
                },
            });
            closeCardDialog();
        } finally {
            setCreatingCard(false);
        }
    }

    /* ---------- DnD ---------- */
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 5 },
        })
    );

    const { activeCard, handleDragStart, handleDragEnd } = useBoardDnd({
        board,
        lists,
        client,
    });

    /* ---------------- Render ---------------- */
    return (
        <Page>
            {/* Top bar */}
            <header className="mb-4 flex items-center gap-3">
                <button
                    onClick={() => router.push("/")}
                    className="
            inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            hover:bg-[var(--color-surface-hover)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]
          ">
                    ← Back
                </button>
                <h2 className="m-0 text-2xl font-semibold">
                    {board?.name ?? "Board"}
                </h2>
            </header>

            {/* Loading */}
            {loading && (
                <>
                    <h3 className="text-lg font-medium">Loading…</h3>
                    <div
                        className="mt-4 grid gap-4"
                        style={{
                            gridTemplateColumns:
                                "repeat(6, minmax(260px, 1fr))",
                        }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-64 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)]"
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Error */}
            {error && (
                <div
                    className="
            mb-4 rounded-lg border px-3 py-2 text-sm
            border-[var(--color-error-border)]
            bg-[var(--color-error-bg)]
            text-[var(--color-error-text)]
          ">
                    {error?.message ?? "Failed to load board."}
                    <div className="mt-3">
                        <button
                            onClick={() => router.push("/boards")}
                            className="
                inline-flex items-center rounded-lg border px-3 py-1.5 text-sm transition
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                hover:bg-[var(--color-surface-hover)]
              ">
                            Go back
                        </button>
                    </div>
                </div>
            )}

            {/* Not found */}
            {!error && !loading && !board && (
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <h3 className="mb-1 text-lg font-medium">
                        Board not found
                    </h3>
                    <p className="text-sm text-[var(--color-subtext)]">
                        This board doesn’t exist or you don’t have access.
                    </p>
                    <div className="mt-3">
                        <button
                            onClick={() => router.push("/boards")}
                            className="
                inline-flex items-center rounded-lg border px-3 py-1.5 text-sm transition
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                hover:bg-[var(--color-surface-hover)]
              ">
                            Go back
                        </button>
                    </div>
                </div>
            )}

            {/* Board */}
            {!error && !loading && board && (
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}>
                    <motion.section
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="h-full overflow-x-auto"
                        style={{
                            display: "grid",
                            gap: 16,
                            gridTemplateColumns: `repeat(${Math.max(
                                lists.length + 1,
                                3
                            )}, 300px)`,
                        }}>
                        <AnimatePresence initial={false}>
                            {/* Lists */}
                            {lists.map((list) => (
                                <motion.div
                                    key={list.id}
                                    variants={listVariant}
                                    layout
                                    className="
                    rounded-xl border p-3
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                  ">
                                    <ListColumn
                                        list={list}
                                        onAddCard={() => openCardDialog(list)}
                                    />
                                </motion.div>
                            ))}

                            {/* Add List column */}
                            <motion.div
                                key="add-list"
                                variants={listVariant}
                                layout
                                className="
                  flex flex-col items-start justify-start gap-2 rounded-xl border border-dashed p-3
                  border-[var(--color-border)]
                  bg-transparent
                ">
                                <h4 className="mb-2 text-base font-semibold">
                                    Add a list
                                </h4>
                                <form
                                    onSubmit={onAddList}
                                    className="flex gap-2">
                                    <input
                                        ref={listInputRef}
                                        type="text"
                                        name="title"
                                        placeholder="List title"
                                        className="
                      rounded-md border px-3 py-2 text-sm outline-none
                      border-[var(--color-border)]
                      bg-[var(--color-surface)]
                      placeholder:text-[var(--color-placeholder)]
                      focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]
                    "
                                    />
                                    <button
                                        type="submit"
                                        disabled={creatingList}
                                        className="
                      inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition
                      bg-[var(--color-primary)] text-[var(--color-on-primary)]
                      hover:bg-[var(--color-primary-hover)]
                      active:bg-[var(--color-primary-active)]
                      disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-[var(--color-on-disabled)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]
                    ">
                                        {creatingList ? "Adding…" : "Add"}
                                    </button>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </motion.section>

                    {/* Drag overlay */}
                    <DragOverlay dropAnimation={null}>
                        {activeCard ? (
                            <div
                                className="
                  rounded-lg border p-3 shadow-xl
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                ">
                                <div className="text-sm font-medium">
                                    {activeCard.title}
                                </div>
                                {activeCard.description && (
                                    <div className="mt-1 text-xs opacity-70">
                                        {activeCard.description}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            {/* Create Card Dialog */}
            {cardDialogOpen && targetList && (
                <DialogBox
                    open={cardDialogOpen}
                    onClose={closeCardDialog}
                    title={`Add card to "${targetList.title}"`}
                    maxWidth="max-w-md">
                    <CreateCardDialog
                        titleRef={titleRef}
                        descRef={descRef}
                        creating={creatingCard}
                        onCancel={closeCardDialog}
                        onSubmit={createCardForList}
                    />
                </DialogBox>
            )}
        </Page>
    );
}
