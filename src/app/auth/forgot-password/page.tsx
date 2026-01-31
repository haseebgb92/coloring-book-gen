'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSent(true);
                toast({
                    title: 'Reset Link Sent',
                    description: 'Please check your email for instructions.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: data.error || 'Failed to send reset link.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-black/5">
                <CardHeader className="space-y-1 text-center bg-slate-50/50 border-b pb-6">
                    <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-2">
                        <Mail className="h-6 w-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    <CardDescription>
                        {isSent
                            ? "We've sent a link to your email"
                            : "Enter your email to receive a reset link"
                        }
                    </CardDescription>
                </CardHeader>
                {!isSent ? (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 h-11"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 pb-8">
                            <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                            </Button>
                            <Link
                                href="/auth/signin"
                                className="flex items-center justify-center text-sm text-muted-foreground hover:text-indigo-600 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                            </Link>
                        </CardFooter>
                    </form>
                ) : (
                    <CardContent className="pt-8 pb-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground px-4">
                            If an account exists for <span className="font-bold text-foreground">{email}</span>, you will receive a password reset link shortly.
                        </p>
                        <p className="text-xs text-indigo-500 font-medium bg-indigo-50 py-2 rounded-lg">
                            Can't find it? Check your <span className="font-bold">Spam</span> or Junk folder.
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/auth/signin">Return to Sign In</Link>
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
