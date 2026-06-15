import React, { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen, Clock, CreditCard, ChevronRight, Search, Star,
  BookMarked, X, CheckCircle2, AlertTriangle,
  Calendar, Award, ArrowRight, RefreshCw, Heart, Bookmark, Send, RotateCcw,
} from "lucide-react";
import { BookItem, Member, BorrowRequest, ReturnRequest, LoanRecord, FineRecord, Reservation } from "./data";

type MemberTab = "browse" | "saved" | "myloans" | "membership";

const TIER_CONFIG = {
  Bronze: {
    color: "#92400e", bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    border: "#fbbf24", badge: "#d97706", perks: ["Borrow up to 3 books", "21-day loan period", "1 renewal per book"],
  },
  Silver: {
    color: "#1e3a5f", bg: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    border: "#38bdf8", badge: "#0369a1", perks: ["Borrow up to 5 books", "28-day loan period", "2 renewals per book", "Reserve books online"],
  },
  Gold: {
    color: "#78350f", bg: "linear-gradient(135deg, #fef9c3 0%, #fef08a 50%, #fde68a 100%)",
    border: "#eab308", badge: "#b45309", perks: ["Borrow up to 8 books", "35-day loan period", "Unlimited renewals", "Priority reservations", "Early access to new arrivals"],
  },
};

const GENRES = ["All", "Historical", "Literary", "Gothic", "Mystery", "Modernist", "Victorian", "Adventure"];

/* ─── Book Detail Modal ───────────────────────────────────────────────────── */
function BookDetailModal({
  book, onClose, onBorrow, isSaved, onToggleSave, onReserve, isReserved, canReserve,
}: {
  book: BookItem; onClose: () => void; onBorrow: (b: BookItem) => void;
  isSaved: boolean; onToggleSave: (id: string) => void;
  onReserve?: () => void; isReserved?: boolean; canReserve?: boolean;
}) {
  const avail = book.totalCopies - book.borrowedCopies;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden bg-white" onClick={e => e.stopPropagation()}>
        <div className="flex">
          <div className="w-48 flex-shrink-0 relative">
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" style={{ minHeight: "320px" }} />
          </div>
          <div className="flex-1 p-8 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs px-3 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(44,95,74,0.1)", color: "var(--primary)" }}>{book.genre}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSave(book.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: isSaved ? "rgba(239,68,68,0.08)" : "var(--secondary)", border: `1.5px solid ${isSaved ? "rgba(239,68,68,0.3)" : "var(--border)"}`, cursor: "pointer" }}
                >
                  <Heart size={13} fill={isSaved ? "#ef4444" : "transparent"} color={isSaved ? "#ef4444" : "var(--muted-foreground)"} />
                  <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: isSaved ? "#ef4444" : "var(--muted-foreground)" }}>
                    {isSaved ? "Saved" : "Save"}
                  </span>
                </button>
                <button onClick={onClose} style={{ background: "var(--secondary)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}><X size={15} color="var(--muted-foreground)" /></button>
              </div>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--foreground)", lineHeight: 1.2 }}>{book.title}</h2>
            <p className="mt-1 mb-3" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>by {book.author} · {book.year}</p>
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill={i < Math.floor(book.rating) ? "#c9973a" : "transparent"} color={i < Math.floor(book.rating) ? "#c9973a" : "#d4cfc8"} />
              ))}
              <span className="ml-1 text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{book.rating}/5.0</span>
            </div>
            <p className="text-sm mb-5 leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{book.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "ISBN", value: book.isbn },
                { label: "Available", value: `${avail} of ${book.totalCopies} copies` },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: "var(--secondary)" }}>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{item.label}</p>
                  <p className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)", fontWeight: 600 }}>{item.value}</p>
                </div>
              ))}
            </div>
            {avail > 0 ? (
              <button
                onClick={() => { onBorrow(book); onClose(); }}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                Borrow This Book
              </button>
            ) : canReserve ? (
              <button
                onClick={() => { onReserve?.(); onClose(); }}
                disabled={isReserved}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: isReserved ? "var(--muted)" : "#d97706", color: "#fff", border: "none", cursor: isReserved ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif" }}>
                <BookMarked size={14} />
                {isReserved ? "Already Reserved" : "Reserve This Book"}
              </button>
            ) : (
              <button disabled className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "none", cursor: "not-allowed", fontFamily: "'Inter', sans-serif" }}>
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Request Sent Modal ──────────────────────────────────────────────────── */
function RequestSentModal({ book, onClose }: { book: BookItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="rounded-2xl w-full max-w-sm shadow-2xl p-8 bg-white text-center" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(201,151,58,0.12)" }}>
          <Send size={26} color="#c9973a" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--foreground)" }}>Request Submitted!</h2>
        <p className="mt-2 mb-1" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "0.95rem", color: "var(--muted-foreground)" }}>{book.title}</p>
        <p className="text-xs mb-6" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
          Your request is pending librarian approval.<br />You'll see the status under My Loans.
        </p>
        <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: "rgba(201,151,58,0.07)", border: "1px solid rgba(201,151,58,0.2)" }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#c9973a" }} />
          <p className="text-xs text-left" style={{ fontFamily: "'DM Mono', monospace", color: "#92400e" }}>
            Awaiting librarian approval — typically within a few hours.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm hover:opacity-90 transition-all" style={{ background: "var(--primary)", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, border: "none", cursor: "pointer" }}>
          View My Loans
        </button>
      </div>
    </div>
  );
}

/* ─── Return Confirm Modal (step 1) ──────────────────────────────────────── */
function ReturnConfirmModal({
  loan, book, onClose, onConfirm,
}: {
  loan: LoanRecord; book: BookItem | undefined; onClose: () => void; onConfirm: () => void;
}) {
  const isOverdue = loan.status === "overdue";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="rounded-2xl w-full max-w-md shadow-2xl bg-white overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Book header */}
        <div className="flex gap-4 p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <img src={book?.coverUrl} alt={loan.bookTitle} className="w-16 h-24 object-cover rounded-xl shadow-sm flex-shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Returning</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", fontStyle: "italic", lineHeight: 1.3 }}>{loan.bookTitle}</h2>
            <p className="text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{book?.author}</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--secondary)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", alignSelf: "flex-start" }}>
            <X size={15} color="var(--muted-foreground)" />
          </button>
        </div>

        {/* Loan details */}
        <div className="p-6 space-y-3">
          {[
            { label: "Borrowed On", value: loan.borrowed },
            { label: "Due Date", value: loan.due, highlight: isOverdue },
            { label: "Return to", value: "Arcanum Library Desk, Ground Floor" },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{item.label}</span>
              <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: item.highlight ? "#dc2626" : "var(--foreground)", fontWeight: item.highlight ? 600 : 400 }}>{item.value}</span>
            </div>
          ))}

          {isOverdue && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)" }}>
              <AlertTriangle size={14} color="#dc2626" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#dc2626" }}>
                This item is overdue. A late fee may apply. Please speak to staff at the desk.
              </p>
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "rgba(44,95,74,0.05)", border: "1px solid rgba(44,95,74,0.15)" }}>
            <CheckCircle2 size={14} color="var(--primary)" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#2c5f4a" }}>
              Submitting a return request notifies the librarian. Bring the book to the desk to complete the return.
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm hover:opacity-90 transition-all"
            style={{ background: "var(--primary)", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, border: "none", cursor: "pointer" }}>
            <RotateCcw size={14} /> Submit Return Request
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm"
            style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Return Sent Modal (step 2) ─────────────────────────────────────────── */
function ReturnSentModal({ loan, onClose }: { loan: LoanRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="rounded-2xl w-full max-w-sm shadow-2xl p-8 bg-white text-center" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(44,95,74,0.1)" }}>
          <RotateCcw size={26} color="var(--primary)" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--foreground)" }}>Return Request Sent!</h2>
        <p className="mt-2 mb-1" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
          {loan.bookTitle}
        </p>
        <p className="text-xs mb-6" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
          The librarian will confirm once you hand in the book at the desk.
        </p>
        <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: "rgba(44,95,74,0.06)", border: "1px solid rgba(44,95,74,0.15)" }}>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--primary)" }} />
          <p className="text-xs text-left" style={{ fontFamily: "'DM Mono', monospace", color: "#2c5f4a" }}>
            Status will update to "Returned" after librarian confirms.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm hover:opacity-90 transition-all"
          style={{ background: "var(--primary)", color: "#fff", fontFamily: "'Inter', sans-serif", fontWeight: 600, border: "none", cursor: "pointer" }}>
          Got it
        </button>
      </div>
    </div>
  );
}

/* ─── Book Card (shared) ──────────────────────────────────────────────────── */
function BrowseBookCard({
  book, isSaved, onToggleSave, onDetail, onBorrow, onReserve, isReserved, canReserve,
}: {
  book: BookItem; isSaved: boolean;
  onToggleSave: (id: string) => void;
  onDetail: (b: BookItem) => void;
  onBorrow: (b: BookItem) => void;
  onReserve?: () => void; isReserved?: boolean; canReserve?: boolean;
}) {
  const avail = book.totalCopies - book.borrowedCopies;
  return (
    <div
      className="group rounded-2xl border overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white"
      style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      onClick={() => onDetail(book)}
    >
      <div className="relative h-52 overflow-hidden">
        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
        <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(255,255,255,0.92)", color: "var(--foreground)" }}>
          {book.genre}
        </span>
        {/* Save / Heart button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleSave(book.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: isSaved ? "rgba(239,68,68,0.9)" : "rgba(255,255,255,0.88)",
            border: "none", cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <Heart size={14} fill={isSaved ? "#fff" : "transparent"} color={isSaved ? "#fff" : "#ef4444"} />
        </button>
        <span className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: avail > 0 ? "rgba(220,252,231,0.92)" : "rgba(254,226,226,0.92)", color: avail > 0 ? "#15803d" : "#dc2626" }}>
          {avail > 0 ? `${avail} avail.` : "Unavail."}
        </span>
      </div>
      <div className="p-4">
        <h3 className="leading-snug mb-0.5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>{book.title}</h3>
        <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>{book.author}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} fill={i < Math.floor(book.rating) ? "#c9973a" : "transparent"} color={i < Math.floor(book.rating) ? "#c9973a" : "#d4cfc8"} />
            ))}
            <span className="ml-1 text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{book.rating}</span>
          </div>
          {avail > 0 ? (
            <button
              onClick={e => { e.stopPropagation(); onBorrow(book); }}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Borrow
            </button>
          ) : canReserve ? (
            <button
              onClick={e => { e.stopPropagation(); onReserve?.(); }}
              className="text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
              style={{ background: isReserved ? "var(--muted)" : "#d97706", color: "#fff", border: "none", cursor: isReserved ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              <BookMarked size={11} /> {isReserved ? "Reserved" : "Reserve"}
            </button>
          ) : (
            <button disabled className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "none", cursor: "default", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Unavail.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Saved Books Page ────────────────────────────────────────────────────── */
function SavedBooksPage({
  savedBooks, books, onToggleSave, onDetail, onBorrow, onBorrowAll,
}: {
  savedBooks: string[]; books: BookItem[];
  onToggleSave: (id: string) => void;
  onDetail: (b: BookItem) => void;
  onBorrow: (b: BookItem) => void;
  onBorrowAll?: () => void;
}) {
  const saved = books.filter(b => savedBooks.includes(b.id));
  const availableSaved = saved.filter(b => b.totalCopies - b.borrowedCopies > 0);
  const unavailableSaved = saved.filter(b => b.totalCopies - b.borrowedCopies === 0);

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(239,68,68,0.07)" }}>
          <Heart size={36} color="#ef4444" style={{ opacity: 0.4 }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--foreground)" }}>
          No saved books yet
        </h2>
        <p className="mt-2 max-w-xs" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
          Tap the heart icon on any book to save it for later borrowing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary strip */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.07)", border: "1.5px solid rgba(239,68,68,0.15)" }}>
          <Heart size={14} fill="#ef4444" color="#ef4444" />
          <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#ef4444", fontWeight: 600 }}>{saved.length} saved</span>
        </div>
        <div className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
          {availableSaved.length} available to borrow · {unavailableSaved.length} unavailable
        </div>
      </div>

      {/* Available section */}
      {availableSaved.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>
              Ready to Borrow
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(44,95,74,0.1)", color: "var(--primary)" }}>
              {availableSaved.length} available
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {availableSaved.map(book => (
              <BrowseBookCard
                key={book.id} book={book} isSaved={true}
                onToggleSave={onToggleSave} onDetail={onDetail} onBorrow={onBorrow}
              />
            ))}
          </div>
        </section>
      )}

      {/* Unavailable section */}
      {unavailableSaved.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>
              Borrow Later
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(220,38,38,0.07)", color: "#dc2626" }}>
              {unavailableSaved.length} unavailable
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {unavailableSaved.map(book => (
              <BrowseBookCard
                key={book.id} book={book} isSaved={true}
                onToggleSave={onToggleSave} onDetail={onDetail} onBorrow={onBorrow}
              />
            ))}
          </div>
        </section>
      )}

      {/* Borrow all available CTA */}
      {availableSaved.length > 1 && (
        <div className="rounded-2xl border p-5 flex items-center justify-between" style={{ background: "rgba(44,95,74,0.04)", borderColor: "rgba(44,95,74,0.15)" }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--foreground)" }}>
              {availableSaved.length} books ready for you
            </p>
            <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
              All your available saved books can be borrowed at once
            </p>
          </div>
          <button
            onClick={onBorrowAll}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm hover:opacity-90 transition-all"
            style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
          >
            <Bookmark size={14} /> Borrow All Available
          </button>
        </div>
      )}
    </div>
  );
}

const REQUEST_STATUS_STYLE: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  pending:  { bg: "rgba(201,151,58,0.1)",  color: "#92400e", label: "Pending Approval", dot: "#c9973a" },
  approved: { bg: "rgba(220,252,231,0.8)", color: "#15803d", label: "Approved",          dot: "#16a34a" },
  rejected: { bg: "rgba(254,226,226,0.8)", color: "#dc2626", label: "Rejected",           dot: "#dc2626" },
};

/* ─── MemberApp ───────────────────────────────────────────────────────────── */
const MEMBER_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "#dcfce7", color: "#15803d", label: "Active" },
  overdue: { bg: "#fee2e2", color: "#dc2626", label: "Overdue" },
  suspended: { bg: "#f3f4f6", color: "#6b7280", label: "Suspended" },
};

export function MemberApp({
  books, members, currentMemberId, borrowRequests, onAddRequest, returnRequests, onAddReturnRequest, loans, fines, onToggleSavedBook, onRenewMembership, onRenewLoan, reservations, onAddReservation, onCancelReservation, onPayFine,
}: {
  books: BookItem[];
  members: Member[];
  currentMemberId: number | null;
  borrowRequests: BorrowRequest[];
  onAddRequest: (req: BorrowRequest) => void;
  returnRequests: ReturnRequest[];
  onAddReturnRequest: (req: ReturnRequest) => void;
  loans: LoanRecord[];
  fines: FineRecord[];
  onToggleSavedBook: (memberId: number, bookIsbn: string) => void;
  onRenewMembership: (memberId: string) => void;
  onRenewLoan: (loanFrappeName: string, memberTier: string) => void;
  reservations: Reservation[];
  onAddReservation: (bookId: string, memberId: string, priority: "Normal" | "Priority") => void;
  onCancelReservation: (reservation: Reservation) => void;
  onPayFine?: (fineFrappeName: string) => void;
}) {
  const [tab, setTab] = useState<MemberTab>("browse");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [detailBook, setDetailBook] = useState<BookItem | null>(null);
  const [requestedBook, setRequestedBook] = useState<BookItem | null>(null);
  const [returnStep, setReturnStep] = useState<"confirm" | "sent" | null>(null);
  const [returningLoan, setReturningLoan] = useState<LoanRecord | null>(null);

  if (currentMemberId === null) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>Please sign in from the main login page.</p>
    </div>;
  }

  const member = members.find(m => m.id === currentMemberId) ?? members[0];
  if (!member) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--muted-foreground)", fontStyle: "italic" }}>Loading member data...</p>
    </div>;
  }

  const tier = TIER_CONFIG[member.tier];
  const myLoans = loans.filter(l => l.memberId === member.id || l.memberFrappeName === member.memberId);
  const activeLoans = myLoans.filter(l => l.status !== "returned");
  const myRequests = borrowRequests.filter(r => r.memberId === member.id);

  const toggleSave = (bookIsbn: string) => {
    onToggleSavedBook(member.id, bookIsbn);
  };

  const myReturnRequests = returnRequests.filter(r => r.memberId === member.id);

  const handleReturnSubmit = (loan: LoanRecord) => {
    const book = books.find(b => b.id === loan.bookId);
    onAddReturnRequest({
      id: Date.now(),
      loanId: loan.id,
      loanFrappeName: (loan as any).frappeName,
      bookId: loan.bookId,
      bookIsbn: book?.isbn,
      memberId: member.id,
      memberFrappeName: member.memberId,
      bookTitle: loan.bookTitle,
      bookCover: book?.coverUrl ?? "",
      bookAuthor: book?.author ?? "",
      memberName: member.name,
      memberAvatar: member.avatarUrl,
      borrowedDate: loan.borrowed,
      dueDate: loan.due,
      returnRequestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "pending",
    });
    setReturnStep("sent");
  };

  const handleBorrowRequest = (book: BookItem) => {
    if (member.status !== "active") {
      toast.error("Account not active", { description: "Only active members can borrow books." });
      return;
    }
    const limits = { Bronze: 3, Silver: 5, Gold: 8 } as const;
    const maxBooks = limits[member.tier];
    const activeCount = activeLoans.length + borrowRequests.filter(r => r.memberId === member.id && r.status === "pending").length;
    if (activeCount >= maxBooks) {
      toast.error(`You've reached your ${member.tier} limit of ${maxBooks} books`);
      return;
    }
    onAddRequest({
      id: Date.now(),
      bookId: book.id,
      bookIsbn: book.isbn,
      memberId: member.id,
      memberFrappeName: member.memberId,
      bookTitle: book.title,
      bookCover: book.coverUrl,
      bookAuthor: book.author,
      memberName: member.name,
      memberAvatar: member.avatarUrl,
      requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "pending",
    });
    setRequestedBook(book);
  };

  const handleBorrowAllSaved = () => {
    const saved = books.filter(b => (member.savedBooks || []).includes(b.id));
    const available = saved.filter(b => b.totalCopies - b.borrowedCopies > 0);
    const limits = { Bronze: 3, Silver: 5, Gold: 8 } as const;
    const maxBooks = limits[member.tier];
    const activeCount = member.activeLoans || 0;
    const slot = Math.max(0, maxBooks - activeCount);
    const toBorrow = available.slice(0, slot);
    if (toBorrow.length === 0) {
      toast.error(activeCount >= maxBooks
        ? `You've reached your ${member.tier} limit of ${maxBooks} books`
        : "No available books to borrow"
      );
      return;
    }
    toBorrow.forEach(book => handleBorrowRequest(book));
    if (toBorrow.length < available.length) {
      toast(`${toBorrow.length} request${toBorrow.length > 1 ? "s" : ""} sent — your ${member.tier} limit is ${maxBooks} books`);
    } else {
      toast.success(`${toBorrow.length} request${toBorrow.length > 1 ? "s" : ""} sent`);
    }
  };

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    return (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
      (genreFilter === "All" || b.genre === genreFilter);
  });

  const pendingCount = myRequests.filter(r => r.status === "pending").length;

  const navItems: { id: MemberTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "browse", label: "Browse Catalog", icon: BookOpen },
        { id: "saved", label: "Saved Books", icon: Heart, count: (member.savedBooks || []).length },
    { id: "myloans", label: "My Loans", icon: Clock, count: pendingCount || undefined },
    { id: "membership", label: "Membership", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-64 flex-shrink-0 border-r" style={{ background: "var(--sidebar)", borderColor: "var(--sidebar-border)" }}>
        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "var(--primary)" }}>
              <BookMarked size={17} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>Arcanum</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Member Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: "#fff", borderColor: "var(--border)" }}>
            <img src={member.avatarUrl} alt={member.name} className="w-9 h-9 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "var(--foreground)" }}>{member.name.split(" ")[0]}</p>
              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{member.tier} Member</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, count }) => {
            const active = tab === id;
            const isSavedTab = id === "saved";
            return (
              <button key={id} onClick={() => setTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                style={{
                  background: active ? (isSavedTab ? "rgba(239,68,68,0.08)" : "rgba(44,95,74,0.1)") : "transparent",
                  color: active ? (isSavedTab ? "#dc2626" : "var(--primary)") : "var(--muted-foreground)",
                  border: "none", cursor: "pointer", textAlign: "left",
                  fontFamily: "'Inter', sans-serif", fontWeight: active ? 600 : 400,
                }}>
                <Icon size={15} fill={isSavedTab && active ? "#dc2626" : "transparent"} />
                {label}
                <div className="ml-auto flex items-center gap-1">
                  {count !== undefined && count > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: active ? (isSavedTab ? "#dc2626" : "var(--primary)") : "var(--secondary)", color: active ? "#fff" : "var(--muted-foreground)", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
                      {count}
                    </span>
                  )}
                  {active && !count && <ChevronRight size={13} style={{ color: isSavedTab ? "#dc2626" : "var(--primary)" }} />}
                </div>
              </button>
            );
          })}
        </nav>

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--foreground)" }}>
              {tab === "browse" && "Browse Catalog"}
              {tab === "saved" && "Saved Books"}
              {tab === "myloans" && "My Loans"}
              {tab === "membership" && "My Membership"}
            </h1>
            <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
              {tab === "browse" && `${books.filter(b => b.available).length} books available to borrow`}
              {tab === "saved" && ((member.savedBooks || []).length > 0 ? `${(member.savedBooks || []).length} books saved · tap the heart to remove` : "No books saved yet")}
              {tab === "myloans" && `${myLoans.filter(l => l.status !== "returned").length} active · ${myRequests.filter(r => r.status === "pending").length} pending approval`}
              {tab === "membership" && `${member.memberId} · ${member.tier} Tier`}
            </p>
          </div>
          {tab === "browse" && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color="var(--muted-foreground)" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books..."
                className="pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "var(--secondary)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif", width: "220px" }} />
            </div>
          )}
        </header>

        <main className="flex-1 overflow-auto p-8">

          {/* ── BROWSE ── */}
          {tab === "browse" && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenreFilter(g)}
                    className="px-3 py-1.5 rounded-full text-xs transition-all"
                    style={{ fontFamily: "'DM Mono', monospace", background: genreFilter === g ? "var(--primary)" : "#fff", color: genreFilter === g ? "#fff" : "var(--muted-foreground)", border: `1.5px solid ${genreFilter === g ? "var(--primary)" : "var(--border)"}`, cursor: "pointer" }}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredBooks.map(book => (
                  <BrowseBookCard
                    key={book.id} book={book}
                    isSaved={(member.savedBooks || []).includes(book.id)}
                    onToggleSave={toggleSave}
                    onDetail={setDetailBook}
                    onBorrow={handleBorrowRequest}
                    onReserve={() => onAddReservation(book.isbn || book.id, member.memberId, member.tier === "Gold" ? "Priority" : "Normal")}
                    isReserved={reservations.some(r => r.book === (book.isbn || book.id) && r.member === member.memberId && r.status === "Active")}
                    canReserve={member.tier === "Silver" || member.tier === "Gold"}
                  />
                ))}
              </div>
              {filteredBooks.length === 0 && (
                <div className="text-center py-20" style={{ color: "var(--muted-foreground)", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic" }}>No books found.</div>
              )}
            </div>
          )}

          {/* ── SAVED ── */}
          {tab === "saved" && (
            <SavedBooksPage
              savedBooks={member.savedBooks || []} books={books}
              onToggleSave={toggleSave}
              onDetail={setDetailBook}
              onBorrow={handleBorrowRequest}
              onBorrowAll={handleBorrowAllSaved}
            />
          )}

          {/* ── MY LOANS ── */}
          {tab === "myloans" && (
            <div className="space-y-7">
              {/* Borrow Requests section */}
              {myRequests.length > 0 && (
                <section>
                  <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>
                    Borrow Requests
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {myRequests.map(req => {
                      const s = REQUEST_STATUS_STYLE[req.status];
                      return (
                        <div key={req.id} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: req.status === "pending" ? "rgba(201,151,58,0.25)" : req.status === "approved" ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                          <div className="flex items-center gap-5 p-5">
                            <img src={req.bookCover} alt={req.bookTitle} className="w-14 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", fontStyle: "italic" }}>{req.bookTitle}</h3>
                                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full flex-shrink-0" style={{ fontFamily: "'DM Mono', monospace", background: s.bg, color: s.color }}>
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                                  {s.label}
                                </span>
                              </div>
                              <p className="text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{req.bookAuthor}</p>
                              <div className="flex items-center gap-5 mt-2.5">
                                <div>
                                  <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Requested</p>
                                  <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>{req.requestedDate}</p>
                                </div>
                                {req.status === "approved" && req.dueDate && (
                                  <div>
                                    <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Due Date</p>
                                    <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "#15803d", fontWeight: 600 }}>{req.dueDate}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 p-2.5 rounded-xl" style={{ background: req.status === "pending" ? "rgba(201,151,58,0.08)" : req.status === "approved" ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
                              {req.status === "pending" && <Send size={16} color="#c9973a" />}
                              {req.status === "approved" && <CheckCircle2 size={16} color="#16a34a" />}
                              {req.status === "rejected" && <X size={16} color="#dc2626" />}
                            </div>
                          </div>
                          {req.status === "pending" && (
                            <div className="px-5 py-2.5 border-t" style={{ borderColor: "rgba(201,151,58,0.15)", background: "rgba(201,151,58,0.04)" }}>
                              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#92400e" }}>
                                Awaiting librarian review. You'll be notified once approved.
                              </p>
                            </div>
                          )}
                          {req.status === "approved" && (
                            <div className="px-5 py-2.5 border-t flex items-center justify-between" style={{ borderColor: "rgba(22,163,74,0.15)", background: "rgba(22,163,74,0.04)" }}>
                              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#15803d" }}>
                                Approved! Pick up your book at the library desk.
                              </p>
                            </div>
                          )}
                          {req.status === "rejected" && (
                            <div className="px-5 py-2.5 border-t" style={{ borderColor: "rgba(220,38,38,0.15)", background: "rgba(220,38,38,0.04)" }}>
                              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#dc2626" }}>
                                Request declined. Please visit the library or contact staff for assistance.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Reservations section */}
              {reservations.filter(r => r.member === member.memberId && r.status === "Active").length > 0 && (
                <section>
                  <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>
                    Reservations
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {reservations.filter(r => r.member === member.memberId && r.status === "Active").map(res => {
                      const book = books.find(b => b.isbn === res.book || b.id === res.book);
                      return (
                        <div key={res.id} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "rgba(217,119,6,0.25)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                          <div className="flex items-center gap-5 p-5">
                            <img src={book?.coverUrl} alt={res.bookTitle || res.book} className="w-14 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", fontStyle: "italic" }}>{res.bookTitle || book?.title || res.book}</h3>
                                <span className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(217,119,6,0.1)", color: "#d97706" }}>
                                  <Clock size={10} /> {res.priority === "Priority" ? "Priority" : "Waiting"}
                                </span>
                              </div>
                              <p className="text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>Reserved on {res.reservedDate}</p>
                            </div>
                            <button
                              onClick={() => onCancelReservation(res)}
                              className="text-xs px-3 py-1.5 rounded-lg"
                              style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1.5px solid rgba(220,38,38,0.2)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Active loans section */}
              <section>
                <h2 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>
                  Active Loans
                </h2>
                {activeLoans.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "var(--border)" }}>
                    <BookOpen size={36} color="var(--muted-foreground)" className="mx-auto mb-3 opacity-30" />
                    <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "var(--muted-foreground)" }}>No active loans.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {activeLoans.map(loan => {
                      const book = books.find(b => b.id === loan.bookId);
                      const isOverdue = loan.status === "overdue";
                      const returnReq = myReturnRequests.find(r => r.loanId === loan.id);
                      const isReturnPending = returnReq?.status === "pending";
                      const isReturnConfirmed = returnReq?.status === "confirmed";

                      return (
                        <div key={loan.id} className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-all"
                          style={{
                            borderColor: isReturnPending ? "rgba(44,95,74,0.25)" : isReturnConfirmed ? "rgba(22,163,74,0.25)" : isOverdue ? "rgba(220,38,38,0.25)" : "var(--border)",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                          }}>
                          <div className="flex items-center gap-5 p-5">
                            <div className="relative flex-shrink-0">
                              <img src={book?.coverUrl} alt={loan.bookTitle} className="w-16 h-24 object-cover rounded-xl shadow-sm" />
                              {(isReturnPending || isReturnConfirmed) && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                                  style={{ background: isReturnConfirmed ? "#16a34a" : "var(--primary)" }}>
                                  <RotateCcw size={11} color="#fff" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)", fontStyle: "italic" }}>
                                  {loan.bookTitle}
                                </h3>
                                <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                                  style={{
                                    fontFamily: "'DM Mono', monospace",
                                    background: isReturnConfirmed ? "rgba(220,252,231,0.9)" : isReturnPending ? "rgba(44,95,74,0.1)" : isOverdue ? "rgba(220,38,38,0.1)" : "rgba(220,252,231,0.8)",
                                    color: isReturnConfirmed ? "#15803d" : isReturnPending ? "#2c5f4a" : isOverdue ? "#dc2626" : "#15803d",
                                  }}>
                                  {isReturnConfirmed ? "Return Confirmed" : isReturnPending ? "Return Pending" : isOverdue ? "Overdue" : "On Loan"}
                                </span>
                              </div>
                              <p className="text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{book?.author}</p>
                              <div className="flex items-center gap-5 mt-3">
                                <div>
                                  <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Borrowed</p>
                                  <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>{loan.borrowed}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Due Date</p>
                                  <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: isOverdue && !returnReq ? "#dc2626" : "var(--foreground)", fontWeight: isOverdue && !returnReq ? 600 : 400 }}>{loan.due}</p>
                                </div>
                                {returnReq && (
                                  <div>
                                    <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Return Requested</p>
                                    <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>{returnReq.returnRequestedDate}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Return action area */}
                            <div className="flex-shrink-0 flex items-center gap-2">
                              {!isReturnConfirmed && !isReturnPending && !isOverdue && (
                                <button
                                  onClick={() => onRenewLoan(loan.frappeName || "", member.tier)}
                                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs transition-all hover:opacity-90"
                                  style={{ background: "rgba(44,95,74,0.08)", color: "var(--primary)", border: "1.5px solid rgba(44,95,74,0.15)", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                  <RefreshCw size={12} /> Renew
                                </button>
                              )}
                              {isReturnConfirmed ? (
                                <div className="p-3 rounded-xl" style={{ background: "rgba(22,163,74,0.08)" }}>
                                  <CheckCircle2 size={20} color="#16a34a" />
                                </div>
                              ) : isReturnPending ? (
                                <div className="p-3 rounded-xl" style={{ background: "rgba(44,95,74,0.07)" }}>
                                  <RotateCcw size={20} color="var(--primary)" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setReturningLoan(loan); setReturnStep("confirm"); }}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
                                  style={{ background: isOverdue ? "#dc2626" : "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                  <RotateCcw size={13} /> Return
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Footer strip */}
                          {isReturnPending && (
                            <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(44,95,74,0.15)", background: "rgba(44,95,74,0.04)" }}>
                              <RotateCcw size={12} color="var(--primary)" />
                              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#2c5f4a" }}>
                                Return request submitted — awaiting librarian confirmation at the desk.
                              </p>
                            </div>
                          )}
                          {isReturnConfirmed && (
                            <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(22,163,74,0.15)", background: "rgba(22,163,74,0.04)" }}>
                              <CheckCircle2 size={12} color="#16a34a" />
                              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#15803d" }}>
                                Return confirmed by librarian. Thank you!
                              </p>
                            </div>
                          )}
                          {isOverdue && !returnReq && (
                            <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(220,38,38,0.15)", background: "rgba(220,38,38,0.04)" }}>
                              <div className="flex items-center gap-2">
                                <AlertTriangle size={12} color="#dc2626" />
                                <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#dc2626" }}>This item is past due. Please return it promptly.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ── MEMBERSHIP ── */}
          {tab === "membership" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: tier.bg, border: `1.5px solid ${tier.border}` }}>
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1771647287015-f30dbb239646?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=900&h=200&q=80"
                    alt="Library" className="w-full h-40 object-cover opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-between px-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace", color: tier.color, opacity: 0.7 }}>Arcanum Public Library</p>
                      <div className="flex items-center gap-3">
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.8rem", color: tier.color }}>{member.name}</h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: MEMBER_STATUS_STYLE[member.status]?.bg || "#f3f4f6", color: MEMBER_STATUS_STYLE[member.status]?.color || "#6b7280" }}>
                          {MEMBER_STATUS_STYLE[member.status]?.label || member.status}
                        </span>
                      </div>
                      <p className="mt-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: tier.color, opacity: 0.8 }}>{member.memberId}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <Award size={20} style={{ color: tier.badge }} />
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: tier.color }}>{member.tier}</span>
                      </div>
                      <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: tier.color, opacity: 0.7 }}>Member since {member.memberSince}</p>
                      <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: tier.color, opacity: 0.7 }}>Expires {member.expiryDate}</p>
                    </div>
                  </div>
                </div>
                  <div className="flex items-center justify-between px-8 py-4" style={{ borderTop: `1px solid ${tier.border}40` }}>
                    <div className="flex gap-6">
                      {[
                        { label: "Total Borrowed", value: member.totalBorrowed },
                        { label: "Active Loans", value: member.activeLoans },
                        { label: "Saved Books", value: (member.savedBooks || []).length },
                      ].map(s => (
                        <div key={s.label}>
                          <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: tier.color, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.4rem", color: tier.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 mx-8 max-w-xs">
                      {(() => {
                        const limits = { Bronze: 3, Silver: 5, Gold: 8 } as const;
                        const max = limits[member.tier];
                        const used = member.activeLoans;
                        const pct = Math.min(100, (used / max) * 100);
                        return (
                          <div>
                            <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'DM Mono', monospace", color: tier.color, opacity: 0.7 }}>
                              <span>Loan Usage</span>
                              <span>{used}/{max}</span>
                            </div>
                            <div className="w-full h-2 rounded-full" style={{ background: `${tier.badge}20` }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tier.badge }} />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  <button onClick={() => onRenewMembership(member.memberId)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm" style={{ background: tier.badge, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    <RefreshCw size={14} /> Renew Membership
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "1rem" }}>
                  {member.tier} Member Benefits
                </h3>
                <div className="space-y-3">
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(44,95,74,0.1)" }}>
                        <CheckCircle2 size={13} color="var(--primary)" />
                      </div>
                      <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "var(--foreground)" }}>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>


              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "1rem" }}>Membership Tiers</h3>
                <div className="grid grid-cols-3 gap-4">
                  {(Object.entries(TIER_CONFIG) as [string, typeof TIER_CONFIG.Gold][]).map(([name, config]) => {
                    const isCurrent = name === member.tier;
                    return (
                      <div key={name} className="rounded-xl p-4 border-2 relative" style={{ borderColor: isCurrent ? config.border : "var(--border)", background: isCurrent ? config.bg : "#fafaf8" }}>
                        {isCurrent && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "'DM Mono', monospace", background: config.badge, color: "#fff" }}>Current</span>}
                        <div className="flex items-center gap-2 mb-3">
                          <Award size={16} style={{ color: config.badge }} />
                          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: config.color }}>{name}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {config.perks.slice(0, 3).map((p, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="mt-0.5 text-xs" style={{ color: config.badge }}>✓</span>
                              <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: "var(--muted-foreground)" }}>{p}</span>
                            </li>
                          ))}
                        </ul>
                        {!isCurrent && (
                          <button onClick={() => toast.info(`Visit the library to upgrade to ${name}`)} className="w-full mt-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-80 transition-all" style={{ background: config.badge, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                            Upgrade <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "1rem" }}>Reading History</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Books Read", value: member.totalBorrowed, icon: BookOpen },
                    { label: "Active Now", value: member.activeLoans, icon: Clock },
                    { label: "Member Since", value: member.memberSince, icon: Calendar },
                  ].map(s => (
                    <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: "var(--secondary)" }}>
                      <s.icon size={18} color="var(--primary)" className="mx-auto mb-2" />
                      <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--foreground)" }}>{s.value}</p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {fines.filter(f => f.member === member.memberId).length > 0 && (
                <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "1rem" }}>
                    Fines & Fees
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full align-middle" style={{ fontFamily: "'DM Mono', monospace", background: "rgba(220,38,38,0.08)", color: "#dc2626" }}>
                      {fines.filter(f => f.member === member.memberId && f.status === "Unpaid").length} unpaid
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {fines.filter(f => f.member === member.memberId).map(f => (
                      <div key={f.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: f.status === "Unpaid" ? "rgba(220,38,38,0.04)" : "rgba(220,252,231,0.4)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: f.status === "Unpaid" ? "rgba(220,38,38,0.1)" : "rgba(22,163,74,0.1)" }}>
                            {f.status === "Unpaid" ? <AlertTriangle size={14} color="#dc2626" /> : <CheckCircle2 size={14} color="#16a34a" />}
                          </div>
                          <div>
                            <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "var(--foreground)" }}>{f.reason}</p>
                            <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>{f.fineDate}{f.paidDate ? ` · Paid ${f.paidDate}` : ""}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold" style={{ fontFamily: "'DM Mono', monospace", color: f.status === "Unpaid" ? "#dc2626" : "#16a34a" }}>
                          ${f.amount.toFixed(2)}
                        </span>
                        {f.status === "Unpaid" && f.frappeName && (
                          <button onClick={() => onPayFine?.(f.frappeName!)}
                            className="text-xs px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80 ml-2"
                            style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
                            Pay
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {detailBook && (
        <BookDetailModal
          book={detailBook}
          isSaved={(member.savedBooks || []).includes(detailBook.id)}
          onToggleSave={toggleSave}
          onClose={() => setDetailBook(null)}
          onBorrow={b => { handleBorrowRequest(b); setDetailBook(null); }}
          onReserve={() => onAddReservation(detailBook.isbn || detailBook.id, member.memberId, member.tier === "Gold" ? "Priority" : "Normal")}
          isReserved={reservations.some(r => r.book === (detailBook.isbn || detailBook.id) && r.member === member.memberId && r.status === "Active")}
          canReserve={member.tier === "Silver" || member.tier === "Gold"}
        />
      )}
      {requestedBook && (
        <RequestSentModal
          book={requestedBook}
          onClose={() => { setRequestedBook(null); setTab("myloans"); }}
        />
      )}
      {returningLoan && returnStep === "confirm" && (
        <ReturnConfirmModal
          loan={returningLoan}
          book={books.find(b => b.id === returningLoan.bookId)}
          onClose={() => { setReturningLoan(null); setReturnStep(null); }}
          onConfirm={() => handleReturnSubmit(returningLoan)}
        />
      )}
      {returningLoan && returnStep === "sent" && (
        <ReturnSentModal
          loan={returningLoan}
          onClose={() => { setReturningLoan(null); setReturnStep(null); }}
        />
      )}
    </div>
  );
}
