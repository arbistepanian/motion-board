// src/types/graphql.ts
export type MeData = {
    me: { id: string; name?: string | null; email?: string | null } | null;
};
