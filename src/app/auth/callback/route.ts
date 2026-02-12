import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/"

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check if user has MFA enabled and needs to complete 2FA verification
            // This ensures OAuth login (Google, etc.) doesn't bypass MFA security
            const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

            // If user has MFA enrolled (nextLevel = aal2) but hasn't verified yet (currentLevel = aal1)
            // Redirect to 2FA verification page instead of dashboard
            if (aalData?.nextLevel === 'aal2' && aalData?.currentLevel === 'aal1') {
                const forwardedHost = request.headers.get("x-forwarded-host")
                const isLocalEnv = process.env.NODE_ENV === "development"
                const mfaRedirectUrl = isLocalEnv
                    ? `${origin}/auth/verify-2fa`
                    : forwardedHost
                        ? `https://${forwardedHost}/auth/verify-2fa`
                        : `${origin}/auth/verify-2fa`
                return NextResponse.redirect(mfaRedirectUrl)
            }

            // No MFA or already verified - proceed to requested destination
            const forwardedHost = request.headers.get("x-forwarded-host")
            const isLocalEnv = process.env.NODE_ENV === "development"
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // If no code or error, redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
