import { gql } from "@apollo/client";

/** Note: `listId` on Card should be exposed by your API for clean DnD */
export const BOARD = gql`
    query Board($id: ID!) {
        board(id: $id) {
            id
            name
            createdAt
            lists {
                id
                title
                position
                createdAt
                cards {
                    id
                    title
                    description
                    position
                    createdAt
                }
            }
        }
    }
`;

export const CREATE_LIST = gql`
    mutation CreateList($boardId: ID!, $title: String!) {
        createList(boardId: $boardId, title: $title) {
            id
            title
            position
            createdAt
            cards {
                id
                title
                description
                position
                createdAt
                listId
            }
        }
    }
`;

export const CREATE_CARD = gql`
    mutation CreateCard($listId: ID!, $title: String!, $description: String) {
        createCard(listId: $listId, title: $title, description: $description) {
            id
            title
            description
            position
            createdAt
            listId
        }
    }
`;

export const MOVE_CARD = gql`
    mutation MoveCard($cardId: ID!, $toListId: ID!, $toPosition: Int!) {
        moveCard(
            cardId: $cardId
            toListId: $toListId
            toPosition: $toPosition
        ) {
            id
            position
            listId
        }
    }
`;
