import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Word Search Studio',
  description: 'Generate professional word search puzzle books for Amazon KDP',
  icons: {
    icon: '/favicon.png',
  }
};

import { Providers } from '@/components/providers';
import { SessionGuard } from '@/components/auth/session-guard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <SessionGuard />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
