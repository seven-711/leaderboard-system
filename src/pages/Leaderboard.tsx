import { useState } from "react";
import { useAppStore } from "../services/store";
import DepartmentRow from "../components/Leaderboard/DepartmentRow";
import QRCodeModal from "../components/Common/QRCodeModal";
import { Share2 } from "lucide-react";
import HeroPodium from "../components/Leaderboard/HeroPodium";
import RecentActivity from "../components/Leaderboard/RecentActivity";

export default function Leaderboard() {
    const { departments } = useAppStore();
    const [timeFilter, setTimeFilter] = useState("1st Day");
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    // Sort departments by points
    const sortedDepartments = [...departments].sort((a, b) => b.points - a.points);

    // Top 3 handled by HeroPodium, rest listed below
    const theRest = sortedDepartments.slice(3);

    return (
        <div className="space-y-12 animate-fade-in">
            <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} url={window.location.href} />

            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Leaderboard</h1>
                    <p className="text-gray-400 text-sm">Department rankings and statistics</p>
                </div>

                <div className="flex gap-4">
                    {/* Share Button */}
                    <button
                        onClick={() => setIsQRModalOpen(true)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[var(--color-neon-green)]/20 hover:text-[var(--color-neon-green)] transition-colors"
                        title="Share via QR Code"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    {/* Filters */}
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
                        {["1st Day", "2nd Day", "3rd Day"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeFilter === filter
                                    ? "bg-[var(--color-neon-green)] text-black shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <HeroPodium />

            {/* Recent Activity Section */}
            <RecentActivity />

            {/* Full List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-300 border-b border-white/10 pb-2 mb-4">Ranking List</h2>
                <div className="grid gap-3">
                    {theRest.map((dept, index) => (
                        <DepartmentRow key={dept.id} department={dept} rank={index + 4} />
                    ))}
                </div>
            </div>
        </div>
    );
}
