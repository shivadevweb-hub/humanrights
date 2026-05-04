import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Search, 
  Trash2, 
  Eye, 
  Lock, 
  Users, 
  Calendar,
  Filter,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Edit2,
  Save,
  X,
  LogOut,
  Mail,
  Key
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Complaint, TeamMember, GalleryImage, Service } from "../types";
import { cn } from "../lib/utils";
import { useAuth } from "../components/AuthProvider";
import { signInWithGoogle, auth, handleFirestoreError, OperationType, db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import Logo from "../components/Logo";

type Tab = "dashboard" | "complaints" | "team" | "gallery" | "services";

const ADMIN_EMAIL = "shivadevweb@gmail.com";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [internalLoggedIn, setInternalLoggedIn] = useState(() => {
    return localStorage.getItem("civis_auth") === "true";
  });
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Data State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [editingTeam, setEditingTeam] = useState<Partial<TeamMember> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryImage> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  const testConnection = async () => {
    try {
      const q = query(collection(db, "complaints"), limit(1));
      await getDocs(q);
      setDbConnected(true);
    } catch (err) {
      console.error("DB Connection Failed:", err);
      setDbConnected(false);
    }
  };

  const isLoggedIn = internalLoggedIn && user?.email === ADMIN_EMAIL;

  useEffect(() => {
    testConnection();
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      // Load Complaints
      const qComplaints = query(collection(db, "complaints"), orderBy("createdAt", "desc"));
      const snapComplaints = await getDocs(qComplaints);
      setComplaints(snapComplaints.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));

      // Load Team
      const snapTeam = await getDocs(collection(db, "team"));
      setTeam(snapTeam.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));

      // Load Gallery
      const snapGallery = await getDocs(collection(db, "gallery"));
      setGallery(snapGallery.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));

      // Load Services
      const snapServices = await getDocs(collection(db, "services"));
      setServices(snapServices.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
    } catch (err) {
      console.error("Load Data Error:", err);
    }
  };

  const handleLoginSuccess = () => {
    setInternalLoggedIn(true);
    localStorage.setItem("civis_auth", "true");
  };

  const handleLogout = () => {
    setInternalLoggedIn(false);
    localStorage.removeItem("civis_auth");
    auth.signOut();
  };

  const handleDeleteComplaintLocal = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "complaints", id));
      setComplaints(complaints.filter(c => c.id !== id));
      notify("Complaint deleted successfully");
    } catch (err) {
      notify("Error deleting complaint", "error");
      handleFirestoreError(err, OperationType.DELETE, `complaints/${id}`);
    }
  };

  const handleDeleteTeamLocal = async (id: string) => {
    if (!confirm("Delete team member?")) return;
    try {
      await deleteDoc(doc(db, "team", id));
      setTeam(team.filter(m => m.id !== id));
      notify("Team member removed");
    } catch (err) {
      notify("Error deleting team member", "error");
      handleFirestoreError(err, OperationType.DELETE, `team/${id}`);
    }
  };

  const handleDeleteGalleryLocal = async (id: string) => {
    if (!confirm("Delete image?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setGallery(gallery.filter(img => img.id !== id));
      notify("Image removed from gallery");
    } catch (err) {
      notify("Error deleting image", "error");
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const handleDeleteServiceLocal = async (id: string) => {
    if (!confirm("Delete service?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      setServices(services.filter(s => s.id !== id));
      notify("Service deleted");
    } catch (err) {
      notify("Error deleting service", "error");
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  const handleSaveTeamLocal = async () => {
    if (!editingTeam) return;
    if (!auth.currentUser) {
      notify("Authentication lost. Please sign in again.", "error");
      return;
    }
    const id = editingTeam.id || crypto.randomUUID();
    const path = `team/${id}`;
    try {
      await setDoc(doc(db, "team", id), {
        ...editingTeam,
        id,
        updatedAt: serverTimestamp()
      });
      await loadData();
      setEditingTeam(null);
      notify("Team member saved successfully");
    } catch (err) {
      notify("Error saving team member", "error");
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleSaveGalleryLocal = async () => {
    if (!editingGallery) return;
    if (!auth.currentUser) {
      notify("Authentication lost. Please sign in again.", "error");
      return;
    }
    const id = editingGallery.id || crypto.randomUUID();
    const path = `gallery/${id}`;
    try {
      await setDoc(doc(db, "gallery", id), {
        ...editingGallery,
        id,
        updatedAt: serverTimestamp()
      });
      await loadData();
      setEditingGallery(null);
      notify("Gallery item saved successfully");
    } catch (err) {
      notify("Error saving gallery item", "error");
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleSaveServiceLocal = async () => {
    if (!editingService) return;
    if (!auth.currentUser) {
      notify("Authentication lost. Please sign in again.", "error");
      return;
    }
    const id = editingService.id || crypto.randomUUID();
    const path = `services/${id}`;
    try {
      await setDoc(doc(db, "services", id), {
        ...editingService,
        id,
        updatedAt: serverTimestamp()
      });
      await loadData();
      setEditingService(null);
      notify("Service updated successfully");
    } catch (err) {
      notify("Error saving service", "error");
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.aiResult.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "All" || c.aiResult.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(complaints.map(c => c.aiResult.category)));
  
  const chartData = categories.length > 0 ? categories.map(cat => ({
    name: cat,
    count: complaints.filter(c => c.aiResult.category === cat).length
  })) : [{ name: "No Complaints", count: 0 }];

  const COLORS = ["#38BDF8", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Securing System...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl border border-border w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="h-20 w-20 bg-white p-2 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Logo size={60} variant="dark" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter mb-1 uppercase text-bg">Admin Gateway</h1>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.3em]">Identity Verification Required</p>
          </div>
          
          <div className="space-y-6">
            {!user ? (
              <button
                onClick={() => signInWithGoogle()}
                className="w-full flex items-center justify-center gap-3 bg-bg text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-ink transition-all shadow-xl shadow-bg/20"
              >
                Sign in with Google
              </button>
            ) : user.email !== ADMIN_EMAIL ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                  Access Denied: Your account ({user.email}) does not have administrative privileges.
                </p>
                <button 
                  onClick={() => auth.signOut()}
                  className="w-full mt-4 text-[10px] font-black uppercase text-accent hover:underline"
                >
                  Switch Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4">
                  <img src={user.photoURL || ""} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-xs font-black uppercase text-bg">Verified Admin</p>
                    <p className="text-[10px] font-bold text-muted">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLoginSuccess}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-xl shadow-accent/20"
                >
                  Enter Command Center
                </button>
              </div>
            )}
            
            <p className="text-[9px] text-center text-muted font-bold uppercase tracking-widest opacity-40 pt-4">
              Authorized Personnel Only • IP Logged
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#E4E3E0] font-sans text-[#141414]">
      {/* Sidebar - Technical Grid Style */}
      <aside className="w-72 bg-[#141414] border-r border-[#141414] hidden lg:flex flex-col text-[#E4E3E0] shadow-2xl shrink-0">
        <div className="p-8 border-b border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Logo size={48} variant="light" />
            <div>
              <div className="text-2xl font-black tracking-tighter uppercase leading-none">
                IHRF<span className="text-accent">FED</span>
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Command & Control</div>
            </div>
          </div>
            <div className="flex items-center gap-2 px-1">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                dbConnected === true ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : 
                dbConnected === false ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : 
                "bg-amber-500 animate-pulse"
              )} />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                {dbConnected === true ? "DB Link Active" : dbConnected === false ? "DB Offline" : "Linking..."}
              </p>
            </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-4 ml-2">Navigation</p>
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
            { id: "complaints", icon: FileText, label: "Case Audits" },
            { id: "team", icon: Users, label: "Agency Team" },
            { id: "gallery", icon: ImageIcon, label: "Asset Gallery" },
            { id: "services", icon: BarChart3, label: "Service Catalog" }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em]",
                activeTab === item.id 
                  ? "bg-[#E4E3E0] text-[#141414] shadow-xl" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-accent" : "text-current opacity-40")} /> 
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img src={user?.photoURL || ""} className="h-8 w-8 rounded-lg border border-white/10" alt="Admin" />
            <div className="overflow-hidden text-white">
              <p className="text-[10px] font-black uppercase truncate">{user?.displayName}</p>
              <p className="text-[9px] font-bold opacity-40 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white border-b border-[#141414]/10 flex items-center justify-between px-10 shrink-0">
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-[#141414]">
              {activeTab === "dashboard" && "Ops Overview"}
              {activeTab === "complaints" && "Incident Record System"}
              {activeTab === "team" && "Human Capital"}
              {activeTab === "gallery" && "Visual Assets"}
              {activeTab === "services" && "Programmatic Services"}
            </h1>
            <p className="text-[10px] font-black text-[#141414]/40 uppercase tracking-[0.2em] mt-1">
              Active node: {activeTab}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#141414]/40">System Time</p>
              <p className="text-xs font-black text-[#141414]">{new Date().toLocaleTimeString([], { hour12: false })} UTC</p>
            </div>
            <div className="h-10 w-[1px] bg-[#141414]/10" />
            <div className="bg-[#141414] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
              Sec_Auth: ACTIVE
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#E4E3E0]/50">
          <div className="max-w-7xl mx-auto space-y-10 pr-4">

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: "Case Load", value: complaints.length, icon: FileText, color: "blue" },
                  { label: "Active Agents", value: team.length, icon: Users, color: "indigo" },
                  { label: "Service Hooks", value: services.length, icon: BarChart3, color: "rose" },
                  { label: "Media Assets", value: gallery.length, icon: ImageIcon, color: "amber" }
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={stat.label}
                    className="bg-white p-8 rounded-[2rem] border border-[#141414]/5 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "p-3 rounded-2xl transition-colors",
                        stat.color === 'blue' && "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                        stat.color === 'indigo' && "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                        stat.color === 'rose' && "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
                        stat.color === 'amber' && "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
                      )}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="text-[10px] font-black opacity-20 uppercase tracking-widest">Type_0{i+1}</div>
                    </div>
                    <div className="text-4xl font-black tracking-tighter text-[#141414]">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#141414]/40 mt-2">{stat.label}</div>
                    <div className="w-full h-1 bg-[#141414]/5 mt-6 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-10 rounded-3xl border border-border shadow-sm">
                  <h3 className="text-lg font-extrabold mb-8 uppercase tracking-widest text-bg">Category Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                        />
                        <Bar dataKey="count" fill="#0F172A" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-border shadow-sm">
                  <h3 className="text-lg font-extrabold mb-8 uppercase tracking-widest text-bg">Volume by Category</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="count"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "complaints" && (
            <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-8 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                <h3 className="text-lg font-extrabold uppercase tracking-widest text-bg">Recent Complaints</h3>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none text-sm font-medium"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] text-sm font-bold outline-none"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F8FAFC] text-[#141414]/40 text-[10px] uppercase tracking-widest font-black">
                    <tr>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Summary</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141414]/5">
                    {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC] transition-all group">
                        <td className="px-8 py-5 text-sm font-bold text-[#141414]/60">
                          {new Date(c.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-[#E0F2FE] text-[#0369A1] rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                            {c.aiResult.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-[#141414] max-w-xs truncate">
                          {c.aiResult.problem_summary}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setSelectedComplaint(c)}
                              className="p-2 text-[#141414]/40 hover:text-accent transition-all"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteComplaintLocal(c.id)}
                              className="p-2 text-[#141414]/40 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-muted font-bold">No complaints found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setEditingTeam({})}
                  className="flex items-center gap-2 bg-bg text-white px-6 py-3 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-ink transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Member
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="bg-white p-6 rounded-3xl border border-[#141414]/5 shadow-sm flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="h-32 w-32 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-black tracking-tight uppercase text-[#141414] mb-1">{member.name}</h3>
                      <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-3">{member.role}</p>
                      <p className="text-xs text-[#141414]/60 font-medium line-clamp-3 mb-6 leading-relaxed">{member.bio || "No profile bio provided."}</p>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setEditingTeam(member)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] text-[#141414] rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-[#E2E8F0] transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit Record
                        </button>
                        <button 
                          onClick={() => handleDeleteTeamLocal(member.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Wipe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {team.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-[#141414]/10 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#141414]/40">No Agency Records Detected</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setEditingGallery({})}
                  className="flex items-center gap-2 bg-bg text-white px-6 py-3 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-ink transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Image
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gallery.map((img) => (
                  <div key={img.id} className="bg-white rounded-[2rem] border border-[#141414]/5 shadow-sm overflow-hidden group flex flex-col">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={img.url} 
                        alt={img.caption} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-black uppercase text-[#141414] truncate mb-1">{img.caption}</p>
                        <p className="text-[10px] text-[#141414]/50 font-bold line-clamp-2 mb-6">{img.description || "No description set"}</p>
                      </div>
                      <div className="flex items-center gap-3 pt-6 border-t border-[#141414]/5">
                        <button 
                          onClick={() => setEditingGallery(img)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F1F5F9] text-[#141414] rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#E2E8F0] transition-all"
                        >
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteGalleryLocal(img.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-[#141414]/10 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#141414]/40">Visual Database Empty</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button 
                  onClick={() => setEditingService({})}
                  className="flex items-center gap-2 bg-bg text-white px-6 py-3 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-ink transition-all"
                >
                  <Plus className="h-4 w-4" /> Add Service
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-6 rounded-3xl border border-[#141414]/5 shadow-sm flex gap-6">
                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black tracking-tight uppercase text-[#141414] mb-1">{service.title}</h3>
                      <p className="text-xs text-[#141414]/60 font-medium line-clamp-3 mb-6 leading-relaxed">{service.description || "No service description available."}</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setEditingService(service)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] text-[#141414] rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-[#E2E8F0] transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteServiceLocal(service.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-[#141414]/10 rounded-[2rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#141414]/40">Service Catalog Unpopulated</p>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-10 right-10 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm",
              notification.type === 'success' && "bg-bg text-white border border-accent/20",
              notification.type === 'error' && "bg-red-500 text-white",
              notification.type === 'info' && "bg-accent text-white"
            )}
          >
            {notification.type === 'success' && <CheckCircle2 className="h-5 w-5 text-accent" />}
            {notification.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1">Complaint Details</h2>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted">ID: {selectedComplaint.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)}
                  className="p-3 hover:bg-neutral-100 rounded-2xl transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-3">Original Text</h4>
                  <div className="p-6 bg-bg rounded-2xl text-sm font-medium text-ink leading-relaxed">
                    {selectedComplaint.originalText}
                  </div>
                </section>
                <section className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Category</h4>
                    <p className="font-bold text-bg">{selectedComplaint.aiResult.category}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Rights Violated</h4>
                    <p className="font-bold text-bg">{selectedComplaint.aiResult.rights_violated}</p>
                  </div>
                </section>
              </div>
              <div className="mt-10 pt-10 border-t border-border flex justify-end">
                <button 
                  onClick={() => setSelectedComplaint(null)}
                  className="bg-bg text-white px-8 py-3 rounded-xl font-extrabold uppercase tracking-widest hover:bg-ink transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Team Edit Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg"
          >
            <div className="p-10">
              <h2 className="text-2xl font-extrabold tracking-tight mb-8 uppercase">
                {editingTeam.id ? "Edit Member" : "Add Member"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Full Name</label>
                  <input 
                    value={editingTeam.name || ""} 
                    onChange={e => setEditingTeam({...editingTeam, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Role</label>
                  <input 
                    value={editingTeam.role || ""} 
                    onChange={e => setEditingTeam({...editingTeam, role: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Image URL</label>
                  <input 
                    value={editingTeam.image || ""} 
                    onChange={e => setEditingTeam({...editingTeam, image: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Bio</label>
                  <textarea 
                    rows={3}
                    value={editingTeam.bio || ""} 
                    onChange={e => setEditingTeam({...editingTeam, bio: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => {
                    setEditingTeam(null);
                    notify("Changes discarded", "info");
                  }}
                  className="flex-1 border border-border py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTeamLocal}
                  className="flex-1 bg-bg text-white py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-ink transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Gallery Edit Modal */}
      {editingGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg"
          >
            <div className="p-10">
              <h2 className="text-2xl font-extrabold tracking-tight mb-8 uppercase">
                {editingGallery.id ? "Edit Image" : "Add Image"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Image URL</label>
                  <input 
                    value={editingGallery.url || ""} 
                    onChange={e => setEditingGallery({...editingGallery, url: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Caption</label>
                  <input 
                    value={editingGallery.caption || ""} 
                    onChange={e => setEditingGallery({...editingGallery, caption: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Description</label>
                  <textarea 
                    rows={4}
                    value={editingGallery.description || ""} 
                    onChange={e => setEditingGallery({...editingGallery, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => {
                    setEditingGallery(null);
                    notify("Changes discarded", "info");
                  }}
                  className="flex-1 border border-border py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveGalleryLocal}
                  className="flex-1 bg-bg text-white py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-ink transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Service Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg"
          >
            <div className="p-10">
              <h2 className="text-2xl font-extrabold tracking-tight mb-8 uppercase">
                {editingService.id ? "Edit Service" : "Add Service"}
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Title</label>
                  <input 
                    value={editingService.title || ""} 
                    onChange={e => setEditingService({...editingService, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={editingService.description || ""} 
                    onChange={e => setEditingService({...editingService, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:ring-2 focus:ring-accent outline-none font-medium text-ink resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => {
                    setEditingService(null);
                    notify("Changes discarded", "info");
                  }}
                  className="flex-1 border border-border py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveServiceLocal}
                  className="flex-1 bg-bg text-white py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-ink transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
