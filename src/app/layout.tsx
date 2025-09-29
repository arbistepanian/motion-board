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
    title: "Portura Lite",
    description: "AI-Powered resume assistant",
    openGraph: {
        title: "Portura Lite",
        description: "AI-Powered resume assistant to help you shine",
        url: "https://portura-lite.vercel.app/",
        siteName: "Portura",
        images: [
            {
                url: "https://portura-lite.vercel.app/portura-lite-homepage-hero.jpg",
                width: 1200,
                height: 630,
                alt: "Portura Lite Open Graph Image",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Portura Lite",
        description: "AI-Powered resume assistant to help you shine",
        images: [
            "https://portura-lite.vercel.app/portura-lite-homepage-hero.jpg",
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
