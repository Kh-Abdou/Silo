import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ═══════ REAL APP HSL COLORS ═══════
const HSL_BG = 'hsl(222, 47%, 3%)';
const HSL_CARD = 'hsl(222, 47%, 6%)';
const HSL_PRIMARY = 'hsl(222, 30%, 50%)';
const HSL_BORDER = 'hsl(222, 30%, 12%)';
const HSL_MUTED_FG = 'hsl(210, 20%, 60%)';
const HSL_FG = 'hsl(210, 40%, 98%)';

// ══════════════════════════════════════════════════════════════════════
// SYNC SCENE — TRUE DESKTOP PARITY
// ══════════════════════════════════════════════════════════════════════

const RESOURCES = [
    { title: 'YouTube.png', type: 'FILE', color: '#a855f7', date: '13/02/2026', tags: ['resource'] },
    { title: 'Meeting Notes Q4.pdf', type: 'PDF', color: '#f97316', date: '12/02/2026', tags: ['work'] },
    { title: 'React Server Comp', type: 'CODE', color: '#22c55e', date: '11/02/2026', tags: ['dev'] },
    { title: 'Silo-Design-Final.zip', type: 'FILE', color: '#3b82f6', isNew: true, date: 'Aujourd\'hui', tags: ['design'] },
];

export const SyncScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const swipeProg = spring({ frame, fps, config: { stiffness: 80, damping: 20 } });
    const phoneX = interpolate(swipeProg, [0, 1], [0, -1920]);
    const laptopX = interpolate(swipeProg, [0, 1], [1920, 0]);
    const msgEntrance = spring({ frame: frame - 60, fps, config: { damping: 200 } });

    // Terminal Zoom effect (Portal to next scene)
    const finalZoom = frame > 150 ? interpolate(frame, [150, 180], [1, 2], { extrapolateRight: 'clamp' }) : 1;
    const finalOpacity = frame > 165 ? interpolate(frame, [165, 180], [1, 0]) : 1;

    return (
        <AbsoluteFill style={{
            backgroundColor: HSL_BG,
            overflow: 'hidden',
            opacity: finalOpacity
        }}>


            {/* ATMOSPHERIC BLOBS (Stellar Cluster) */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, backgroundColor: '#4f46e5', opacity: 0.05, filter: 'blur(120px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, backgroundColor: '#7c3aed', opacity: 0.04, filter: 'blur(150px)', borderRadius: '50%' }} />

            {/* PHONE SCENE (CLONE) */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `translateX(${phoneX}px) scale(0.73)`,
            }}>
                <div style={{ width: 280, height: 560, backgroundColor: HSL_BG, border: `3px solid #1e293b`, borderRadius: 40, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Header Mini */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 22, height: 22, backgroundColor: HSL_PRIMARY, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <HourglassLogo color="white" />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 900, color: HSL_FG }}>SILO</span>
                        </div>
                        {/* Fake Content */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ height: 100, borderRadius: 16, border: `1px solid ${HSL_BORDER}`, backgroundColor: HSL_CARD }} />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* LAPTOP SCENE */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `translateX(${laptopX}px) scale(${0.73 * finalZoom})`,
            }}>

                <div style={{ width: 1200, height: 700, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        flex: 1, backgroundColor: HSL_BG, border: `4px solid #1e293b`,
                        borderRadius: 30, overflow: 'hidden',
                        boxShadow: '0 50px 150px rgba(0,0,0,1)',
                        display: 'flex', flexDirection: 'column',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        position: 'relative'
                    }}>
                        {/* PC Header (Minimalist 1:1) */}
                        <div style={{ padding: '20px 48px', borderBottom: `1px solid ${HSL_BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 32, height: 32, backgroundColor: HSL_PRIMARY, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HourglassLogo color="white" size={18} />
                                </div>
                                <span style={{ fontSize: 22, fontWeight: 900, color: HSL_FG, letterSpacing: '-0.04em' }}>SILO</span>
                            </div>
                            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HSL_MUTED_FG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid ${HSL_BORDER}`, background: 'linear-gradient(135deg, #1e293b, #020617)' }} />
                            </div>
                        </div>

                        {/* PC Content (Masonry Grid) */}
                        <div style={{ flex: 1, padding: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                            {RESOURCES.map((res, i) => {
                                const cardEntrance = spring({ frame: frame - 40 - i * 4, fps, config: { damping: 200 } });
                                return (
                                    <div key={i} style={{
                                        padding: '18px 22px', borderRadius: 20,
                                        backgroundColor: HSL_CARD, border: `1px solid ${res.isNew ? HSL_PRIMARY : HSL_BORDER}`,
                                        transform: `scale(${cardEntrance})`, opacity: cardEntrance,
                                        boxShadow: res.isNew ? `0 20px 60px -15px ${HSL_PRIMARY}44` : 'none',
                                        display: 'flex', flexDirection: 'column', gap: 12,
                                        height: i % 2 === 0 ? 180 : 150 // Varying heights
                                    }}>
                                        {/* Icon Top Left */}
                                        <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: `${res.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: res.color }} />
                                        </div>

                                        {/* Title + Download */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 16, fontWeight: 800, color: HSL_FG }}>{res.title}</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HSL_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                                            </svg>
                                        </div>

                                        {/* Footer */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${HSL_BORDER}`, paddingTop: 12, marginTop: 'auto' }}>
                                            <div style={{ backgroundColor: '#1e293b', padding: '4px 12px', borderRadius: 6, color: HSL_FG, fontSize: 10, fontWeight: 900 }}>#{res.tags[0]}</div>
                                            <div style={{ color: HSL_MUTED_FG, fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }}>{res.date}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* PC Dock (Correct 5 items) */}
                        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
                            <div style={{
                                padding: '8px', borderRadius: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: `1.5px solid ${HSL_BORDER}`, display: 'flex', alignItems: 'center', gap: 14,
                                backdropFilter: 'blur(32px)', boxShadow: '0 30px 100px rgba(0,0,0,0.9)'
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: 18, backgroundColor: HSL_PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HomeIcon color="#fff" />
                                </div>
                                <SearchIcon color={HSL_MUTED_FG} />
                                <div style={{ width: 2, height: 28, backgroundColor: HSL_BORDER }} />
                                <div style={{
                                    padding: '12px 32px', borderRadius: 100, backgroundColor: HSL_PRIMARY,
                                    color: HSL_FG, fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em',
                                    boxShadow: `0 10px 40px ${HSL_PRIMARY}66`
                                }}>
                                    + Capture
                                </div>
                                <div style={{ width: 2, height: 28, backgroundColor: HSL_BORDER }} />
                                <FiltersIcon color={HSL_MUTED_FG} />
                                <GraphIcon color={HSL_MUTED_FG} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MESSAGING (Simplified: Just text) */}
            <div style={{
                position: 'absolute', bottom: 120, left: '50%',
                transform: `translateX(-50%) translateY(${interpolate(msgEntrance, [0, 1], [40, 0])}px)`,
                opacity: msgEntrance,
                textAlign: 'center'
            }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: HSL_FG, letterSpacing: '-0.05em', opacity: 0.8 }}>
                    Universally synced.
                </span>
            </div>

        </AbsoluteFill>
    );
};

// ═══ ICON HELPERS ═══
const HourglassLogo = ({ color, size = 12 }: { color: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
);
const HomeIcon = ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const SearchIcon = ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);
const FiltersIcon = ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" />
    </svg>
);
const GraphIcon = ({ color }: { color: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);
