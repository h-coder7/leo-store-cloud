import { createClient } from '@supabase/supabase-js';

/**
 * A static Supabase client that does NOT use cookies.
 * Use this ONLY inside unstable_cache callbacks where dynamic
 * headers/cookies are not allowed.
 */
export const supabaseStatic = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);
