"use client";

import { useMemo, useRef, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";

import Header from "@/app/ui/components/Header";
import Heading from "@/app/ui/components/Heading";
import Paragraph from "@/app/ui/components/Paragraph";
import Button from "@/app/ui/components/Button";
import TextInput from "@/app/ui/components/TextInput";
import DialogBox from "@/app/ui/components/DialogBox";

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
            {loading && (
                <>
                    <Heading level={2}>Loading…</Heading>
                    <div
                        className="grid gap-4 mt-4"
                        style={{
                            gridTemplateColumns:
                                "repeat(6, minmax(260px, 1fr))",
                        }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] animate-pulse"
                            />
                        ))}
                    </div>
                </>
            )}

            {error && (
                <>
                    <Heading level={2}>Board</Heading>
                    <Paragraph>
                        {error ? error.message : "Failed to load board."}
                    </Paragraph>
                    <Button
                        variation="secondary"
                        onClick={() => router.push("/boards")}>
                        Go back
                    </Button>
                </>
            )}

            {!error && !loading && !board && (
                <>
                    <Heading level={2}>Board not found</Heading>
                    <Paragraph>
                        This board doesn’t exist or you don’t have access.
                    </Paragraph>
                    <Button
                        variation="secondary"
                        onClick={() => router.push("/boards")}>
                        Go back
                    </Button>
                </>
            )}

            {!error && !loading && board && (
                <>
                    <header className="flex items-center gap-3 mb-4">
                        <Button
                            variation="secondary"
                            icon="arrowLeft"
                            onClick={() => router.push("/")}>
                            Back
                        </Button>
                        <Heading level={2} style={{ margin: 0 }}>
                            {board.name}
                        </Heading>
                    </header>

                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        collisionDetection={closestCenter}>
                        <motion.section
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="overflow-x-auto h-full"
                            style={{
                                display: "grid",
                                gap: 16,
                                gridTemplateColumns: `repeat(${Math.max(
                                    lists.length + 1,
                                    3
                                )}, 300px)`,
                            }}>
                            <AnimatePresence initial={false}>
                                {lists.map((list) => (
                                    <motion.div
                                        key={list.id}
                                        variants={listVariant}
                                        layout
                                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3">
                                        <ListColumn
                                            list={list}
                                            onAddCard={() =>
                                                openCardDialog(list)
                                            }
                                        />
                                    </motion.div>
                                ))}
                                <motion.div
                                    key="add-list"
                                    variants={listVariant}
                                    layout
                                    className="rounded-xl border border-dashed border-[var(--color-border)] bg-transparent p-3 flex flex-col gap-2 justify-start items-start">
                                    <Heading
                                        level={4}
                                        style={{ marginBottom: 8 }}>
                                        Add a list
                                    </Heading>
                                    <form
                                        onSubmit={onAddList}
                                        className="flex gap-2">
                                        <TextInput
                                            ref={listInputRef}
                                            type="text"
                                            name="title"
                                            placeholder="List title"
                                        />
                                        <Button
                                            variation="primary"
                                            type="submit"
                                            disabled={creatingList}>
                                            {creatingList ? "Adding…" : "Add"}
                                        </Button>
                                    </form>
                                </motion.div>
                            </AnimatePresence>
                        </motion.section>

                        <DragOverlay dropAnimation={null}>
                            {activeCard ? (
                                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 shadow-xl">
                                    <div className="text-sm font-medium">
                                        {activeCard.title}
                                    </div>
                                    {activeCard.description && (
                                        <div className="text-xs opacity-70 mt-1">
                                            {activeCard.description}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </>
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
