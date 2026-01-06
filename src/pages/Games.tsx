import { useState, useMemo } from "react";
import { useAppStore } from "../services/store";
import { Search, Filter, Trophy, Clock } from "lucide-react";
import { cn } from "../lib/utils";

export default function Games() {
    const { games, departments } = useAppStore();
    const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Extract unique game types for filter
    const gameTypes = useMemo(() => {
        const types = new Set(games.map(g => g.type));
        return ['all', ...Array.from(types)];
    }, [games]);

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            // Status Filter
            if (statusFilter !== 'all' && game.status !== statusFilter) return false;

            // Type Filter
            if (typeFilter !== 'all' && game.type !== typeFilter) return false;

            // Search (check dept names or sport type)
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const deptA = departments.find(d => d.id === game.departmentA_id)?.name.toLowerCase() || '';
                const deptB = departments.find(d => d.id === game.departmentB_id)?.name.toLowerCase() || '';
                const type = game.type.toLowerCase();
                if (!deptA.includes(term) && !deptB.includes(term) && !type.includes(term)) return false;
            }

            return true;
        }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    }, [games, statusFilter, typeFilter, searchTerm, departments]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            {/* Header */}
            <div className="relative glass-panel p-6 md:p-8 rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-green)]/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-4 md:gap-6 w-full md:w-auto">
                    <div className="p-3 md:p-4 bg-[var(--color-neon-green)]/10 rounded-2xl border border-[var(--color-neon-green)]/20 shadow-[0_0_20px_rgba(57,255,20,0.15)] shrink-0">
                        <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-neon-green)]" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">Games & Results</h1>
                        <p className="text-gray-400 font-medium mt-1 text-sm md:text-base">Explore complete match history</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative z-10 w-full md:w-72">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-[var(--color-neon-green)] focus:outline-none focus:ring-1 focus:ring-[var(--color-neon-green)] transition-all placeholder:text-gray-600 shadow-inner"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
                    {(['all', 'live', 'upcoming', 'completed'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-all",
                                statusFilter === status
                                    ? "bg-[var(--color-neon-green)] text-black shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {status === 'completed' ? 'Final' : status}
                        </button>
                    ))}
                </div>

                {/* Type Dropdown */}
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm appearance-none focus:border-[var(--color-neon-green)] focus:outline-none cursor-pointer"
                    >
                        {gameTypes.map(type => (
                            <option key={type} value={type} className="bg-gray-900">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Games Grid */}
            <div className="grid gap-4">
                {filteredGames.map(game => {
                    const deptA = departments.find(d => d.id === game.departmentA_id);
                    const deptB = departments.find(d => d.id === game.departmentB_id);
                    const isLive = game.status === 'live';

                    return (
                        <div
                            key={game.id}
                            className={cn(
                                "glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 group hover:bg-white/5 transition-all",
                                isLive && "border-[var(--color-neon-green)]/50 shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                            )}
                        >
                            {/* Date & Status */}
                            <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-32 gap-2 text-sm">
                                <span className="font-mono text-gray-400">
                                    {new Date(game.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                <div className={cn(
                                    "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
                                    isLive ? "bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)]" : "bg-white/10 text-gray-400"
                                )}>
                                    {isLive && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                    {game.status === 'completed' ? 'FINAL' : game.status}
                                </div>
                            </div>

                            {/* Matchup */}
                            <div className="flex-1 flex items-center justify-center gap-4 w-full">
                                {/* Team A */}
                                <div className="flex items-center gap-4 flex-1 justify-end text-right">
                                    <div className="hidden sm:block">
                                        <div className={cn(
                                            "font-bold text-lg leading-tight transition-colors",
                                            game.status === 'completed' && game.scoreA > game.scoreB ? "text-yellow-400 text-glow-gold" :
                                                game.status === 'completed' && game.scoreA < game.scoreB ? "text-gray-500" : "text-white"
                                        )}>
                                            {deptA?.name}
                                        </div>
                                        {game.status === 'completed' && game.scoreA === game.scoreB && (
                                            <div className="text-xs font-bold text-gray-400 mt-0.5">DRAW</div>
                                        )}
                                        {game.status === 'completed' && game.scoreA > game.scoreB && (
                                            <div className="text-xs font-bold text-yellow-500 mt-0.5 animate-pulse">WINNER</div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10">
                                            {deptA?.logo}
                                        </div>
                                        {game.status === 'completed' && game.scoreA > game.scoreB && (
                                            <div className="absolute -top-3 -left-2 text-xl drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] filter">
                                                👑
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Score / VS */}
                                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                                    <div className={cn(
                                        "text-2xl font-black font-mono whitespace-nowrap",
                                        isLive ? "text-[var(--color-neon-green)] text-glow" : "text-white"
                                    )}>
                                        {game.status === 'upcoming' ? (
                                            <span className="text-lg text-gray-500 font-sans">VS</span>
                                        ) : (
                                            `${game.scoreA} - ${game.scoreB}`
                                        )}
                                    </div>
                                    {game.status !== 'upcoming' && (game.currentPeriod || game.gameClock) && (
                                        <div className="text-xs font-mono text-[var(--color-neon-green)]">
                                            {game.currentPeriod} {game.gameClock && `• ${game.gameClock}`}
                                        </div>
                                    )}
                                </div>

                                {/* Team B */}
                                <div className="flex items-center gap-4 flex-1 justify-start text-left">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10">
                                            {deptB?.logo}
                                        </div>
                                        {game.status === 'completed' && game.scoreB > game.scoreA && (
                                            <div className="absolute -top-3 -right-2 text-xl drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] filter">
                                                👑
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className={cn(
                                            "font-bold text-lg leading-tight transition-colors",
                                            game.status === 'completed' && game.scoreB > game.scoreA ? "text-yellow-400 text-glow-gold" :
                                                game.status === 'completed' && game.scoreB < game.scoreA ? "text-gray-500" : "text-white"
                                        )}>
                                            {deptB?.name}
                                        </div>
                                        {game.status === 'completed' && game.scoreB === game.scoreA && (
                                            <div className="text-xs font-bold text-gray-400 mt-0.5">DRAW</div>
                                        )}
                                        {game.status === 'completed' && game.scoreB > game.scoreA && (
                                            <div className="text-xs font-bold text-yellow-500 mt-0.5 animate-pulse">WINNER</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2 text-xs text-gray-500">
                                <span className="uppercase tracking-widest font-bold">{game.type}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(game.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {filteredGames.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        No games found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
