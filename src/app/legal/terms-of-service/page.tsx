
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
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
                <CardHeader className="bg-slate-50 border-b p-8 pt-4">
                    <CardTitle className="text-3xl font-black text-slate-900">Terms of Service</CardTitle>
                    <p className="text-slate-500">Last Updated: January 30, 2026</p>
                </CardHeader>
                <CardContent className="p-8 prose prose-slate max-w-none">
                    <p className="lead">
                        Welcome to Word Search Studio! These terms and conditions outline the rules and regulations for the use of Word Search Studio's Website and Services. By accessing this website we assume you accept these terms and conditions. Do not continue to use Word Search Studio if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h3>1. Definitions</h3>
                    <p><strong>"Service"</strong> refers to the Word Search Studio puzzle generation tool and website.</p>
                    <p><strong>"User", "You"</strong> refers to the individual accessing the Service.</p>
                    <p><strong>"Company", "We", "Us"</strong> refers to Word Search Studio.</p>

                    <h3>2. Account Registration</h3>
                    <ul>
                        <li>You must provide accurate and complete information when creating an account.</li>
                        <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                        <li>Strictly one account per user. Sharing your account credentials with others is a violation of these terms and may result in account termination.</li>
                        <li>We implement "Single Session" and "Device Limit" enforcement to prevent unauthorized account sharing.</li>
                    </ul>

                    <h3>3. Commercial Rights & Content Ownership</h3>
                    <ul>
                        <li><strong>Your Content:</strong> You retain all rights to the word lists and data you upload to the Service.</li>
                        <li><strong>Generated Assets:</strong> Upon generation, you grant yourself a perpetual, worldwide license to use the output (PDFs, images) for personal or commercial purposes, including selling books on Amazon KDP.</li>
                        <li><strong>Our Rights:</strong> We retain ownership of the software, code, algorithms, and design of the Word Search Studio platform. You may not reverse engineer, decompile, or copy the underlying technology.</li>
                    </ul>

                    <h3>4. Subscription & Payments</h3>
                    <ul>
                        <li><strong>Pro Plan:</strong> Access to advanced features (Multi-Level Studio, High-Res Export, Unlimited Generation) requires a paid subscription.</li>
                        <li><strong>Billing:</strong> The Pro Plan is billed on a monthly basis. Payment is due at the beginning of each billing cycle.</li>
                        <li><strong>Cancellation:</strong> You may cancel your subscription at any time. Your Pro access will continue until the end of the current billing period.</li>
                        <li><strong>Refunds:</strong> We generally do not offer refunds for partial months of service, but exceptions may be made for technical failures at our discretion.</li>
                    </ul>

                    <h3>5. Acceptable Use</h3>
                    <p>You agree not to use the Service:</p>
                    <ul>
                        <li>To generate content that is unlawful, hateful, or abusive.</li>
                        <li>To disrupt or interfere with the security or performance of the Service.</li>
                        <li>To attempt to bypass any restrictions or limitations set by the Service.</li>
                        <li>To automate use of the system (e.g., via bots) without our express permission.</li>
                    </ul>

                    <h3>6. Termination</h3>
                    <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>

                    <h3>7. Limitation of Liability</h3>
                    <p>In no event shall Word Search Studio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                    <h3>8. Governing Law</h3>
                    <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Word Search Studio operates, without regard to its conflict of law provisions.</p>

                    <h3>9. Changes to Terms</h3>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
                </CardContent>
            </Card>
        </div>
    );
}
