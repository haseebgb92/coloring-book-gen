import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Check if user exists
        const { data: user, error: userError } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .eq("email", email)
            .single();

        if (userError || !user) {
            // For security, don't reveal that the user doesn't exist
            return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
        }

        // 2. Generate a random token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // 3. Store the token in Supabase (we need a new table for this or add it to profiles)
        // Let's try to add it to profiles for simplicity, but a separate table is better.
        // Assuming we added reset_token and reset_token_expires to profiles.

        /* 
        SQL to run:
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE;
        */

        const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({
                reset_token: token,
                reset_token_expires: expires.toISOString(),
            })
            .eq("id", user.id);

        if (updateError) {
            console.error("Update error:", updateError);
            return NextResponse.json({ error: "Cloud Database Error: Failed to store reset token. Please ensure you have run the ALTER TABLE SQL command in Supabase to add 'reset_token' and 'reset_token_expires' columns." }, { status: 500 });
        }

        // 4. Send the email
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
        const emailResult = await sendResetPasswordEmail(email, resetUrl);

        if (!emailResult.success) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Reset link sent successfully" });
    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
