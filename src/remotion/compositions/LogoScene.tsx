import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_FAMILY } from '../Root';

// ═══════════════════════════════════════════════════
// EXACT DARK THEME COLORS FROM globals.css
// ═══════════════════════════════════════════════════
// --background: 222 47% 3%    → #050a14
// --card: 222 47% 6%          → #0c1527
// --primary: 222 30% 50%      → #5976ad
// --primary-fg: 210 40% 98%   → #f5f8fc
// --border: 222 30% 12%       → #161e2e
// --muted: 222 20% 10%        → #151a22
// --muted-fg: 210 20% 60%     → #8a9bb0
// --secondary: 222 20% 10%    → #151a22
// --accent: 222 20% 12%       → #181f2c
// --destructive: 0 62.8% 30.6% → #7f1d1d
const BG = '#050a14';
const PRIMARY = '#5976ad';
const PRIMARY_FG = '#f5f8fc';
const MUTED_FG = '#8a9bb0';

export const LogoScene: React.FC<{ isIntro?: boolean }> = ({ isIntro = true }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 200 } });
    const textReveal = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: BG }}>
            <div style={{ transform: `scale(${entrance})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
                {/* Hourglass icon — matches the real app header logo */}
                <div style={{
                    width: 80, height: 80, backgroundColor: PRIMARY, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 16px 48px ${PRIMARY}44`,
                    transform: `scale(${entrance})`,
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={PRIMARY_FG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 22h14" /><path d="M5 2h14" />
                        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                    </svg>
                </div>

                <h1 style={{
                    fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em',
                    color: PRIMARY_FG, fontFamily: FONT_FAMILY, margin: 0,
                    opacity: textReveal, textTransform: 'uppercase' as const,
                }}>
                    SILO
                </h1>

                {!isIntro && (
                    <p style={{
                        fontSize: 16, color: MUTED_FG, fontFamily: FONT_FAMILY, margin: 0,
                        letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700,
                        opacity: interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' }),
                    }}>
                        Your Knowledge, Connected.
                    </p>
                )}

                {isIntro && (
                    <p style={{
                        fontSize: 14, color: MUTED_FG, fontFamily: FONT_FAMILY, margin: 0,
                        letterSpacing: '0.15em', textTransform: 'uppercase' as const, fontWeight: 600,
                        opacity: interpolate(frame, [40, 65], [0, 1], { extrapolateRight: 'clamp' }),
                    }}>
                        Capture · Sync · Export
                    </p>
                )}
            </div>
        </AbsoluteFill>
    );
};
