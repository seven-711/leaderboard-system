import { useAppStore } from "../services/store";
import LiveGameCard from "../components/LiveFeed/LiveGameCard";
import { Activity, CalendarClock } from "lucide-react";

export default function LiveFeed() {
    const { games, departments } = useAppStore();

    const liveGames = games.filter(g => g.status === "live");
    const upcomingGames = games.filter(g => g.status === "upcoming").sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
                    <Activity className="w-8 h-8 text-[var(--color-neon-green)]" />
                    Live Feed
                </h1>
                <p className="text-gray-400">Real-time updates from the arena</p>
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
