import { Activity, Users, Trophy, Calendar } from "lucide-react";
import { useAppStore } from "../../services/store";

export default function AdminDashboard() {
    const { departments, games, loading } = useAppStore();

    const liveGames = games.filter(g => g.status === 'live').length;
    const upcomingGames = games.filter(g => g.status === 'upcoming').length;


    const stats = [
        { name: "Live Games", value: liveGames.toString(), icon: Activity, color: "text-[var(--color-neon-green)]" },
        { name: "Departments", value: departments.length.toString(), icon: Users, color: "text-blue-400" },
        { name: "Total Matches", value: games.length.toString(), icon: Trophy, color: "text-yellow-400" },
        { name: "Upcoming", value: upcomingGames.toString(), icon: Calendar, color: "text-purple-400" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--color-neon-green)] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-[var(--color-neon-green)]/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity ${stat.color.replace('text-', 'bg-')}`} />

                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.name}</p>
                                <p className="text-3xl font-black mt-2 tracking-tight text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Games */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-green)]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                        <p className="text-gray-400 text-sm mt-1">Latest matches and updates</p>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-wider text-[var(--color-neon-green)] hover:text-white transition-colors">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-500">
                                <th className="py-4 pl-4">Matchup</th>
                                <th className="py-4 text-center">Score</th>
                                <th className="py-4 text-center">Status</th>
                                <th className="py-4 pr-4 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {games.slice(0, 5).map(game => {
                                const deptA = departments.find(d => d.id === game.departmentA_id);
                                const deptB = departments.find(d => d.id === game.departmentB_id);
                                const isLive = game.status === 'live';

                                return (
                                    <tr key={game.id} className="group border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center -space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-lg z-10">
                                                        {deptA?.logo}
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-lg z-0">
                                                        {deptB?.logo}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white group-hover:text-[var(--color-neon-green)] transition-colors">
                                                        {deptA?.name} <span className="text-gray-500 text-xs font-medium mx-1">VS</span> {deptB?.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{game.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg font-mono font-bold ${isLive ? 'bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] border border-[var(--color-neon-green)]/20' : 'bg-black/20 text-gray-300'}`}>
                                                <span>{game.scoreA}</span>
                                                <span className="text-gray-600">:</span>
                                                <span>{game.scoreB}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isLive
                                                ? 'bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse'
                                                : game.status === 'completed'
                                                    ? 'bg-gray-500/10 text-gray-500'
                                                    : 'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                                {game.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 text-right text-gray-400 font-medium">
                                            {new Date(game.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {games.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-300">No Matches Found</h3>
                            <p className="text-gray-500 text-sm mt-1">Schedule a new game to see activity here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
