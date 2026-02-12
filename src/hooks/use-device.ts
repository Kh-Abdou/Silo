"use client"

import { useState, useEffect } from "react"

export type DeviceType = {
    isMobile: boolean
    isTablet: boolean
    isPC: boolean
    isTouch: boolean
}

/**
 * useDevice Hook
 * 
 * Provides robust detection of device types based on:
 * - Screen width (Next.js/Tailwind breakpoints)
 * - Pointer capabilities (Touch vs. Mouse)
 */
export function useDevice(): DeviceType {
    const [device, setDevice] = useState<DeviceType>({
        isMobile: false,
        isTablet: false,
        isPC: false,
        isTouch: false
    })

    useEffect(() => {
        const updateDevice = () => {
            const isTouch = window.matchMedia("(pointer: coarse)").matches
            const width = window.innerWidth

            setDevice({
                // Mobile: Small screen + Touch
                isMobile: width < 768 && isTouch,
                // Tablet: Larger screen + Touch
                isTablet: width >= 768 && isTouch,
                // PC: Screen >= 768 + Mouse
                isPC: width >= 768 && !isTouch,
                isTouch
            })
        }

        // Initial check
        updateDevice()

        // Handle resize
        window.addEventListener("resize", updateDevice)
        return () => window.removeEventListener("resize", updateDevice)
    }, [])

    return device
}
