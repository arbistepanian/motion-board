"use client";

import { signOut, useSession } from "next-auth/react";
import Heading from "./Heading";
import Button from "./Button";
import LinkButton from "./LinkButton";
import { useQuery } from "@apollo/client/react";
import { MeData } from "@/app/lib/types/graphql";
import gql from "graphql-tag";
import Paragraph from "./Paragraph";

const ME = gql`
    query {
        me {
            id
            name
            email
        }
    }
`;

export default function Header() {
    const { data: session } = useSession();
    const { data: meData } = useQuery<MeData>(ME, {
        fetchPolicy: "cache-and-network",
    });

    return (
        <header className="w-screen h-14 fixed left-0 top-0 px-6 py-4 border-b border-[var(--color-border)]/10 flex justify-between items-center bg-[var(--color-surface-alt)] text-[var(--color-text)] z-10">
            <Heading level={1} style={{ margin: 0 }}>
                Motion Board
            </Heading>
            <div className="flex items-center justify-end gap-4">
                <Paragraph>
                    {session
                        ? `Signed in as ${
                              meData?.me?.name ?? meData?.me?.email
                          }`
                        : "You’re not signed in."}
                </Paragraph>
                {session ? (
                    <Button
                        variation="secondary"
                        icon="signout"
                        onClick={() => signOut()}>
                        Sign out
                    </Button>
                ) : (
                    <LinkButton icon="signin" href="/login">
                        Sign in
                    </LinkButton>
                )}
            </div>
        </header>
    );
}
