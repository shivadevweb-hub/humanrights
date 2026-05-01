import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Team", path: "/team" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="h-[72px] bg-bg border-b border-white/10 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-10 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-xl font-extrabold tracking-tighter uppercase">
              CIVIS<span className="text-accent">AI</span>
            </div>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-opacity hover:opacity-100",
                location.pathname === link.path ? "opacity-100" : "opacity-60"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white opacity-80 hover:opacity-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-bg border-t border-white/10 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

