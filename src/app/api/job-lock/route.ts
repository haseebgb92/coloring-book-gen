
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { userId, action } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        if (action === 'acquire') {
            // Check if locked
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('job_lock_expires_at')
                .eq('id', userId)
                .single();

            if (profile?.job_lock_expires_at) {
                const expiresAt = new Date(profile.job_lock_expires_at);
                if (new Date() < expiresAt) {
                    return NextResponse.json({ allowed: false, error: 'Job already in progress on another device.' });
                }
            }

            // Lock for 5 minutes (failsafe)
            const lockTime = new Date();
            lockTime.setMinutes(lockTime.getMinutes() + 5);

            await supabaseAdmin
                .from('profiles')
                .update({ job_lock_expires_at: lockTime.toISOString() })
                .eq('id', userId);

            return NextResponse.json({ allowed: true });
        }

        else if (action === 'release') {
            await supabaseAdmin
                .from('profiles')
                .update({ job_lock_expires_at: null })
                .eq('id', userId);

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Job lock error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
