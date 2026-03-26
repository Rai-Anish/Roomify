import { Link } from "react-router";
import { Github, Twitter, Linkedin } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Home", to: "/" },
    { label: "Pricing", to: "/pricing" },
    { label: "Enterprise", to: "/enterprise" },
    { label: "My Projects", to: "/my-projects" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
  ],
};

const SOCIALS = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-xl font-serif font-bold text-zinc-900 tracking-tight">
                FloorPlan3D
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-6">
              AI-powered floor plan visualization. Transform 2D blueprints into photorealistic 3D renders in seconds.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:border-zinc-400 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-4">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-zinc-500 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 font-mono">
            © {new Date().getFullYear()} FloorPlan3D. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};