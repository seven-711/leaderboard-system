import { type Department } from "../../services/mockData";
import { cn } from "../../lib/utils";
import ElectricBorder from "../Common/ElectricBorder";

// Import rank icons
import goldIcon from "../../assets/ranks/gold.png";
import silverIcon from "../../assets/ranks/silver.png";
import bronzeIcon from "../../assets/ranks/bronze.png";

interface PodiumCardProps {
    department: Department;
    rank: 1 | 2 | 3;
}

export default function PodiumCard({ department, rank }: PodiumCardProps) {

    const cardStyles = {
        1: "from-[#D4A017] via-[#F4C430] to-[#AA8C00]", // Gold
        2: "from-[#6B5B95] via-[#8E7CC3] to-[#5A4D80]", // Purple/Violet
        3: "from-[#9B2D83] via-[#C74B99] to-[#7A2369]"  // Magenta/Purple
    };

    const electricColors = {
        1: "#FFD700", // Gold
        2: "#8E7CC3", // Purple
        3: "#C74B99"  // Magenta
    };

    const rankIcons = {
        1: goldIcon,
        2: silverIcon,
        3: bronzeIcon
    };

    const cardContent = (
        <div className={cn(
            "w-24 sm:w-36 md:w-44 rounded-b-2xl p-1 relative overflow-hidden",
            rank === 1 ? "h-40 sm:h-52 md:h-60" : "h-36 sm:h-48 md:h-56",
            `bg-gradient-to-b ${cardStyles[rank]}`
        )}>
            {/* Inner content */}
            <div className="w-full h-full rounded-b-xl bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center pt-2 sm:pt-4 pb-4 sm:pb-6 px-2 sm:px-3">

                {/* Rank Badge Icon */}
                <div className="relative flex flex-col items-center justify-center mb-1 sm:mb-2">
                    {/* Glow backdrop */}
                    <div className={cn(
                        "absolute w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full blur-xl opacity-60",
                        rank === 1 ? "bg-yellow-400" :
                            rank === 2 ? "bg-cyan-300" :
                                "bg-red-500"
                    )} />

                    {/* Floating Rank Icon */}
                    <img
                        src={rankIcons[rank]}
                        alt={`Rank ${rank}`}
                        className={cn(
                            "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 relative z-10 object-contain",
                            "animate-bounce",
                            rank === 1 ? "drop-shadow-[0_4px_20px_rgba(250,204,21,0.9)]" :
                                rank === 2 ? "drop-shadow-[0_4px_20px_rgba(147,197,253,0.8)]" :
                                    "drop-shadow-[0_4px_20px_rgba(245,158,11,0.9)]"
                        )}
                        style={{ animationDuration: '2s' }}
                    />
                </div>

                {/* Department Avatar/Logo */}
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-5xl sm:text-7xl md:text-8xl drop-shadow-2xl">{department.logo}</span>
                </div>
            </div>

            {/* Top fade-out overlay */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-[#0c0c18] to-transparent pointer-events-none" />
        </div>
    );

    return (
        <div className={cn(
            "relative flex flex-col items-center",
            rank === 1 ? "z-20 -mt-6 sm:-mt-10 scale-100 sm:scale-110" : "z-10"
        )}>
            <ElectricBorder color={electricColors[rank]} speed={1.5} chaos={0.08} borderRadius={16}>
                {cardContent}
            </ElectricBorder>
        </div>
    );
}
