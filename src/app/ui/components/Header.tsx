"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Heading from "./Heading";

interface HeaderProps {
    userName?: string;
    userImage?: string;
    title?: string;
}

export default function Header({ userName, title, userImage }: HeaderProps) {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-screen h-14 fixed left-0 top-0 px-6 py-4 border-b border-[var(--foreground)]/10 flex justify-between items-center bg-[var(--background)] text-[var(--foreground)] z-10">
            <Heading
                level={1}
                className="sm:text-xl text-lx font-semibold mb-0">
                <span>Portura Lite</span> {title && <span> - {title}</span>}
            </Heading>

            <div className="relative">
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center space-x-2 focus:outline-none cursor-pointer">
                    {userImage && (
                        <Image
                            src={userImage}
                            alt="User avatar"
                            width={36}
                            height={36}
                            className="rounded-full border border-[var(--foreground)]/20"
                        />
                    )}
                    <span className="text-sm font-medium">{userName}</span>
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-[var(--background)] text-[var(--foreground)] border border-[var(--foreground)]/20 rounded shadow-md z-50">
                        <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--foreground)]/5"
                            onClick={() => signOut({ callbackUrl: "/" })}>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
