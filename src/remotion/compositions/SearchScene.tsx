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

// ═══════════════════════════════════════════════════════════════════════
// SEARCH SCENE — Full-screen desktop dashboard
// ═══════════════════════════════════════════════════════════════════════

const ALL_CARDS = [
    { title: 'GPT-4 Technical Report', type: 'LINK', tags: ['AI', 'research'], color: PRIMARY, isTarget: true },
    { title: 'React Server Components', type: 'CODE', tags: ['dev', 'react'], color: '#22c55e' },
    { title: 'Design System v3.pdf', type: 'PDF', tags: ['design'], color: '#f97316' },
    { title: 'Meeting Notes Q4', type: 'TEXT', tags: ['work', 'notes'], color: '#a855f7' },
    { title: 'Supabase Auth Setup', type: 'LINK', tags: ['dev', 'auth'], color: '#5976ad' },
    { title: 'Brand Guidelines.zip', type: 'FILE', tags: ['design', 'brand'], color: '#ef4444' },
];

export const SearchScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ═══ DASHBOARD ENTRANCE ═══
    const dashEntrance = spring({ frame, fps, config: { damping: 200 } });

    // ═══ FILTER BAR (30–120) ═══
    const filterVisible = frame >= 30 && frame < 120;
    const filterEntrance = filterVisible
        ? interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })
        : frame >= 120 ? interpolate(frame, [120, 130], [1, 0], { extrapolateRight: 'clamp' }) : 0;
    const aiTagActive = frame >= 80;

    // ═══ DOCK STATES ═══
    const filterDockActive = frame >= 30 && frame < 120;
    const searchDockActive = frame >= 120;

    // ═══ ACTIVE CARD FILTERING ═══
    const filteringByAI = frame >= 80 && frame < 120;
    const searchingGPT = frame >= 165;

    let visibleCards = ALL_CARDS;
    if (searchingGPT) {
        visibleCards = ALL_CARDS.filter(c => c.title.includes('GPT-4'));
    } else if (filteringByAI) {
        visibleCards = ALL_CARDS.filter(c => c.tags.includes('AI'));
    }

    // ═══ SEARCH OVERLAY (120+) ═══
    const searchOpen = frame >= 120;
    const searchEntrance = searchOpen ? spring({ frame: frame - 120, fps, config: { damping: 200 } }) : 0;

    // Typing "GPT-4"  
    const searchQuery = 'GPT-4';
    const queryProgress = interpolate(frame, [140, 165], [0, 1], { extrapolateRight: 'clamp' });
    const queryChars = Math.floor(queryProgress * searchQuery.length);
    const typedQuery = searchQuery.substring(0, queryChars);
    const cursorBlink = Math.sin(frame * 0.3) > 0 ? 1 : 0;

    return (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', backgroundColor: BG }}>
            {/* NARRATIVE OVERLAY (Raw text only) */}
            <div style={{
                position: 'absolute', bottom: 220, left: '50%', transform: 'translateX(-50%)',
                opacity: interpolate(frame, [0, 20, 220, 240], [0, 1, 1, 0]),
                zIndex: 200, textAlign: 'center'
            }}>
                <span style={{
                    color: PRIMARY_FG, fontSize: 18, fontWeight: 800, letterSpacing: '0.05em',
                    textTransform: 'uppercase', opacity: 0.9,
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    Search and filter
                </span>
            </div>

            {/* ═══ HEADER — Fixed top bar ═══ */}
            <div style={{
                height: 56, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: `1px solid ${BORDER}`, backgroundColor: `${BG}cc`,
                opacity: dashEntrance, position: 'relative', zIndex: 50,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 30, height: 30, backgroundColor: PRIMARY, borderRadius: 7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 10px ${PRIMARY}33`,
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_FG} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 22h14" /><path d="M5 2h14" />
                            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: PRIMARY_FG, fontFamily: FONT_FAMILY, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                        SILO
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 1, height: 20, backgroundColor: BORDER }} />
                    <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED_FG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    </div>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BORDER}`,
                        background: `linear-gradient(135deg, ${PRIMARY}44, ${MUTED})`,
                    }} />
                </div>
            </div>

            {/* ═══ FILTER BAR ═══ */}
            {filterEntrance > 0 && (
                <div style={{
                    position: 'absolute', top: 68, left: 0, right: 0, zIndex: 40,
                    display: 'flex', justifyContent: 'center', padding: '0 48px',
                    opacity: filterEntrance, transform: `translateY(${(1 - filterEntrance) * -10}px)`,
                }}>
                    <div style={{
                        backgroundColor: `${BG}cc`, backdropFilter: 'blur(16px)',
                        border: `1px solid ${BORDER}`, borderRadius: 16, padding: '8px 16px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                        display: 'flex', alignItems: 'center', gap: 16,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {['LINK', 'CODE', 'PDF', 'TEXT', 'FILE'].map(type => (
                                <span key={type} style={{
                                    fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                                    border: `1px solid ${BORDER}`, color: MUTED_FG, backgroundColor: 'transparent',
                                    fontFamily: FONT_FAMILY, textTransform: 'uppercase',
                                }}>
                                    {type.charAt(0) + type.slice(1).toLowerCase()}s
                                </span>
                            ))}
                        </div>
                        <div style={{ width: 1, height: 12, backgroundColor: BORDER }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {['AI', 'dev', 'design', 'research'].map(tag => {
                                const isActive = tag === 'AI' && aiTagActive;
                                return (
                                    <span key={tag} style={{
                                        fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                                        border: `1px solid ${isActive ? PRIMARY_FG : BORDER}`,
                                        color: isActive ? BG : MUTED_FG,
                                        backgroundColor: isActive ? PRIMARY_FG : 'transparent',
                                        fontFamily: FONT_FAMILY, textTransform: 'lowercase',
                                    }}>
                                        #{tag}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ RESOURCE CARDS ═══ */}
            <div style={{
                flex: 1, padding: '28px 48px 100px',
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14,
                alignContent: 'start', overflow: 'hidden',
            }}>
                {visibleCards.map((card, i) => {
                    const cardEntrance = spring({ frame: frame - 6 - i * 3, fps, config: { damping: 200 } });
                    return (
                        <div key={card.title} style={{
                            backgroundColor: card.isTarget ? `${PRIMARY}10` : CARD,
                            border: `1px solid ${card.isTarget ? `${PRIMARY}44` : BORDER}`,
                            borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
                            transform: `scale(${cardEntrance}) translateY(${(1 - cardEntrance) * 10}px)`,
                            opacity: cardEntrance,
                            boxShadow: card.isTarget && searchingGPT ? `0 0 20px ${PRIMARY}22` : 'none',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    backgroundColor: `${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <div style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: card.color }} />
                                </div>
                                <span style={{
                                    fontSize: 8, fontWeight: 700, color: MUTED_FG,
                                    textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT_FAMILY,
                                }}>
                                    {card.type}
                                </span>
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: PRIMARY_FG, fontFamily: FONT_FAMILY, margin: 0, lineHeight: 1.4 }}>
                                {card.title}
                            </p>
                            <div style={{ display: 'flex', gap: 5 }}>
                                {card.tags.map(t => (
                                    <span key={t} style={{
                                        fontSize: 8, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
                                        backgroundColor: MUTED, color: MUTED_FG, fontFamily: FONT_FAMILY,
                                    }}>
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ═══ SPOTLIGHT SEARCH ═══ */}
            {searchOpen && (
                <div style={{
                    position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
                    width: 480, zIndex: 100,
                    opacity: searchEntrance,
                }}>
                    <div style={{
                        backgroundColor: `${BG}e6`, backdropFilter: 'blur(24px)',
                        border: `1px solid ${BORDER}`, borderRadius: 14,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        transform: `translateY(${(1 - searchEntrance) * 20}px) scale(${0.95 + searchEntrance * 0.05})`,
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 16px', borderBottom: `1px solid ${BORDER}`,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED_FG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                            <span style={{ flex: 1, fontSize: 14, color: typedQuery ? PRIMARY_FG : MUTED_FG, fontFamily: FONT_FAMILY }}>
                                {typedQuery || 'Jump to memory...'}
                                <span style={{
                                    display: 'inline-block', width: 1.5, height: 16,
                                    backgroundColor: PRIMARY, opacity: cursorBlink,
                                    verticalAlign: 'middle', marginLeft: 1,
                                }} />
                            </span>
                            {typedQuery && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={MUTED_FG} strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            )}
                        </div>
                        <div style={{
                            padding: '6px 16px', backgroundColor: `${MUTED}60`,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <span style={{
                                fontSize: 8, fontWeight: 700, color: MUTED_FG,
                                textTransform: 'uppercase', letterSpacing: '0.15em',
                                padding: '2px 8px', backgroundColor: `${MUTED}80`,
                                borderRadius: 6, border: `1px solid ${BORDER}`, fontFamily: FONT_FAMILY,
                            }}>
                                Search everywhere
                            </span>
                            <span style={{ fontSize: 8, color: MUTED_FG, fontFamily: FONT_FAMILY, opacity: 0.5 }}>ESC to close</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ FLOATING DOCK ═══ */}
            <div style={{
                position: 'absolute', bottom: 24, left: '50%',
                transform: `translateX(-50%) translateY(${(1 - dashEntrance) * 60}px)`,
                opacity: dashEntrance, zIndex: 50,
                display: 'flex', alignItems: 'center', padding: 8, gap: 4,
                backgroundColor: `${CARD}cc`, backdropFilter: 'blur(20px)',
                border: `1px solid ${BORDER}`, borderRadius: 28,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
                <DockBtn icon="home" active={!filterDockActive && !searchDockActive} />
                <DockBtn icon="search" active={searchDockActive} />
                <div style={{ width: 1, height: 20, backgroundColor: `${BORDER}80`, margin: '0 6px' }} />
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    backgroundColor: PRIMARY, color: PRIMARY_FG, fontWeight: 700,
                    padding: '9px 18px', borderRadius: 14,
                    fontSize: 12, fontFamily: FONT_FAMILY,
                    boxShadow: `0 4px 12px ${PRIMARY}44`,
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Capture
                </div>
                <div style={{ width: 1, height: 20, backgroundColor: `${BORDER}80`, margin: '0 6px' }} />
                <DockBtn icon="filter" active={filterDockActive} />
                <DockBtn icon="graph" />
            </div>

            {searchOpen && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 30,
                    backgroundColor: `rgba(0,0,0,${0.15 * searchEntrance})`,
                    pointerEvents: 'none',
                }} />
            )}
        </AbsoluteFill>
    );
};

const DockBtn: React.FC<{ icon: string; active?: boolean }> = ({ icon, active = false }) => {
    const col = active ? PRIMARY_FG : MUTED_FG;
    const bg = active ? PRIMARY : 'transparent';
    const icons: Record<string, JSX.Element> = {
        home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
        filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /></svg>,
        graph: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2"><rect width="6" height="6" x="1" y="1" rx="1" /><rect width="6" height="6" x="17" y="1" rx="1" /><rect width="6" height="6" x="9" y="17" rx="1" /><path d="M7 4h10" /><path d="M12 7v10" /></svg>,
    };
    return (
        <div style={{ width: 36, height: 36, borderRadius: 14, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? 'inset 0 1px 2px rgba(0,0,0,0.2)' : 'none' }}>
            {icons[icon]}
        </div>
    );
};
