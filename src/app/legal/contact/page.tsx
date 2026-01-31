
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
    return (
        <div className="container mx-auto py-16 px-4 max-w-2xl">
            <Card className="border-0 shadow-lg">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/" className="gap-2 text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                    </Button>
                </div>
                <CardHeader className="bg-slate-50 border-b p-8 text-center pt-4">
                    <CardTitle className="text-3xl font-black text-slate-900">Contact Support</CardTitle>
                    <p className="text-slate-500">We're here to help you succeed.</p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid gap-6">
                        <Button className="h-20 text-lg bg-green-600 hover:bg-green-700 w-full justify-start px-6" asChild>
                            <a href="https://wa.me/923059051007" target="_blank">
                                <MessageCircle className="h-8 w-8 mr-4" />
                                <div className="text-left">
                                    <div className="font-bold">Chat on WhatsApp</div>
                                    <div className="text-sm font-normal opacity-90">+92 305 9051007</div>
                                </div>
                            </a>
                        </Button>

                        <Button variant="outline" className="h-20 text-lg w-full justify-start px-6" asChild>
                            <a href="mailto:wordsearchstudio@advertpreneur.com">
                                <Mail className="h-8 w-8 mr-4 text-slate-500" />
                                <div className="text-left">
                                    <div className="font-bold text-slate-900">Email Support</div>
                                    <div className="text-sm font-normal text-slate-500">wordsearchstudio@advertpreneur.com</div>
                                </div>
                            </a>
                        </Button>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-xl text-center">
                        <h3 className="font-bold text-indigo-900 mb-2">Office Hours</h3>
                        <p className="text-indigo-700/80 text-sm">Mon-Fri: 9:00 AM - 6:00 PM (PKT)<br />Response time: Usually within 2 hours</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
