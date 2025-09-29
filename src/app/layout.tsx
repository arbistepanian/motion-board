import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./ui/styles/globals.css";
import Providers from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Motion Board",
    description: "Your task and workflow management solution.",
    openGraph: {
        title: "Motion Board",
        description: "Your task and workflow management solution.",
        url: "https://portura-lite.vercel.app/",
        siteName: "Motion Board",
        images: [
            {
                url: "https://motionboard.vercel.app/motion-board-homepage-hero.jpg",
                width: 1200,
                height: 630,
                alt: "Motion Board Open Graph Image",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Motion Board",
        description: "Your task and workflow management solution.",
        images: [
            "https://motionboard.vercel.app/motion-board-homepage-hero.jpg",
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
