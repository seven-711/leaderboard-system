import { useState } from "react";
import { Users, Gamepad2, LayoutDashboard } from "lucide-react";
import DepartmentForm from "../components/Admin/DepartmentForm";
import GameForm from "../components/Admin/GameForm";
import { useAppStore } from "../services/store";

type Tab = 'departments' | 'games';

export default function Admin() {
    const [activeTab, setActiveTab] = useState<Tab>('departments');
    const { loading, departments, games } = useAppStore();

    const tabs = [
        { id: 'departments' as Tab, label: 'Departments', icon: Users, count: departments.length },
        { id: 'games' as Tab, label: 'Games', icon: Gamepad2, count: games.length },
    ];

    return (
        <div className="min-h-screen p-4 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[var(--color-neon-green)]/20 rounded-lg">
                        <LayoutDashboard className="w-6 h-6 text-[var(--color-neon-green)]" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Admin Panel</h1>
                </div>
                <p className="text-gray-400">Manage departments, games, and scores</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-[var(--color-neon-green)] text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-black/20' : 'bg-white/10'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-[var(--color-neon-green)] border-t-transparent rounded-full"></div>
                </div>
            )}

            {/* Tab Content */}
            {!loading && (
                <>
                    {activeTab === 'departments' && <DepartmentForm />}
                    {activeTab === 'games' && <GameForm />}
                </>
            )}
        </div>
    );
}
