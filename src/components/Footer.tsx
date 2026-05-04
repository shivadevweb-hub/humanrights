import { Scale, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <div className="flex flex-col transition-colors duration-300">
      <footer className="py-24 bg-surface border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.05),transparent_40%)]" />
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-8 group">
                <Logo size={56} className="transition-transform duration-500 group-hover:scale-110" />
                <div className="flex flex-col">
                  <div className="text-2xl font-display font-bold tracking-tighter uppercase text-ink leading-none">
                    IHRF<span className="text-accent ml-1">FEDERATION</span>
                  </div>
                  <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent/60 leading-none mt-2">Justice for all</div>
                </div>
              </div>
              <p className="text-muted max-w-sm text-lg leading-relaxed font-medium">
                A global collective dedicated to protecting human rights through the ethical application of artificial intelligence and legal advocacy.
              </p>
            </div>

            <div>
              <h3 className="text-ink font-display font-bold uppercase text-xs tracking-[0.3em] mb-8">Navigation</h3>
              <ul className="space-y-4">
                <li><Link to="/services" className="text-muted hover:text-accent transition-colors font-medium">Services & Case Analysis</Link></li>
                <li><Link to="/team" className="text-muted hover:text-accent transition-colors font-medium">Expert Advocacy Team</Link></li>
                <li><Link to="/gallery" className="text-muted hover:text-accent transition-colors font-medium">Case Impact Gallery</Link></li>
                <li><Link to="/contact" className="text-muted hover:text-accent transition-colors font-medium">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-ink font-display font-bold uppercase text-xs tracking-[0.3em] mb-8">Central Hub</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-muted font-medium"><Mail className="h-4 w-4 text-accent" /> justice@ihrf-federation.org</li>
                <li className="flex items-center gap-3 text-muted font-medium"><Phone className="h-4 w-4 text-accent" /> +1 (202) 555-0199</li>
                <li className="flex items-center gap-3 text-muted font-medium leading-relaxed font-medium"><MapPin className="h-4 w-4 text-accent shrink-0" /> UN Plaza, New York, NY 10017, USA</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 2026 Status Bar */}
      <div className="h-14 bg-surface dark:bg-[#0A0A0A] border-t border-border flex items-center justify-between px-10 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-muted overflow-x-auto whitespace-nowrap transition-colors duration-300">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            <span>AI CORE: ONLINE</span>
          </div>
          <span className="opacity-20">|</span>
          <span>SYSTEM LATENCY: 24MS</span>
          <span className="opacity-20">|</span>
          <span>PROTECTED USERS: 842K+</span>
          <span className="opacity-20">|</span>
          <span className="text-accent">ENCRYPTION: QUANTUM-READY</span>
        </div>
        <div className="ml-10">© 2026 IHRF FEDERATION. ALL RIGHTS RESERVED.</div>
      </div>
    </div>
  );
}

