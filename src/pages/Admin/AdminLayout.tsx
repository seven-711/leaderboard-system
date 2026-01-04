import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Trophy, Settings, LogOut, Users, Building2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { StaggeredMenu } from "../../components/Admin/StaggeredMenu";

export default function AdminLayout() {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Departments", path: "/admin/departments", icon: Building2 },
        { name: "Manage Games", path: "/admin/games", icon: Calendar },
        { name: "Score Entry", path: "/admin/scores", icon: Trophy },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    // Transform navItems for the StaggeredMenu
    const mobileMenuItems = navItems.map(item => ({
        label: item.name,
        link: item.path,
        // icon: item.icon // Icons removed for mobile view as requested
    }));

    return (
        <div className="h-screen flex bg-[var(--color-dark-base)] text-white overflow-hidden">
            {/* Mobile Menu */}
            <div className="md:hidden">
                <StaggeredMenu items={mobileMenuItems} />
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="hidden w-64 md:flex flex-col border-r border-white/10 bg-[var(--color-dark-surface)]">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <span className="font-bold text-xl tracking-wider uppercase text-[var(--color-neon-green)] text-glow">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path))
                                    ? "bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] border border-[var(--color-neon-green)]/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Exit to App</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <div className="p-4 pb-32 md:p-8 md:pb-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
