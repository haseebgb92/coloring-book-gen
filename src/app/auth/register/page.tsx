'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

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
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Account Created',
                    description: 'Signing you in...',
                });

                // Auto sign in after registration
                await signIn('credentials', {
                    email,
                    password,
                    callbackUrl: '/create',
                    redirect: true
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Registration Failed',
                    description: data.error || 'Something went wrong.',
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
                        <UserPlus className="h-6 w-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Join Word Search Studio and start creating
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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
                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-bold" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-indigo-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
