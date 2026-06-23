import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * A static Supabase client that does NOT use cookies.
 * Use this ONLY inside unstable_cache callbacks where dynamic
 * headers/cookies are not allowed.
 *
 * Initialized lazily so Next.js build does not crash when env vars
 * are only injected at deploy/runtime (e.g. Cloudflare Workers CI).
 */
let client: SupabaseClient | null = null;

export function getSupabaseStatic(): SupabaseClient {
    if (!client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error('Supabase is not configured');
        }
        client = createClient(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return client;
}

export const supabaseStatic: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const value = Reflect.get(getSupabaseStatic() as object, prop);
        return typeof value === 'function' ? value.bind(getSupabaseStatic()) : value;
    },
});
