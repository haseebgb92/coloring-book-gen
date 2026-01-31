import { Resend } from 'resend';
import { resetPasswordTemplate } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Word Search Studio <onboarding@resend.dev>',
            replyTo: 'wordsearchstudio@advertpreneur.com',
            to: email,
            subject: 'Reset your Word Search Studio password',
            html: resetPasswordTemplate(resetUrl),
        });

        if (error) {
            console.error('Email error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error };
    }
}
