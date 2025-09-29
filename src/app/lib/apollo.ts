import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function makeClient() {
    return new ApolloClient({
        link: new HttpLink({ uri: "/api/graphql", fetch }),
        cache: new InMemoryCache({
            typePolicies: {
                Card: { keyFields: ["id"] },
                List: { keyFields: ["id"] },
                Board: { keyFields: ["id"] },
            },
        }),
    });
}
