import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface SupportButtonProps {
    currentCount: number;
    onSupport: () => void;
}

export default function SupportButton({ currentCount, onSupport }: SupportButtonProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        onSupport();
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500); // Reset animation
    };

    return (
        <button
            onClick={handleClick}
            className="group relative flex items-center gap-3 px-6 py-3 bg-[var(--color-neon-green)]/10 border border-[var(--color-neon-green)]/30 rounded-full hover:bg-[var(--color-neon-green)]/20 transition-all duration-300 active:scale-95"
        >
            <div className="relative">
                <Heart
                    className={cn(
                        "w-6 h-6 text-[var(--color-neon-green)] transition-all duration-300",
                        isAnimating ? "fill-[var(--color-neon-green)] scale-125" : "fill-transparent"
                    )}
                />
                {/* Floating hearts animation particles could go here */}
            </div>

            <div className="flex flex-col items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-neon-green)]">Support</span>
                <span className="text-white font-bold text-lg leading-none">{currentCount}</span>
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full ring-1 ring-[var(--color-neon-green)]/50 opacity-0 group-hover:animate-ping" />
        </button>
    );
}
