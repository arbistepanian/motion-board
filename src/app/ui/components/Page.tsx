"use client";

import { cn } from "@/app/lib/utils/utils";
import Header from "./Header";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    className?: string;
    userName?: string;
    userImage?: string;
    children: React.ReactNode;
}

export default function Page({ children, className, ...props }: PageProps) {
    return (
        <main
            className={cn(
                "flex flex-col min-h-screen w-screen px-6 pt-16 pb-6 items-center justify-start bg-[var(--color-surface)] text-[var(--color-text)]",
                className
            )}
            {...props}>
            <Header />

            <div className="w-full px-4">
                <div className="bg-[var(--color-surface)] text-[var(--color-text)]">
                    {children}
                </div>
            </div>
        </main>
    );
}
