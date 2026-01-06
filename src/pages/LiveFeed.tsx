import { useAppStore } from "../services/store";
import LiveGameCard from "../components/LiveFeed/LiveGameCard";
import { Activity, CalendarClock } from "lucide-react";

export default function LiveFeed() {
    const { games, departments } = useAppStore();

    const liveGames = games.filter(g => g.status === "live");
    const upcomingGames = games.filter(g => g.status === "upcoming").sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="relative glass-panel p-4 md:p-8 rounded-3xl border border-white/10 overflow-hidden flex flex-row items-center justify-between gap-4 md:gap-6">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-green)]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-4 md:gap-6">
                    <div className="p-3 md:p-4 bg-[var(--color-neon-green)]/10 rounded-2xl border border-[var(--color-neon-green)]/20 shadow-[0_0_20px_rgba(57,255,20,0.15)]">
                        <Activity className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-neon-green)]" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="hidden md:block text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">Live Feed</h1>
                        <p className="hidden md:block text-gray-400 font-medium mt-1">Real-time updates from the arena</p>
                    </div>
                </div>

                {/* Decorative Pulse Element */}
                <div className="relative z-10 flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[var(--color-neon-green)]/30">
                    <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon-green)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-full w-full bg-[var(--color-neon-green)]"></span>
                    </span>
                    <span className="text-[var(--color-neon-green)] font-bold text-xs md:text-sm tracking-wider uppercase whitespace-nowrap">Live Coverage</span>
                </div>
            </div>

            {/* Live Section */}
            <section>
                <h2 className="text-xl font-bold mb-6 text-[var(--color-neon-green)] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-neon-green)] animate-pulse" />
                    Happening Now
                </h2>

                {liveGames.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 max-w-2xl mx-auto">
                        {liveGames.map(game => (
                            <LiveGameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 glass-panel rounded-xl text-gray-500">
                        No games are currently live.
                    </div>
                )}
            </section>

            {/* Upcoming Section */}
            <section>
                <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
                    <CalendarClock className="w-5 h-5" />
                    Coming Up Next
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingGames.map(game => {
                        const deptA = departments.find(d => d.id === game.departmentA_id);
                        const deptB = departments.find(d => d.id === game.departmentB_id);
                        return (
                            <div key={game.id} className="glass-panel p-4 rounded-xl flex flex-col gap-3 hover:bg-white/5 transition-colors">
                                <div className="text-xs font-bold text-[var(--color-neon-green)] uppercase">{game.type}</div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{deptA?.name}</span>
                                    <span className="text-gray-500 text-xs">vs</span>
                                    <span className="font-semibold text-right">{deptB?.name}</span>
                                </div>
                                <div className="mt-auto pt-3 border-t border-white/5 text-xs text-gray-400 flex items-center gap-2">
                                    <CalendarClock className="w-3 h-3" />
                                    {new Date(game.startTime).toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
