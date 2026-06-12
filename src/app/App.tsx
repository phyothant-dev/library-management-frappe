import React, { useState, useEffect } from "react";
import { BookMarked, Shield, BookOpen, Users, BarChart3, Star, ArrowRight } from "lucide-react";
import { LibrarianApp } from "./components/LibrarianApp";
import { MemberApp } from "./components/MemberApp";
import { BorrowRequest, ReturnRequest, BookItem } from "./components/data";
import { getBooks, bookToItem } from "../service/api";

type Role = null | "librarian" | "member";

function LoginScreen({ onSelect }: { onSelect: (role: "librarian" | "member") => void }) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)", fontFamily: "'Inter', sans-serif" }}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1771647287015-f30dbb239646?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=900&h=1200&q=85"
          alt="Grand Library" className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(44,95,74,0.3) 0%, rgba(0,0,0,0.15) 100%)" }} />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <blockquote>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontStyle: "italic", color: "#fff", lineHeight: 1.5, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
              "A library is not a luxury but one of the necessities of life."
            </p>
            <footer className="mt-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em" }}>
              — HENRY WARD BEECHER
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: "var(--primary)" }}>
              <BookMarked size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--foreground)" }}>Arcanum</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "var(--muted-foreground)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Library Management System</p>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.9rem", color: "var(--foreground)", lineHeight: 1.2 }}>Welcome back.</h1>
          <p className="mt-2 mb-8" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Choose how you'd like to access Arcanum today.
          </p>

          <div className="space-y-4">
            <button onClick={() => onSelect("librarian")}
              className="w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 hover:border-primary hover:shadow-md group"
              style={{ background: "#fff", borderColor: "var(--border)", cursor: "pointer" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(44,95,74,0.1)" }}>
                    <Shield size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>Librarian</p>
                    <p className="text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>Full system access & administration</p>
                  </div>
                </div>
                <ArrowRight size={18} color="var(--muted-foreground)" className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex gap-4 mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                {[{ icon: BarChart3, label: "Dashboard" }, { icon: BookOpen, label: "Catalog" }, { icon: Users, label: "Members" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={12} color="var(--primary)" />
                    <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </button>

            <button onClick={() => onSelect("member")}
              className="w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 hover:border-accent hover:shadow-md group"
              style={{ background: "#fff", borderColor: "var(--border)", cursor: "pointer" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,151,58,0.1)" }}>
                    <BookOpen size={22} color="#c9973a" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>Member</p>
                    <p className="text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>Browse books, manage your loans</p>
                  </div>
                </div>
                <ArrowRight size={18} color="var(--muted-foreground)" className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex gap-4 mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                {[{ icon: BookOpen, label: "Browse" }, { icon: Star, label: "Saved" }, { icon: BookMarked, label: "Membership" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={12} color="#c9973a" />
                    <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </button>
          </div>

          <div className="mt-10 pt-8 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            {[{ value: "3,842", label: "Books" }, { value: "1,247", label: "Members" }, { value: "284", label: "On Loan" }].map(s => (
              <div key={s.label} className="text-center">
                <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--foreground)" }}>{s.value}</p>
                <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
            Arcanum Public Library · Est. 1891 · v2.4.1
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  {/* MARKER-MAKE-KIT-INVOKED */}
  const [role, setRole] = useState<Role>(null);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);

  useEffect(() => {
    getBooks()
      .then(data => setBooks(data.map(bookToItem)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addBorrowRequest = (req: BorrowRequest) =>
    setBorrowRequests(prev => [req, ...prev]);

  const updateBorrowRequest = (id: number, status: "approved" | "rejected") =>
    setBorrowRequests(prev =>
      prev.map(r => r.id === id
        ? { ...r, status, dueDate: status === "approved" ? "Jul 1, 2026" : undefined }
        : r
      )
    );

  const addReturnRequest = (req: ReturnRequest) =>
    setReturnRequests(prev => [req, ...prev]);

  const confirmReturn = (id: number) =>
    setReturnRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "confirmed" as const } : r)
    );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--muted-foreground)" }}>Connecting to Arcanum...</p>
    </div>
  );

  if (role === null) return <LoginScreen onSelect={setRole} />;
  if (role === "librarian") return (
    <LibrarianApp
      onSwitchRole={() => setRole(null)}
      books={books}
      onBooksChange={setBooks}
      borrowRequests={borrowRequests}
      onUpdateBorrowRequest={updateBorrowRequest}
      returnRequests={returnRequests}
      onConfirmReturn={confirmReturn}
    />
  );
  if (role === "member") return (
    <MemberApp
      onSwitchRole={() => setRole(null)}
      books={books}
      borrowRequests={borrowRequests}
      onAddRequest={addBorrowRequest}
      returnRequests={returnRequests}
      onAddReturnRequest={addReturnRequest}
    />
  );
  return null;
}
