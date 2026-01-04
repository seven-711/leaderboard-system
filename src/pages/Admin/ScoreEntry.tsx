import React, { useState, useEffect } from "react";
import { useAppStore } from "../../services/store";
import { PlayCircle, StopCircle, Hash } from "lucide-react";
import { type Game } from "../../services/mockData";
import { cn } from "../../lib/utils";

// Sub-component for individual game control to manage local state
function GameControlRow({ game }: { game: Game }) {
    const { departments, updateScore, updateGame } = useAppStore();
    const deptA = departments.find(d => d.id === game.departmentA_id);
    const deptB = departments.find(d => d.id === game.departmentB_id);

    // Local state for smooth typing
    const [scoreA, setScoreA] = useState(game.scoreA);
    const [scoreB, setScoreB] = useState(game.scoreB);
    const [period, setPeriod] = useState(game.currentPeriod || '');
    const [isDirty, setIsDirty] = useState(false);

    // Sync from props if they change externally (and simple conflict resolution: server wins if not dirty)
    useEffect(() => {
        if (!isDirty) {
            setScoreA(game.scoreA);
            setScoreB(game.scoreB);
            setPeriod(game.currentPeriod || '');
        }
    }, [game, isDirty]);

    const handleSave = async () => {
        setIsDirty(false);
        // We preserve the existing clock value (game.gameClock) if any, but don't expose it for editing
        await updateScore(game.id, scoreA, scoreB, period, game.gameClock);
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    const handlePreset = (value: string) => {
        setPeriod(value);
        setIsDirty(true);
        // Auto-save on preset click for convenience
        updateScore(game.id,
            scoreA,
            scoreB,
            value,
            game.gameClock
        );
    };

    const handleStatus = async (status: 'live' | 'completed') => {
        await updateGame(game.id, { status });
    };

    if (!deptA || !deptB) return null;

    // Determine presets based on game type
    const isBasketball = game.type.toLowerCase().includes('basketball');
    const isVolleyball = game.type.toLowerCase().includes('volleyball');

    const periodPresets = isBasketball
        ? ['Q1', 'Q2', 'Q3', 'Q4', 'OT']
        : isVolleyball
            ? ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5']
            : ['1st Half', '2nd Half', 'Final'];

    return (
        <div className={cn(
            "glass-panel p-4 md:p-6 rounded-xl flex flex-col lg:flex-row items-center justify-between gap-6 border-l-4 transition-all duration-300",
            game.status === 'live' ? "border-[var(--color-neon-green)] shadow-[0_0_20px_rgba(57,255,20,0.05)]" : "border-gray-700"
        )}>
            {/* Game Info Header (Mobile Centered / Desktop Left) */}
            <div className="flex flex-col items-center lg:items-start gap-2 min-w-[200px]">
                <div className={cn(
                    "text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-2",
                    game.status === 'live' ? "bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)] animate-pulse" : "bg-white/10 text-gray-400"
                )}>
                    {game.status === 'live' && <span className="w-2 h-2 rounded-full bg-current" />}
                    {game.status === 'completed' ? 'FINAL' : game.status}
                </div>
                <div className="text-center lg:text-left">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">{game.type}</div>
                    <div className="font-bold text-lg leading-tight">{deptA.name}</div>
                    <div className="text-xs text-gray-500 my-0.5">VS</div>
                    <div className="font-bold text-lg leading-tight">{deptB.name}</div>
                </div>
            </div>

            {/* Score Controls */}
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <div className="flex items-center justify-center gap-4 md:gap-8 bg-black/20 p-4 md:p-6 rounded-2xl border border-white/5 w-full">
                    {/* Team A Score */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{deptA.logo}</span>
                        </div>
                        <input
                            type="number"
                            value={scoreA}
                            onChange={(e) => { setScoreA(parseInt(e.target.value) || 0); setIsDirty(true); }}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="w-24 text-center bg-transparent text-5xl font-black text-white border-b-2 border-white/10 focus:border-[var(--color-neon-green)] focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="h-16 w-px bg-white/10" />

                    {/* Team B Score */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{deptB.logo}</span>
                        </div>
                        <input
                            type="number"
                            value={scoreB}
                            onChange={(e) => { setScoreB(parseInt(e.target.value) || 0); setIsDirty(true); }}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="w-24 text-center bg-transparent text-5xl font-black text-white border-b-2 border-white/10 focus:border-[var(--color-neon-green)] focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Period Controls */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <div className="relative">
                        <Hash className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={period}
                            onChange={(e) => { setPeriod(e.target.value); setIsDirty(true); }}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder="Period (e.g. Q1)"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:border-[var(--color-neon-green)] focus:outline-none text-center"
                        />
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {periodPresets.map(p => (
                            <button
                                key={p}
                                onClick={() => handlePreset(p)}
                                className={cn(
                                    "px-2 py-1 text-[10px] uppercase font-bold rounded border transition-colors",
                                    period === p
                                        ? "bg-[var(--color-neon-green)] text-black border-[var(--color-neon-green)]"
                                        : "bg-transparent text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Game Actions */}
            <div className="flex flex-col gap-3 lg:items-end min-w-[140px]">
                {game.status === 'upcoming' ? (
                    <button
                        onClick={() => handleStatus('live')}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-neon-green)] hover:bg-[var(--color-neon-green-hover)] text-black rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Start Game
                    </button>
                ) : (
                    <div className="space-y-3 w-full">
                        <div className="flex items-center justify-center gap-2 text-[var(--color-neon-green)] text-sm font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-current" />
                            Recording Live
                        </div>
                        <button
                            onClick={() => handleStatus('completed')}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold transition-colors"
                        >
                            <StopCircle className="w-5 h-5" />
                            End Game
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ScoreEntry() {
    const { games, loading } = useAppStore();

    // Only show active or upcoming games
    const activeGames = games.filter(g => g.status === 'live' || g.status === 'upcoming');

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--color-neon-green)] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white/90">Live Scoreboard</h1>
                    <p className="text-lg text-gray-400 font-medium mt-2">Manage scores and game status in real-time</p>
                </div>
                <div className="px-5 py-2.5 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 self-start md:self-auto hover:bg-white/10 transition-colors cursor-default group">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon-green)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-neon-green)]"></span>
                    </span>
                    <span className="text-gray-300 font-medium text-sm group-hover:text-white transition-colors">
                        <span className="text-[var(--color-neon-green)] font-mono font-bold text-lg mr-1.5">{activeGames.length}</span>
                        Active Games
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {activeGames.map(game => (
                    <GameControlRow key={game.id} game={game} />
                ))}
                {activeGames.length === 0 && (
                    <div className="text-center py-16 glass-panel rounded-2xl border-2 border-dashed border-white/10">
                        <div className="text-gray-500 text-lg">No active or upcoming games found.</div>
                        <p className="text-gray-600 text-sm mt-2">Schedule new games in the Request Management tab.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
