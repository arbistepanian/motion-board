"use client";

import { makeClient } from "@/app/lib/apollo";
import { ApolloProvider } from "@apollo/client/react";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    const client = makeClient();
    return (
        <SessionProvider>
            <ApolloProvider client={client}>{children}</ApolloProvider>
        </SessionProvider>
    );
}
