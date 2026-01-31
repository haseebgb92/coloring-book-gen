
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, CreditCard, Ban } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function UsagePolicy() {
    return (
        <div className="container mx-auto py-16 px-4 max-w-4xl">
            <Card className="border-0 shadow-lg">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/" className="gap-2 text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                    </Button>
                </div>
                <CardHeader className="bg-red-50 border-b p-8 pt-6">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                        <CardTitle className="text-3xl font-black text-red-900">Strict Usage & Refund Policy</CardTitle>
                    </div>
                    <p className="text-red-700/80 font-medium">Please read carefully before upgrading.</p>
                </CardHeader>
                <CardContent className="p-8 prose prose-slate max-w-none">

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mt-0 flex items-center gap-2">
                            🚫 1. Zero Tolerance on Password Sharing
                        </h3>
                        <p>
                            Word Search Studio is a <strong>single-user license</strong> service. Your account is for your personal use only.
                        </p>
                        <ul>
                            <li><strong>Account Sharing is Prohibited:</strong> You may NOT share your login credentials (email/password) with any other individual, including colleagues or family members.</li>
                            <li><strong>Automatic Detection:</strong> Our system uses advanced "Single Session" and "Device Fingerprinting" technology. If we detect your account is being accessed from multiple locations or devices simultaneously or in a suspicious manner, <strong>your account will be locked immediately.</strong></li>
                            <li><strong>Permanent Ban:</strong> Repeated violations of this policy will result in a permanent ban from the platform without refund.</li>
                        </ul>
                    </div>

                    <Separator className="my-8" />

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mt-0 flex items-center gap-2">
                            💳 2. Refund Policy
                        </h3>
                        <p>
                            Because Word Search Studio offers immediate access to digital goods and high-cost server-side generation features, we maintain a strict refund policy:
                        </p>
                        <ul>
                            <li><strong>No Full Refunds:</strong> Once you subscribe and have accessed the tool or generated content, no full refunds will be issued.</li>
                            <li><strong>No Partial Refunds:</strong> We do not offer pro-rated refunds for unused days in a month. If you cancel, you will retain access until the end of your billing cycle.</li>
                            <li><strong>Cancellation:</strong> You are free to cancel your monthly subscription at any time via your account settings or by contacting support. Future charges will be stopped immediately.</li>
                            <li><strong>Exceptions:</strong> In the rare event of a duplicate billing error caused by our system, a full refund for the duplicate charge will be issued immediately upon verification.</li>
                        </ul>
                    </div>

                    <h3 className="mt-8">3. Fair Use of Resources</h3>
                    <p>
                        While our Pro plan offers "Unlimited" generation, this is subject to a Fair Use Policy to prevent abuse and screen scraping.
                    </p>
                    <ul>
                        <li><strong>Automated Scraping:</strong> Use of scripts, bots, or automated tools to generate content is strictly prohibited.</li>
                        <li><strong>Excessive Load:</strong> Generative patterns that place an undue burden on our servers (e.g., thousands of requests in minutes) may result in temporary rate limiting.</li>
                    </ul>

                    <h3 className="mt-8">4. Contact & Disputes</h3>
                    <p>
                        If you have questions about this policy or believe your account was flagged in error, please contact our security team immediately at <strong>wordsearchstudio@advertpreneur.com</strong>.
                    </p>

                </CardContent>
            </Card>
        </div>
    );
}
