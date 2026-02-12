/**
 * API Route: Recovery Code Verification (Login Flow)
 * 
 * POST: Verify a recovery code and mark it as used
 * Used when user can't access their authenticator app
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { findMatchingCode } from "@/lib/recovery-codes"

// ============================================================================
// POST - Verify Recovery Code
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        // 1. Parse request body
        const body = await request.json()
        const { code } = body

        if (!code || typeof code !== "string") {
            return NextResponse.json(
                { error: "Bad Request", message: "Recovery code is required" },
                { status: 400 }
            )
        }

        // 2. Get the current session (should be at AAL1 after password login)
        const supabase = await createClient()
        const { data, error: authError } = await supabase.auth.getUser()
        const user = data?.user

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized", message: "You must be logged in" },
                { status: 401 }
            )
        }

        // 3. Get all unused recovery codes for this user
        const unusedCodes = await prisma.recoveryCode.findMany({
            where: {
                userId: user.id,
                used: false
            },
            select: {
                id: true,
                codeHash: true
            }
        })

        if (unusedCodes.length === 0) {
            return NextResponse.json(
                { error: "No Codes", message: "No recovery codes available. Please contact support." },
                { status: 400 }
            )
        }

        // 4. Find matching code
        const match = await findMatchingCode(code, unusedCodes)

        if (!match) {
            return NextResponse.json(
                { error: "Invalid Code", message: "Invalid recovery code. Please try again." },
                { status: 401 }
            )
        }

        // 5. Mark the code as used (burn it)
        await prisma.recoveryCode.update({
            where: { id: match.id },
            data: {
                used: true,
                usedAt: new Date()
            }
        })

        // 6. Count remaining codes to warn user
        const remainingCount = unusedCodes.length - 1

        // 7. Return success
        // Note: The session elevation to AAL2 equivalent needs to be handled
        // by the frontend through a different mechanism since Supabase MFA
        // doesn't natively support recovery codes
        return NextResponse.json({
            success: true,
            message: "Recovery code verified successfully",
            remainingCodes: remainingCount,
            warning: remainingCount <= 2
                ? "Warning: You have only " + remainingCount + " recovery codes left. Consider regenerating them."
                : null
        })

    } catch (error) {
        console.error("Recovery code verification error:", error)
        return NextResponse.json(
            { error: "Server Error", message: "Failed to verify recovery code" },
            { status: 500 }
        )
    }
}
