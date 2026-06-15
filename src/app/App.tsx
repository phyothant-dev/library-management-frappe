import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { BookMarked } from "lucide-react";
import { LibrarianApp } from "./components/LibrarianApp";
import { MemberApp } from "./components/MemberApp";
import { BorrowRequest, ReturnRequest, LoanRecord, FineRecord, Reservation, BookItem, Member } from "./components/data";
import { getBooks, bookToItem, updateBook } from "../service/api";
import { getMembers, createMember, createUser, updateMember, deleteMember as deleteFrappeMember, frappeMemberToMember, memberToFrappePayload, hashId } from "../service/member";
import {
  getBorrowRequests, createBorrowRequest, updateBorrowRequest as updateFrappeBorrowRequest,
  getLoans as fetchLoans, createLoan, updateLoan as updateFrappeLoan,
  getReturnRequests, createReturnRequest, updateReturnRequest as updateFrappeReturnRequest,
  frappeLoanToLoanRecord,
} from "../service/loan";
import { getFines, getMemberFines, createFine, updateFine, frappeFineToFineRecord, calculateFineAmount } from "../service/fine";
import {
  getReservations, getActiveReservations, createReservation, updateReservation as updateFrappeReservation,
  frappeReservationToReservation,
} from "../service/reservation";
import { login as frappeLogin, determineRole } from "../service/auth";

const FRAPPE_BASE = import.meta.env.VITE_FRAPPE_BASE_URL;

const TIER_LIMITS: Record<string, { maxBooks: number; loanPeriodDays: number; maxRenewals: number }> = {
  Bronze: { maxBooks: 3, loanPeriodDays: 21, maxRenewals: 1 },
  Silver: { maxBooks: 5, loanPeriodDays: 28, maxRenewals: 2 },
  Gold: { maxBooks: 8, loanPeriodDays: 35, maxRenewals: Infinity },
};

type Role = null | "librarian" | "assistant" | "member";

function LoginScreen({ books, members, loans, onLogin }: { books: BookItem[]; members: Member[]; loans: LoanRecord[]; onLogin: (role: Role, memberId?: number) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);
    try {
      const auth = await frappeLogin(email, password);
      const role = determineRole(auth.roles);
      if (role === "member") {
        const member = members.find(m => m.email.toLowerCase() === email.toLowerCase());
        if (!member) {
          setError("Member profile not found — contact the library");
          setLoggingIn(false);
          return;
        }
        onLogin("member", member.id);
      } else {
        onLogin(role);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?._error_message || err?.message;
      setError(typeof msg === "string" ? msg : "Login failed — check your credentials");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--background)", fontFamily: "'Inter', sans-serif" }}>
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
            Sign in to access the Arcanum library portal.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#fff", border: "1.5px solid var(--border)", color: "var(--foreground)", fontFamily: "'Inter', sans-serif" }}
                required
              />
            </div>

            {error && (
              <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#dc2626" }}>{error}</p>
            )}

            <button type="submit" disabled={loggingIn}
              className="w-full py-3 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--primary)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              {loggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            {[
              { value: books.length.toLocaleString(), label: "Books" },
              { value: members.length.toLocaleString(), label: "Members" },
              { value: loans.filter(l => l.status !== "returned").length.toLocaleString(), label: "On Loan" },
            ].map(s => (
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
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [fines, setFines] = useState<FineRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [bookData, memberData, borrowData, loanData, returnData, fineData, resData] = await Promise.all([
          getBooks(),
          getMembers().catch(() => []),
          getBorrowRequests().catch(() => []),
          fetchLoans().catch(() => []),
          getReturnRequests().catch(() => []),
          getFines().catch(() => []),
          getReservations().catch(() => []),
        ]);
        setBooks(bookData.map(bookToItem));
        if (memberData.length > 0) {
          setMembers(memberData.map(frappeMemberToMember));
        }
        if (borrowData.length > 0) {
          const memberLookup = new Map(memberData.map(m => [m.name, m]));
          setBorrowRequests(borrowData.map(br => {
            const member = memberLookup.get(br.member);
            return {
              id: Date.now() + Math.random(),
              frappeName: br.name,
              bookId: br.book,
              bookIsbn: br.book,
              memberId: member ? hashId(member.name) : 0,
              memberFrappeName: br.member,
              bookTitle: br.book_title,
              bookCover: br.book_cover || "",
              bookAuthor: br.book_author || "",
              memberName: br.member_name,
              memberAvatar: member?.avatar
                ? (member.avatar.startsWith("http") ? member.avatar : `${FRAPPE_BASE}${member.avatar}`)
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
              requestedDate: br.requested_date,
              status: br.status.toLowerCase() as "pending" | "approved" | "rejected",
              dueDate: br.due_date,
            } as BorrowRequest;
          }));
        }
        if (loanData.length > 0) {
          const memberLookup = new Map(memberData.map(m => [m.name, m]));
          const today = new Date();
          setLoans(loanData.map(l => {
            const m = memberLookup.get(l.member);
            const due = new Date(l.due_date);
            const isOverdue = l.status === "Active" && due < today;
            return {
              id: Date.now() + Math.random(),
              frappeName: l.name,
              bookId: l.book,
              bookIsbn: l.book,
              memberId: m ? hashId(m.name) : 0,
              memberFrappeName: l.member,
              bookTitle: l.book_title,
              memberName: l.member_name,
              borrowed: l.borrowed_date,
              due: l.due_date,
              returned: l.return_date || null,
              status: l.status === "Returned"
                ? "returned"
                : isOverdue
                  ? "overdue"
                  : "active",
            } as LoanRecord;
          }));
        }
        if (fineData.length > 0) {
          setFines(fineData.map(frappeFineToFineRecord));
        }
        if (resData.length > 0) {
          setReservations(resData.map(frappeReservationToReservation));
        }
        if (returnData.length > 0) {
          const memberLookup = new Map(memberData.map(m => [m.name, m]));
          setReturnRequests(returnData.map(rr => {
            const member = memberLookup.get(rr.member);
            return {
              id: Date.now() + Math.random(),
              frappeName: rr.name,
              loanFrappeName: rr.loan,
              bookId: rr.book,
              bookIsbn: rr.book,
              memberId: member ? hashId(member.name) : 0,
              memberFrappeName: rr.member,
              bookTitle: rr.book_title,
              bookCover: rr.book_cover || "",
              bookAuthor: rr.book_author || "",
              memberName: rr.member_name,
              memberAvatar: member?.avatar
                ? (member.avatar.startsWith("http") ? member.avatar : `${FRAPPE_BASE}${member.avatar}`)
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
              borrowedDate: rr.borrowed_date,
              dueDate: rr.due_date,
              returnRequestedDate: rr.return_requested_date,
              status: rr.status.toLowerCase() as "pending" | "confirmed",
            } as ReturnRequest;
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addMember = async (m: Member) => {
    setMembers(prev => [...prev, m]);
    try {
      const user = await createUser(m.email, m.name, ["Library Member"]);
      const payload = { ...memberToFrappePayload(m), user: user.name };
      await createMember(payload);
    } catch (err) {
      console.error("Failed to save member to Frappe:", err);
    }
    toast.success("Member registered", {
      description: `${m.name} has been added to the library.`,
    });
  };

  const addBorrowRequest = async (req: BorrowRequest) => {
    setBorrowRequests(prev => [req, ...prev]);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const frappeReq = await createBorrowRequest({
        book: req.bookIsbn || req.bookId,
        member: req.memberFrappeName || "",
        requested_date: today,
      });
      setBorrowRequests(prev =>
        prev.map(r => r.id === req.id
          ? { ...r, frappeName: frappeReq.name, requestedDate: today }
          : r
        )
      );
    } catch (err) {
      toast.error("Failed to sync borrow request with server");
      console.error("Failed to create borrow request:", err);
    }
  };

  const updateBorrowRequest = async (id: number, status: "approved" | "rejected") => {
    setBorrowRequests(prev => {
      const req = prev.find(r => r.id === id);
      if (!req) {
        toast.error("Request not found");
        return prev;
      }
      if (!req.frappeName) {
        toast.error("Borrow request not yet synced to server — try again in a moment");
        return prev;
      }
      const frappeName = req.frappeName;
      (async () => {
        try {
          await updateFrappeBorrowRequest(frappeName, {
            status: status === "approved" ? "Approved" : "Rejected",
          });
          if (status === "approved") {
            const memberRec = members.find(m => m.memberId === req.memberFrappeName);
            const tier = memberRec?.tier || "Bronze";
            const limits = TIER_LIMITS[tier];
            if ((memberRec?.activeLoans || 0) >= limits.maxBooks) {
              toast.error(`Limit reached — ${tier} members can only borrow ${limits.maxBooks} books at a time`);
              setBorrowRequests(p =>
                p.map(r => r.id === id ? { ...r, status: "rejected" } : r)
              );
              return prev;
            }
            const today = new Date().toISOString().slice(0, 10);
            const due = new Date();
            due.setDate(due.getDate() + limits.loanPeriodDays);
            const dueDate = due.toISOString().slice(0, 10);
            const loan = await createLoan({
              book: req.bookIsbn || req.bookId,
              member: req.memberFrappeName || "",
              borrowed_date: today,
              due_date: dueDate,
            });
            setLoans(p => [{
              id: Date.now() + Math.random(),
              frappeName: loan.name,
              bookId: req.bookIsbn || req.bookId,
              bookIsbn: req.bookIsbn,
              memberId: req.memberId,
              memberFrappeName: req.memberFrappeName,
              bookTitle: req.bookTitle,
              memberName: req.memberName,
              borrowed: today,
              due: dueDate,
              returned: null,
              status: "active",
              renewals: 0,
            } as LoanRecord, ...p]);
            setBorrowRequests(p =>
              p.map(r => r.id === id ? { ...r, status, dueDate } : r)
            );
            try {
              const isbn = req.bookIsbn || req.bookId;
              const memberName = req.memberFrappeName || "";
              await updateBook(isbn, { borrowed_copies: (books.find(b => b.isbn === isbn)?.borrowedCopies || 0) + 1 } as any);
              await updateMember(memberName, {
                active_loans: (memberRec?.activeLoans || 0) + 1,
                total_borrowed: (memberRec?.totalBorrowed || 0) + 1,
              } as any);
              setMembers(p => p.map(m =>
                m.memberId === memberName
                  ? { ...m, activeLoans: (m.activeLoans || 0) + 1, totalBorrowed: (m.totalBorrowed || 0) + 1 }
                  : m
              ));
            } catch (countErr) {
              console.error("Failed to update counters:", countErr);
            }
            toast.success("Loan created", {
              description: `${req.bookTitle} — ${dueDate}`,
            });
          } else {
            setBorrowRequests(p =>
              p.map(r => r.id === id ? { ...r, status } : r)
            );
            toast.success("Request rejected");
          }
        } catch (err) {
          toast.error("Failed to update borrow request");
          console.error(err);
        }
      })();
      return prev;
    });
  };

  const addReturnRequest = async (req: ReturnRequest) => {
    setReturnRequests(prev => [req, ...prev]);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const frappeReq = await createReturnRequest({
        loan: req.loanFrappeName || "",
        book: req.bookIsbn || req.bookId,
        member: req.memberFrappeName || "",
        return_requested_date: today,
      });
      setReturnRequests(prev =>
        prev.map(r => r.id === req.id
          ? { ...r, frappeName: frappeReq.name, returnRequestedDate: today }
          : r
        )
      );
    } catch (err) {
      toast.error("Failed to sync return request with server");
      console.error("Failed to create return request:", err);
    }
  };

  const toggleSavedBook = async (memberId: number, bookIsbn: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    const saved = member.savedBooks || [];
    const next = saved.includes(bookIsbn)
      ? saved.filter(b => b !== bookIsbn)
      : [...saved, bookIsbn];
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, savedBooks: next } : m
    ));
    try {
      await updateMember(member.memberId, { saved_books: JSON.stringify(next) } as any);
      toast.success(saved.includes(bookIsbn) ? "Book removed from saved" : "Book saved");
    } catch (err: any) {
      const msg = err?.response?.data?._error_message || err?.response?.data?.message || err?.message;
      toast.error(`Failed to sync: ${msg}`);
      console.error("Failed to sync saved books:", err);
      // revert local state
      setMembers(prev => prev.map(m =>
        m.id === memberId ? { ...m, savedBooks: saved } : m
      ));
    }
  };

  const renewMembership = async (memberId: string) => {
    const member = members.find(m => m.memberId === memberId);
    if (!member) return;
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expiry = nextYear.toISOString().slice(0, 10);
    try {
      await updateMember(memberId, { expiry_date: expiry } as any);
      setMembers(p => p.map(m =>
        m.memberId === memberId ? { ...m, expiryDate: nextYear.toLocaleDateString("en-US", { month: "short", year: "numeric" }) } : m
      ));
      toast.success("Membership renewed", { description: `Expires ${nextYear.toLocaleDateString("en-US", { month: "long", year: "numeric" })}` });
    } catch (err) {
      toast.error("Failed to renew membership");
      console.error(err);
    }
  };

  const renewLoan = async (loanFrappeName: string, memberTier: string) => {
    const limits = TIER_LIMITS[memberTier] || TIER_LIMITS.Bronze;
    const loan = loans.find(l => l.frappeName === loanFrappeName);
    if (!loan) { toast.error("Loan not found"); return; }
    if ((loan.renewals || 0) >= limits.maxRenewals) {
      toast.error(`Renewal limit reached — ${memberTier} allows ${limits.maxRenewals} renewals`);
      return;
    }
    const today = new Date();
    const newDue = new Date(loan.due);
    newDue.setDate(newDue.getDate() + limits.loanPeriodDays);
    if (newDue <= today) {
      newDue.setTime(today.getTime() + limits.loanPeriodDays * 24 * 60 * 60 * 1000);
    }
    const newDueStr = newDue.toISOString().slice(0, 10);
    try {
      await updateFrappeLoan(loanFrappeName, { due_date: newDueStr, renewals: (loan.renewals || 0) + 1 } as any);
      setLoans(p => p.map(l =>
        l.frappeName === loanFrappeName
          ? { ...l, due: newDueStr, renewals: (l.renewals || 0) + 1 }
          : l
      ));
      toast.success("Loan renewed", { description: `New due date: ${newDueStr}` });
    } catch (err) {
      toast.error("Failed to renew loan");
      console.error(err);
    }
  };

  const addReservation = async (bookId: string, memberId: string, priority: "Normal" | "Priority") => {
    try {
      const created = await createReservation({ book: bookId, member: memberId, priority });
      const res = frappeReservationToReservation(created);
      setReservations(prev => [...prev, res]);
      toast.success("Book reserved", { description: "You'll be notified when it's available" });
    } catch (err) {
      toast.error("Failed to reserve book");
      console.error(err);
    }
  };

  const deleteMember = async (memberId: string, localId: number) => {
    try {
      await deleteFrappeMember(memberId);
      setMembers(prev => prev.filter(m => m.id !== localId));
      toast.success("Member deleted");
    } catch (err) {
      toast.error("Failed to delete member");
      console.error(err);
    }
  };

  const editMember = async (memberId: string, data: Partial<Member>) => {
    try {
      const tier = data.tier;
      await updateMember(memberId, { tier, full_name: data.name, email: data.email, phone: data.phone } as any);
      setMembers(prev => prev.map(m =>
        m.memberId === memberId ? { ...m, ...data } : m
      ));
      toast.success("Member updated", { description: data.name });
    } catch (err) {
      toast.error("Failed to update member");
      console.error(err);
    }
  };

  const cancelReservation = async (reservation: Reservation) => {
    if (!reservation.frappeName) return;
    try {
      await updateFrappeReservation(reservation.frappeName, { status: "Cancelled" });
      setReservations(p => p.map(r =>
        r.id === reservation.id ? { ...r, status: "Cancelled" } : r
      ));
      toast.success("Reservation cancelled");
    } catch (err) {
      toast.error("Failed to cancel reservation");
      console.error(err);
    }
  };

  const confirmReturn = (id: number) => {
    setReturnRequests(prev => {
      const req = prev.find(r => r.id === id);
      if (!req) {
        toast.error("Return request not found");
        return prev;
      }
      if (!req.frappeName) {
        toast.error("Return request not yet synced");
        return prev;
      }
      const frappeName = req.frappeName;
      (async () => {
        try {
          await updateFrappeReturnRequest(frappeName, { status: "Confirmed" });
          setReturnRequests(p =>
            p.map(r => r.id === id ? { ...r, status: "confirmed" as const } : r)
          );
          if (req.loanFrappeName) {
            const today = new Date().toISOString().slice(0, 10);
            await updateFrappeLoan(req.loanFrappeName, {
              status: "Returned",
              return_date: today,
            } as any);
            setLoans(p =>
              p.map(l => l.frappeName === req.loanFrappeName
                ? { ...l, status: "returned" as const, returned: today }
                : l
              )
            );
            try {
              await updateBook(req.bookIsbn || req.bookId, { borrowed_copies: Math.max(0, (books.find(b => b.isbn === (req.bookIsbn || req.bookId))?.borrowedCopies || 1) - 1) } as any);
              const memberRec = members.find(m => m.memberId === req.memberFrappeName);
              if (memberRec) {
                await updateMember(req.memberFrappeName || "", { active_loans: Math.max(0, (memberRec.activeLoans || 1) - 1) } as any);
                setMembers(p => p.map(m =>
                  m.memberId === req.memberFrappeName
                    ? { ...m, activeLoans: Math.max(0, (m.activeLoans || 1) - 1) }
                    : m
                ));
              }
              if (req.dueDate && new Date(req.dueDate) < new Date()) {
                const fineAmount = calculateFineAmount(
                  memberRec?.tier || "Bronze",
                  req.dueDate,
                  today,
                );
                if (fineAmount > 0) {
                  const created = await createFine({
                    member: req.memberFrappeName || "",
                    loan: req.loanFrappeName,
                    amount: fineAmount,
                    reason: "Overdue Return",
                    fine_date: today,
                  });
                  setFines(prev => [...prev, frappeFineToFineRecord(created)]);
                  toast.warning(`Overdue fine: $${fineAmount.toFixed(2)}`, {
                    description: `${req.bookTitle} · ${memberRec?.tier || "Bronze"} tier`,
                  });
                }
              }
            } catch (countErr) {
              console.error("Failed to update counters:", countErr);
            }
          }
          const bookReservations = reservations.filter(
            r => r.book === (req.bookIsbn || req.bookId) && r.status === "Active"
          );
          if (bookReservations.length > 0) {
            const sorted = bookReservations.sort((a, b) =>
              a.priority === "Priority" ? -1 : b.priority === "Priority" ? 1 : 0
            );
            const next = sorted[0];
            toast.info(`Reservation queue — ${bookReservations.length} waiting`, {
              description: `${next.memberName || next.member} is next (${next.priority})`,
            });
          }
          toast.success("Return confirmed", {
            description: req.bookTitle,
          });
        } catch (err) {
          toast.error("Failed to confirm return");
          console.error(err);
        }
      })();
      return prev;
    });
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      {renderContent()}
    </>
  );

  function renderContent() {
    if (loading) return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--muted-foreground)" }}>Connecting to Arcanum...</p>
      </div>
    );

    if (role === null) return <LoginScreen books={books} members={members} loans={loans} onLogin={(r, memberId) => { setRole(r); if (memberId) setCurrentMemberId(memberId); }} />;
    if (role === "librarian" || role === "assistant") return (
      <LibrarianApp
        role={role}
        books={books}
        onBooksChange={setBooks}
        members={members}
        onAddMember={addMember}
        borrowRequests={borrowRequests}
        onUpdateBorrowRequest={updateBorrowRequest}
        returnRequests={returnRequests}
        onConfirmReturn={confirmReturn}
        loans={loans}
        reservations={reservations}
        onEditMember={editMember}
        onDeleteMember={deleteMember}
      />
    );
    if (role === "member") return (
      <MemberApp
        books={books}
        members={members}
        currentMemberId={currentMemberId}
        borrowRequests={borrowRequests}
        onAddRequest={addBorrowRequest}
        returnRequests={returnRequests}
        onAddReturnRequest={addReturnRequest}
        loans={loans}
        fines={fines}
        onToggleSavedBook={toggleSavedBook}
        onRenewMembership={renewMembership}
        onRenewLoan={renewLoan}
        reservations={reservations}
        onAddReservation={addReservation}
        onCancelReservation={cancelReservation}
      />
    );
    return null;
  }
}
