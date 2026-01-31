import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only initialize if we have the URL and key
if (!supabaseUrl) {
    console.warn("SUPABASE_URL is missing. Database features will fail.");
}

// Client for public use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin use (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
