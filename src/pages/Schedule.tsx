import { useAppStore } from "../services/store";
import { Calendar } from "lucide-react";


export default function Schedule() {
    const { games, departments } = useAppStore();


    const sortedGames = [...games].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Group by date
    const groupedGames = sortedGames.reduce((acc, game) => {
        const date = new Date(game.startTime).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(game);
        return acc;
    }, {} as Record<string, typeof games>);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-[#FFD700]" />
                        Game Schedule
                    </h1>
                    <p className="text-gray-400">Upcoming matches and results</p>
                </div>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedGames).map(([date, dayGames]) => (
                    <div key={date}>
                        <h2 className="text-lg font-bold text-[var(--color-neon-green)] mb-4 border-b border-white/10 pb-2 sticky top-20 bg-[var(--color-dark-base)]/90 backdrop-blur-md z-10 py-2">
                            {date}
                        </h2>
                        <div className="grid gap-4">
                            {dayGames.map(game => {
                                const deptA = departments.find(d => d.id === game.departmentA_id);
                                const deptB = departments.find(d => d.id === game.departmentB_id);

                                return (
                                    <div key={game.id} className="glass-panel p-4 rounded-xl flex items-center justify-between hover:border-[var(--color-neon-green)]/30 transition-all">
                                        <div className="flex items-center gap-4 w-1/3">
                                            <div className="text-gray-400 text-sm font-mono">
                                                {new Date(game.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-xs font-bold uppercase py-1 px-2 rounded bg-white/5 border border-white/10">
                                                {game.type}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-6 flex-1">
                                            <div className="flex items-center gap-2 text-right justify-end w-1/2">
                                                <span className="font-bold">{deptA?.name}</span>
                                                <span className="text-2xl">{deptA?.logo}</span>
                                            </div>

                                            <div className="font-mono font-bold text-gray-500">VS</div>

                                            <div className="flex items-center gap-2 text-left justify-start w-1/2">
                                                <span className="text-2xl">{deptB?.logo}</span>
                                                <span className="font-bold">{deptB?.name}</span>
                                            </div>
                                        </div>

                                        <div className="w-1/3 text-right">
                                            {game.status === 'completed' ? (
                                                <span className="font-bold text-gray-400">{game.scoreA} - {game.scoreB}</span>
                                            ) : game.status === 'live' ? (
                                                <span className="font-bold text-[var(--color-neon-green)] animate-pulse">LIVE</span>
                                            ) : (
                                                <button className="text-xs border border-white/20 hover:bg-white/10 px-3 py-1 rounded-full transition-colors">
                                                    Set Reminder
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
