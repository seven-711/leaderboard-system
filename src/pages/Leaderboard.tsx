import { useState } from "react";
import { useAppStore } from "../services/store";
import DepartmentRow from "../components/Leaderboard/DepartmentRow";
import { Trophy } from "lucide-react";
import HeroPodium from "../components/Leaderboard/HeroPodium";
import RecentActivity from "../components/Leaderboard/RecentActivity";
import QRCode from "react-qr-code";

export default function Leaderboard() {
    const { departments } = useAppStore();
    const [timeFilter, setTimeFilter] = useState("1st Day");

    // Sort departments by points
    const sortedDepartments = [...departments].sort((a, b) => b.points - a.points);

    // Top 3 handled by HeroPodium, rest listed below
    const theRest = sortedDepartments.slice(3);

    return (
        <div className="space-y-12 animate-fade-in">
            <QRCode value={window.location.href} size={0} className="hidden" />

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

            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden mt-8">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon-green)]/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-4">
                    <div className="hidden md:block p-3 bg-[var(--color-neon-green)]/10 rounded-2xl border border-[var(--color-neon-green)]/20 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                        <Trophy className="w-8 h-8 text-[var(--color-neon-green)]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">Leaderboard</h1>
                        <p className="hidden md:block text-gray-400 text-sm font-medium">Department rankings and statistics</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 relative z-10">
                    {/* Embedded QR Code */}
                    <div className="relative group bg-white p-3 rounded-xl border-2 border-[var(--color-neon-green)] shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-transform hover:scale-105 cursor-pointer">
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 96, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={window.location.href}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--color-neon-green)] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg tracking-wider animate-pulse whitespace-nowrap">
                            SCAN TO SHARE
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-40 bg-black/90 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center border border-white/10 z-20 backdrop-blur-md shadow-xl">
                            Scan to invite others to The Zenith
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-t border-l border-white/10"></div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center p-1 sm:p-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm">
                        {["1st Day", "2nd Day", "3rd Day"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-base font-bold transition-all duration-300 ${timeFilter === filter
                                    ? "bg-[var(--color-neon-green)] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] scale-[1.02]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
