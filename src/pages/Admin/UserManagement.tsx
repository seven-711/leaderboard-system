import { useState } from "react";
import { useAppStore, type User } from "../../services/store";
import { Plus, Shield, Trash2, Check } from "lucide-react";
import Modal from "../../components/Common/Modal";
import { cn } from "../../lib/utils";

export default function UserManagement() {
    const { users, addUser, deleteUser } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        username: '',
        role: 'delegate',
        assignedSports: []
    });

    const sportOptions = [
        { value: 'Basketball', label: 'Basketball' },
        { value: 'Volleyball', label: 'Volleyball' },
        { value: 'Soccer', label: 'Soccer' }, // Example sports
        { value: 'Esports', label: 'Esports' },
        { value: 'Badminton', label: 'Badminton' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username) return;
        await addUser(formData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            username: '',
            role: 'delegate',
            assignedSports: []
        });
        setIsAdding(false);
    };

    const toggleSport = (sport: string) => {
        setFormData(prev => {
            const exists = prev.assignedSports.includes(sport);
            return {
                ...prev,
                assignedSports: exists
                    ? prev.assignedSports.filter(s => s !== sport)
                    : [...prev.assignedSports, sport]
            };
        });
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-400">Manage admin accounts and sport delegates.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-[var(--color-neon-green)] text-black px-4 py-2 rounded-lg font-bold hover:bg-[var(--color-neon-green-hover)] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create User
                </button>
            </div>

            <div className="grid gap-4">
                {users.map(user => (
                    <div key={user.id} className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
                                user.role === 'admin' ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                            )}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{user.username}</h3>
                                    <span className={cn(
                                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                                        user.role === 'admin'
                                            ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                                            : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                    )}>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                                    {user.role === 'admin' ? (
                                        <span className="flex items-center gap-1 text-purple-300/70">
                                            <Shield className="w-3 h-3" /> Full Access
                                        </span>
                                    ) : (
                                        user.assignedSports.length > 0 ? (
                                            user.assignedSports.map(sport => (
                                                <span key={sport} className="bg-white/5 px-2 py-0.5 rounded text-gray-300">
                                                    {sport}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-600 italic">No sports assigned</span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                            {/* Only allow deleting if it's not the last admin, handling this logic simply here */}
                            {user.username !== 'admin' && (
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                    title="Delete User"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit User Modal */}
            <Modal
                isOpen={isAdding}
                onClose={resetForm}
                title="Create New User"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            placeholder="e.g. delegate_01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'delegate' })}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-lg border font-medium transition-all text-center",
                                    formData.role === 'delegate'
                                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                        : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                                )}
                            >
                                Delegate
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'admin', assignedSports: [] })}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-lg border font-medium transition-all text-center",
                                    formData.role === 'admin'
                                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                                        : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                                )}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Sport Selection (Only for Delegates) */}
                    {formData.role === 'delegate' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-400">Assigned Sports</label>
                            <div className="grid grid-cols-2 gap-2">
                                {sportOptions.map(sport => {
                                    const isSelected = formData.assignedSports.includes(sport.value);
                                    return (
                                        <button
                                            key={sport.value}
                                            type="button"
                                            onClick={() => toggleSport(sport.value)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all border",
                                                isSelected
                                                    ? "bg-[var(--color-neon-green)]/10 border-[var(--color-neon-green)] text-[var(--color-neon-green)]"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                            )}
                                        >
                                            {sport.label}
                                            {isSelected && <Check className="w-3 h-3" />}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-500">Select which sports this delegate can manage.</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[var(--color-neon-green)] text-black font-bold py-3 rounded-xl hover:bg-[var(--color-neon-green-hover)] transition-colors"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
