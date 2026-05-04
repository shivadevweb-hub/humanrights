import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Send, FileText, CheckCircle2, AlertCircle, Info, HelpCircle, ArrowRight, Shield, History, Trash2 } from "lucide-react";
import { analyzeComplaint } from "../services/aiService";
import { AIResult } from "../types";
import { cn } from "../lib/utils";
import { useAuth } from "../components/AuthProvider";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

interface CaseRecord {
  id: string;
  content: string;
  category: string;
  analysis: AIResult;
  createdAt: any;
  status: string;
}

export default function Services() {
  const [complaint, setComplaint] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);
  const [history, setHistory] = useState<CaseRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "complaints"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const records: CaseRecord[] = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as CaseRecord);
      });
      setHistory(records);
    } catch (err) {
      console.error("Fetch History Error:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!complaint.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setShowLetter(false);

    try {
      const data = await analyzeComplaint(complaint);
      setResult(data);
      
      if (user) {
        const path = "complaints";
        try {
          await addDoc(collection(db, path), {
            userId: user.uid,
            content: complaint,
            category: data.category,
            analysis: data,
            status: "pending",
            createdAt: serverTimestamp()
          });
          fetchHistory();
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteRecord = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    const path = `complaints/${id}`;
    try {
      await deleteDoc(doc(db, "complaints", id));
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const generateLetter = () => {
    if (!result) return "";
    return `To: [Relevant Authority/Organization]\nFrom: [Your Name]\nDate: ${new Date().toLocaleDateString()}\n\nSubject: Formal Complaint Regarding ${result.category}\n\nDear Sir/Madam,\n\nI am writing to formally submit a complaint regarding the following situation:\n\n${result.problem_summary}\n\nBased on my assessment, the following key issues have been identified:\n${result.key_issues.map(issue => `- ${issue}`).join("\n")}\n\nI believe this situation constitutes a violation of my rights, specifically:\n${result.rights_violated}\n\nLegal Context:\n${result.legal_explanation}\n\nI am seeking the following actions to be taken:\n${result.step_by_step_actions.map(action => `- ${action}`).join("\n")}\n\nI look forward to your prompt response regarding this matter.\n\nSincerely,\n[Your Name]`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-bg transition-colors duration-300">
      {/* Left: Input Section */}
      <section className="w-full lg:w-[320px] bg-surface border-r border-border p-8 flex flex-col gap-6 shrink-0 transition-colors duration-300">
        <div>
          <h1 className="text-3xl leading-[1.1] font-extrabold tracking-[-1.5px] mb-2 text-ink">Justice starts with a report.</h1>
          <p className="text-sm text-muted leading-relaxed">
            Our AI Human Rights agents provide instant legal intelligence and guidance for those seeking protection.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <label className="text-[11px] font-extrabold uppercase opacity-60 tracking-wider text-ink">Your Incident Description</label>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Describe the situation in detail. Include dates, locations, and parties involved..."
            className="w-full h-48 lg:flex-1 p-4 rounded-xl border border-border bg-bg text-ink text-sm outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !complaint.trim()}
          className="bg-accent text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
        >
          {isAnalyzing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Analyze Case"
          )}
        </button>

        <div className="text-[11px] text-muted text-center font-bold">
          Secure and Confidential • 2026 AI Standard
        </div>

        {user && history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-muted hover:text-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="h-3 w-3" /> My Case History ({history.length})
              </div>
              <span>{showHistory ? "Hide" : "Show"}</span>
            </button>
            
            {showHistory && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2">
                {history.map((record) => (
                  <div key={record.id} className="p-3 bg-bg border border-border rounded-lg group relative">
                    <div className="text-[9px] font-bold text-muted uppercase mb-1">
                      {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                    </div>
                    <div className="text-[10px] font-extrabold text-ink line-clamp-1 mb-1">{record.category}</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setResult(record.analysis);
                          setComplaint(record.content);
                          setShowHistory(false);
                        }}
                        className="text-[9px] font-bold text-accent hover:underline"
                      >
                        Load
                      </button>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="text-[9px] font-bold text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Right: Output Section */}
      <section className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-ink">Analysis Results</h2>
          {result && (
            <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
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
              <div className="h-16 w-16 bg-surface rounded-2xl flex items-center justify-center mb-4 border border-border shadow-sm">
                <Info className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-ink">No Analysis Yet</h3>
              <p className="text-sm text-muted max-w-xs font-medium">
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
              <h3 className="text-lg font-bold mb-2 text-ink">Agents are Working</h3>
              <p className="text-sm text-muted font-medium">
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
                  <h3 className="text-ink">Classification</h3>
                  <p className="mb-2 text-muted"><strong>Category:</strong> {result.category}</p>
                  <p className="text-ink">{result.problem_summary}</p>
                </div>

                <div className="agent-card">
                  <span className="agent-tag">Legal Intelligence</span>
                  <h3 className="text-ink">Rights Identified</h3>
                  <ul className="list-disc pl-5 space-y-1 text-ink">
                    {result.rights_violated.split(',').map((r, i) => (
                      <li key={i}>{r.trim()}</li>
                    ))}
                  </ul>
                  <p className="mt-3 pt-3 border-t border-border italic text-xs text-muted">
                    {result.legal_explanation}
                  </p>
                </div>

                <div className="agent-card">
                  <span className="agent-tag">Guidance Agent</span>
                  <h3 className="text-ink">Immediate Actions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-ink">
                    {result.step_by_step_actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="agent-card">
                  <span className="agent-tag">Follow-up Agent</span>
                  <h3 className="text-ink">Clarifying Questions</h3>
                  <div className="space-y-2">
                    {result.follow_up_questions.map((q, i) => (
                      <p key={i} className="p-3 bg-bg border border-border rounded-lg text-xs italic text-ink">
                        {q}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-surface border border-border text-ink p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
                <div>
                  <div className="font-extrabold text-xl mb-1">Ready to proceed?</div>
                  <div className="text-sm text-muted font-medium">Download your structured complaint letter for legal representation.</div>
                </div>
                <button
                  onClick={() => setShowLetter(!showLetter)}
                  className="bg-accent text-white px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider hover:brightness-110 transition-all shrink-0 shadow-lg shadow-accent/20"
                >
                  {showLetter ? "Hide Letter" : "Generate Letter"}
                </button>
              </div>

              {showLetter && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface p-10 rounded-2xl shadow-xl border border-border font-mono text-xs text-ink whitespace-pre-wrap leading-relaxed transition-all duration-300"
                >
                  {generateLetter()}
                  <div className="mt-8 pt-8 border-t border-border flex justify-end">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generateLetter());
                      }}
                      className="text-accent font-extrabold uppercase tracking-widest hover:underline"
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

