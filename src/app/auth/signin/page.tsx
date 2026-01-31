'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    variant: 'destructive',
                    title: 'Login Failed',
                    description: 'Invalid email or password.',
                });
            } else {
                // Force a full page reload to the home page (generator) to ensure session is active
                window.location.href = '/create';
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
                        <Lock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the Studio
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
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-indigo-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Don&apos;t have an account? <a href="mailto:wordsearchstudio@advertpreneur.com" className="underline hover:text-indigo-600">Contact support</a> to get started.
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
