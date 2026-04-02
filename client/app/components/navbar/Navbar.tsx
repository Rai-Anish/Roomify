import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "~/store/authStore";
import { useLogout } from "~/hooks/useAuth";
import { NavDropdown } from "./NavDropdown";
import { NavMobile } from "./NavMobile";
import { Button } from "../ui/Button";

const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/enterprise", label: "Enterprise" },
];

const Navbar = () => {
    const navigate = useNavigate();
    const { user, _hasHydrated } = useAuthStore();
    const logout = useLogout();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isSignedIn = !!user;

    useEffect(() => {
        const handler = () => {
            if (window.scrollY > 8) {
                document.body.classList.add("scrolled");
            }
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        setMobileOpen(false);
        logout.mutate(undefined);
    };

    return (
    <>
        <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-background/90 backdrop-blur-sm border-b border-black/5">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex">
                    <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
                        <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className="text-xl font-serif font-bold text-zinc-900 tracking-tight">FloorPlan3D</span>
                    </div>

                    <div className="hidden md:flex items-center pl-6 gap-6">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-primary"
                                            : "text-zinc-500 hover:text-black"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        {isSignedIn && (
                            <NavLink
                                to="/my-projects"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-zinc-500 hover:text-black"}`
                                }
                            >
                                My Projects
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    {!_hasHydrated ? (
                        <div className="w-20 h-8 bg-zinc-100 animate-pulse rounded-lg" />
                    ) : isSignedIn && user ? (
                        <NavDropdown
                            user={user}
                            onLogout={handleLogout}
                            open={dropdownOpen}
                            setOpen={setDropdownOpen}
                        />
                    ) : (
                        <Button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 text-sm rounded-lg shadow-sm"
                        >
                            Sign In
                        </Button>
                    )}
                </div>

                {/* Mobile toggle */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-all"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>
        </header>
        <NavMobile
            open={mobileOpen}
            isSignedIn={isSignedIn}
            user={user ?? null}
            navLinks={NAV_LINKS}
            onLogout={handleLogout}
            onClose={() => setMobileOpen(false)}
        />
    </>
);
}

export default Navbar;