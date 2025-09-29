// hooks/useBoardDnd.ts
"use client";

import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { MOVE_CARD, BOARD } from "@/app/lib/graphql/board.gql";
import { arrayMove } from "@dnd-kit/sortable";
import {
    BoardData,
    BoardVars,
    Card,
    List,
    MoveCardData,
    MoveCardVars,
} from "@/app/lib/types/board";
import {
    cloneDeep,
    findListByCard,
    normalizePositions,
} from "@/app/lib/utils/boardUtils";
import type { ApolloClient } from "@apollo/client";

export function useBoardDnd({
    board,
    lists,
    client,
}: {
    board: BoardData["board"];
    lists: List[];
    client: ApolloClient;
}) {
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [moveCard] = useMutation<MoveCardData, MoveCardVars>(MOVE_CARD);

    function optimisticReorder(
        cardId: string,
        toListId: string,
        toIndex: number
    ) {
        client.cache.updateQuery<BoardData, BoardVars>(
            { query: BOARD, variables: { id: board!.id } },
            (prev: BoardData | null): BoardData | null => {
                if (!prev?.board) return prev;
                const draft = cloneDeep(prev);
                if (!draft.board) return prev;
                const listsDraft: List[] = draft.board.lists;

                const fromList = findListByCard(listsDraft, cardId);
                const toList =
                    listsDraft.find((l) => l.id === toListId) || null;
                if (!fromList || !toList) return prev;

                const cardIdx = fromList.cards.findIndex(
                    (c) => c.id === cardId
                );
                if (cardIdx === -1) return prev;

                const [card] = fromList.cards.splice(cardIdx, 1);

                const targetIndex = Math.max(
                    0,
                    Math.min(toIndex, toList.cards.length)
                );
                toList.cards.splice(targetIndex, 0, card);

                fromList.cards = normalizePositions(fromList.cards);
                toList.cards = normalizePositions(toList.cards);
                return draft;
            }
        );
    }

    function handleDragStart(e: DragStartEvent) {
        if (!board) return;
        const id = String(e.active.id);
        for (const l of lists) {
            const card = l.cards.find((c) => c.id === id);
            if (card) {
                setActiveCard(card);
                break;
            }
        }
    }

    async function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e;
        setActiveCard(null);
        if (!board || !active || !over) return;

        const cardId = String(active.id);
        const overId = String(over.id);

        const fromList = findListByCard(lists, cardId);
        if (!fromList) return;

        // Resolve target list + index
        let toList: List | null = null;
        let toIndex = 0;

        const cardTargetList = lists.find((l) =>
            l.cards.some((c) => c.id === overId)
        );
        if (cardTargetList) {
            toList = cardTargetList;
            toIndex = cardTargetList.cards.findIndex((c) => c.id === overId);
        } else {
            const listTarget = lists.find((l) => l.id === overId) || null;
            toList = listTarget;
            toIndex = toList ? toList.cards.length : 0;
        }
        if (!toList) return;

        const sameList = fromList.id === toList.id;

        if (sameList) {
            const fromIdx = fromList.cards.findIndex((c) => c.id === cardId);
            if (fromIdx === -1) return;
            const newCards = arrayMove(fromList.cards, fromIdx, toIndex);

            // Optimistic reorder within same list
            client.cache.updateQuery<BoardData, BoardVars>(
                { query: BOARD, variables: { id: board.id } },
                (prev: BoardData | null): BoardData | null => {
                    if (!prev?.board) return prev;
                    const draft = cloneDeep(prev);
                    if (!draft.board) return prev;
                    const listDraft = draft.board.lists.find(
                        (l) => l.id === fromList.id
                    )!;
                    listDraft.cards = normalizePositions(newCards);
                    return draft;
                }
            );

            const toPosition = toIndex + 1;
            await moveCard({
                variables: { cardId, toListId: toList.id, toPosition },
                optimisticResponse: {
                    moveCard: {
                        id: cardId,
                        position: toPosition,
                        listId: toList.id,
                        __typename: "Card",
                    },
                },
            });
        } else {
            // Cross-list move
            optimisticReorder(cardId, toList.id, toIndex);
            const toPosition = toIndex + 1;
            await moveCard({
                variables: { cardId, toListId: toList.id, toPosition },
                optimisticResponse: {
                    moveCard: {
                        id: cardId,
                        position: toPosition,
                        listId: toList.id,
                        __typename: "Card",
                    },
                },
            });
        }
    }

    return { activeCard, handleDragStart, handleDragEnd };
}
