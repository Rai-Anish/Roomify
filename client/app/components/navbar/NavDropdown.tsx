import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";

type Props = {
    user: { username: string; email: string; avatar: string | null };
    onLogout: () => void;
    open: boolean;
    setOpen: (v: boolean) => void;
};

const Avatar = ({ user }: { user: Props["user"] }) => {
    if (user.avatar) return (
        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-200" />
    );
    return (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-zinc-200">
            <span className="text-primary text-xs font-bold uppercase">{user.username?.charAt(0)}</span>
        </div>
    );
};

export const NavDropdown = ({ user, onLogout, open, setOpen }: Props) => {
    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const go = (path: string) => { navigate(path); setOpen(false); };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-all"
            >
                <Avatar user={user} />
                <span className="text-sm font-medium text-zinc-700 max-w-24 truncate">{user.username}</span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-zinc-100">
                        <p className="text-xs text-zinc-400 font-mono uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-semibold text-zinc-900 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                        {[
                            { icon: LayoutDashboard, label: "My Projects", path: "/my-projects" },
                            { icon: User, label: "Profile", path: "/profile" },
                        ].map(({ icon: Icon, label, path }) => (
                            <button
                                key={path}
                                onClick={() => go(path)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                            >
                                <Icon size={15} className="text-zinc-400" />
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="p-1.5 border-t border-zinc-100">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={15} />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};