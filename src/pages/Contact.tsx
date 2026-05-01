import { useState } from "react";
import * as React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send this to an API
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
              GET IN <br />
              <span className="text-accent">TOUCH.</span>
            </h1>
            <p className="text-muted text-lg font-medium mb-12 leading-relaxed max-w-md">
              Have questions about our platform or need specific assistance? Our team is here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#F1F5F9] rounded-2xl text-bg">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">Email Us</div>
                  <div className="text-xl font-extrabold tracking-tight">info@rightsassist.ai</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#F1F5F9] rounded-2xl text-bg">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">Call Hotline</div>
                  <div className="text-xl font-extrabold tracking-tight">+1 (555) 000-0000</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#F1F5F9] rounded-2xl text-bg">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">Visit Office</div>
                  <div className="text-xl font-extrabold tracking-tight">123 Justice Ave, Global City</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#F8FAFC] p-10 rounded-[40px] border border-border"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-20 w-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">MESSAGE SENT</h2>
                <p className="text-muted font-medium">We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-accent font-extrabold uppercase tracking-widest text-xs hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="Urgent Legal Assistance"
                    className="w-full px-6 py-4 rounded-2xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Your Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you today?"
                    className="w-full px-6 py-4 rounded-2xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none transition-all font-medium resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-bg text-white py-5 rounded-2xl font-extrabold uppercase tracking-widest hover:bg-ink transition-all shadow-xl shadow-bg/10"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

