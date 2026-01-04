import { useParams, Link } from "react-router-dom";
import { useAppStore } from "../services/store";
import SupportButton from "../components/Common/SupportButton";
import { ArrowLeft, Calendar, Trophy } from "lucide-react";
import RippleGrid from "../components/Common/RippleGrid";

export default function DepartmentProfile() {
    const { id } = useParams<{ id: string }>();
    const { departments, games, supportDepartment } = useAppStore();

    const department = departments.find((d) => d.id === id);

    if (!department) {
        return <div className="text-center text-red-500 mt-20">Department not found</div>;
    }

    const deptGames = games.filter(g => g.departmentA_id === id || g.departmentB_id === id)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        <div className="space-y-8 animate-fade-in">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leaderboard
            </Link>

            {/* Header Profile */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
                    <RippleGrid
                        mouseInteraction={false}
                        opacity={0.6}
                        gridThickness={0.8}
                        rippleIntensity={0.5}
                        gridSize={2}
                    />
                </div>
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-neon-green)]/10 to-transparent rounded-full blur-3xl pointer-events-none"
                />

                <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-7xl border-2 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] relative z-10">
                    {department.logo}
                </div>

                <div className="flex-1 text-center md:text-left relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2 text-glow">{department.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300 mb-6">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[#FFD700]" /> {department.points} Points
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <span className="text-green-400 font-bold">{department.wins}W</span> - <span className="text-red-400 font-bold">{department.losses}L</span>
                        </span>
                    </div>

                    <SupportButton
                        currentCount={department.support_count}
                        onSupport={() => supportDepartment(department.id)}
                    />
                </div>
            </div>

            {/* Match History */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-[var(--color-neon-green)]" />
                    Match History
                </h2>
                <div className="grid gap-4">
                    {deptGames.map((game) => {
                        const isA = game.departmentA_id === id;
                        // Find opponent
                        const opponentId = isA ? game.departmentB_id : game.departmentA_id;
                        const opponent = departments.find(d => d.id === opponentId);

                        // Result
                        const myScore = isA ? game.scoreA : game.scoreB;
                        const oppScore = isA ? game.scoreB : game.scoreA;
                        let result = "Upcoming";
                        let resultColor = "text-gray-400";

                        if (game.status === "completed") {
                            if (myScore > oppScore) { result = "WIN"; resultColor = "text-green-400"; }
                            else if (myScore < oppScore) { result = "LOSS"; resultColor = "text-red-400"; }
                            else { result = "DRAW"; resultColor = "text-gray-300"; }
                        } else if (game.status === "live") {
                            result = "LIVE"; resultColor = "text-[var(--color-neon-green)] animate-pulse";
                        }

                        return (
                            <div key={game.id} className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-white/5 transition-colors">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                    <div className="text-xs text-gray-500 shrink-0">
                                        {new Date(game.startTime).toLocaleDateString()}
                                    </div>
                                    <div className="font-semibold text-lg flex items-center gap-2 shrink-0">
                                        <span>{department.logo}</span> vs <span>{opponent?.logo}</span>
                                    </div>
                                    <div className="text-sm text-gray-300 hidden sm:block">
                                        {game.type}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                    <div className="font-mono text-xl font-bold">
                                        {game.status !== "upcoming" ? `${myScore} - ${oppScore}` : "VS"}
                                    </div>
                                    <div className={`font-bold text-right ${resultColor}`}>
                                        {result}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {deptGames.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No games found for this department.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
