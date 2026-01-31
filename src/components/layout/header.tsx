'use client';

import { Search, LogOut, User, UserPlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isPro = (session?.user as any)?.plan === 'pro';

  return (
    <header className="border-b bg-card shadow-sm sticky top-0 z-50 bg-opacity-95 backdrop-blur-md px-4 print:hidden">
      <div className="max-w-[1800px] mx-auto flex h-16 items-center justify-between gap-4">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-0.5 rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Word Search Studio Logo" className="h-10 w-10 object-contain" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-foreground hidden sm:block">
              Word Search <span className="text-indigo-600">Studio</span>
            </h1>
          </Link>

          <nav className="flex items-center gap-1">
            {(pathname?.startsWith('/create') || pathname?.startsWith('/multi-level')) && (
              <>
                <Button
                  variant={pathname?.startsWith('/create') ? 'secondary' : 'ghost'}
                  asChild
                  size="sm"
                  className={`font-bold ${pathname?.startsWith('/create') ? 'text-indigo-600' : ''}`}
                >
                  <Link href="/create">Single Puzzle</Link>
                </Button>
                <Button
                  variant={pathname?.startsWith('/multi-level') ? 'secondary' : 'ghost'}
                  asChild
                  size="sm"
                  className={`font-bold ${pathname?.startsWith('/multi-level') ? 'text-indigo-600' : ''}`}
                >
                  <Link href="/multi-level">Multi-Level</Link>
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Authenticated Account</span>
                <span className="text-xs font-black text-slate-800 tracking-tight leading-none">{session.user?.email}</span>
              </div>

              <div className="h-8 w-[1px] bg-border mx-1" />

              {isPro ? (
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-700 text-[10px] font-black h-7 px-3 uppercase tracking-tighter shadow-sm shadow-indigo-100">
                    <Sparkles className="h-3 w-3 mr-1" /> PRO
                  </Badge>
                  {(session?.user as any)?.plan_expires_at && (
                    <span className="text-[9px] font-bold text-indigo-600/70 uppercase tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded leading-none">
                      {Math.ceil((new Date((session.user as any).plan_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days Left
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="secondary" className="text-[10px] font-black h-7 px-3 uppercase tracking-tighter">
                  FREE PLAN
                </Badge>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-xs"
                onClick={() => signIn()}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                className="font-bold text-xs bg-indigo-600 hover:bg-indigo-700 px-4 rounded-full shadow-md"
                asChild
              >
                <Link href="/auth/register">
                  <UserPlus className="h-3.5 w-3.5 mr-2" /> Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
