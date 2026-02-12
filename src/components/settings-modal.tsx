"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, Save, User, Shield, Database, Lock, AlertCircle, Loader2, Trash2, Download, Pencil, FileArchive } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { updateProfile } from "@/app/auth/actions"
import { deleteAllResources, exportVaultData } from "@/app/actions"
import { TwoFactorAuth } from "@/components/settings/two-factor-auth"
import { ChangeEmailDialog } from "@/components/settings/change-email-dialog"
import { cn } from "@/lib/utils"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useDevice } from "@/hooks/use-device"

export type SettingsTab = "general" | "security" | "data"

interface SettingsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialTab?: SettingsTab
    user: SupabaseUser | null
    onExportZip?: () => Promise<void>
}

const tabs = [
    { id: "general" as const, label: "Général", icon: User },
    { id: "security" as const, label: "Sécurité", icon: Shield },
    { id: "data" as const, label: "Données", icon: Database },
]

export function SettingsModal({ open, onOpenChange, initialTab = "general", user, onExportZip }: SettingsModalProps) {
    const [activeTab, setActiveTab] = React.useState<SettingsTab>(initialTab)
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
    const [isChangeEmailOpen, setIsChangeEmailOpen] = React.useState(false)
    const [errors, setErrors] = React.useState<{ name?: string }>({})
    const [isLoading, setIsLoading] = React.useState(false)
    const [isFetching, setIsFetching] = React.useState(true)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const { isTouch } = useDevice()

    // Sync initialTab when modal opens
    React.useEffect(() => {
        if (open) {
            setActiveTab(initialTab)
        }
    }, [open, initialTab])

    // Fetch user data on mount
    React.useEffect(() => {
        if (!open) return
        const fetchUserData = async () => {
            setIsFetching(true)
            const supabase = createClient()
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            if (currentUser) {
                setName(currentUser.user_metadata?.full_name || currentUser.user_metadata?.display_name || "")
                setEmail(currentUser.email || "")
                setAvatarUrl(currentUser.user_metadata?.avatar_url || null)
            }
            setIsFetching(false)
        }
        fetchUserData()
    }, [open])

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 500 * 1024) {
            toast.error("L'image doit faire moins de 500KB")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64 = event.target?.result as string
            setAvatarUrl(base64)
        }
        reader.readAsDataURL(file)
    }

    const validateForm = () => {
        const newErrors: { name?: string } = {}
        if (!name || name.length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères"
        }
        if (name.length > 50) {
            newErrors.name = "Le nom doit faire moins de 50 caractères"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
        if (!validateForm()) return
        setIsLoading(true)

        const result = await updateProfile({ name, email })

        if (result.error) {
            if (result.validationErrors) {
                setErrors(result.validationErrors)
            } else {
                toast.error("Échec de la mise à jour", { description: result.error })
            }
        } else {
            toast.success("Profil mis à jour avec succès")
        }

        setIsLoading(false)
    }

    const handleExport = async () => {
        const res = await exportVaultData()
        if (res.success && res.data) {
            const blob = new Blob([res.data], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `silo_vault_export_${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success("Données exportées avec succès")
        } else {
            toast.error("Échec de l'export")
        }
    }

    const [isExportingZip, setIsExportingZip] = React.useState(false)
    const handleExportZip = async () => {
        if (!onExportZip) return
        setIsExportingZip(true)
        await onExportZip()
        setIsExportingZip(false)
    }


    const handleClearAll = async () => {
        if (confirm("DANGER: Cette action supprimera toutes vos données. Continuer ?")) {
            const res = await deleteAllResources()
            if (res.success) {
                toast.success("Mémoire purgée")
            }
        }
    }

    const handleSwipe = (offsetX: number) => {
        if (!isTouch) return
        const threshold = 50
        const currentIndex = tabs.findIndex(t => t.id === activeTab)

        if (offsetX > threshold && currentIndex > 0) {
            // Swipe Right -> Previous Tab
            const prevTab = tabs[currentIndex - 1]
            if (prevTab) setActiveTab(prevTab.id)
        } else if (offsetX < -threshold && currentIndex < tabs.length - 1) {
            // Swipe Left -> Next Tab
            const nextTab = tabs[currentIndex + 1]
            if (nextTab) setActiveTab(nextTab.id)
        }
    }

    const getAvatarSrc = () => {
        if (avatarUrl) return avatarUrl
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'DefaultUser'}`
    }

    if (!open) return null

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container - Centers content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-xl max-h-[calc(100vh-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight text-foreground">Paramètres</h2>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        Gérer votre compte
                                    </p>
                                </div>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-border shrink-0">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative",
                                                activeTab === tab.id
                                                    ? "text-primary"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Content */}
                            <motion.div
                                className="flex-1 overflow-y-auto p-6"
                                drag={isTouch ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(_, info) => handleSwipe(info.offset.x)}
                            >
                                {isFetching ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {activeTab === "general" && (
                                            <motion.div
                                                key="general"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-6"
                                            >
                                                {/* Avatar Section */}
                                                <div className="flex items-center gap-4">
                                                    <div className="relative group">
                                                        <div className="w-20 h-20 rounded-full bg-muted border-2 border-border overflow-hidden">
                                                            <img src={getAvatarSrc()} alt="avatar" className="w-full h-full object-cover" />
                                                        </div>
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Camera className="w-5 h-5 text-white" />
                                                        </button>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleAvatarUpload}
                                                            className="hidden"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-muted-foreground">Cliquez pour changer la photo</p>
                                                        <p className="text-[10px] text-muted-foreground/60">Max 500KB, JPG/PNG</p>
                                                    </div>
                                                </div>

                                                {/* Name Field */}
                                                <div>
                                                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                                                        Nom d'affichage
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => {
                                                            setName(e.target.value)
                                                            setErrors(prev => { const newErr = { ...prev }; delete newErr.name; return newErr })
                                                        }}
                                                        className={cn(
                                                            "w-full h-11 px-4 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
                                                            errors.name ? "border-red-500" : "border-border"
                                                        )}
                                                        placeholder="Votre nom"
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Email Field - READ ONLY */}
                                                <div>
                                                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                                        Adresse Email
                                                        <Lock className="w-3 h-3" />
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            readOnly
                                                            disabled
                                                            className="w-full h-11 px-4 pr-12 bg-muted/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                                                        />
                                                        <button
                                                            onClick={() => setIsChangeEmailOpen(true)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full text-foreground/50 hover:text-primary transition-colors"
                                                            title="Modifier l'email"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 text-[10px] text-muted-foreground">
                                                        L'email ne peut pas être modifié sans vérification d'identité.
                                                    </p>
                                                </div>

                                                <ChangeEmailDialog
                                                    open={isChangeEmailOpen}
                                                    onOpenChange={setIsChangeEmailOpen}
                                                    currentEmail={email}
                                                />

                                                {/* Save Button */}
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isLoading}
                                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                                                </button>
                                            </motion.div>
                                        )}

                                        {activeTab === "security" && (
                                            <motion.div
                                                key="security"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-6"
                                            >
                                                {/* 2FA Section */}
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                                                        Authentification à deux facteurs
                                                    </h3>
                                                    <TwoFactorAuth />
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === "data" && (
                                            <motion.div
                                                key="data"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="space-y-6"
                                            >
                                                {/* Export Section */}
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                                                        Exporter les données
                                                    </h3>
                                                    <button
                                                        onClick={handleExport}
                                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-border"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                                <Download className="w-5 h-5" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-bold text-sm text-foreground">Exporter le Vault (JSON)</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Télécharger au format brut</p>
                                                            </div>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={handleExportZip}
                                                        disabled={isExportingZip}
                                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group border border-border mt-3 disabled:opacity-50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                                {isExportingZip ? (
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                ) : (
                                                                    <FileArchive className="w-5 h-5" />
                                                                )}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-bold text-sm text-foreground">Exporter le Vault (ZIP)</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Organisé par dossiers via Tags</p>
                                                            </div>
                                                        </div>
                                                    </button>

                                                </div>

                                                {/* Danger Zone */}
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-4">
                                                        Zone de danger
                                                    </h3>
                                                    <button
                                                        onClick={handleClearAll}
                                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive hover:bg-destructive/10 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive">
                                                                <AlertCircle className="w-5 h-5" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-bold text-sm">Purger toute la mémoire</p>
                                                                <p className="text-[10px] opacity-70 uppercase tracking-widest">Supprimer toutes les ressources</p>
                                                            </div>
                                                        </div>
                                                        <Trash2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
