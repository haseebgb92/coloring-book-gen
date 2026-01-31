'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Passwords do not match.',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                toast({
                    title: 'Success!',
                    description: 'Your password has been reset successfully.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: data.error || 'Failed to reset password.',
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

    if (!token) {
        return (
            <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-black/5">
                <CardContent className="pt-10 pb-10 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold">Invalid Reset Link</h2>
                    <p className="text-sm text-muted-foreground">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button className="w-full bg-indigo-600" asChild>
                        <Link href="/auth/forgot-password">Request New Link</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-black/5">
                <CardContent className="pt-10 pb-10 text-center space-y-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Password Reset!</h2>
                        <p className="text-sm text-muted-foreground px-4">
                            Your password has been updated. You can now log in with your new credentials.
                        </p>
                    </div>
                    <Button className="w-full bg-indigo-600 h-11" asChild>
                        <Link href="/auth/signin">Go to Sign In</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-black/5">
            <CardHeader className="space-y-1 text-center bg-slate-50/50 border-b pb-6">
                <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-2">
                    <Lock className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl font-bold">New Password</CardTitle>
                <CardDescription>
                    Enter a strong password for your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-11"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-11"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pb-8">
                    <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function ResetPassword() {
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
