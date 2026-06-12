import React, { useState } from "react";
import {
  BookOpen, Users, BarChart3, Clock, ChevronRight, TrendingUp,
  AlertTriangle, CheckCircle2, Plus, X, Search, Star,
  BookMarked, Calendar, Phone, Mail, Trash2, Send,
  ThumbsUp, ThumbsDown, Bell,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { BOOKS, MEMBERS, LOANS, MONTHLY_DATA, GENRE_DATA, BookItem, Member, BorrowRequest, ReturnRequest } from "./data";

type Tab = "dashboard" | "catalog" | "members" | "loans" | "requests";

const GENRES = ["All", "Historical", "Literary", "Gothic", "Mystery", "Modernist", "Victorian", "Adventure"];

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "#dcfce7", color: "#15803d", label: "Active" },
  overdue: { bg: "#fee2e2", color: "#dc2626", label: "Overdue" },
  suspended: { bg: "#f3f4f6", color: "#6b7280", label: "Suspended" },
  returned: { bg: "#dbeafe", color: "#1d4ed8", label: "Returned" },
};

const TIER_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Gold: { bg: "#fefce8", color: "#92400e", border: "#fbbf24" },
  Silver: { bg: "#f8fafc", color: "#475569", border: "#94a3b8" },
  Bronze: { bg: "#fff7ed", color: "#9a3412", border: "#fb923c" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border p-3 shadow-lg" style={{ background: "#fff", borderColor: "var(--border)", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem" }}>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

/* ─── Add Book Modal ─────────────────────────────────────────────────────── */
function AddBookModal({ onClose, onAdd }: { onClose: () => void; onAdd: (b: BookItem) => void }) {
  const [form, setForm] = useState({ title: "", author: "", genre: "Historical", year: "2024", isbn: "", copies: "1", coverUrl: "", description: "" });
  const handle = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.title || !form.author) return;
    onAdd({
      id: Date.now(), title: form.title, author: form.author, genre: form.genre,
      year: parseInt(form.year), available: true, rating: 4.0,
      totalCopies: parseInt(form.copies), borrowedCopies: 0, isbn: form.isbn,
      coverUrl: form.coverUrl || "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
      description: form.description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" style={{ background: "#fff" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--foreground)" }}>Add New Book</h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Add a volume to the Arcanum collection</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--secondary)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer" }}><X size={16} color="var(--muted-foreground)" /></button>
        </div>
        <div className="p-8 grid grid-cols-2 gap-4">
          {[
            { label: "Title *", key: "title", placeholder: "Book title", full: true },
            { label: "Author *", key: "author", placeholder: "Author name" },
            { label: "ISBN", key: "isbn", placeholder: "978-..." },
            { label: "Year", key: "year", placeholder: "2024" },
            { label: "Copies", key: "copies", placeholder: "1" },
          ].map(({ label, key, placeholder, full }) => (
            <div key={key} className={full ? "col-span-2" : ""}>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => handle(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 rounded-lg outline-none text-sm"
                style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Genre</label>
            <select
              value={form.genre} onChange={e => handle("genre", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg outline-none text-sm"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
            >
              {["Historical", "Literary", "Gothic", "Mystery", "Modernist", "Victorian", "Adventure", "Other"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Cover Image URL</label>
            <input
              value={form.coverUrl} onChange={e => handle("coverUrl", e.target.value)}
              placeholder="https://... (leave blank for default)"
              className="w-full px-3.5 py-2.5 rounded-lg outline-none text-sm"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Description</label>
            <textarea
              value={form.description} onChange={e => handle("description", e.target.value)}
              placeholder="Brief description of the book..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg outline-none text-sm resize-none"
              style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
        <div className="flex gap-3 px-8 pb-7">
          <button onClick={submit} className="flex-1 py-3 rounded-xl text-sm transition-all hover:opacity-90" style={{ background: "var(--primary)", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Add to Collection
          </button>
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm" style={{ background: "var(--secondary)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif", border: "1px solid var(--border)", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Member Modal ────────────────────────────────────────────────────── */
function AddMemberModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: Member) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", tier: "Bronze" as "Bronze" | "Silver" | "Gold", avatarUrl: "" });
  const handle = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name || !form.email) return;
    const id = Date.now();
    onAdd({
      id, name: form.name, email: form.email, phone: form.phone,
      memberSince: "Jun 2026", activeLoans: 0, totalBorrowed: 0, status: "active",
      avatarUrl: form.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
      tier: form.tier as any, memberId: `ARC-${String(id).slice(-5)}`, expiryDate: "Jun 2027",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-2xl w-full max-w-lg shadow-2xl" style={{ background: "#fff" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--foreground)" }}>Register New Member</h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Add a patron to the Arcanum library</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--secondary)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer" }}><X size={16} color="var(--muted-foreground)" /></button>
        </div>
        <div className="p-8 space-y-4">
          {[
            { label: "Full Name *", key: "name", placeholder: "e.g. Eleanor Hartwell" },
            { label: "Email *", key: "email", placeholder: "email@example.com" },
            { label: "Phone", key: "phone", placeholder: "+1 (555) 000-0000" },
            { label: "Avatar Image URL", key: "avatarUrl", placeholder: "https://... (optional)" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => handle(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 rounded-lg outline-none text-sm"
                style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs mb-2 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Membership Tier</label>
            <div className="grid grid-cols-3 gap-3">
              {(["Bronze", "Silver", "Gold"] as const).map(t => {
                const s = TIER_STYLES[t];
                return (
                  <button key={t} onClick={() => handle("tier", t)}
                    className="py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      background: form.tier === t ? s.bg : "var(--secondary)",
                      border: `2px solid ${form.tier === t ? s.border : "var(--border)"}`,
                      color: form.tier === t ? s.color : "var(--muted-foreground)",
                      fontFamily: "'DM Mono', monospace", cursor: "pointer", fontWeight: form.tier === t ? 600 : 400,
                    }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-8 pb-7">
          <button onClick={submit} className="flex-1 py-3 rounded-xl text-sm hover:opacity-90 transition-all" style={{ background: "var(--primary)", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Register Member
          </button>
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm" style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Book Card (Librarian) ───────────────────────────────────────────────── */
function BookCard({ book, onDelete }: { book: BookItem; onDelete: (id: number) => void }) {
  const avail = book.totalCopies - book.borrowedCopies;
  return (
    <div className="group rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300" style={{ background: "#fff", borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="relative h-48 overflow-hidden">
        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
        <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}>{book.genre}</span>
        <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: avail > 0 ? "rgba(220,252,231,0.95)" : "rgba(254,226,226,0.95)", color: avail > 0 ? "#15803d" : "#dc2626" }}>
          {avail}/{book.totalCopies} avail.
        </span>
        <button
          onClick={() => onDelete(book.id)}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
          style={{ background: "rgba(220,38,38,0.85)", border: "none", cursor: "pointer" }}
        >
          <Trash2 size={12} color="#fff" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="leading-snug mb-0.5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{book.title}</h3>
        <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>{book.author} · {book.year}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} fill={i < Math.floor(book.rating) ? "#c9973a" : "transparent"} color={i < Math.floor(book.rating) ? "#c9973a" : "#d4cfc8"} />
            ))}
            <span className="ml-1 text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{book.rating}</span>
          </div>
          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{book.isbn}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── LibrarianApp ───────────────────────────────────────────────────────── */
export function LibrarianApp({
  onSwitchRole, borrowRequests, onUpdateBorrowRequest, returnRequests, onConfirmReturn,
}: {
  onSwitchRole: () => void;
  borrowRequests: BorrowRequest[];
  onUpdateBorrowRequest: (id: number, status: "approved" | "rejected") => void;
  returnRequests: ReturnRequest[];
  onConfirmReturn: (id: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [books, setBooks] = useState<BookItem[]>(BOOKS);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    return (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
      (genreFilter === "All" || b.genre === genreFilter);
  });
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const pendingBorrows = borrowRequests.filter(r => r.status === "pending").length;
  const pendingReturns = returnRequests.filter(r => r.status === "pending").length;
  const pendingCount = pendingBorrows + pendingReturns;

  const navItems: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "catalog", label: "Book Catalog", icon: BookOpen },
    { id: "members", label: "Members", icon: Users },
    { id: "requests", label: "Pending Requests", icon: Bell, badge: pendingCount || undefined },
    { id: "loans", label: "Loan Records", icon: Clock },
  ];

  const stats = [
    { label: "Total Books", value: books.reduce((a, b) => a + b.totalCopies, 0).toLocaleString(), sub: "in collection", icon: BookOpen, green: true },
    { label: "Active Members", value: members.filter(m => m.status === "active").length.toString(), sub: "of " + members.length + " total", icon: Users },
    { label: "On Loan", value: LOANS.filter(l => l.status !== "returned").length.toString(), sub: "currently borrowed", icon: BookMarked },
    { label: "Overdue", value: LOANS.filter(l => l.status === "overdue").length.toString(), sub: "past due", icon: AlertTriangle },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-64 flex-shrink-0 border-r" style={{ background: "var(--sidebar)", borderColor: "var(--sidebar-border)" }}>
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "var(--primary)" }}>
              <BookMarked size={17} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>Arcanum</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Library System</p>
            </div>
          </div>
          <div className="mt-4 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(44,95,74,0.08)" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span style={{ fontSize: "0.55rem", color: "#fff", fontFamily: "'DM Mono', monospace" }}>L</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "var(--foreground)" }}>Librarian View</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--muted-foreground)" }}>Full access</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const active = tab === id;
            const isRequests = id === "requests";
            return (
              <button key={id} onClick={() => setTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{ background: active ? (isRequests && badge ? "rgba(201,151,58,0.1)" : "rgba(44,95,74,0.1)") : "transparent", color: active ? (isRequests && badge ? "#92400e" : "var(--primary)") : "var(--muted-foreground)", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Inter', sans-serif", fontWeight: active ? 600 : 400 }}>
                <Icon size={15} />
                {label}
                <div className="ml-auto flex items-center gap-1">
                  {badge && badge > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: "#c9973a", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
                      {badge}
                    </span>
                  )}
                  {active && !badge && <ChevronRight size={13} style={{ color: "var(--primary)" }} />}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-6">
          <button onClick={onSwitchRole}
            className="w-full py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
            Switch to Member View
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--foreground)" }}>
              {tab === "dashboard" && "Overview"}
              {tab === "catalog" && "Book Catalog"}
              {tab === "members" && "Members"}
              {tab === "requests" && "Pending Requests"}
              {tab === "loans" && "Loan Records"}
            </h1>
            <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
              {tab === "dashboard" && "Arcanum Public Library · June 2026"}
              {tab === "catalog" && `${books.length} titles · ${books.filter(b => b.available).length} with copies available`}
              {tab === "members" && `${members.length} registered patrons`}
              {tab === "requests" && `${pendingCount} pending · ${borrowRequests.length} total`}
              {tab === "loans" && "All borrowing activity"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <button onClick={() => setTab("requests")}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
                  style={{ background: "rgba(201,151,58,0.1)", color: "#92400e", border: "1.5px solid rgba(201,151,58,0.25)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                  <Bell size={14} />
                  {pendingCount} Pending Request{pendingCount > 1 ? "s" : ""}
                </button>
              )}
              {tab === "catalog" && (
                <button onClick={() => setShowAddBook(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all" style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                  <Plus size={15} /> Add Book
                </button>
              )}
              {tab === "members" && (
                <button onClick={() => setShowAddMember(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all" style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                  <Plus size={15} /> Add Member
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">

          {/* ── DASHBOARD ── */}
          {tab === "dashboard" && (
            <div className="space-y-7">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="rounded-2xl p-5 border" style={{ background: s.green ? "var(--primary)" : "#fff", borderColor: s.green ? "var(--primary)" : "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace", color: s.green ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)" }}>{s.label}</p>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "2rem", color: s.green ? "#fff" : "var(--foreground)", lineHeight: 1 }}>{s.value}</p>
                        <p className="text-xs mt-1.5" style={{ fontFamily: "'DM Mono', monospace", color: s.green ? "rgba(255,255,255,0.6)" : "var(--muted-foreground)" }}>{s.sub}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ background: s.green ? "rgba(255,255,255,0.15)" : "rgba(44,95,74,0.08)" }}>
                        <s.icon size={18} color={s.green ? "#fff" : "var(--primary)"} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border p-6 bg-white" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--foreground)" }}>Circulation Activity</h2>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Jan – Jun 2026</p>
                    </div>
                    <TrendingUp size={16} color="var(--primary)" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={MONTHLY_DATA}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2c5f4a" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2c5f4a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c9973a" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#c9973a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: "#78716c", fontSize: 11, fontFamily: "'DM Mono'" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#78716c", fontSize: 11, fontFamily: "'DM Mono'" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="borrowed" stroke="#2c5f4a" strokeWidth={2.5} fill="url(#g1)" name="Borrowed" />
                      <Area type="monotone" dataKey="returned" stroke="#c9973a" strokeWidth={2.5} fill="url(#g2)" name="Returned" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--foreground)" }}>By Genre</h2>
                  <p className="text-xs mt-0.5 mb-4" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Collection breakdown</p>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={GENRE_DATA} cx="50%" cy="50%" innerRadius={36} outerRadius={55} dataKey="value" paddingAngle={4}>
                        {GENRE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {GENRE_DATA.map(g => (
                      <div key={g.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{g.name}</span>
                        </div>
                        <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)", fontWeight: 600 }}>{g.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--foreground)" }}>New Acquisitions</h2>
                  <p className="text-xs mt-0.5 mb-5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Monthly additions</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={MONTHLY_DATA} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#78716c", fontSize: 11, fontFamily: "'DM Mono'" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#78716c", fontSize: 11, fontFamily: "'DM Mono'" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="new" fill="#2c5f4a" radius={[4, 4, 0, 0]} name="New Books" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl border p-6 bg-white" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" }}>Recent Loans</h2>
                  <div className="space-y-3">
                    {LOANS.slice(0, 5).map(l => {
                      const s = STATUS_BADGE[l.status];
                      return (
                        <div key={l.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                          <div>
                            <p className="text-sm" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "var(--foreground)" }}>{l.bookTitle}</p>
                            <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{l.memberName}</p>
                          </div>
                          <span className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: s.bg, color: s.color }}>{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CATALOG ── */}
          {tab === "catalog" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--muted-foreground)" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or author..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "#fff", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setGenreFilter(g)}
                      className="px-3 py-1.5 rounded-full text-xs transition-all"
                      style={{ fontFamily: "'DM Mono', monospace", background: genreFilter === g ? "var(--primary)" : "#fff", color: genreFilter === g ? "#fff" : "var(--muted-foreground)", border: `1.5px solid ${genreFilter === g ? "var(--primary)" : "var(--border)"}`, cursor: "pointer" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredBooks.map(b => <BookCard key={b.id} book={b} onDelete={id => setBooks(prev => prev.filter(x => x.id !== id))} />)}
              </div>
              {filteredBooks.length === 0 && (
                <div className="text-center py-20" style={{ color: "var(--muted-foreground)", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic" }}>No volumes found.</div>
              )}
            </div>
          )}

          {/* ── MEMBERS ── */}
          {tab === "members" && (
            <div className="space-y-5">
              <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--muted-foreground)" />
                <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search members..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "#fff", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredMembers.map(m => {
                  const status = STATUS_BADGE[m.status];
                  const tier = TIER_STYLES[m.tier];
                  return (
                    <div key={m.id} className="rounded-2xl border overflow-hidden bg-white hover:shadow-md transition-all" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                      <div className="h-16" style={{ background: "linear-gradient(135deg, #f3f0eb 0%, #e8e4dd 100%)" }} />
                      <div className="px-5 pb-5">
                        <div className="flex items-end justify-between -mt-7 mb-4">
                          <img src={m.avatarUrl} alt={m.name} className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-sm" />
                          <span className="text-xs px-2.5 py-1 rounded-full mb-1" style={{ fontFamily: "'DM Mono', monospace", background: status.bg, color: status.color }}>{status.label}</span>
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>{m.name}</h3>
                        <p className="text-xs mt-0.5 mb-3" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{m.memberId}</p>
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail size={11} color="var(--muted-foreground)" />
                            <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{m.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={11} color="var(--muted-foreground)" />
                            <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{m.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={11} color="var(--muted-foreground)" />
                            <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Since {m.memberSince} · Exp. {m.expiryDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                          <span className="text-xs px-3 py-1.5 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}>{m.tier} Member</span>
                          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{m.activeLoans} active · {m.totalBorrowed} total</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── REQUESTS ── */}
          {tab === "requests" && (
            <div className="space-y-5">
              {/* Summary pills */}
              <div className="flex items-center gap-3">
                {[
                  { label: "Pending", count: pendingCount, bg: "rgba(201,151,58,0.1)", color: "#92400e", dot: "#c9973a" },
                  { label: "Borrow Requests", count: borrowRequests.length, bg: "rgba(44,95,74,0.07)", color: "#2c5f4a", dot: "var(--primary)" },
                  { label: "Return Requests", count: returnRequests.length, bg: "rgba(22,163,74,0.07)", color: "#15803d", dot: "#16a34a" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border" style={{ background: s.bg, borderColor: `${s.dot}30` }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                    <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: s.color, fontWeight: 600 }}>{s.count}</span>
                    <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: s.color, opacity: 0.8 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {borrowRequests.length === 0 && returnRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-28 rounded-2xl border bg-white" style={{ borderColor: "var(--border)" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(44,95,74,0.07)" }}>
                    <Send size={28} color="var(--primary)" style={{ opacity: 0.4 }} />
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--foreground)" }}>No requests yet</p>
                  <p className="text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>Borrow and return requests from members will appear here.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Borrow requests */}
                  {borrowRequests.length > 0 && (
                    <section>
                      <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>
                        Borrow Requests
                        {pendingBorrows > 0 && <span className="ml-2 text-xs px-2 py-0.5 rounded-full align-middle" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(201,151,58,0.12)", color: "#92400e" }}>{pendingBorrows} pending</span>}
                      </h2>
                  <div className="space-y-3">
                  {borrowRequests.map(req => {
                    const isPending = req.status === "pending";
                    const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
                      pending:  { bg: "rgba(201,151,58,0.1)",  color: "#92400e", label: "Pending" },
                      approved: { bg: "rgba(220,252,231,0.8)", color: "#15803d", label: "Approved" },
                      rejected: { bg: "rgba(254,226,226,0.8)", color: "#dc2626", label: "Rejected" },
                    };
                    const ss = statusStyles[req.status];
                    return (
                      <div key={req.id} className="rounded-2xl border bg-white overflow-hidden transition-all hover:shadow-md"
                        style={{ borderColor: isPending ? "rgba(201,151,58,0.22)" : "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                        <div className="flex items-center gap-5 p-5">
                          {/* Book cover */}
                          <img src={req.bookCover} alt={req.bookTitle} className="w-14 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm" />

                          {/* Book + member info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", fontStyle: "italic" }}>
                                {req.bookTitle}
                              </h3>
                              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                                style={{ fontFamily: "'DM Mono', monospace", background: ss.bg, color: ss.color }}>
                                {ss.label}
                              </span>
                            </div>
                            <p className="text-xs mb-3" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{req.bookAuthor}</p>

                            {/* Member row */}
                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: "var(--secondary)" }}>
                              <img src={req.memberAvatar} alt={req.memberName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs truncate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "var(--foreground)" }}>{req.memberName}</p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Requested</p>
                                  <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>{req.requestedDate}</p>
                                </div>
                                {req.dueDate && (
                                  <div className="text-right">
                                    <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Due Date</p>
                                    <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#15803d", fontWeight: 600 }}>{req.dueDate}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          {isPending && (
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button
                                onClick={() => onUpdateBorrowRequest(req.id, "approved")}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all"
                                style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                              >
                                <ThumbsUp size={13} /> Approve
                              </button>
                              <button
                                onClick={() => onUpdateBorrowRequest(req.id, "rejected")}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:opacity-80 transition-all"
                                style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1.5px solid rgba(220,38,38,0.2)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                              >
                                <ThumbsDown size={13} /> Reject
                              </button>
                            </div>
                          )}
                          {!isPending && (
                            <div className="flex-shrink-0 p-3 rounded-xl" style={{ background: req.status === "approved" ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
                              {req.status === "approved" ? <CheckCircle2 size={20} color="#16a34a" /> : <X size={20} color="#dc2626" />}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                    </section>
                  )}

                  {/* Return requests */}
                  {returnRequests.length > 0 && (
                    <section>
                      <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>
                        Return Requests
                        {pendingReturns > 0 && <span className="ml-2 text-xs px-2 py-0.5 rounded-full align-middle" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(44,95,74,0.1)", color: "#2c5f4a" }}>{pendingReturns} pending</span>}
                      </h2>
                      <div className="space-y-3">
                        {returnRequests.map(req => {
                          const isPending = req.status === "pending";
                          return (
                            <div key={req.id} className="rounded-2xl border bg-white overflow-hidden transition-all hover:shadow-md"
                              style={{ borderColor: isPending ? "rgba(44,95,74,0.22)" : "rgba(22,163,74,0.2)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                              <div className="flex items-center gap-5 p-5">
                                <img src={req.bookCover} alt={req.bookTitle} className="w-14 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3 mb-1">
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", fontStyle: "italic" }}>
                                      {req.bookTitle}
                                    </h3>
                                    <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                                      style={{ fontFamily: "'DM Mono', monospace", background: isPending ? "rgba(44,95,74,0.1)" : "rgba(220,252,231,0.9)", color: isPending ? "#2c5f4a" : "#15803d" }}>
                                      {isPending ? "Awaiting Confirmation" : "Return Confirmed"}
                                    </span>
                                  </div>
                                  <p className="text-xs mb-3" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{req.bookAuthor}</p>
                                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: "var(--secondary)" }}>
                                    <img src={req.memberAvatar} alt={req.memberName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                    <p className="text-xs flex-1 truncate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "var(--foreground)" }}>{req.memberName}</p>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                      <div className="text-right">
                                        <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Due Date</p>
                                        <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>{req.dueDate}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Return Requested</p>
                                        <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>{req.returnRequestedDate}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {isPending ? (
                                  <button
                                    onClick={() => onConfirmReturn(req.id)}
                                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all"
                                    style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                    <CheckCircle2 size={13} /> Confirm Return
                                  </button>
                                ) : (
                                  <div className="flex-shrink-0 p-3 rounded-xl" style={{ background: "rgba(22,163,74,0.08)" }}>
                                    <CheckCircle2 size={20} color="#16a34a" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── LOANS ── */}
          {tab === "loans" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "On Loan", value: LOANS.filter(l => l.status !== "returned").length, color: "var(--primary)", bg: "rgba(44,95,74,0.07)" },
                  { label: "Due This Week", value: 8, color: "#c9973a", bg: "rgba(201,151,58,0.07)" },
                  { label: "Overdue", value: LOANS.filter(l => l.status === "overdue").length, color: "#dc2626", bg: "rgba(220,38,38,0.07)" },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl border p-5 bg-white" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{s.label}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--foreground)" }}>All Loan Records</h2>
                </div>
                <table className="w-full">
                  <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Book", "Borrower", "Borrowed", "Due Date", "Status"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)", fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {LOANS.map(l => {
                      const s = STATUS_BADGE[l.status];
                      return (
                        <tr key={l.id} className="border-b hover:bg-secondary/40 transition-colors" style={{ borderColor: "var(--border)" }}>
                          <td className="py-3.5 px-5"><p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "var(--foreground)", fontSize: "0.9rem" }}>{l.bookTitle}</p></td>
                          <td className="py-3.5 px-5"><p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "var(--foreground)" }}>{l.memberName}</p></td>
                          <td className="py-3.5 px-5"><p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{l.borrowed}</p></td>
                          <td className="py-3.5 px-5"><p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: l.status === "overdue" ? "#dc2626" : "var(--muted-foreground)" }}>{l.due}</p></td>
                          <td className="py-3.5 px-5"><span className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: s.bg, color: s.color }}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddBook && <AddBookModal onClose={() => setShowAddBook(false)} onAdd={b => setBooks(prev => [...prev, b])} />}
      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} onAdd={m => setMembers(prev => [...prev, m])} />}
    </div>
  );
}
