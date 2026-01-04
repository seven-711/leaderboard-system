import { useAppStore } from "../../services/store";
import PodiumCard from "./PodiumCard";
import LightPillar from "../Common/LightPillar";

export default function HeroPodium() {
    const { departments } = useAppStore();
    const sorted = [...departments].sort((a, b) => b.points - a.points);

    const rank1 = sorted[0];
    const rank2 = sorted[1];
    const rank3 = sorted[2];

    if (sorted.length < 3) return null;

    return (
        <div className="relative w-full min-h-[300px] sm:min-h-[400px] pt-0 pb-12 sm:pb-20 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#0c0c18]">

            {/* Light Pillar Background */}
            <LightPillar
                leftColor="#8B5CF6"
                centerColor="#FFD700"
                rightColor="#EC4899"
                intensity={0.8}
                rotationSpeed={0.2}
                glowAmount={0.003}
                pillarWidth={4.0}
                pillarHeight={0.3}
                noiseIntensity={0.3}
                pillarRotation={90}
            />

            {/* Starfield Background */}
            <div className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `
            radial-gradient(1px 1px at 30px 40px, white, transparent),
            radial-gradient(1.5px 1.5px at 80px 120px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 150px 60px, white, transparent),
            radial-gradient(1px 1px at 220px 180px, white, transparent),
            radial-gradient(1.5px 1.5px at 300px 90px, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 380px 140px, white, transparent),
            radial-gradient(1px 1px at 450px 50px, white, transparent),
            radial-gradient(1px 1px at 520px 170px, white, transparent),
            radial-gradient(1.5px 1.5px at 600px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 680px 130px, white, transparent)
          `,
                    backgroundSize: '750px 220px'
                }}
            />

            {/* Left Purple Nebula Swoop (Curtain Effect) */}
            <div
                className="absolute left-0 top-0 w-1/2 h-full pointer-events-none"
                style={{
                    background: `
            radial-gradient(ellipse 80% 60% at 0% 50%, rgba(139, 92, 246, 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 10% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)
          `
                }}
            />

            {/* Right Purple Nebula Swoop (Curtain Effect) */}
            <div
                className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
                style={{
                    background: `
            radial-gradient(ellipse 80% 60% at 100% 50%, rgba(139, 92, 246, 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 90% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)
          `
                }}
            />

            {/* Curved Horizon Arc at Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[250%] h-48 pointer-events-none">
                {/* Outer glow */}
                <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-full h-[200px] rounded-[50%] bg-gradient-to-t from-blue-500/20 via-purple-500/10 to-transparent blur-2xl" />
                {/* Secondary softer arc */}
                <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[90%] h-[160px] rounded-[50%] border-t border-blue-400/20" />
            </div>

            {/* Podium Cards Row */}
            <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-4 md:gap-8">
                <PodiumCard department={rank2} rank={2} />
                <PodiumCard department={rank1} rank={1} />
                <PodiumCard department={rank3} rank={3} />
            </div>
        </div>
    );
}
