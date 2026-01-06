import { Link, useLocation } from "react-router-dom";
import { Trophy, Calendar, Activity, Users, Menu, X } from "lucide-react"; // Icons
import { useState } from "react";
import { cn } from "../../lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: "Leaderboard", path: "/", icon: Trophy },
        { name: "Live Feed", path: "/live", icon: Activity },
        { name: "Games", path: "/games", icon: Calendar },
        { name: "Departments", path: "/departments", icon: Users },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-dark-base)] text-white font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass-panel border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Trophy className="h-8 w-8 text-[var(--color-neon-green)] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                            <span className="font-bold text-xl tracking-wider uppercase text-glow">UniLeague</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                                            location.pathname === item.path
                                                ? "text-[var(--color-neon-green)] bg-white/5 shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                                                : "text-gray-300 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                ))}
                                {/* Admin Link (Hidden or subtle) */}
                                <Link to="/login" className="text-gray-500 hover:text-gray-300 text-xs uppercase tracking-widest ml-4">
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden glass-panel border-b border-white/10">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium",
                                        location.pathname === item.path
                                            ? "text-[var(--color-neon-green)] bg-white/10"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                            <Link to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-3 text-gray-500 hover:text-gray-300 text-sm">
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-neon-green)]/5 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />

                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
