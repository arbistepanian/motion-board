import NextAuth, { User, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/prisma";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV !== "production",
    adapter: PrismaAdapter(prisma),
    // You can use 'jwt' as well; 'database' persists sessions in the Session table
    session: { strategy: "database" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        signOut: "/",
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true,
            authorization: { params: { scope: "read:user user:email" } },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            // expose user.id on the client
            if (session.user) (session.user as User).id = user.id;
            return session;
        },
    },
};

export const { handlers, auth } = NextAuth(authOptions);
