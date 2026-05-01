import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Send, FileText, CheckCircle2, AlertCircle, Info, HelpCircle, ArrowRight, Shield } from "lucide-react";
import { analyzeComplaint } from "../services/aiService";
import { AIResult } from "../types";
import { cn } from "../lib/utils";

export default function Services() {
  const [complaint, setComplaint] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);

  const handleAnalyze = async () => {
    if (!complaint.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setShowLetter(false);

    try {
      const data = await analyzeComplaint(complaint);
      setResult(data);
      
      await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: "Guest User",
          userEmail: "guest@example.com",
          originalText: complaint,
          aiResult: data
        })
      });
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateLetter = () => {
    if (!result) return "";
    return `To: [Relevant Authority/Organization]\nFrom: [Your Name]\nDate: ${new Date().toLocaleDateString()}\n\nSubject: Formal Complaint Regarding ${result.category}\n\nDear Sir/Madam,\n\nI am writing to formally submit a complaint regarding the following situation:\n\n${result.problem_summary}\n\nBased on my assessment, the following key issues have been identified:\n${result.key_issues.map(issue => `- ${issue}`).join("\n")}\n\nI believe this situation constitutes a violation of my rights, specifically:\n${result.rights_violated}\n\nLegal Context:\n${result.legal_explanation}\n\nI am seeking the following actions to be taken:\n${result.step_by_step_actions.map(action => `- ${action}`).join("\n")}\n\nI look forward to your prompt response regarding this matter.\n\nSincerely,\n[Your Name]`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] bg-[#F8FAFC]">
      {/* Left: Input Section */}
      <section className="w-full lg:w-[320px] bg-white border-r border-border p-8 flex flex-col gap-6 shrink-0">
        <div>
          <h1 className="text-3xl leading-[1.1] font-extrabold tracking-[-1.5px] mb-2">Justice starts with a report.</h1>
          <p className="text-sm text-muted leading-relaxed">
            Our AI Human Rights agents provide instant legal intelligence and guidance for those seeking protection.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <label className="text-[11px] font-extrabold uppercase opacity-60 tracking-wider">Your Incident Description</label>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Describe the situation in detail. Include dates, locations, and parties involved..."
            className="w-full h-48 lg:flex-1 p-4 rounded-xl border border-border bg-[#F1F5F9] text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !complaint.trim()}
          className="bg-bg text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-ink disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Analyze Case"
          )}
        </button>

        <div className="text-[11px] text-muted text-center">
          Secure and Confidential • GDPR Compliant
        </div>
      </section>

      {/* Right: Output Section */}
      <section className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold">Analysis Results</h2>
          {result && (
            <div className="bg-[#E0F2FE] text-[#0369A1] px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              Case ID: HR-{Math.floor(Math.random() * 9000) + 1000}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl"
            >
              <div className="h-16 w-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
                <Info className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">No Analysis Yet</h3>
              <p className="text-sm text-muted max-w-xs">
                Submit your incident description on the left to begin the AI-powered legal analysis.
              </p>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12"
            >
              <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
              <h3 className="text-lg font-bold mb-2">Agents are Working</h3>
              <p className="text-sm text-muted">
                Simulating multi-agent legal intelligence...
              </p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="agent-card">
                  <span className="agent-tag">Complaint Analyzer</span>
                  <h3>Classification</h3>
                  <p className="mb-2"><strong>Category:</strong> {result.category}</p>
                  <p>{result.problem_summary}</p>
                </div>

                <div className="agent-card">
                  <span className="agent-tag">Legal Intelligence</span>
                  <h3>Rights Identified</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.rights_violated.split(',').map((r, i) => (
                      <li key={i}>{r.trim()}</li>
                    ))}
                  </ul>
                  <p className="mt-3 pt-3 border-t border-border italic text-xs">
                    {result.legal_explanation}
                  </p>
                </div>

                <div className="agent-card">
                  <span className="agent-tag">Guidance Agent</span>
                  <h3>Immediate Actions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.step_by_step_actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="agent-card">
                  <span className="agent-tag">Follow-up Agent</span>
                  <h3>Clarifying Questions</h3>
                  <div className="space-y-2">
                    {result.follow_up_questions.map((q, i) => (
                      <p key={i} className="p-3 bg-neutral-50 rounded-lg text-xs italic">
                        {q}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-bg text-white p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <div className="font-bold text-lg mb-1">Ready to proceed?</div>
                  <div className="text-sm opacity-70">Download your structured complaint letter for legal representation.</div>
                </div>
                <button
                  onClick={() => setShowLetter(!showLetter)}
                  className="bg-accent text-bg px-6 py-3 rounded-lg font-extrabold text-sm uppercase tracking-wider hover:brightness-110 transition-all shrink-0"
                >
                  {showLetter ? "Hide Letter" : "Generate Letter"}
                </button>
              </div>

              {showLetter && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-10 rounded-2xl shadow-xl border border-border font-mono text-xs text-ink whitespace-pre-wrap leading-relaxed"
                >
                  {generateLetter()}
                  <div className="mt-8 pt-8 border-t border-border flex justify-end">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generateLetter());
                        alert("Letter copied to clipboard!");
                      }}
                      className="text-accent font-extrabold uppercase tracking-tighter hover:underline"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

