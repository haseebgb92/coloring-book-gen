import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const { isPro } = await req.json();

        if (isPro) {
            return NextResponse.json({ success: true });
        }

        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown";

        // 1. Check if record exists
        const { data: usage, error: fetchError } = await supabaseAdmin
            .from("usage_tracking")
            .select("*")
            .eq("identifier", ip)
            .single();

        const now = new Date();

        if (!usage) {
            // Create new record
            await supabaseAdmin
                .from("usage_tracking")
                .insert({
                    identifier: ip,
                    count: 1,
                    last_reset: now.toISOString(),
                });
        } else {
            // Update existing record
            const lastReset = new Date(usage.last_reset);
            const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

            if (hoursSinceReset >= 24) {
                await supabaseAdmin
                    .from("usage_tracking")
                    .update({
                        count: 1,
                        last_reset: now.toISOString(),
                    })
                    .eq("identifier", ip);
            } else {
                await supabaseAdmin
                    .from("usage_tracking")
                    .update({
                        count: usage.count + 1,
                    })
                    .eq("identifier", ip);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Usage increment error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
