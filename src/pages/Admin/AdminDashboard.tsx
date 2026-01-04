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
                    <div key={stat.name} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">{stat.name}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-10 h-10 ${stat.color} opacity-80`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Games */}
            <div className="glass-panel p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {games.slice(0, 5).map(game => {
                        const deptA = departments.find(d => d.id === game.departmentA_id);
                        const deptB = departments.find(d => d.id === game.departmentB_id);
                        return (
                            <div key={game.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${game.status === 'live' ? 'bg-[var(--color-neon-green)] animate-pulse' :
                                        game.status === 'completed' ? 'bg-gray-500' : 'bg-blue-500'
                                        }`} />
                                    <span className="text-sm">
                                        {deptA?.logo} {deptA?.name} vs {deptB?.logo} {deptB?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-bold">{game.scoreA} - {game.scoreB}</span>
                                    <span className={`text-xs uppercase px-2 py-1 rounded ${game.status === 'live' ? 'bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)]' :
                                        game.status === 'completed' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {game.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {games.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No games yet. Schedule one to get started!</div>
                    )}
                </div>
            </div>
        </div>
    );
}
