"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Camera, Save, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Resource } from "@/types/resource"
import { updateProfile } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/client"
import { useDevice } from "@/hooks/use-device"

interface ProfileEditViewProps {
    mounted: boolean
    theme: string | undefined
    resources: Resource[]
    onClose: () => void
}

export function ProfileEditView({ mounted, theme, resources, onClose }: ProfileEditViewProps) {
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
    const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({})
    const [isLoading, setIsLoading] = React.useState(false)
    const [isFetching, setIsFetching] = React.useState(true)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const { isTouch } = useDevice()

    // Fetch user on mount
    React.useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setName(user.user_metadata?.full_name || "")
                setEmail(user.email || "")
                setAvatarUrl(user.user_metadata?.avatar_url || null)
            }
            setIsFetching(false)
        }
        fetchUser()
    }, [])

    const validateForm = () => {
        const newErrors: { name?: string; email?: string } = {}

        if (!name || name.length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }
        if (name.length > 50) {
            newErrors.name = "Name must be less than 50 characters"
        }

        if (!email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 500 * 1024) {
            toast.error("Image must be less than 500KB")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64 = event.target?.result as string
            setAvatarUrl(base64)
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        if (!validateForm()) return

        setIsLoading(true)

        const result = await updateProfile({ name, email })

        if (result.error) {
            if (result.validationErrors) {
                setErrors(result.validationErrors)
            } else {
                toast.error("Update failed", { description: result.error })
            }
        } else {
            toast.success("Profile updated successfully")
        }

        setIsLoading(false)
    }

    const getAvatarSrc = () => {
        if (avatarUrl) return avatarUrl
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${mounted && theme === 'dark' ? 'Noir' : 'Felix'}`
    }

    if (isFetching) {
        return (
            <motion.div
                key="profile-view"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="max-w-xl mx-auto pb-56"
            >
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl p-12 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            key="profile-view"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 100 }}
            drag={isTouch ? "y" : false}
            dragConstraints={{ top: 0, bottom: 300 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                    onClose();
                }
            }}
            className="max-w-xl mx-auto pb-56"
        >
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl relative">
                {/* Drag Handle for Mobile */}
                {isTouch && (
                    <div className="w-full flex justify-center pt-3 pb-1">
                        <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
                    </div>
                )}
                <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-4 pb-4 px-0">
                            <h2 className="text-xl font-bold tracking-tight text-foreground">Profile</h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Manage your account details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
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
                            <p className="text-xs text-muted-foreground">Click avatar to change photo</p>
                            <p className="text-[10px] text-muted-foreground/60">Max 500KB, JPG/PNG</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setErrors(prev => { const newErr = { ...prev }; delete newErr.name; return newErr }) }}
                                className={`w-full h-11 px-4 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.name ? "border-red-500" : "border-border"
                                    }`}
                                placeholder="Your name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(prev => { const newErr = { ...prev }; delete newErr.email; return newErr }) }}
                                className={`w-full h-11 px-4 bg-muted/30 border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${errors.email ? "border-red-500" : "border-border"
                                    }`}
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Usage Statistics</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                                <p className="text-xs text-muted-foreground">Total Resources</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{new Set(resources.flatMap(r => r.tags || [])).size}</p>
                                <p className="text-xs text-muted-foreground">Unique Tags</p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
