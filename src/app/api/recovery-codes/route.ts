/**
 * API Route: Recovery Codes Generation & Management
 * 
 * POST: Generate new recovery codes (or regenerate with TOTP verification)
 * GET: Get count of remaining unused codes
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { generateRecoveryCodes } from "@/lib/recovery-codes"

// ============================================================================
// POST - Generate/Regenerate Recovery Codes
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        // 1. Get authenticated user
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized", message: "You must be logged in" },
                { status: 401 }
            )
        }

        // 2. Check if this is a regeneration request (requires AAL2)
        const body = await request.json().catch(() => ({}))
        const isRegenerate = body.regenerate === true

        if (isRegenerate) {
            // For regeneration, verify the user has completed MFA verification
            const { data: aalData, error: aalError } =
                await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

            if (aalError) {
                console.error("AAL check error:", aalError)
                return NextResponse.json(
                    { error: "Auth Error", message: "Unable to verify MFA status" },
                    { status: 500 }
                )
            }

            // Require AAL2 for regeneration (ensures TOTP was verified)
            if (aalData?.currentLevel !== "aal2") {
                return NextResponse.json(
                    { error: "MFA Required", message: "TOTP verification required to regenerate codes" },
                    { status: 403 }
                )
            }
        }

        // 3. Generate new recovery codes
        const { plainCodes, hashedCodes } = await generateRecoveryCodes()

        // 4. Transaction: Delete old codes + Insert new ones
        await prisma.$transaction([
            // Delete existing codes for this user
            prisma.recoveryCode.deleteMany({
                where: { userId: user.id }
            }),
            // Insert new hashed codes
            prisma.recoveryCode.createMany({
                data: hashedCodes.map(hash => ({
                    userId: user.id,
                    codeHash: hash,
                    used: false
                }))
            })
        ])

        // 5. Return plain codes for ONE-TIME display
        // SECURITY: These codes should never be logged or stored in plain text
        return NextResponse.json({
            success: true,
            codes: plainCodes,
            message: isRegenerate
                ? "Recovery codes regenerated. Previous codes are now invalid."
                : "Recovery codes generated successfully."
        })

    } catch (error) {
        console.error("Recovery codes generation error:", error)
        return NextResponse.json(
            { error: "Server Error", message: "Failed to generate recovery codes" },
            { status: 500 }
        )
    }
}

// ============================================================================
// GET - Get Remaining Codes Count
// ============================================================================

export async function GET() {
    try {
        // 1. Get authenticated user
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized", message: "You must be logged in" },
                { status: 401 }
            )
        }

        // 2. Count unused codes
        const remaining = await prisma.recoveryCode.count({
            where: {
                userId: user.id,
                used: false
            }
        })

        const total = await prisma.recoveryCode.count({
            where: { userId: user.id }
        })

        return NextResponse.json({
            remaining,
            total,
            hasRecoveryCodes: total > 0
        })

    } catch (error) {
        console.error("Recovery codes count error:", error)
        return NextResponse.json(
            { error: "Server Error", message: "Failed to get recovery codes count" },
            { status: 500 }
        )
    }
}
