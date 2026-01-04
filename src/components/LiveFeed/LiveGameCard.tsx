import { motion } from "framer-motion";
import { CircleDot, Clock } from "lucide-react";
import { type Game } from "../../services/mockData";
import { useAppStore } from "../../services/store";

interface LiveGameCardProps {
    game: Game;
}

export default function LiveGameCard({ game }: LiveGameCardProps) {
    const { departments } = useAppStore();

    const deptA = departments.find(d => d.id === game.departmentA_id);
    const deptB = departments.find(d => d.id === game.departmentB_id);

    if (!deptA || !deptB) return null;

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-6 rounded-2xl border-[var(--color-neon-green)]/40 shadow-[0_0_20px_rgba(57,255,20,0.1)] relative overflow-hidden"
        >
            {/* Live Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)]/50 text-[var(--color-neon-green)] text-xs font-bold uppercase tracking-wider animate-pulse">
                <CircleDot className="w-3 h-3 fill-current" />
                Live
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:gap-8 py-4 text-center mt-6 sm:mt-0">
                {/* Teams and Score */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center text-2xl sm:text-4xl border border-white/10">
                            {deptA.logo}
                        </div>
                        <span className="font-bold text-xs sm:text-sm max-w-[80px] sm:max-w-[100px] leading-tight truncate">{deptA.name}</span>
                    </div>

                    {/* Score */}
                    <div className="font-mono text-3xl sm:text-5xl font-black text-white text-glow whitespace-nowrap">
                        {game.scoreA} : {game.scoreB}
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center text-2xl sm:text-4xl border border-white/10">
                            {deptB.logo}
                        </div>
                        <span className="font-bold text-xs sm:text-sm max-w-[80px] sm:max-w-[100px] leading-tight truncate">{deptB.name}</span>
                    </div>
                </div>

                {/* Game Info */}
                <div className="flex flex-col items-center gap-1 text-gray-400 text-xs sm:text-sm">
                    <span className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-[var(--color-neon-green)]">{game.type}</span>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                            {game.currentPeriod || 'Pre-game'}
                            {game.gameClock && ` - ${game.gameClock}`}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
