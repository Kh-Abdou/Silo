import { Composition, registerRoot } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import { SiloVideo } from './SiloVideo';
import './style.css';

const { fontFamily } = loadFont('normal', {
    weights: ['400', '600', '700'],
    subsets: ['latin'],
});

export const FONT_FAMILY = fontFamily;

// 6 scenes, 5 fade transitions of 15 frames each
// Scene durations: 90 + 210 + 240 + 240 + 150 + 120 = 1050
// Minus transitions: 5 * 15 = 75
// Total: 1050 - 75 = 975 frames ≈ 32.5s
const TOTAL_FRAMES = 975;

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="Main"
                component={SiloVideo}
                durationInFrames={TOTAL_FRAMES}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};

registerRoot(RemotionRoot);
