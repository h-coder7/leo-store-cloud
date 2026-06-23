import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * A static Supabase client that does NOT use cookies.
 * Use this ONLY inside unstable_cache callbacks where dynamic
 * headers/cookies are not allowed.
 */
let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
    return Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}

export function getSupabaseStatic(): SupabaseClient {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured');
    }

    if (!client) {
        client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            }
        );
    }

    return client;
}
