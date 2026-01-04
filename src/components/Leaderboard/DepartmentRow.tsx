import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { type Department } from "../../services/mockData";

interface DepartmentRowProps {
    department: Department;
    rank: number;
}

export default function DepartmentRow({ department, rank }: DepartmentRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.05 }}
        >
            <Link
                to={`/department/${department.id}`}
                className="flex items-center justify-between p-4 rounded-xl glass-panel border-white/5 hover:border-[var(--color-neon-green)]/30 hover:bg-white/5 transition-all duration-200 group relative overflow-hidden"
            >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-green)]/0 to-[var(--color-neon-green)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-4 relative z-10">
                    {/* Rank */}
                    <span className="w-8 font-bold text-gray-500 group-hover:text-white transition-colors">
                        #{rank}
                    </span>

                    {/* Logo */}
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
                        {department.logo}
                    </div>

                    {/* Name & Record */}
                    <div>
                        <h4 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                            {department.name}
                        </h4>
                        <span className="text-xs text-gray-400">
                            {department.wins}W - {department.losses}L
                        </span>
                    </div>
                </div>

                {/* Points */}
                <div className="flex items-center gap-4 relative z-10">
                    <div className="text-right">
                        <div className="font-bold text-[var(--color-neon-green)]">{department.points}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Points</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[var(--color-neon-green)] transition-colors" />
                </div>
            </Link>
        </motion.div>
    );
}
