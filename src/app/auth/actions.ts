"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

// Helper to get origin with fallback
async function getOrigin(): Promise<string> {
    try {
        const headersList = await headers()
        const origin = headersList.get("origin")
        if (origin) return origin

        const host = headersList.get("host")
        if (host) {
            const protocol = host.includes("localhost") ? "http" : "https"
            return `${protocol}://${host}`
        }
    } catch {
        // Fallback
    }
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = await getOrigin()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                prompt: "select_account",
            },
        },
    })

    if (error) {
        console.error("Google sign in error:", error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }

    return { error: "No redirect URL received" }
}

export async function signInWithEmail(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Sign in error:", error)
        return { error: error.message }
    }

    // Check if user has MFA enabled and needs to complete 2FA verification
    const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    if (aalError) {
        console.error("AAL check error:", aalError)
        // If we can't check AAL, proceed to dashboard (safe fallback)
        redirect("/dashboard")
    }

    // If user has MFA enrolled (nextLevel = aal2) but hasn't verified yet (currentLevel = aal1)
    // Redirect to 2FA verification page
    if (aalData?.nextLevel === 'aal2' && aalData?.currentLevel === 'aal1') {
        redirect("/auth/verify-2fa")
    }

    // No MFA or already verified - proceed to dashboard
    redirect("/dashboard")
}

export async function signUpWithEmail(email: string, password: string, name: string) {
    const supabase = await createClient()
    const origin = await getOrigin()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name: name,
            },
        },
    })

    if (error) {
        console.error("Sign up error:", error)

        // Check for specific email sending error
        if (error.message.includes("email") || error.message.includes("Email")) {
            return {
                error: "Unable to send confirmation email. Please try again or contact support.",
                details: "Supabase email service may be rate-limited. Configure custom SMTP in Supabase dashboard."
            }
        }

        return { error: error.message }
    }

    // Check if email confirmation is required
    if (data.user && (!data.session || (data.user.identities && data.user.identities.length === 0))) {
        return {
            success: true,
            message: "Account created! Check your email to confirm.",
            needsConfirmation: true
        }
    }

    // If session exists, user is logged in (email confirmation disabled)
    if (data.session) {
        redirect("/dashboard")
    }

    return { success: true, message: "Account created! Check your email to confirm.", needsConfirmation: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
}

export async function getUser() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data?.user || null
}

// Profile validation helper
function validateProfile(data: { name?: string; email?: string }) {
    const errors: { name?: string; email?: string } = {}

    if (data.name !== undefined) {
        if (!data.name || data.name.length < 2) {
            errors.name = "Name must be at least 2 characters"
        }
        if (data.name && data.name.length > 50) {
            errors.name = "Name must be less than 50 characters"
        }
    }

    if (data.email !== undefined) {
        if (!data.email) {
            errors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Please enter a valid email"
        }
    }

    return Object.keys(errors).length > 0 ? errors : null
}

export async function updateProfile(data: { name?: string; email?: string }) {
    const validationErrors = validateProfile(data)
    if (validationErrors) {
        return { error: "Validation failed", validationErrors }
    }

    const supabase = await createClient()

    const updateData: { email?: string; data?: { full_name?: string } } = {}

    if (data.name) {
        updateData.data = { full_name: data.name }
    }

    if (data.email) {
        updateData.email = data.email
    }

    const { error } = await supabase.auth.updateUser(updateData)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
