import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface Option {
    value: string;
    label: string;
    icon?: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={cn("relative", isOpen && "z-[100]", className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-4 py-2.5 rounded-lg flex items-center justify-between gap-2",
                    "bg-white/5 border border-white/10 text-left",
                    "hover:bg-white/10 hover:border-white/20 transition-all",
                    "focus:outline-none focus:border-[var(--color-neon-green)] focus:ring-1 focus:ring-[var(--color-neon-green)]/30",
                    isOpen && "border-[var(--color-neon-green)] ring-1 ring-[var(--color-neon-green)]/30"
                )}
            >
                <span className={cn(
                    "flex items-center gap-2",
                    selectedOption ? "text-white" : "text-gray-500"
                )}>
                    {selectedOption?.icon && <span className="text-lg">{selectedOption.icon}</span>}
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 text-gray-400 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className={cn(
                    "absolute z-[100] w-full mt-2 py-1 rounded-lg",
                    "bg-[var(--color-dark-surface)] border border-white/10",
                    "shadow-xl shadow-black/40 backdrop-blur-xl",
                    "animate-in fade-in slide-in-from-top-2 duration-150",
                    "max-h-60 overflow-y-auto"
                )}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full px-4 py-2.5 flex items-center justify-between gap-2 text-left",
                                "hover:bg-[var(--color-neon-green)]/10 transition-colors",
                                value === option.value && "bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                {option.icon && <span className="text-lg">{option.icon}</span>}
                                <span className={cn(
                                    "text-sm",
                                    value === option.value ? "font-medium" : "text-gray-300"
                                )}>
                                    {option.label}
                                </span>
                            </span>
                            {value === option.value && (
                                <Check className="w-4 h-4 text-[var(--color-neon-green)]" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
