'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    CheckCircle2,
    Sparkles,
    Zap,
    LayoutTemplate,
    Download,
    Palette,
    BookOpen,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PromoPopup } from '@/components/marketing/promo-popup';

export default function LandingPage() {
    const { data: session } = useSession();
    const router = useRouter();

    // If already logged in, we let them stay here but the CTAs change.
    // Or we could auto-redirect: 
    // useEffect(() => { if (session) router.push('/create'); }, [session]);
    // Use preference was "once logged in it goes to tool". I'll default the Main CTA to go to tool.

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <PromoPopup />
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm font-medium border-indigo-200 bg-indigo-50 text-indigo-700 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Sparkles className="h-3.5 w-3.5 mr-2 inline-block text-indigo-500 fill-indigo-500" />
                        The #1 Choice for KDP Publishers
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
                        Create Professional <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Word Search Books
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Turn your word lists into best-selling puzzle books in minutes.
                        Automated layout, KDP-ready PDFs, and stunning designs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform" asChild>
                            <Link href={session ? "/create" : "/auth/register"}>
                                {session ? "Go to Studio" : "Start Creating for Free"} <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>

                        {!session && (
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2" asChild>
                                <Link href="/auth/signin">Login to Account</Link>
                            </Button>
                        )}
                    </div>

                    <div className="mt-16 relative mx-auto max-w-5xl rounded-xl border border-slate-200/60 bg-white/50 shadow-2xl backdrop-blur p-2 dark:bg-slate-900/50 dark:border-slate-800">
                        <div className="rounded-lg overflow-hidden bg-slate-100 aspect-[16/9] flex items-center justify-center relative group">
                            {/* Placeholder for tool screenshot - creating a mock UI with CSS */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                                <div className="grid grid-cols-12 gap-4 w-3/4 h-3/4 opacity-80">
                                    {/* Fake UI Sidebar */}
                                    <div className="col-span-3 bg-white rounded-lg shadow-sm p-4 space-y-3">
                                        <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                        <div className="h-8 w-full bg-indigo-100 rounded"></div>
                                        <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                                        <div className="h-8 w-full bg-slate-100 rounded"></div>
                                        <div className="h-8 w-full bg-slate-100 rounded"></div>
                                    </div>
                                    {/* Fake UI Main */}
                                    <div className="col-span-9 bg-white rounded-lg shadow-sm border p-6 flex items-center justify-center">
                                        <div className="grid grid-cols-10 gap-1 p-4 border-2 border-black aspect-square h-full">
                                            {Array.from({ length: 100 }).map((_, i) => (
                                                <div key={i} className="bg-slate-50 text-[6px] flex items-center justify-center font-mono">A</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[1px]">
                                <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg">Interactive Studio Preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Everything You Need</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Professional tools built for Amazon KDP creators.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: LayoutTemplate, title: "KDP Print Ready", desc: "Automated margins, bleed settings, and trim sizes compliant with Amazon KDP standards." },
                            { icon: Zap, title: "Multi-Level Logic", desc: "Generate Easy, Medium, and Hard puzzles in a single batch with smart complexity sorting." },
                            { icon: Palette, title: "Custom Branding", desc: "Your books, your style. Upload custom fonts, backgrounds, and logos." },
                            { icon: Download, title: "300 DPI Export", desc: "Crystal clear PDF exports ensuring professional print quality every time." },
                            { icon: BookOpen, title: "Mass Generator", desc: "Create 100+ page books in seconds with solution keys automatically appended." },
                            { icon: ShieldCheck, title: "Commercial Rights", desc: "You own 100% of the content you generate. Sell anywhere, keep all profits." },
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-indigo-100">
                                <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="h-7 w-7 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Simple Pricing</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Start for free, upgrade for power.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* FREE */}
                        <Card className="border-0 shadow-lg relative overflow-hidden">
                            <CardHeader className="p-8">
                                <CardTitle className="text-2xl font-bold">Free Starter</CardTitle>
                                <CardDescription>Perfect for testing the waters</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-black text-slate-900">$0</span>
                                    <span className="text-slate-500 font-medium">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-4">
                                <ul className="space-y-3">
                                    {['5 Puzzles per Day', 'Basic Grid Settings', 'Standard Export', 'Watermarked PDF'].map((item, i) => (
                                        <li key={i} className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-slate-400" />
                                            <span className="text-slate-600">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full h-12 mt-8 font-bold" variant="outline" asChild>
                                    <Link href="/auth/register">Sign Up Free</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* PRO */}
                        <Card className="border-2 border-indigo-600 shadow-2xl relative overflow-hidden scale-105">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                            <CardHeader className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10">
                                <CardTitle className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">Pro Studio</CardTitle>
                                <CardDescription>For serious publishers</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-black text-indigo-700 dark:text-indigo-400">$99</span>
                                    <span className="text-slate-500 font-medium">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-4 bg-indigo-50/50 dark:bg-indigo-900/10 h-full">
                                <ul className="space-y-3">
                                    {[
                                        'Unlimited Puzzle Generation',
                                        'Multi-Level Book Studio',
                                        'High-Res 300 DPI Export',
                                        'Custom Fonts & Backgrounds',
                                        'Priority Support',
                                        'Commercial License'
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full h-12 mt-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200" asChild>
                                    <a href="https://wa.me/923059051007?text=I%20want%20to%20upgrade%20to%20PRO" target="_blank">Upgrade to PRO</a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-8 opacity-90">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold text-white">Word Search Studio</span>
                    </div>
                    <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
                        <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/legal/usage-policy" className="hover:text-white transition-colors">Usage & Refund Policy</Link>
                        <Link href="/legal/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/legal/contact" className="hover:text-white transition-colors">Contact Support</Link>
                    </div>
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Word Search Studio. A product of <a href="https://advertpreneur.com" target="_blank" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">advertpreneur</a>.
                    </p>
                </div>
            </footer>
        </div>
    );
}
