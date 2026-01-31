import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const { isPro } = await req.json();

        // Pro users have no limits
        if (isPro) {
            return NextResponse.json({ allowed: true });
        }

        // Get client IP
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown";

        // 1. Get current usage for this IP
        const { data: usage, error: fetchError } = await supabaseAdmin
            .from("usage_tracking")
            .select("*")
            .eq("identifier", ip)
            .single();

        const now = new Date();
        const LIMIT = 5;

        if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "no rows found"
            console.error("Usage fetch error:", fetchError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        // 2. If no record, create one
        if (!usage) {
            return NextResponse.json({ allowed: true, remaining: LIMIT });
        }

        // 3. check if 24 hours passed
        const lastReset = new Date(usage.last_reset);
        const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

        if (hoursSinceReset >= 24) {
            // Reset count
            await supabaseAdmin
                .from("usage_tracking")
                .update({ count: 0, last_reset: now.toISOString() })
                .eq("identifier", ip);

            return NextResponse.json({ allowed: true, remaining: LIMIT });
        }

        // 4. Check if limit reached
        if (usage.count >= LIMIT) {
            return NextResponse.json({ allowed: false, remaining: 0 });
        }

        return NextResponse.json({ allowed: true, remaining: LIMIT - usage.count });
    } catch (error: any) {
        console.error("Usage limit error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
