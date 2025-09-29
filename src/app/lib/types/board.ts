export type BoardsData = {
    boards: { id: string; name: string }[];
};

export type CreateBoardData = {
    createBoard: { id: string; name: string };
};

export type CreateBoardVars = { name: string };

export type Card = {
    __typename?: "Card";
    id: string;
    title: string;
    description?: string | null;
    position: number;
    createdAt: string;
    listId: string;
};

export type List = {
    id: string;
    title: string;
    position: number;
    createdAt: string;
    cards: Card[];
};

export type BoardData = {
    board: {
        id: string;
        name: string;
        createdAt: string;
        lists: List[];
    } | null;
};

export type BoardVars = { id: string };

export type CreateCardData = { createCard: Card };
export type CreateCardVars = {
    listId: string;
    title: string;
    description?: string;
};

export type MoveCardData = {
    moveCard: {
        __typename?: "Card";
        id: string;
        position: number;
        listId: string;
    }; // ✅ include listId
};
export type MoveCardVars = {
    cardId: string;
    toListId: string;
    toPosition: number;
};
