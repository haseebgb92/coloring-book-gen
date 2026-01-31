import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // 1. Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create profile
        const { error: insertError } = await supabaseAdmin
            .from("profiles")
            .insert({
                email,
                password_hash: hashedPassword,
                role: "user",
                plan: "free",
            });

        if (insertError) {
            console.error("Insert error:", insertError.message);
            return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Account created successfully" });
    } catch (error: any) {
        console.error("Register error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
