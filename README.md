# 📌 Motion Board

**Motion Board** is a modern, motion-first Kanban for teams and solo builders. Create boards, lists, and cards; drag & drop to reorder within a list or move cards across lists with buttery-smooth animations. Data is persisted via a GraphQL API powered by Prisma, and authentication is handled with NextAuth (Google & GitHub), linking accounts by **email** so one user can sign in with multiple providers and see the same boards.

Built with **Next.js**, **React**, **Apollo GraphQL**, **Prisma**, **NextAuth**, **Framer Motion**, and **dnd-kit**.

---

## 🚀 Features

-   ✅ Email-linked auth (Google & GitHub via NextAuth)
-   ✅ Per-user boards (only see your own data)
-   ✅ Create boards & lists
-   ✅ Create cards via dialog (no inline form clutter)
-   ✅ Drag & drop cards **within** and **across** lists (dnd-kit)
-   ✅ Optimistic UI + Apollo cache updates
-   ✅ Smooth UI transitions (Framer Motion)
-   ✅ Minimal GraphQL schema & resolvers included
-   ✅ App Router `/api/graphql` route (Next.js)

---

## 🖼️ Demo

_Coming soon._  
Run locally with the setup steps below.

---

## 🌟 About Motion Board

**Motion Board** focuses on delightful interactions and a clean developer experience:

-   Motion-first UX using **Framer Motion**.
-   Precise drag-and-drop using **dnd-kit** (`closestCorners`, list droppable targets).
-   Simple, typed GraphQL schema and resolvers with **Prisma**.
-   Account linking by **email** so users can sign in with either Google or GitHub and access the same data.

---

## 🏗️ Tech Stack

-   **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion
-   **Drag & Drop**: dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`)
-   **GraphQL (Server)**: @apollo/server + `@as-integrations/next`
-   **GraphQL (Client)**: Apollo Client
-   **Database / ORM**: Prisma (PostgreSQL/SQLite)
-   **Auth**: NextAuth.js (Google, GitHub) + PrismaAdapter
-   **Runtime**: Node.js (App Router route handlers)

---

## 🛠️ Setup Instructions

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>.git
    cd <your-repo-root>
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Set Environment Variables**

    Create `.env` files (root or `apps/web/` depending on your setup). Minimum required:

    ```bash
    # Auth
    NEXTAUTH_SECRET=your_random_secret
    GITHUB_ID=your_github_oauth_client_id
    GITHUB_SECRET=your_github_oauth_client_secret
    GOOGLE_ID=your_google_oauth_client_id
    GOOGLE_SECRET=your_google_oauth_client_secret

    # Database (Prisma)
    DATABASE_URL=postgresql://user:password@host:5432/dbname
    # For SQLite you can use: file:./dev.db

    # Optional
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    NODE_ENV=development
    ```

4. **Prisma DB Setup**

    ```bash
    npx prisma generate
    # Choose one of the following:
    npx prisma migrate dev   # if you have migrations
    # or
    npx prisma db push       # to sync schema without migrations
    ```

5. **Run the App**

    ```bash
    # If monorepo (e.g., Turbo), adjust to workspace scripts if needed
    npm run dev
    # then open http://localhost:3000
    ```

6. **Production Build**

    ```bash
    npm run build
    npm start
    ```

---

## 🔐 Notes on Auth Linking (Google + GitHub)

-   Providers are configured with `allowDangerousEmailAccountLinking: true` so a user with the **same email** can sign in with either provider and see the **same boards**.
-   Emails are normalized to lowercase in the session callback to avoid duplicates.
-   Ensure `User.email` is unique in your database. On PostgreSQL, consider `CITEXT` for case-insensitive uniqueness.

---

## 📦 GraphQL Endpoints

-   Route handler: **`/api/graphql`** (App Router)
-   Example operations:
    -   `query { me }`
    -   `mutation { createBoard(name: "My Board") }`
    -   `mutation { createList(boardId: "...", title: "Todo") }`
    -   `mutation { createCard(listId: "...", title: "Task", description: "Details") }`
    -   `mutation { moveCard(cardId: "...", toListId: "...", toPosition: 3) }`

---

## 📄 License

MIT License

---

## 🙋‍♂️ Author

Made by @ArbiStepanian
