import { useAppStore } from "../services/store";
import { Link } from "react-router-dom";
import { Users, Trophy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Departments() {
    const { departments } = useAppStore();

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                    <Users className="w-8 h-8 text-[var(--color-neon-green)]" />
                </div>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Participating
                    </span>
                    <br className="sm:hidden" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-neon-green)] to-emerald-500 ml-2">
                        Departments
                    </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                    Meet the elite teams competing for glory in the ultimate showdown.
                </p>
            </div>

            {/* Department Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departments.map((dept, index) => (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            to={`/department/${dept.id}`}
                            className="block group relative overflow-hidden glass-panel p-4 sm:p-6 rounded-2xl border border-white/5 hover:border-[var(--color-neon-green)]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                        >
                            {/* Background Glow */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-neon-green)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-neon-green)]/10 transition-colors" />

                            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                                {/* Logo */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl sm:text-4xl border border-white/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    {dept.logo}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-[var(--color-neon-green)] transition-colors truncate">
                                        {dept.name}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
                                            <span>{dept.points} pts</span>
                                        </div>
                                        <div className="whitespace-nowrap">
                                            <span className="text-green-400 font-bold">{dept.wins}W</span>
                                            <span className="mx-1">-</span>
                                            <span className="text-red-400 font-bold">{dept.losses}L</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow Icon */}
                                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors shrink-0" />
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {departments.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No departments found.
                    </div>
                )}
            </div>
        </div>
    );
}
