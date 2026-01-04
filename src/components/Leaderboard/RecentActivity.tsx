
import { useAppStore } from "../../services/store";
import { CheckCircle2, Calendar } from "lucide-react";

export default function RecentActivity() {
    const { games, departments } = useAppStore();

    // specific activities concluded (completed games)
    const recentGames = games
        .filter(g => g.status === "completed")
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
        .slice(0, 5); // Show top 5 recent

    if (recentGames.length === 0) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-300 border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-neon-green)]" />
                Recent Activity
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentGames.map(game => {
                    const deptA = departments.find(d => d.id === game.departmentA_id);
                    const deptB = departments.find(d => d.id === game.departmentB_id);

                    const isWinnerA = game.scoreA > game.scoreB;
                    const isWinnerB = game.scoreB > game.scoreA;

                    return (
                        <div key={game.id} className="glass-panel p-4 rounded-xl flex flex-col gap-3 hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-center">
                                <div className="text-xs font-bold text-[var(--color-neon-green)] uppercase tracking-wider">{game.type}</div>
                                <div className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full uppercase">Concluded</div>
                            </div>

                            <div className="flex flex-col gap-2 my-1">
                                <div className={`flex justify-between items-center ${isWinnerA ? "text-white font-bold" : "text-gray-400"}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{deptA?.logo}</span>
                                        <span>{deptA?.name}</span>
                                    </div>
                                    <span className="text-lg">{game.scoreA}</span>
                                </div>
                                <div className={`flex justify-between items-center ${isWinnerB ? "text-white font-bold" : "text-gray-400"}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{deptB?.logo}</span>
                                        <span>{deptB?.name}</span>
                                    </div>
                                    <span className="text-lg">{game.scoreB}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-t border-white/5 text-xs text-gray-500 flex items-center gap-2 group-hover:text-gray-400 transition-colors">
                                <Calendar className="w-3 h-3" />
                                {new Date(game.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
