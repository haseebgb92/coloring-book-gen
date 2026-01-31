import type { Metadata } from "next";
import { Outfit, Raleway } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: '--font-raleway',
});

export const metadata: Metadata = {
  title: "Coloring Book Gen | Print-Ready KDP Interiors",
  description: "Create beautiful, educational coloring books with writing practice for Amazon KDP.",
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
      <body className={`${outfit.variable} ${raleway.variable}`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
