"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Heading from "../ui/components/Heading";
import Button from "../ui/components/Button";
import type {
    BoardsData,
    CreateBoardData,
    CreateBoardVars,
} from "@/app/lib/types/board";
import TextInput from "../ui/components/TextInput";
import { motion, AnimatePresence } from "framer-motion";
import Paragraph from "../ui/components/Paragraph";
import { useRouter } from "next/navigation";
import Page from "../ui/components/Page";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const card = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

const BOARDS = gql`
    query {
        boards {
            id
            name
        }
    }
`;
const CREATE_BOARD = gql`
    mutation ($name: String!) {
        createBoard(name: $name) {
            id
            name
        }
    }
`;

export default function Home() {
    const { data: session } = useSession();
    const {
        data: boardsData,
        loading: boardsLoading,
        error: boardsError,
        refetch,
    } = useQuery<BoardsData>(BOARDS, { skip: !session });
    const [createBoard] = useMutation<CreateBoardData, CreateBoardVars>(
        CREATE_BOARD
    );
    const [name, setName] = useState("");
    const [pending, setPending] = useState(false);

    const boards = boardsData?.boards ?? [];

    const router = useRouter();

    return (
        <Page>
            {session && (
                <>
                    <section className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!name.trim()) return;
                                setPending(true);
                                await createBoard({ variables: { name } });
                                setName("");
                                setPending(false);
                                refetch();
                            }}
                            className="flex justify-start items-end gap-2">
                            <TextInput
                                label="Board name"
                                type="text"
                                style={{ flex: 1 }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="New board name"
                            />
                            <Button
                                variation="primary"
                                type="submit"
                                disabled={!name.trim() || pending}>
                                Create
                            </Button>
                        </form>
                    </section>
                    {boardsError && (
                        <Paragraph>Failed to load boards.</Paragraph>
                    )}
                    {!boardsError && boardsLoading ? (
                        <div
                            className="grid gap-3"
                            style={{
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(220px, 1fr))",
                            }}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-20 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.section
                            variants={container}
                            initial="hidden"
                            animate="show"
                            style={{
                                display: "grid",
                                gap: 12,
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(220px, 1fr))",
                            }}>
                            <AnimatePresence>
                                {boards.map((b) => (
                                    <motion.div
                                        key={b.id}
                                        variants={card}
                                        layout
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                        onClick={() =>
                                            router.push(`/boards/${b.id}`)
                                        }
                                        className="bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-alt-hover)] cursor-pointer border border-[var(--color-border)] rounded-lg p-4">
                                        <Heading level={3}>{b.name}</Heading>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.section>
                    )}
                </>
            )}
        </Page>
    );
}
