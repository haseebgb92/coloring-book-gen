'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export function SessionGuard() {
    const { data: session } = useSession();
    const { toast } = useToast();

    useEffect(() => {
        if (session?.user && (session.user as any).sessionError === 'KICKED_OUT') {
            toast({
                variant: 'destructive',
                title: 'Logged Out',
                description: 'You have been logged out because another device logged into this account.',
            });

            // Sign out and redirect to home/login
            signOut({ callbackUrl: '/auth/signin' });
        }
    }, [session, toast]);

    return null;
}
