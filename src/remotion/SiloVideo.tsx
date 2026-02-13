import { AbsoluteFill, Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { LogoScene } from './compositions/LogoScene';
import { CaptureScene } from './compositions/CaptureScene';
import { SyncScene } from './compositions/SyncScene';
import { SearchScene } from './compositions/SearchScene';
import { ExportScene } from './compositions/ExportScene';

const TRANSITION_DURATION = 15; // 0.5s fade between scenes

export const SiloVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#030508' }}>
            {/* Background Music - Global (Stable SoundHelix) */}
            <Audio
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
                volume={0.12}
                loop
            />

            {/* ════ SOUND EFFECTS (SFX) ════ */}

            {/* SFX: Success Chime (Delayed to match new modal timing) */}
            {/* Local paths are now served by Next.js with correct Content-Length headers */}
            <Sequence from={105 + 85} durationInFrames={60}>
                <Audio src={staticFile("audio/success.mp3")} volume={0.5} />
            </Sequence>



            {/* ════ TRANSITION SERIES (Visuals Only) ════ */}
            <TransitionSeries>
                {/* Scene 1: Intro Logo — 3s */}
                <TransitionSeries.Sequence durationInFrames={90}>
                    <LogoScene isIntro={true} />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />

                {/* Scene 2: Upload — 7s */}
                <TransitionSeries.Sequence durationInFrames={210}>
                    <CaptureScene />
                </TransitionSeries.Sequence>

                {/* NO TRANSITION HERE for seamless phone-to-laptop swipe */}

                {/* Scene 3: Multi-Device Sync — 6s */}
                <TransitionSeries.Sequence durationInFrames={180}>
                    <SyncScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />

                {/* Scene 4: Search & Filter — 8s (Lengthened for clarity) */}
                <TransitionSeries.Sequence durationInFrames={240}>
                    <SearchScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />

                {/* Scene 5: Export — 8s (Lengthened for readability) */}
                <TransitionSeries.Sequence durationInFrames={240}>
                    <ExportScene />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />

                {/* Scene 6: Outro — 6s (Lengthened for smooth ending) */}
                <TransitionSeries.Sequence durationInFrames={180}>
                    <LogoScene isIntro={false} />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
