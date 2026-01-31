
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
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
                    <CardTitle className="text-3xl font-black text-slate-900">Privacy Policy</CardTitle>
                    <p className="text-slate-500">Last Updated: January 30, 2026</p>
                </CardHeader>
                <CardContent className="p-8 prose prose-slate max-w-none">
                    <p className="lead">
                        At Word Search Studio, accessible from wordsearchstudio.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Word Search Studio and how we use it.
                    </p>

                    <h3>1. Information We Collect</h3>
                    <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
                    <ul>
                        <li><strong>Personal Account Information:</strong> When you register for an account, we ask for your email address and a password. This allows us to secure your access to our tools.</li>
                        <li><strong>Payment Information:</strong> If you upgrade to a Pro plan, payment processing is handled by our third-party payment processors. We do not store your full credit card details on our servers.</li>
                        <li><strong>Usage Data:</strong> We collect data on how you interact with our service, such as the number of puzzles generated and the features used, to help us improve the system performance.</li>
                        <li><strong>Generated Content:</strong> The word lists you upload and the puzzle configurations you create are processed temporarily to generate your PDF files. We do not claim ownership of your specific word lists.</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>We use the information we collect in various ways, including to:</p>
                    <ul>
                        <li>Provide, operate, and maintain our website and generator tools.</li>
                        <li>Improve, personalize, and expand our website's functionality.</li>
                        <li>Understand and analyze how you use our website to optimize user experience.</li>
                        <li>Process your transactions and manage your subscription.</li>
                        <li>Send you emails relating to your account, such as password resets, subscription confirmations, and important service updates.</li>
                        <li>Find and prevent fraud.</li>
                    </ul>

                    <h3>3. Cookies and Web Beacons</h3>
                    <p>Like any other website, Word Search Studio uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

                    <h3>4. Third Party Privacy Policies</h3>
                    <p>Word Search Studio's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>

                    <h3>5. Data Security</h3>
                    <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>

                    <h3>6. Children's Information</h3>
                    <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Word Search Studio does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>

                    <h3>7. Contact Us</h3>
                    <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at <strong>wordsearchstudio@advertpreneur.com</strong> or via our Contact page.</p>
                </CardContent>
            </Card>
        </div>
    );
}
