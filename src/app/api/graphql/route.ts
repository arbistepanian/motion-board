// apps/web/src/app/api/graphql/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { authOptions } from "@/app/auth";
import prisma from "@/app/lib/prisma";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { getServerSession, Session } from "next-auth";
import { NextRequest } from "next/server";

type GraphQLContext = { session: Session | null };

// --- Minimal schema
const typeDefs = gql`
    scalar DateTime
    type User {
        id: ID!
        name: String
        email: String
        image: String
    }

    type Query {
        me: User
        boards: [Board!]!
        lists(boardId: ID!): [List!]!
        cards(listId: ID!): [Card!]!
    }

    type Mutation {
        createBoard(name: String!): Board!
        createList(boardId: ID!, title: String!): List!
        createCard(listId: ID!, title: String!, description: String): Card!
        moveCard(cardId: ID!, toListId: ID!, toPosition: Int!): Card!
    }

    type Board {
        id: ID!
        name: String!
        ownerId: String!
        owner: User!
        createdAt: DateTime!
        lists: [List!]!
    }

    type List {
        id: ID!
        title: String!
        position: Int!
        createdAt: DateTime!
        cards: [Card!]!
    }

    type Card {
        id: ID!
        title: String!
        description: String
        position: Int!
        createdAt: DateTime!
    }
`;

// --- Resolvers (minimal, position = max+1 for new items)
const resolvers = {
    Query: {
        me: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
            console.log("session: ", ctx.session);
            if (!ctx.session?.user?.id) return null;
            return prisma.user.findUnique({
                where: { id: ctx.session.user.id },
            });
        },
        boards: () => prisma.board.findMany(),
        lists: (_: unknown, { boardId }: { boardId: string }) =>
            prisma.list.findMany({
                where: { boardId },
                orderBy: { position: "asc" },
            }),
        cards: (_: unknown, { listId }: { listId: string }) =>
            prisma.card.findMany({
                where: { listId },
                orderBy: { position: "asc" },
            }),
    },
    Mutation: {
        createBoard: async (
            _: unknown,
            { name }: { name: string },
            ctx: GraphQLContext
        ) => {
            if (!ctx.session?.user?.id) {
                throw new Error("Unauthorized");
            }
            return prisma.board.create({
                data: { name, ownerId: ctx.session.user.id },
            });
        },
        createList: async (
            _: unknown,
            { boardId, title }: { boardId: string; title: string }
        ) => {
            const max = await prisma.list.aggregate({
                where: { boardId },
                _max: { position: true },
            });
            const position = (max._max.position ?? 0) + 1;
            return prisma.list.create({ data: { boardId, title, position } });
        },
        createCard: async (
            _: unknown,
            {
                listId,
                title,
                description,
            }: { listId: string; title: string; description?: string }
        ) => {
            const max = await prisma.card.aggregate({
                where: { listId },
                _max: { position: true },
            });
            const position = (max._max.position ?? 0) + 1;
            return prisma.card.create({
                data: { listId, title, description, position },
            });
        },
        moveCard: (
            _: unknown,
            {
                cardId,
                toListId,
                toPosition,
            }: { cardId: string; toListId: string; toPosition: number }
        ) =>
            prisma.card.update({
                where: { id: cardId },
                data: { listId: toListId, position: toPosition },
            }),
    },
    Board: {
        lists: (b: { id: string }) =>
            prisma.list.findMany({
                where: { boardId: b.id },
                orderBy: { position: "asc" },
            }),
    },
    List: {
        cards: (l: { id: string }) =>
            prisma.card.findMany({
                where: { listId: l.id },
                orderBy: { position: "asc" },
            }),
    },
};

const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
    server,
    {
        context: async (): Promise<GraphQLContext> => {
            const session = await getServerSession(authOptions);
            return { session };
        },
    }
);

export { handler as GET, handler as POST };
