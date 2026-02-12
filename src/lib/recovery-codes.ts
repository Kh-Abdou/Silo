/**
 * MFA Recovery Codes Utility
 * 
 * Handles generation, hashing, and verification of recovery codes.
 * Codes are stored hashed (bcrypt) and each is single-use.
 */

import crypto from "crypto"
import bcrypt from "bcryptjs"

// ============================================================================
// CONSTANTS
// ============================================================================

const CODE_LENGTH = 8        // Format: XXXX-XXXX (8 chars without dash)
const CODE_COUNT = 10        // 10 codes per user
const BCRYPT_ROUNDS = 10     // bcrypt cost factor

// Safe alphabet: no O/0, I/1, L to avoid confusion
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

// ============================================================================
// TYPES
// ============================================================================

export interface RecoveryCodeResult {
    plainCodes: string[]     // Codes in plain text (for one-time display)
    hashedCodes: string[]    // Hashes for DB storage
}

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Generate a single recovery code
 * Format: XXXX-XXXX (alphanumeric, easy to read)
 */
function generateCode(): string {
    const bytes = crypto.randomBytes(CODE_LENGTH)
    let code = ""

    for (let i = 0; i < CODE_LENGTH; i++) {
        const byte = bytes[i]
        if (byte !== undefined) {
            const index = byte % ALPHABET.length
            code += ALPHABET[index] ?? ''
        }
    }

    // Format as XXXX-XXXX
    return `${code.slice(0, 4)}-${code.slice(4)}`
}

/**
 * Normalize a code for comparison
 * Removes dashes/spaces and converts to uppercase
 */
export function normalizeCode(code: string): string {
    return code.replace(/[-\s]/g, "").toUpperCase()
}

/**
 * Generate a set of recovery codes with their hashes
 * Returns both plain codes (for display) and hashes (for storage)
 */
export async function generateRecoveryCodes(): Promise<RecoveryCodeResult> {
    const plainCodes: string[] = []
    const hashedCodes: string[] = []

    for (let i = 0; i < CODE_COUNT; i++) {
        const code = generateCode()
        const normalized = normalizeCode(code)
        const hash = await bcrypt.hash(normalized, BCRYPT_ROUNDS)

        plainCodes.push(code)
        hashedCodes.push(hash)
    }

    return { plainCodes, hashedCodes }
}

/**
 * Verify a recovery code against a stored hash
 * Uses bcrypt.compare which is timing-safe
 */
export async function verifyCode(
    inputCode: string,
    hashedCode: string
): Promise<boolean> {
    const normalized = normalizeCode(inputCode)
    return bcrypt.compare(normalized, hashedCode)
}

/**
 * Find and verify a code against multiple stored hashes
 * Returns the index of the matching code, or -1 if not found
 */
export async function findMatchingCode(
    inputCode: string,
    hashedCodes: Array<{ id: string; codeHash: string }>
): Promise<{ id: string; index: number } | null> {
    const normalized = normalizeCode(inputCode)

    for (let i = 0; i < hashedCodes.length; i++) {
        const codeEntry = hashedCodes[i]
        if (codeEntry) {
            const isMatch = await bcrypt.compare(normalized, codeEntry.codeHash)
            if (isMatch) {
                return { id: codeEntry.id, index: i }
            }
        }
    }

    return null
}
