"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy, Download, Check, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

// ============================================================================
// TYPES
// ============================================================================

interface RecoveryCodesModalProps {
    isOpen: boolean
    codes: string[]
    onConfirm: () => void
    title?: string
    description?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export function RecoveryCodesModal({
    isOpen,
    codes,
    onConfirm,
    title = "Codes de Secours",
    description = "Sauvegardez ces codes en lieu sûr. Ils vous permettront d'accéder à votre compte si vous perdez votre téléphone."
}: RecoveryCodesModalProps) {
    const [acknowledged, setAcknowledged] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [allCopied, setAllCopied] = useState(false)

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handleCopyCode = async (code: string, index: number) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedIndex(index)
            setTimeout(() => setCopiedIndex(null), 2000)
        } catch {
            toast.error("Impossible de copier le code")
        }
    }

    const handleCopyAll = async () => {
        try {
            const codesText = codes.join("\n")
            await navigator.clipboard.writeText(codesText)
            setAllCopied(true)
            toast.success("Tous les codes ont été copiés!")
            setTimeout(() => setAllCopied(false), 2000)
        } catch {
            toast.error("Impossible de copier les codes")
        }
    }

    const handleDownload = () => {
        const content = [
            "===========================================",
            "SILO - CODES DE SECOURS MFA",
            "===========================================",
            "",
            "⚠️ GARDEZ CES CODES EN LIEU SÛR",
            "Chaque code ne peut être utilisé qu'une seule fois.",
            "",
            "-------------------------------------------",
            ...codes.map((code, i) => `${i + 1}. ${code}`),
            "-------------------------------------------",
            "",
            `Date de génération: ${new Date().toLocaleDateString("fr-FR")}`,
            "",
            "Si vous perdez l'accès à votre application",
            "d'authentification, utilisez un de ces codes",
            "pour vous connecter.",
            "==========================================="
        ].join("\n")

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `silo-recovery-codes-${Date.now()}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success("Fichier téléchargé!")
    }

    const handleConfirm = () => {
        if (acknowledged) {
            setAcknowledged(false)
            onConfirm()
        }
    }

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent
                className="max-w-lg max-h-[90vh] overflow-y-auto"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {/* Warning Banner */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                Action requise !
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                Ces codes ne seront <strong>jamais affichés à nouveau</strong>.
                                Copiez-les ou téléchargez-les maintenant.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Codes Grid */}
                <div className="grid grid-cols-2 gap-2 my-4">
                    {codes.map((code, index) => (
                        <button
                            key={index}
                            onClick={() => handleCopyCode(code, index)}
                            className="group flex items-center justify-between gap-2 p-3 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors"
                        >
                            <span className="font-mono text-sm tracking-wider text-foreground">
                                {code}
                            </span>
                            {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={handleCopyAll}
                    >
                        {allCopied ? (
                            <>
                                <Check className="w-4 h-4 text-green-500" />
                                Copié!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copier tous
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4" />
                        Télécharger .txt
                    </Button>
                </div>

                {/* Acknowledgment Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border mt-2">
                    <Checkbox
                        id="acknowledge"
                        checked={acknowledged}
                        onCheckedChange={(checked: boolean) => setAcknowledged(checked)}
                        className="mt-0.5"
                    />
                    <Label
                        htmlFor="acknowledge"
                        className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                    >
                        J&apos;ai sauvegardé mes codes de secours en lieu sûr et je comprends
                        qu&apos;ils ne seront plus jamais affichés.
                    </Label>
                </div>

                {/* Confirm Button */}
                <Button
                    onClick={handleConfirm}
                    disabled={!acknowledged}
                    className="w-full mt-2"
                    size="lg"
                >
                    Terminer la configuration
                </Button>
            </DialogContent>
        </Dialog>
    )
}
