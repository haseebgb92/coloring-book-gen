import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Coloring Book Studio",
    description: "Professional KDP-ready coloring book generator",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Raleway+Dots&display=swap" rel="stylesheet" />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
