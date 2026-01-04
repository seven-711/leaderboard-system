import { useState } from "react";
import { useAppStore } from "../../services/store";
import { Plus, Trash2, Edit2, X, Save, Play, Square, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import { type Game } from "../../services/mockData";
import CustomSelect from "../../components/Common/CustomSelect";

export default function GameManagement() {
    const { games, departments, addGame, updateGame, deleteGame, loading } = useAppStore();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Omit<Game, 'id'>>({
        type: '',
        departmentA_id: '',
        departmentB_id: '',
        scoreA: 0,
        scoreB: 0,
        status: 'upcoming',
        startTime: new Date().toISOString(),
    });

    const gameTypes = [
        { value: 'Basketball', label: 'Basketball', icon: '🏀' },
        { value: 'Volleyball', label: 'Volleyball', icon: '🏐' },
        { value: 'Soccer', label: 'Soccer', icon: '⚽' },
        { value: 'Esports (Valorant)', label: 'Esports (Valorant)', icon: '🎮' },
        { value: 'Esports (Mobile Legends)', label: 'Esports (ML)', icon: '📱' },
        { value: 'Badminton', label: 'Badminton', icon: '🏸' },
        { value: 'Table Tennis', label: 'Table Tennis', icon: '🏓' },
    ];

    const resetForm = () => {
        setFormData({
            type: '',
            departmentA_id: departments[0]?.id || '',
            departmentB_id: departments[1]?.id || '',
            scoreA: 0,
            scoreB: 0,
            status: 'upcoming',
            startTime: new Date().toISOString(),
        });
        setIsEditing(null);
        setIsAdding(false);
    };

    const handleEdit = (game: Game) => {
        setIsEditing(game.id);
        setFormData({
            type: game.type,
            departmentA_id: game.departmentA_id,
            departmentB_id: game.departmentB_id,
            scoreA: game.scoreA,
            scoreB: game.scoreB,
            status: game.status,
            startTime: game.startTime,
        });
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateGame(isEditing, formData);
            } else {
                await addGame(formData);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving game:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this game?')) {
            try {
                await deleteGame(id);
            } catch (error) {
                console.error('Error deleting game:', error);
            }
        }
    };

    const handleStatusChange = async (id: string, status: Game['status']) => {
        await updateGame(id, { status });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--color-neon-green)] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8 animate-fade-in pb-32">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white/90">Game Management</h1>
                        <p className="text-lg text-gray-400 font-medium mt-2">Schedule and manage tournament matches</p>
                    </div>

                </div>

                {/* Add/Edit Form Modal */}
                {(isAdding || isEditing) && (
                    <div className="glass-panel p-6 rounded-xl space-y-4 overflow-visible relative z-50">
                        <h3 className="text-lg font-bold text-white">
                            {isEditing ? 'Edit Game' : 'Schedule New Game'}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Game Type</label>
                                <CustomSelect
                                    options={gameTypes}
                                    value={formData.type}
                                    onChange={(val) => setFormData({ ...formData, type: val })}
                                    placeholder="Select game type..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Team A</label>
                                <CustomSelect
                                    options={departments.map(dept => ({ value: dept.id, label: dept.name, icon: dept.logo }))}
                                    value={formData.departmentA_id}
                                    onChange={(val) => setFormData({ ...formData, departmentA_id: val })}
                                    placeholder="Select team..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Team B</label>
                                <CustomSelect
                                    options={departments.map(dept => ({ value: dept.id, label: dept.name, icon: dept.logo }))}
                                    value={formData.departmentB_id}
                                    onChange={(val) => setFormData({ ...formData, departmentB_id: val })}
                                    placeholder="Select team..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Status</label>
                                <CustomSelect
                                    options={[
                                        { value: 'upcoming', label: 'Upcoming', icon: '📅' },
                                        { value: 'live', label: 'Live', icon: '🔴' },
                                        { value: 'completed', label: 'Final', icon: '✅' },
                                    ]}
                                    value={formData.status}
                                    onChange={(val) => setFormData({ ...formData, status: val as Game['status'] })}
                                    placeholder="Select status..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime?.slice(0, 16) || ''}
                                    onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value).toISOString() })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                                />
                            </div>

                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Score A</label>
                                    <input
                                        type="number"
                                        value={formData.scoreA}
                                        onChange={(e) => setFormData({ ...formData, scoreA: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                                    />
                                </div>
                                <span className="text-2xl text-gray-400 pb-2">-</span>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Score B</label>
                                    <input
                                        type="number"
                                        value={formData.scoreB}
                                        onChange={(e) => setFormData({ ...formData, scoreB: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-green)] text-black rounded-lg font-bold hover:bg-[var(--color-neon-green-hover)] transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="glass-panel rounded-xl overflow-x-auto relative z-0">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-4 whitespace-nowrap">Date</th>
                                <th className="px-4 py-4 whitespace-nowrap">Type</th>
                                <th className="px-4 py-4 whitespace-nowrap">Matchup</th>
                                <th className="px-4 py-4 whitespace-nowrap text-center">Score</th>
                                <th className="px-4 py-4 whitespace-nowrap text-center">Status</th>
                                <th className="px-4 py-4 whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {games.map((game) => {
                                const deptA = departments.find(d => d.id === game.departmentA_id);
                                const deptB = departments.find(d => d.id === game.departmentB_id);
                                return (
                                    <tr key={game.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-300">
                                            {new Date(game.startTime).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold whitespace-nowrap">
                                            {game.type}
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg">{deptA?.logo}</span>
                                                <span className="text-white">{deptA?.name}</span>
                                                <span className="mx-2 text-gray-500 text-xs">vs</span>
                                                <span className="text-lg">{deptB?.logo}</span>
                                                <span className="text-white">{deptB?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className={cn(
                                                    "w-10 h-9 flex items-center justify-center rounded bg-black/40 font-mono font-bold text-lg",
                                                    game.status === 'live' ? "text-[var(--color-neon-green)] border border-[var(--color-neon-green)]/50 shadow-[0_0_10px_rgba(57,255,20,0.2)]" : "text-white border border-white/10"
                                                )}>
                                                    {game.scoreA}
                                                </div>
                                                <span className="text-gray-600 font-bold text-xs">-</span>
                                                <div className={cn(
                                                    "w-10 h-9 flex items-center justify-center rounded bg-black/40 font-mono font-bold text-lg",
                                                    game.status === 'live' ? "text-[var(--color-neon-green)] border border-[var(--color-neon-green)]/50 shadow-[0_0_10px_rgba(57,255,20,0.2)]" : "text-white border border-white/10"
                                                )}>
                                                    {game.scoreB}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => handleStatusChange(game.id, 'upcoming')}
                                                    className={cn(
                                                        "p-1.5 rounded transition-colors",
                                                        game.status === 'upcoming' ? 'bg-blue-500/30 text-blue-400' : 'hover:bg-white/10 text-gray-500'
                                                    )}
                                                    title="Upcoming"
                                                >
                                                    <Clock className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(game.id, 'live')}
                                                    className={cn(
                                                        "p-1.5 rounded transition-colors",
                                                        game.status === 'live' ? 'bg-red-500/30 text-red-400' : 'hover:bg-white/10 text-gray-500'
                                                    )}
                                                    title="Live"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(game.id, 'completed')}
                                                    className={cn(
                                                        "p-1.5 rounded transition-colors",
                                                        game.status === 'completed' ? 'bg-gray-500/30 text-gray-400' : 'hover:bg-white/10 text-gray-500'
                                                    )}
                                                    title="Final"
                                                >
                                                    <Square className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(game)}
                                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-400"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(game.id)}
                                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {games.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No games scheduled. Click "Schedule Game" to add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Floating Action Button - Dynamic Island Style */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="group flex items-center gap-3 pl-2 pr-6 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all hover:scale-105 hover:border-[var(--color-neon-green)]/30 hover:shadow-[0_8px_32px_rgba(57,255,20,0.15)]"
                >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-neon-green)] text-black shadow-lg shadow-[var(--color-neon-green)]/20 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-white text-xs tracking-wide group-hover:text-[var(--color-neon-green)] transition-colors">Schedule Game</span>
                </button>
            </div>
        </>
    );
}
