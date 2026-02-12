import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Skip Supabase session handling if env vars not configured or invalid
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith("http")) {
        console.warn("[Middleware] Supabase env vars not configured or invalid, skipping auth")
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options ?? {})
                    )
                },
            },
        }
    )

    // Refresh session if expired - important for Server Components
    // Wrap in try/catch to handle invalid refresh tokens and avoid crashes
    let user = null
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            // "Auth session missing!" is a normal state for guest users.
            // Only log and handle actual errors (like invalid refresh tokens).
            const isMissingSession = error.message?.toLowerCase().includes("session missing")

            if (!isMissingSession) {
                console.warn("[Middleware] Auth getUser error:", error.message)
                // If it's a critical error (like invalid token), throw to handle cleanup
                if (error.message?.toLowerCase().includes("refresh token") || error.status === 401) {
                    throw error
                }
            }
        }
        user = data?.user
    } catch (error) {
        console.error("[Middleware] Critical auth failure, clearing local session:", error)

        // If we are already on the login or signup page, don't redirect again to avoid loops
        const isAuthPath = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")

        if (isAuthPath) {
            return supabaseResponse
        }

        // Prepare redirect to login
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = "/login"
        const response = NextResponse.redirect(loginUrl)

        // Force clear all Supabase related cookies
        request.cookies.getAll().forEach((cookie) => {
            if (cookie.name.startsWith("sb-")) {
                response.cookies.set(cookie.name, "", {
                    path: "/",
                    maxAge: 0,
                })
            }
        })

        return response
    }

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = ["/", "/settings", "/profile"]
    const isProtectedPath = protectedPaths.some((path) =>
        path === "/" ? request.nextUrl.pathname === "/" : request.nextUrl.pathname.startsWith(path)
    )

    // If on protected path and not logged in, redirect to login
    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        const response = NextResponse.redirect(url)
        // Copy cookies from supabaseResponse to ensure potential session updates are preserved
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value, cookie)
        })
        return response
    }

    // If on login/signup and already logged in, redirect to home
    const authPaths = ["/login", "/signup"]
    const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isAuthPath && user) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        const response = NextResponse.redirect(url)
        // Copy cookies from supabaseResponse to preserve the refreshed session
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value, cookie)
        })
        return response
    }

    return supabaseResponse
}
