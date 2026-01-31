import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        // 1. Find user with this token and check expiry
        const { data: user, error: userError } = await supabaseAdmin
            .from("profiles")
            .select("id, reset_token_expires")
            .eq("reset_token", token)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // 2. Check if token expired
        const now = new Date();
        const expires = new Date(user.reset_token_expires);
        if (now > expires) {
            return NextResponse.json({ error: "Token has expired" }, { status: 400 });
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Update the user password and clear reset token
        const { error: updateError } = await supabaseAdmin
            .from("profiles")
            .update({
                password_hash: hashedPassword,
                reset_token: null,
                reset_token_expires: null,
            })
            .eq("id", user.id);

        if (updateError) {
            console.error("Update error:", updateError);
            return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Password reset successfully" });
    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
