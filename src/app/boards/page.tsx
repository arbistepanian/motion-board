"use client";

import { gql } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
    BoardsData,
    CreateBoardData,
    CreateBoardVars,
} from "@/app/lib/types/board";
import { useMutation, useQuery } from "@apollo/client/react";

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
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
    const router = useRouter();

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

    async function onCreateBoard(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        setPending(true);
        try {
            await createBoard({ variables: { name: trimmed } });
            setName("");
            await refetch();
        } finally {
            setPending(false);
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--color-text)]">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Boards
                </h1>
            </header>

            {session && (
                <>
                    {/* Create board form */}
                    <section className="mb-6 w-full sm:w-md">
                        <form
                            onSubmit={onCreateBoard}
                            className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label
                                    htmlFor="boardName"
                                    className="mb-1 block text-sm text-[var(--color-subtext)]">
                                    Board name
                                </label>
                                <input
                                    id="boardName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="New board name"
                                    className="
                    w-full rounded-lg border px-3 py-2 text-sm outline-none shadow-sm
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    placeholder:text-[var(--color-placeholder)]
                    focus:ring-2 focus:ring-[var(--color-primary)]
                    focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]
                  "
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!name.trim() || pending}
                                className="
                  inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition
                  bg-[var(--color-primary)] text-[var(--color-on-primary)]
                  hover:bg-[var(--color-primary-hover)]
                  active:bg-[var(--color-primary-active)]
                  disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-[var(--color-on-disabled)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]
                ">
                                {pending ? "Creating…" : "Create"}
                            </button>
                        </form>
                    </section>

                    {/* Error */}
                    {boardsError && (
                        <p
                            className="
              mb-4 rounded-lg border px-3 py-2 text-sm
              border-[var(--color-error-border)]
              bg-[var(--color-error-bg)]
              text-[var(--color-error-text)]
            ">
                            Failed to load boards.
                        </p>
                    )}

                    {/* Boards grid */}
                    {boardsLoading ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="
                    h-24 animate-pulse rounded-xl border
                    border-[var(--color-border)]
                    bg-[var(--color-surface-alt)]
                  "
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.section
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            <AnimatePresence>
                                {boards.map((b) => (
                                    <motion.button
                                        key={b.id}
                                        variants={card}
                                        layout="position"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            router.push(`/boards/${b.id}`)
                                        }
                                        className="
                      group h-24 cursor-pointer rounded-xl border p-4 text-left shadow-sm transition
                      border-[var(--color-border)]
                      bg-[var(--color-surface)]
                      hover:bg-[var(--color-surface-hover)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]
                    ">
                                        <div className="flex h-full items-center justify-between">
                                            <span className="text-sm font-medium">
                                                {b.name}
                                            </span>
                                            <span
                                                className="
                          rounded-md px-2 py-1 text-[10px] font-medium transition
                          bg-[var(--color-accent)]
                          text-[var(--color-on-accent)]
                          group-hover:bg-[var(--color-accent-alt)]
                          group-hover:text-[var(--color-on-accent-alt)]
                        ">
                                                Open
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </motion.section>
                    )}
                </>
            )}

            {!session && (
                <div
                    className="
            rounded-xl border border-dashed p-6 text-center text-sm
            border-[var(--color-border)]
            text-[var(--color-subtext)]
          ">
                    Please sign in to view your boards.
                </div>
            )}
        </main>
    );
}
