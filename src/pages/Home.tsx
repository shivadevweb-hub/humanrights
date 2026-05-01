import { motion } from "motion/react";
import { ArrowRight, Shield, Scale, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-8xl font-extrabold tracking-[-0.05em] text-bg mb-6 leading-[0.9]">
                JUSTICE STARTS <br />
                WITH A <span className="text-accent">REPORT.</span>
              </h1>
              <p className="text-lg text-muted mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                Our AI Human Rights agents provide instant legal intelligence and guidance for those seeking protection and advocacy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/services"
                  className="w-full sm:w-auto bg-bg text-white px-10 py-5 rounded-lg font-extrabold text-sm uppercase tracking-widest hover:bg-ink transition-all flex items-center justify-center gap-2 group"
                >
                  Start Analysis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto border-2 border-bg text-bg px-10 py-5 rounded-lg font-extrabold text-sm uppercase tracking-widest hover:bg-bg hover:text-white transition-all"
                >
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bg rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#F8FAFC] border-y border-border">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tighter">WHY CHOOSE CIVISAI?</h2>
            <p className="text-muted max-w-2xl mx-auto font-medium">
              We combine legal expertise with cutting-edge artificial intelligence to provide accessible human rights support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Shield className="h-10 w-10 text-accent" />,
                title: "PRIVACY FIRST",
                desc: "Your data is encrypted and handled with the highest standards of confidentiality."
              },
              {
                icon: <Scale className="h-10 w-10 text-accent" />,
                title: "LEGAL INTELLIGENCE",
                desc: "Simulated multi-agent system provides comprehensive legal perspectives on your case."
              },
              {
                icon: <Globe className="h-10 w-10 text-accent" />,
                title: "GLOBAL STANDARDS",
                desc: "Analysis based on international human rights frameworks and local legal precedents."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-border"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-extrabold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

