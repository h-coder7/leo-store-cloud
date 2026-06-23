import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect the admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/login'
        return NextResponse.redirect(loginUrl)
    }

    // Redirect logged in users away from the login page
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        const adminUrl = request.nextUrl.clone()
        adminUrl.pathname = '/admin'
        return NextResponse.redirect(adminUrl)
    }

    return supabaseResponse
}

export const config = {
    /*
     * Only run auth checks on routes that actually need them. This avoids a
     * Supabase Auth network call (`auth.getUser()`) on every public store page,
     * which dramatically reduces Supabase request/bandwidth usage.
     */
    matcher: ['/admin/:path*', '/login'],
}
