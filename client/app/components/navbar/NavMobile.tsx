import { NavLink, useNavigate } from "react-router";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "../ui/Button";

type Props = {
    open: boolean;
    isSignedIn: boolean;
    user: { username: string; email: string; avatar: string | null } | null;
    navLinks: { to: string; label: string }[];
    onLogout: () => void;
    onClose: () => void;
};

export const NavMobile = ({ open, isSignedIn, user, navLinks, onLogout, onClose }: Props) => {
    const navigate = useNavigate();
    const go = (path: string) => { navigate(path); onClose(); };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 md:hidden transition-opacity duration-300 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            {/* Drawer — slides down from top-16 (navbar height) */}
            <div
                className={`fixed top-16 left-0 right-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
                    open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
                <div className="bg-white border-b border-zinc-100 shadow-xl px-4 py-4 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-orange-50 text-primary"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {isSignedIn && (
                        <NavLink
                            to="/my-projects"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-orange-50 text-primary"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                                }`
                            }
                        >
                            My Projects
                        </NavLink>
                    )}

                    <div className="h-px bg-zinc-100 my-2" />

                    {isSignedIn && user ? (
                        <>
                            <div className="px-3 py-2">
                                <p className="text-xs text-zinc-400 font-mono uppercase tracking-wide">Signed in as</p>
                                <p className="text-sm font-semibold text-zinc-900 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={() => go("/my-projects")}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                            >
                                <LayoutDashboard size={15} />
                                My Projects
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={15} />
                                Sign out
                            </button>
                        </>
                    ) : (
                            <Button
                                onClick={() => go("/login")}
                                className="w-full px-4 py-2.5 text-sm font-medium"
                            >
                                Sign In
                            </Button>
                    )}
                </div>
            </div>
        </>
    );
};