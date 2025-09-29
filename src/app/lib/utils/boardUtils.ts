import { Card, List } from "@/app/lib/types/board";

export function cloneDeep<T>(v: T): T {
    return JSON.parse(JSON.stringify(v));
}

export function sortByPosition<T extends { position: number }>(arr: T[]): T[] {
    return [...arr].sort((a, b) => a.position - b.position);
}

export function normalizePositions(cards: Card[]): Card[] {
    return cards.map((c, i) => ({ ...c, position: i + 1 }));
}

export function findListByCard(lists: List[], cardId: string): List | null {
    for (const l of lists) if (l.cards.some((c) => c.id === cardId)) return l;
    return null;
}
