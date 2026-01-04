import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { cn } from "../../lib/utils";
import { type Department } from "../../services/mockData";

interface RankCardProps {
    department: Department;
    rank: 1 | 2 | 3;
}

export default function RankCard({ department, rank }: RankCardProps) {
    const isFirst = rank === 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            className={cn(
                "relative flex flex-col items-center p-6 rounded-2xl glass-panel w-full max-w-[280px] hover:scale-105 transition-transform duration-300",
                isFirst ? "order-2 -mt-8 z-10 border-[var(--color-neon-green)]/50 shadow-[0_0_30px_rgba(57,255,20,0.15)]" : "order-1 sm:order-2 lg:order-none mt-4 border-white/10"
            )}
        >
            {/* Crown for 1st place */}
            {isFirst && (
                <div className="absolute -top-8 animate-bounce">
                    <Crown className="w-12 h-12 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]" fill="#FFD700" />
                </div>
            )}

            {/* Rank Badge */}
            <div className={cn(
                "absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-lg",
                rank === 1 ? "bg-[#FFD700] text-black" :
                    rank === 2 ? "bg-[#C0C0C0] text-black" : "bg-[#CD7F32] text-black"
            )}>
                #{rank}
            </div>

            {/* Logo */}
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-6xl mb-4 border border-white/10 shadow-inner">
                {department.logo}
            </div>

            {/* Name */}
            <h3 className="font-bold text-lg text-center mb-1 text-glow">{department.name}</h3>

            {/* Points */}
            <div className="text-2xl font-extrabold text-[var(--color-neon-green)]">
                {department.points} <span className="text-xs font-normal text-gray-400">pts</span>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 text-xs text-gray-400">
                <div><span className="text-green-400 font-bold">{department.wins}</span> W</div>
                <div><span className="text-red-400 font-bold">{department.losses}</span> L</div>
            </div>
        </motion.div>
    );
}
