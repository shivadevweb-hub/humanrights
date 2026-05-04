import { motion } from "motion/react";
import { ArrowRight, Shield, Scale, Globe, Users, FileSearch, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import HeaderBanner from "../components/HeaderBanner";
import { dataService } from "../services/dataService";
import { Service } from "../types";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const iconMap = {
  FileSearch: <FileSearch className="h-10 w-10 text-accent" />,
  ShieldAlert: <ShieldAlert className="h-10 w-10 text-accent" />,
  Image: <ImageIcon className="h-10 w-10 text-accent" />,
  Shield: <Shield className="h-10 w-10 text-accent" />,
  Scale: <Scale className="h-10 w-10 text-accent" />,
  Globe: <Globe className="h-10 w-10 text-accent" />
};

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const snap = await getDocs(collection(db, "services"));
      if (snap.empty) {
        // Fallback to dataService if empty (initial seed)
        setServices(dataService.getServices());
      } else {
        setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      }
    } catch (err) {
      console.error("Home Fetch Services Error:", err);
      setServices(dataService.getServices());
    }
  };

  return (
    <div className="flex flex-col overflow-hidden bg-bg">
      <HeaderBanner />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-accent),transparent_50%)] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/10 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent">Empowering Global Justice 2026</span>
            </div>
            <h1 className="text-4xl md:text-8xl font-display font-bold leading-[0.9] mb-8 tracking-tighter">
              DEFENDING <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-ink to-accent">HUMAN RIGHTS</span> <br/>
              WITH AI PRECISION.
            </h1>
            <p className="text-lg text-muted mb-10 max-w-lg leading-relaxed font-medium">
              IHRF Federation leverages advanced artificial intelligence to analyze violations, provide legal guidance, and advocate for justice worldwide.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/services"
                className="bg-accent text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 flex items-center gap-3 shadow-lg shadow-accent/20"
              >
                Analyze My Case <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/gallery"
                className="bg-surface border border-border text-ink px-8 py-4 rounded-full font-bold transition-all hover:bg-black/5 dark:hover:bg-white/5"
              >
                View Impact
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] group-hover:bg-accent/40 transition-all duration-700" />
              <div className="relative glass p-6 sm:p-12 rounded-full aspect-square flex items-center justify-center border border-border shadow-2xl overflow-hidden bg-surface/40">
                <Logo className="w-[180px] h-[180px] sm:w-[320px] sm:h-[320px] transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative bg-surface/20">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl mb-6">OUR SERVICES</h2>
              <p className="text-muted text-lg font-medium">
                We combine decades of advocacy experience with 2026's most powerful AI models to secure rights for every individual.
              </p>
            </div>
            <Link to="/services" className="text-accent font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
              Explore All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card group"
              >
                <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl group-hover:bg-accent/10 transition-colors">
                  {iconMap[service.icon as keyof typeof iconMap] || <Shield className="h-10 w-10 text-accent" />}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors uppercase tracking-tight">{service.title}</h3>
                <p className="text-muted leading-relaxed font-medium">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="bg-gradient-to-br from-accent/5 to-surface border border-border rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 text-center relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl mb-8 tracking-tighter text-ink">READY TO DEFEND <br/>YOUR RIGHTS?</h2>
              <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                Join thousands of individuals using IHRF Federation to secure a more just future.
              </p>
              <Link
                to="/services"
                className="bg-accent text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-lg transition-all hover:scale-110 inline-flex items-center gap-3 shadow-xl shadow-accent/20"
              >
                Submit A Complaint <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

