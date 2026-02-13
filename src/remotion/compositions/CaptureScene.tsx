import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ═══════ REAL APP HSL COLORS ═══════
const HSL_BG = 'hsl(222, 47%, 3%)';
const HSL_CARD = 'hsl(222, 47%, 6%)';
const HSL_PRIMARY = 'hsl(222, 30%, 50%)';
const HSL_BORDER = 'hsl(222, 30%, 12%)';
const HSL_MUTED_FG = 'hsl(210, 20%, 60%)';
const HSL_FG = 'hsl(210, 40%, 98%)';

// ══════════════════════════════════════════════════════════════════════
// HIGH-FIDELITY CAPTURE SCENE (MOBILE 1:1)
// ══════════════════════════════════════════════════════════════════════

const EXISTING_RESOURCES = [
    { title: 'YouTube.png', type: 'FILE', color: '#a855f7', date: '13/02/2026', tags: ['resource'] },
];

export const CaptureScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const phoneEntrance = spring({ frame: frame - 3, fps, config: { damping: 200 } });

    // Modal Sequence: Delayed to frame 45 for "click comprehension"
    const modalEntrance = frame >= 45 && frame < 115
        ? spring({ frame: frame - 45, fps, config: { damping: 200 } })
        : frame >= 115 ? interpolate(frame, [115, 122], [1, 0], { extrapolateRight: 'clamp' }) : 0;

    const toastVisible = frame >= 112 && frame < 160;
    const toastEntrance = toastVisible ? spring({ frame: frame - 112, fps, config: { damping: 200 } }) : 0;
    const dashboardVisible = frame >= 125;
    const newCardEntrance = spring({ frame: frame - 135, fps, config: { damping: 200 } });


    const urlText = "https://remotion.dev";
    const typedUrl = frame >= 55 ? urlText.slice(0, Math.floor((frame - 55) / 2)) : "";

    return (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: HSL_BG }}>

            {/* NARRATIVE OVERLAY (Raw text only) */}
            <div style={{
                position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
                opacity: interpolate(frame, [0, 20, 190, 210], [0, 1, 1, 0]),
                zIndex: 200, textAlign: 'center'
            }}>
                <span style={{
                    color: HSL_FG, fontSize: 18, fontWeight: 800, letterSpacing: '0.05em',
                    textTransform: 'uppercase', opacity: 0.9,
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    Upload files or links
                </span>
            </div>

            {/* PHONE FRAME */}
            <div style={{
                width: 280, height: 560,
                transform: `scale(${phoneEntrance * 0.73})`,
                opacity: phoneEntrance,
                position: 'relative',
            }}>
                <div style={{
                    width: '100%', height: '100%',
                    backgroundColor: HSL_BG, border: `3px solid #1e293b`,
                    borderRadius: 40, overflow: 'hidden',
                    boxShadow: '0 30px 100px rgba(0,0,0,1)',
                    display: 'flex', flexDirection: 'column',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    {/* Notch */}
                    <div style={{ width: '100%', padding: '10px 0 6px', display: 'flex', justifyContent: 'center', backgroundColor: HSL_BG }}>
                        <div style={{ width: 80, height: 24, borderRadius: 14, backgroundColor: '#020617' }} />
                    </div>

                    <div style={{ flex: 1, backgroundColor: HSL_BG, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                        {/* 1. Header (Sun icon only on right) */}
                        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 22, height: 22, backgroundColor: HSL_PRIMARY, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                                    </svg>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 900, color: HSL_FG, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>SILO</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HSL_MUTED_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        </div>

                        {/* 2. Masonry Cards */}
                        <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {EXISTING_RESOURCES.map((res, i) => (
                                <div key={i} style={{
                                    backgroundColor: HSL_CARD,
                                    border: `1px solid ${HSL_BORDER}`,
                                    borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
                                    position: 'relative',
                                }}>
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: `${res.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: res.color }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: HSL_FG }}>{res.title}</span>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={HSL_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                                        </svg>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${HSL_BORDER}`, paddingTop: 8, marginTop: 2 }}>
                                        <div style={{ backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: 4, color: HSL_FG, fontSize: 8, fontWeight: 900 }}>#{res.tags[0]}</div>
                                        <div style={{ color: HSL_MUTED_FG, fontSize: 8, fontWeight: 700, fontFamily: 'monospace' }}>{res.date}</div>
                                    </div>
                                </div>
                            ))}

                            {dashboardVisible && (
                                <div style={{
                                    backgroundColor: HSL_CARD, border: `1px solid ${HSL_PRIMARY}`,
                                    borderRadius: 16, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
                                    transform: `scale(${newCardEntrance})`, opacity: newCardEntrance,
                                    boxShadow: `0 10px 30px -5px ${HSL_PRIMARY}33`
                                }}>
                                    <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: `${HSL_PRIMARY}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: HSL_PRIMARY }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: HSL_FG }}>Silo-Design.zip</span>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={HSL_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
                                        </svg>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${HSL_BORDER}`, paddingTop: 8, marginTop: 2 }}>
                                        <div style={{ backgroundColor: '#1e293b', padding: '2px 8px', borderRadius: 4, color: HSL_FG, fontSize: 8, fontWeight: 900 }}>#design</div>
                                        <div style={{ color: HSL_MUTED_FG, fontSize: 8, fontWeight: 700, fontFamily: 'monospace' }}>Aujourd'hui</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Floating Dock (Correct 5 items with separators) */}
                        <div style={{ padding: '16px', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <div style={{
                                padding: '6px', borderRadius: 100, backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: `1px solid ${HSL_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                backdropFilter: 'blur(24px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                            }}>
                                <div style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: HSL_PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HomeIcon color="#fff" size={18} />
                                </div>
                                <SearchIcon color={HSL_MUTED_FG} size={18} />
                                <div style={{ width: 1, height: 14, backgroundColor: HSL_BORDER }} />
                                <div style={{
                                    padding: '10px 18px', borderRadius: 100, backgroundColor: HSL_PRIMARY,
                                    color: HSL_FG, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em',
                                }}>+ Capture</div>
                                <div style={{ width: 1, height: 14, backgroundColor: HSL_BORDER }} />
                                <FiltersIcon color={HSL_MUTED_FG} size={18} />
                                <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#1e293b', border: `1px solid ${HSL_BORDER}`, overflow: 'hidden' }}>
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Khobz" alt="avatar" style={{ width: '100%', height: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAGIC PASTE (MODAL 1:1) */}
                    {modalEntrance > 0.01 && (
                        <div style={{
                            position: 'absolute', inset: 0, zIndex: 100,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12,
                            backgroundColor: `rgba(2, 6, 23, ${0.9 * modalEntrance})`,
                            backdropFilter: `blur(${modalEntrance * 16}px)`
                        }}>
                            <div style={{
                                width: '100%', backgroundColor: HSL_BG, border: `1px solid ${HSL_BORDER}`,
                                borderRadius: 24, overflow: 'hidden', transform: `scale(${0.9 + 0.1 * modalEntrance})`,
                                boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                                display: 'flex', flexDirection: 'column'
                            }}>
                                {/* Modal Header */}
                                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${HSL_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 28, height: 28, backgroundColor: HSL_PRIMARY, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CloudIcon color="white" size={14} />
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 900, color: HSL_FG, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Capture Memory</span>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HSL_MUTED_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </div>

                                {/* Modal Content (Inputs) */}
                                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>

                                    {/* Upload Area */}
                                    <div style={{ fontSize: 8, fontWeight: 900, color: HSL_MUTED_FG, textTransform: 'uppercase' }}>File or Attachment</div>
                                    <div style={{ height: 110, border: `1.5px dashed ${HSL_BORDER}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                        <CloudIcon color={HSL_MUTED_FG} size={20} />
                                        <div style={{ color: HSL_FG, fontSize: 10, fontWeight: 800 }}>Click to browse</div>
                                        <div style={{ color: HSL_MUTED_FG, fontSize: 8, fontWeight: 700 }}>PDF, RAR, IMG</div>
                                    </div>

                                    {/* Inputs */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div style={{ fontSize: 8, fontWeight: 900, color: HSL_MUTED_FG, textTransform: 'uppercase' }}>Title</div>
                                        <div style={{ height: 38, borderRadius: 12, backgroundColor: HSL_CARD, border: `1px solid ${HSL_BORDER}`, padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ color: typedUrl ? HSL_FG : HSL_MUTED_FG, fontSize: 10, fontWeight: typedUrl ? 700 : 400 }}>
                                                {typedUrl ? "My Design Project" : "Optional memory title..."}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div style={{ fontSize: 8, fontWeight: 900, color: HSL_MUTED_FG, textTransform: 'uppercase' }}>Source URL</div>
                                        <div style={{ height: 38, borderRadius: 12, backgroundColor: HSL_CARD, border: `1px solid ${HSL_BORDER}`, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ color: typedUrl ? HSL_FG : HSL_MUTED_FG, fontSize: 10, fontWeight: typedUrl ? 800 : 400 }}>
                                                {typedUrl || "https://..."}
                                                <span style={{ opacity: Math.sin(frame / 5) > 0 ? 1 : 0, color: HSL_PRIMARY }}>|</span>
                                            </span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={HSL_MUTED_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                        </div>
                                    </div>


                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div style={{ fontSize: 8, fontWeight: 900, color: HSL_MUTED_FG, textTransform: 'uppercase' }}>Note</div>
                                        <div style={{ height: 60, borderRadius: 12, backgroundColor: HSL_CARD, border: `1px solid ${HSL_BORDER}`, padding: '12px', display: 'flex' }}>
                                            <span style={{ color: HSL_MUTED_FG, fontSize: 10 }}>Quick description...</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 8, fontWeight: 900, color: HSL_FG }}>#resource</span>
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={HSL_FG} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </div>
                                        <span style={{ color: HSL_MUTED_FG, fontSize: 9, fontWeight: 700 }}>Add tag...</span>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div style={{ padding: '0 18px 18px' }}>
                                    <div style={{
                                        width: '100%', padding: '14px', backgroundColor: '#334155', borderRadius: 12,
                                        color: HSL_FG, fontWeight: 900, fontSize: 13, textAlign: 'center',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                                    }}>
                                        <span>Save to Vault</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                                            <polyline points="9 10 4 15 9 20" /><path d="M20 4v7a4 4 0 0 1-4 4H4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TOAST */}
                    {toastVisible && (
                        <div style={{ position: 'absolute', bottom: 100, left: 24, right: 24, zIndex: 120, opacity: toastEntrance }}>
                            <div style={{
                                backgroundColor: '#020617', border: '1px solid #22c55e44', borderRadius: 14,
                                padding: '12px 20px', display: 'flex', gap: 12, alignItems: 'center',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 15px #22c55e' }} />
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc' }}>Captured successfully</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ═══ ICON HELPERS ═══
const HomeIcon = ({ color, size = 18 }: { color: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const SearchIcon = ({ color, size = 18 }: { color: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);
const FiltersIcon = ({ color, size = 18 }: { color: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" />
    </svg>
);
const CloudIcon = ({ color, size = 18 }: { color: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" />
    </svg>
);
