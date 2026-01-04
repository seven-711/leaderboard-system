import { useState } from "react";
import { useAppStore } from "../../services/store";
import { type Department } from "../../services/mockData";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import DragDropUpload from "../Common/DragDropUpload";
import { useToast } from "../Common/Toast";
import { cn } from "../../lib/utils";

export default function DepartmentForm() {
    const { departments, addDepartment, updateDepartment, deleteDepartment, uploadDepartmentLogo } = useAppStore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<Omit<Department, 'id'>>({
        name: '',
        logo: '',
        color: '#39ff14',
        wins: 0,
        losses: 0,
        points: 0,
        support_count: 0,
    });

    const resetForm = () => {
        setFormData({
            name: '',
            logo: '',
            color: '#39ff14',
            wins: 0,
            losses: 0,
            points: 0,
            support_count: 0,
        });
        setSelectedFile(null);
        setIsEditing(null);
        setIsAdding(false);
    };

    const handleEdit = (dept: Department) => {
        setIsEditing(dept.id);
        setFormData({
            name: dept.name,
            logo: dept.logo,
            color: dept.color,
            wins: dept.wins,
            losses: dept.losses,
            points: dept.points,
            support_count: dept.support_count,
        });
    };

    const handleSave = async () => {
        // Validation
        if (!formData.name) {
            toast("Department name is required", "error");
            return;
        }
        if (formData.wins < 0 || formData.losses < 0 || formData.points < 0) {
            toast("Wins, Losses, and Points cannot be negative", "error");
            return;
        }

        try {
            setUploading(true);
            let logoUrl = formData.logo;

            if (selectedFile) {
                // Upload file if selected
                logoUrl = await uploadDepartmentLogo(selectedFile);
            } else if (!logoUrl && !isEditing) {
                // Determine if we need a default logo logic or require one
                // allowing empty logo for now if user didn't select any
            }

            const dataToSave = { ...formData, logo: logoUrl };

            if (isEditing) {
                await updateDepartment(isEditing, dataToSave);
                toast("Department updated successfully", "success");
            } else {
                await addDepartment(dataToSave);
                toast("Department added successfully", "success");
            }
            resetForm();
        } catch (error) {
            console.error('Error saving department:', error);
            toast("Failed to save department", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(id);
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Departments</h2>

                {/* Add Department Button (Dynamic Island on Mobile) */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center md:static md:w-auto md:translate-x-0 md:z-0">
                    <button
                        onClick={() => setIsAdding(true)}
                        className={cn(
                            "flex items-center gap-2 font-bold transition-all duration-300",
                            // Mobile Styles (Dynamic Island)
                            "bg-black text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 hover:scale-105 active:scale-95",
                            // Desktop Styles (Original)
                            "md:bg-[var(--color-neon-green)] md:text-black md:px-4 md:py-2 md:rounded-lg md:shadow-none md:border-none md:hover:scale-100 md:hover:bg-[var(--color-neon-green-hover)]"
                        )}
                    >
                        <Plus className="w-5 h-5 md:text-black" />
                        Add Department
                    </button>
                </div>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || isEditing) && (
                <div className="glass-panel p-6 rounded-xl space-y-4">
                    <h3 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit Department' : 'Add New Department'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                                placeholder="Department name"
                            />
                        </div>

                        <div>
                            <DragDropUpload
                                value={formData.logo}
                                onFileSelect={setSelectedFile}
                                label="Department Logo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Color</label>
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Points</label>
                            <input
                                type="number"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Wins</label>
                            <input
                                type="number"
                                value={formData.wins}
                                onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Losses</label>
                            <input
                                type="number"
                                value={formData.losses}
                                onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[var(--color-neon-green)] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={uploading}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-green)] text-black rounded-lg font-bold hover:bg-[var(--color-neon-green-hover)] transition-colors",
                                uploading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Save className="w-4 h-4" />
                            {uploading ? 'Saving...' : 'Save'}
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

            {/* Departments List */}
            <div className="space-y-3">
                {departments.map((dept) => (
                    <div
                        key={dept.id}
                        className="glass-panel p-4 rounded-xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{dept.logo}</span>
                            <div>
                                <h4 className="font-bold text-white">{dept.name}</h4>
                                <p className="text-sm text-gray-400">
                                    {dept.wins}W - {dept.losses}L • {dept.points} pts
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(dept)}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <Pencil className="w-4 h-4 text-white" />
                            </button>
                            <button
                                onClick={() => handleDelete(dept.id)}
                                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}

                {departments.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No departments yet. Add one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
