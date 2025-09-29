"use client";

import { signIn } from "next-auth/react";
import Button from "../ui/components/Button";
import Heading from "../ui/components/Heading";
import Paragraph from "../ui/components/Paragraph";
import Image from "next/image";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-text">
            <div className="text-center space-y-6 ">
                <Heading level={1}>Login to Motion Board</Heading>
                <Paragraph>
                    Use your Google or Github account to get started
                </Paragraph>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variation="secondary"
                        onClick={() =>
                            signIn("google", { callbackUrl: "/boards" })
                        }>
                        <div className="flex items-center justify-center space-x-2">
                            <div>Sign in with Google</div>
                            <Image
                                loading="lazy"
                                height={24}
                                width={24}
                                alt="Google"
                                className="w-6 h-6"
                                src="https://authjs.dev/img/providers/google.svg"
                            />
                        </div>
                    </Button>
                    <Button
                        variation="secondary"
                        onClick={() =>
                            signIn("github", { callbackUrl: "/boards" })
                        }>
                        <span>Sign in with GitHub</span>
                        <Image
                            loading="lazy"
                            height={24}
                            width={24}
                            alt="GitHub"
                            className="w-6 h-6"
                            src="https://authjs.dev/img/providers/github.svg"
                        />
                    </Button>
                </div>
            </div>
        </main>
    );
}
