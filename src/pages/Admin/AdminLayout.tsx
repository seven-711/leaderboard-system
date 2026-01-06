import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Trophy, Settings, LogOut, Users, Building2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { StaggeredMenu } from "../../components/Admin/StaggeredMenu";
import { useAppStore } from "../../services/store";

export default function AdminLayout() {
    const { currentUser, logout } = useAppStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard, roles: ['admin', 'delegate'] },
        { name: "Departments", path: "/admin/departments", icon: Building2, roles: ['admin'] },
        { name: "Manage Games", path: "/admin/games", icon: Calendar, roles: ['admin', 'delegate'] },
        { name: "Score Entry", path: "/admin/scores", icon: Trophy, roles: ['admin', 'delegate'] },
        { name: "Users", path: "/admin/users", icon: Users, roles: ['admin'] },
        { name: "Settings", path: "/admin/settings", icon: Settings, roles: ['admin'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        currentUser && item.roles.includes(currentUser.role)
    );

    // Transform navItems for the StaggeredMenu
    const mobileMenuItems = filteredNavItems.map(item => ({
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

                <div className="px-6 py-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-neon-green)]/20 flex items-center justify-center text-[var(--color-neon-green)] font-bold">
                            {currentUser?.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold truncate">{currentUser?.username}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">{currentUser?.role}</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {filteredNavItems.map((item) => (
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
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-left">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Sign Out</span>
                    </button>
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
