import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_FAMILY } from '../Root';

// ═══════ DARK THEME EXACT COLORS ═══════
const BG = '#050a14';
const CARD = '#0c1527';
const PRIMARY = '#5976ad';
const PRIMARY_FG = '#f5f8fc';
const BORDER = '#161e2e';
const MUTED = '#151a22';
const MUTED_FG = '#8a9bb0';

// ═══════════════════════════════════════════════════════════════════
// EXPORT SCENE — Recreates the real Settings > Data Tab
// 
// Real app behavior:
//  1. Settings modal opens, tabs: General | Security | Data
//  2. Tab slides to Data
//  3. "Export Vault (ZIP)" button is clicked
//  4. toast.loading("Generating ZIP archive...") appears bottom-right
//  5. toast transitions to toast.success("Export complete")
//  6. Format badges + Zero Lock-In message
//
// NO progress bar — the real app uses Sonner toast notifications.
// ═══════════════════════════════════════════════════════════════════

export const ExportScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ═══ MODAL ENTRANCE ═══
    const modalEntrance = spring({ frame: frame - 5, fps, config: { damping: 200 } });

    // ═══ TAB SWITCH: General → Data (frame 25-35) ═══
    const tabSwitch = interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' });

    // ═══ EXPORT BUTTONS APPEAR ═══
    const exportJsonEntrance = spring({ frame: frame - 40, fps, config: { damping: 200 } });
    const exportZipEntrance = spring({ frame: frame - 48, fps, config: { damping: 200 } });

    // ═══ ZIP BUTTON "CLICK" EFFECT (frame 60) ═══
    const zipClicked = frame >= 60;
    const zipClickPulse = zipClicked
        ? interpolate(frame, [60, 63, 66], [1, 0.97, 1], { extrapolateRight: 'clamp' })
        : 1;

    // ═══ TOAST NOTIFICATION (frame 65): Loading state ═══
    const toastAppear = frame >= 65;
    const toastEntrance = toastAppear ? spring({ frame: frame - 65, fps, config: { damping: 200 } }) : 0;

    // ═══ TOAST TRANSITION (frame 100): Loading → Success ═══
    const toastSuccess = frame >= 100;

    // ═══ TOAST SPINNER rotation ═══
    const spinnerAngle = frame * 8;

    // ═══ FORMAT BADGES (frame 110) ═══
    const badgeDelay = 110;
    const badges = ['ZIP', 'JSON', 'MD', 'PDF'];

    // ═══ ZERO LOCK-IN (frame 120) ═══
    const lockInOpacity = interpolate(frame, [120, 135], [0, 1], { extrapolateRight: 'clamp' });

    // ═══ DANGER ZONE ═══
    const dangerEntrance = spring({ frame: frame - 53, fps, config: { damping: 200 } });

    return (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: BG }}>
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />

            {/* ═══ Settings Modal ═══ */}
            <div style={{
                width: 520, maxHeight: 480, backgroundColor: CARD, border: `1px solid ${BORDER}`,
                borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                transform: `scale(${modalEntrance}) translateY(${(1 - modalEntrance) * 20}px)`,
                opacity: modalEntrance, position: 'relative', zIndex: 1,
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Header */}
                <div style={{
                    padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, background: `${MUTED}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: PRIMARY_FG, fontFamily: FONT_FAMILY, margin: 0, letterSpacing: '-0.02em' }}>Settings</h2>
                        <p style={{ fontSize: 9, fontWeight: 700, color: MUTED_FG, fontFamily: FONT_FAMILY, margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.15em' }}>Manage your account</p>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED_FG} strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </div>
                </div>

                {/* Tab bar */}
                <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
                    {[
                        { id: 'general', label: 'General', icon: 'user' },
                        { id: 'security', label: 'Security', icon: 'shield' },
                        { id: 'data', label: 'Data', icon: 'database' },
                    ].map(tab => {
                        const finalActive = tabSwitch > 0.5 ? tab.id === 'data' : tab.id === 'general';
                        return (
                            <div key={tab.id} style={{
                                flex: 1, padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                position: 'relative', fontSize: 12, fontWeight: 500, fontFamily: FONT_FAMILY,
                                color: finalActive ? PRIMARY : MUTED_FG,
                            }}>
                                <TabIcon type={tab.icon} color={finalActive ? PRIMARY : MUTED_FG} />
                                <span>{tab.label}</span>
                                {finalActive && (
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                                        backgroundColor: PRIMARY,
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Content — Data Tab */}
                <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
                    {/* Export Data section */}
                    <div>
                        <h3 style={{ fontSize: 9, fontWeight: 700, color: MUTED_FG, textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontFamily: FONT_FAMILY, margin: '0 0 12px 0' }}>
                            Export Data
                        </h3>

                        {/* Export JSON Button */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12,
                            border: `1px solid ${BORDER}`, opacity: exportJsonEntrance, marginBottom: 10,
                            transform: `translateY(${(1 - exportJsonEntrance) * 10}px)`,
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, backgroundColor: MUTED,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED_FG,
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: PRIMARY_FG, fontFamily: FONT_FAMILY, margin: 0 }}>Export Vault (JSON)</p>
                                <p style={{ fontSize: 9, fontWeight: 700, color: MUTED_FG, fontFamily: FONT_FAMILY, margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Download raw format</p>
                            </div>
                        </div>

                        {/* Export ZIP Button (clickable, shows pulse on click) */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12,
                            border: `1px solid ${zipClicked ? PRIMARY : BORDER}`,
                            opacity: exportZipEntrance,
                            transform: `translateY(${(1 - exportZipEntrance) * 10}px) scale(${zipClickPulse})`,
                            backgroundColor: zipClicked ? `${PRIMARY}08` : 'transparent',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, backgroundColor: zipClicked ? PRIMARY : MUTED,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: zipClicked ? PRIMARY_FG : MUTED_FG,
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 800, color: PRIMARY_FG, fontFamily: FONT_FAMILY, margin: 0 }}>Export Vault (ZIP)</p>
                                <p style={{ fontSize: 10, fontWeight: 700, color: MUTED_FG, fontFamily: FONT_FAMILY, margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Organized by folders via Tags</p>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div style={{ opacity: dangerEntrance, transform: `translateY(${(1 - dangerEntrance) * 10}px)` }}>
                        <h3 style={{ fontSize: 9, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' as const, letterSpacing: '0.15em', fontFamily: FONT_FAMILY, margin: '0 0 10px 0' }}>
                            Danger Zone
                        </h3>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12,
                            border: '1px solid rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.05)',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', fontFamily: FONT_FAMILY, margin: 0 }}>Purge all memory</p>
                                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(239,68,68,0.7)', fontFamily: FONT_FAMILY, margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Delete all resources</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                 TOAST NOTIFICATION — Bottom-right (à la Sonner)
                 Phase 1: "Generating ZIP archive..." + spinner
                 Phase 2: "Export complete" + green check
                 ══════════════════════════════════════════════════ */}
            {toastAppear && (
                <div style={{
                    position: 'absolute', bottom: 30, right: 30, zIndex: 50,
                    transform: `translateY(${(1 - toastEntrance) * 30}px)`,
                    opacity: toastEntrance,
                }}>
                    <div style={{
                        backgroundColor: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
                        padding: '12px 18px', boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', gap: 12,
                        minWidth: 260,
                    }}>
                        {!toastSuccess ? (
                            <>
                                {/* Loading spinner */}
                                <div style={{
                                    width: 16, height: 16, borderRadius: '50%',
                                    border: `2px solid ${BORDER}`, borderTopColor: PRIMARY,
                                    transform: `rotate(${spinnerAngle}deg)`,
                                    flexShrink: 0,
                                }} />
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: PRIMARY_FG, fontFamily: FONT_FAMILY, margin: 0 }}>
                                        Generating ZIP archive...
                                    </p>
                                    <p style={{ fontSize: 11, color: MUTED_FG, fontFamily: FONT_FAMILY, margin: 0 }}>
                                        Downloading files may take a moment.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Success icon */}
                                <div style={{
                                    width: 22, height: 22, borderRadius: '50%', backgroundColor: 'rgba(34,197,94,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: '#22c55e', fontFamily: FONT_FAMILY, margin: 0 }}>
                                    Export complete
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ Format badges + Zero Lock-In ═══ */}
            <div style={{
                position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                opacity: lockInOpacity,
            }}>
                {/* Format badges */}
                <div style={{ display: 'flex', gap: 8 }}>
                    {badges.map((b, i) => {
                        const badgeSpring = spring({ frame: frame - badgeDelay - i * 4, fps, config: { damping: 200 } });
                        return (
                            <span key={b} style={{
                                fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 7,
                                backgroundColor: MUTED, color: PRIMARY, border: `1px solid ${BORDER}`,
                                fontFamily: FONT_FAMILY, transform: `scale(${badgeSpring})`, opacity: badgeSpring,
                            }}>
                                .{b.toLowerCase()}
                            </span>
                        );
                    })}
                </div>

                {/* Zero Lock-In text */}
                <div style={{ textAlign: 'center' }}>
                    <span style={{
                        fontSize: 28, fontWeight: 900, color: PRIMARY_FG, fontFamily: FONT_FAMILY,
                        letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                        lineHeight: 1.1, marginBottom: 6, display: 'inline-block'
                    }}>
                        Zero Lock-In
                    </span>
                    <br />
                    <span style={{ fontSize: 14, fontWeight: 600, color: MUTED_FG, fontFamily: FONT_FAMILY, opacity: 0.8 }}>
                        Your data. Your formats. Always exportable.
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// Tab icon helper
const TabIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
    const s = { width: 14, height: 14 };
    switch (type) {
        case 'user': return <svg viewBox="0 0 24 24" {...s} fill="none" stroke={color} strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
        case 'shield': return <svg viewBox="0 0 24 24" {...s} fill="none" stroke={color} strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>;
        case 'database': return <svg viewBox="0 0 24 24" {...s} fill="none" stroke={color} strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>;
        default: return null;
    }
};
