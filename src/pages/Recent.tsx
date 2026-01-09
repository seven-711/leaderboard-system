import RecentActivity from "../components/Leaderboard/RecentActivity";
import { Clock } from "lucide-react";

export default function Recent() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="relative glass-panel p-6 md:p-8 rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-green)]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="p-3 md:p-4 bg-[var(--color-neon-green)]/10 rounded-2xl border border-[var(--color-neon-green)]/20 shadow-[0_0_20px_rgba(57,255,20,0.15)] shrink-0">
                        <Clock className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-neon-green)]" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">Recent Activity</h1>
                        <p className="text-gray-400 font-medium mt-1 text-sm md:text-base">Latest updates and concluded matches</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <RecentActivity />
        </div>
    );
}
