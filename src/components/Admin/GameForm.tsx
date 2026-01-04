import { useState } from "react";
import { useAppStore } from "../../services/store";
import { type Game } from "../../services/mockData";
import { Plus, Pencil, Trash2, X, Save, Play, Square, Clock } from "lucide-react";

export default function GameForm() {
    const { games, departments, addGame, updateGame, deleteGame } = useAppStore();
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

    const getDeptName = (id: string) => departments.find(d => d.id === id)?.name || 'Unknown';
    const getDeptLogo = (id: string) => departments.find(d => d.id === id)?.logo || '❓';

    const gameTypes = ['Basketball', 'Volleyball', 'Soccer', 'Esports (Valorant)', 'Esports (Mobile Legends)', 'Badminton', 'Table Tennis'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Games / Matches</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-green)] text-black rounded-lg font-bold hover:bg-[var(--color-neon-green-hover)] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Game
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || isEditing) && (
                <div className="glass-panel p-6 rounded-xl space-y-4">
                    <h3 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit Game' : 'Add New Game'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Game Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            >
                                <option value="">Select type...</option>
                                {gameTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Team A</label>
                            <select
                                value={formData.departmentA_id}
                                onChange={(e) => setFormData({ ...formData, departmentA_id: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            >
                                <option value="">Select team...</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.logo} {dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Team B</label>
                            <select
                                value={formData.departmentB_id}
                                onChange={(e) => setFormData({ ...formData, departmentB_id: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            >
                                <option value="">Select team...</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.logo} {dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Score A</label>
                            <input
                                type="number"
                                value={formData.scoreA}
                                onChange={(e) => setFormData({ ...formData, scoreA: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Score B</label>
                            <input
                                type="number"
                                value={formData.scoreB}
                                onChange={(e) => setFormData({ ...formData, scoreB: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as Game['status'] })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={formData.startTime.slice(0, 16)}
                                onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value).toISOString() })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            />
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

            {/* Games List */}
            <div className="space-y-3">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="glass-panel p-4 rounded-xl"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${game.status === 'live' ? 'bg-[var(--color-neon-green)]/20 text-[var(--color-neon-green)]' :
                                    game.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                                        'bg-blue-500/20 text-blue-400'
                                }`}>
                                {game.status}
                            </span>
                            <span className="text-sm text-gray-400">{game.type}</span>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{getDeptLogo(game.departmentA_id)}</span>
                                <span className="text-white font-medium">{getDeptName(game.departmentA_id)}</span>
                            </div>
                            <div className="text-xl font-bold text-white">
                                {game.scoreA} - {game.scoreB}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{getDeptName(game.departmentB_id)}</span>
                                <span className="text-2xl">{getDeptLogo(game.departmentB_id)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleStatusChange(game.id, 'upcoming')}
                                    className={`p-2 rounded-lg transition-colors ${game.status === 'upcoming' ? 'bg-blue-500/30' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Set Upcoming"
                                >
                                    <Clock className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                    onClick={() => handleStatusChange(game.id, 'live')}
                                    className={`p-2 rounded-lg transition-colors ${game.status === 'live' ? 'bg-[var(--color-neon-green)]/30' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Set Live"
                                >
                                    <Play className="w-4 h-4 text-[var(--color-neon-green)]" />
                                </button>
                                <button
                                    onClick={() => handleStatusChange(game.id, 'completed')}
                                    className={`p-2 rounded-lg transition-colors ${game.status === 'completed' ? 'bg-gray-500/30' : 'bg-white/10 hover:bg-white/20'}`}
                                    title="Set Completed"
                                >
                                    <Square className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(game)}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    <Pencil className="w-4 h-4 text-white" />
                                </button>
                                <button
                                    onClick={() => handleDelete(game.id)}
                                    className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {games.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No games scheduled. Add one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
