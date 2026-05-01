import { Scale, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="flex flex-col">
      <footer className="bg-bg text-white/60 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl font-extrabold tracking-tighter uppercase text-white">
                  CIVIS<span className="text-accent">AI</span>
                </div>
              </div>
              <p className="text-sm max-w-md">
                Empowering individuals with AI-driven legal intelligence to protect and advocate for human rights globally.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
                <li><Link to="/team" className="hover:text-accent transition-colors">Our Team</Link></li>
                <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@rightsassist.ai</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 000-0000</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Status Bar */}
      <div className="h-12 bg-white border-t border-border flex items-center justify-between px-10 text-[10px] font-extrabold uppercase tracking-wider text-muted">
        <div className="flex items-center gap-4">
          <span>System Status: <span className="text-success">● Active</span></span>
          <span className="opacity-40">|</span>
          <span>Active Agents: 4</span>
          <span className="opacity-40">|</span>
          <span>Global Complaints Today: 142</span>
        </div>
        <div>© 2024 CivisAI Human Rights Platform</div>
      </div>
    </div>
  );
}

