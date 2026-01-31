'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function PromoPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    // Don't show if user is already Pro
    const isPro = (session?.user as any)?.plan === 'pro';

    useEffect(() => {
        // Check if already shown in this session (optional, but good UX)
        const hasShown = sessionStorage.getItem('promo_shown');
        if (hasShown || isPro) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem('promo_shown', 'true');
        }, 50000); // 50 seconds

        return () => clearTimeout(timer);
    }, [isPro]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit">
                        <Timer className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="space-y-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-100 border-red-200">Limited Time Offer</Badge>
                        <DialogTitle className="text-3xl font-black text-slate-900">Get 15% OFF</DialogTitle>
                        <DialogDescription className="text-lg pt-2">
                            Upgrade to Pro Monthly today and save on your first month!
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-left">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">Unlimited PDF Generation</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-left">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">Access to Multi-Level Studio</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg text-left">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-700">Commercial License Included</span>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:justify-center gap-2">
                    <Button className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700" asChild>
                        <a href="https://wa.me/923059051007?text=I%20want%20to%20claim%20the%2015%25%20OFF%20Limited%20Offer" target="_blank">
                            Claim 15% Discount
                        </a>
                    </Button>
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-muted-foreground">
                        No thanks, I'll pay full price
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
