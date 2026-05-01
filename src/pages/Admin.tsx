import { useState, useEffect } from "react";
import * as React from "react";
import { motion } from "motion/react";
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
  Image as ImageIcon,
  Plus,
  Edit2,
  Save,
  X
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
import { Complaint, TeamMember, GalleryImage } from "../types";
import { cn } from "../lib/utils";

type Tab = "dashboard" | "complaints" | "team" | "gallery";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // Data State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [editingTeam, setEditingTeam] = useState<Partial<TeamMember> | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryImage> | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchComplaints();
      fetchTeam();
      fetchGallery();
    }
  }, [isLoggedIn]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints");
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error("Failed to fetch team");
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setGallery(data);
    } catch (err) {
      console.error("Failed to fetch gallery");
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      setComplaints(complaints.filter(c => c.id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    try {
      await fetch(`/api/team/${id}`, { method: "DELETE" });
      setTeam(team.filter(m => m.id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      setGallery(gallery.filter(img => img.id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleSaveTeam = async () => {
    if (!editingTeam) return;
    const isNew = !editingTeam.id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/team" : `/api/team/${editingTeam.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTeam)
      });
      const saved = await res.json();
      if (isNew) {
        setTeam([...team, saved]);
      } else {
        setTeam(team.map(m => m.id === saved.id ? saved : m));
      }
      setEditingTeam(null);
    } catch (err) {
      console.error("Save failed");
    }
  };

  const handleSaveGallery = async () => {
    if (!editingGallery) return;
    const isNew = !editingGallery.id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/gallery" : `/api/gallery/${editingGallery.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGallery)
      });
      const saved = await res.json();
      if (isNew) {
        setGallery([...gallery, saved]);
      } else {
        setGallery(gallery.map(img => img.id === saved.id ? saved : img));
      }
      setEditingGallery(null);
    } catch (err) {
      console.error("Save failed");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid password");
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.aiResult.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "All" || c.aiResult.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(complaints.map(c => c.aiResult.category)));
  
  const chartData = categories.map(cat => ({
    name: cat,
    count: complaints.filter(c => c.aiResult.category === cat).length
  }));

  const COLORS = ["#38BDF8", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"];

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl border border-border w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-bg text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal</h1>
            <p className="text-muted text-sm font-medium">Please enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-4 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
            />
            <button
              type="submit"
              className="w-full bg-bg text-white py-4 rounded-xl font-extrabold uppercase tracking-widest hover:bg-ink transition-all"
            >
              Login
            </button>
          </form>
          <p className="text-center text-[10px] uppercase font-extrabold text-muted mt-8 tracking-widest">Demo password: admin123</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-bg border-r border-white/10 hidden lg:flex flex-col text-white">
        <div className="p-8 border-b border-white/10">
          <div className="text-xl font-extrabold tracking-tighter uppercase">
            CIVIS<span className="text-accent">AI</span>
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest opacity-40 mt-1">Admin Dashboard</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "dashboard" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("complaints")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "complaints" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <FileText className="h-5 w-5" /> Complaints
          </button>
          <button 
            onClick={() => setActiveTab("team")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "team" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Users className="h-5 w-5" /> Team
          </button>
          <button 
            onClick={() => setActiveTab("gallery")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "gallery" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <ImageIcon className="h-5 w-5" /> Gallery
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full text-left px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-bg uppercase">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "complaints" && "Complaint Management"}
                {activeTab === "team" && "Team Management"}
                {activeTab === "gallery" && "Gallery Management"}
              </h1>
              <p className="text-muted font-medium">Welcome back, Administrator</p>
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-white px-4 py-2 rounded-lg border border-border flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {new Date().toLocaleDateString()}
            </div>
          </header>

          {activeTab === "dashboard" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 text-bg rounded-xl">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight">{complaints.length}</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted mt-1">Total Complaints</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-indigo-50 text-bg rounded-xl">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight">{team.length}</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted mt-1">Team Members</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-amber-50 text-bg rounded-xl">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight">{gallery.length}</div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted mt-1">Gallery Items</div>
                </div>
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
                  <thead className="bg-[#F8FAFC] text-muted text-[10px] uppercase tracking-widest font-extrabold">
                    <tr>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Summary</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC] transition-all group">
                        <td className="px-8 py-5 text-sm font-medium text-muted">
                          {new Date(c.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-[#E0F2FE] text-[#0369A1] rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                            {c.aiResult.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-bg max-w-xs truncate">
                          {c.aiResult.problem_summary}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setSelectedComplaint(c)}
                              className="p-2 text-muted hover:text-accent transition-all"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteComplaint(c.id)}
                              className="p-2 text-muted hover:text-red-500 transition-all"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                  <div key={member.id} className="bg-white p-6 rounded-3xl border border-border shadow-sm flex gap-6">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="h-24 w-24 rounded-2xl object-cover grayscale"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-extrabold tracking-tight uppercase">{member.name}</h3>
                      <p className="text-accent text-[10px] font-extrabold uppercase tracking-widest mb-2">{member.role}</p>
                      <p className="text-xs text-muted line-clamp-2 mb-4">{member.bio}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingTeam(member)}
                          className="p-2 text-muted hover:text-accent transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTeam(member.id)}
                          className="p-2 text-muted hover:text-red-500 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <div key={img.id} className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden group">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={img.url} 
                        alt={img.caption} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                      <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button 
                          onClick={() => setEditingGallery(img)}
                          className="p-3 bg-white text-bg rounded-xl hover:scale-110 transition-all"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteGallery(img.id)}
                          className="p-3 bg-white text-red-500 rounded-xl hover:scale-110 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold truncate">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

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
                  <div className="p-6 bg-[#F1F5F9] rounded-2xl text-sm font-medium text-ink leading-relaxed">
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
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Role</label>
                  <input 
                    value={editingTeam.role || ""} 
                    onChange={e => setEditingTeam({...editingTeam, role: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Image URL</label>
                  <input 
                    value={editingTeam.image || ""} 
                    onChange={e => setEditingTeam({...editingTeam, image: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Bio</label>
                  <textarea 
                    rows={3}
                    value={editingTeam.bio || ""} 
                    onChange={e => setEditingTeam({...editingTeam, bio: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none font-medium resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setEditingTeam(null)}
                  className="flex-1 border border-border py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTeam}
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
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted ml-1">Caption</label>
                  <input 
                    value={editingGallery.caption || ""} 
                    onChange={e => setEditingGallery({...editingGallery, caption: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-[#F1F5F9] focus:ring-2 focus:ring-accent outline-none font-medium"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setEditingGallery(null)}
                  className="flex-1 border border-border py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-neutral-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveGallery}
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

