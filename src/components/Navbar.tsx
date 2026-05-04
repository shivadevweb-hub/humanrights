import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X, Sun, Moon, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import Logo from "./Logo";
import { useAuth } from "./AuthProvider";
import { signInWithGoogle, auth } from "../lib/firebase";

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Team", path: "/team" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="h-[80px] glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="relative shrink-0 flex items-center justify-center">
              <Logo size={48} variant={theme === "dark" ? "light" : "dark"} className="relative sm:w-14 sm:h-14 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <div className="text-xl sm:text-2xl font-display font-bold tracking-tighter uppercase whitespace-nowrap leading-none transition-colors duration-300">
                IHRF<span className="text-accent-gold ml-1">FED</span>
              </div>
              <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-accent-gold/80 leading-none mt-1">Federation 2026</div>
            </div>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xs font-bold uppercase tracking-widest transition-all duration-300",
                location.pathname === link.path 
                  ? "text-accent" 
                  : "text-muted hover:text-accent"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => auth.signOut()}
                className="text-xs font-bold uppercase tracking-widest text-muted hover:text-[#7D0000] transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full border border-accent/20 overflow-hidden shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-accent/10 flex items-center justify-center text-accent">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <LogIn className="h-4 w-4" /> Login
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-accent-gold" />
            ) : (
              <Moon className="h-5 w-5 text-slate-800" />
            )}
          </button>
        </div>

        {/* Mobile menu and theme toggle row */}
        <div className="lg:hidden flex items-center gap-2">
          {user ? (
            <div className="h-8 w-8 rounded-full border border-accent/20 overflow-hidden shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-accent/10 flex items-center justify-center text-accent">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="p-2 text-muted hover:text-accent"
            >
              <LogIn className="h-5 w-5" />
            </button>
          )}
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-accent-gold" />
            ) : (
              <Moon className="h-5 w-5 text-slate-800" />
            )}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-ink hover:opacity-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="lg:hidden bg-surface border-t border-border animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-ink"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <button
                onClick={() => auth.signOut()}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#7D0000] flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

