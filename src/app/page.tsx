import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import LinkButton from "./ui/components/LinkButton";
import Heading from "./ui/components/Heading";
import Paragraph from "./ui/components/Paragraph";
import Image from "next/image";
import Link from "./ui/components/Link";

export default async function HomePage() {
    const session = await getServerSession(authOptions);

    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-text px-4">
            <div className="text-center space-y-6">
                <Image
                    src="/motion-board-homepage-hero.jpg"
                    width={1000}
                    height={560}
                    alt="Motion Board"
                    className="w-full max-w-200 h-auto rounded-lg shadow-lg"
                />
                <Heading level={1}>Welcome to Motion Board</Heading>
                <Paragraph className="text-muted">
                    Your AI-powered resume assistant
                </Paragraph>
                <LinkButton href={session ? "/dashboard" : "/login"}>
                    {session ? "Go to Dashboard" : "Login / Sign Up"}
                </LinkButton>
                <Paragraph className="text-lg text-[var(--color-text) mb-8">
                    <span>Made By </span>
                    <Link
                        href="https://github.com/arbistepanian"
                        target="_blank">
                        Arbi Stepanian
                    </Link>
                </Paragraph>
            </div>
        </main>
    );
}
