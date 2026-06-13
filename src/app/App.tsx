import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { BookMarked, Shield, BookOpen, Users, BarChart3, Star, ArrowRight } from "lucide-react";
import { LibrarianApp } from "./components/LibrarianApp";
import { MemberApp } from "./components/MemberApp";
import { BorrowRequest, ReturnRequest, LoanRecord, FineRecord, BookItem, Member, MEMBERS, LOANS as HARDCODED_LOANS } from "./components/data";
import { getBooks, bookToItem, updateBook } from "../service/api";
import { getMembers, createMember, createUser, updateMember, frappeMemberToMember, memberToFrappePayload, hashId } from "../service/member";
import {
  getBorrowRequests, createBorrowRequest, updateBorrowRequest as updateFrappeBorrowRequest,
  getLoans as fetchLoans, createLoan, updateLoan as updateFrappeLoan,
  getReturnRequests, createReturnRequest, updateReturnRequest as updateFrappeReturnRequest,
  frappeLoanToLoanRecord,
} from "../service/loan";
import { getFines, getMemberFines, createFine, updateFine, frappeFineToFineRecord } from "../service/fine";

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
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loans, setLoans] = useState<LoanRecord[]>(HARDCODED_LOANS);
  const [fines, setFines] = useState<FineRecord[]>([]);
  const membersFetched = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [bookData, memberData, borrowData, loanData, returnData, fineData] = await Promise.all([
          getBooks(),
          getMembers().catch(() => []),
          getBorrowRequests().catch(() => []),
          fetchLoans().catch(() => []),
          getReturnRequests().catch(() => []),
          getFines().catch(() => []),
        ]);
        setBooks(bookData.map(bookToItem));
        if (memberData.length > 0 && !membersFetched.current) {
          membersFetched.current = true;
          const apiMembers: Member[] = memberData.map(frappeMemberToMember);
          setMembers(prev => {
            const emails = new Set(prev.map(m => m.email.toLowerCase()));
            const merged = [...prev];
            for (const am of apiMembers) {
              if (!emails.has(am.email.toLowerCase())) {
                emails.add(am.email.toLowerCase());
                merged.push(am);
              }
            }
            return merged;
          });
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
                ? (member.avatar.startsWith("http") ? member.avatar : `https://phyothant.j.frappe.cloud${member.avatar}`)
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
                ? (member.avatar.startsWith("http") ? member.avatar : `https://phyothant.j.frappe.cloud${member.avatar}`)
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
      (async () => {
        try {
          await updateFrappeBorrowRequest(req.frappeName, {
            status: status === "approved" ? "Approved" : "Rejected",
          });
          if (status === "approved") {
            const today = new Date().toISOString().slice(0, 10);
            const due = new Date();
            due.setDate(due.getDate() + 14);
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
            } as LoanRecord, ...p]);
            setBorrowRequests(p =>
              p.map(r => r.id === id ? { ...r, status, dueDate } : r)
            );
            try {
              const isbn = req.bookIsbn || req.bookId;
              const memberName = req.memberFrappeName || "";
              const memberRec = members.find(m => m.memberId === memberName);
              await updateBook(isbn, { borrowed_copies: (books.find(b => b.isbn === isbn)?.borrowedCopies || 0) + 1 } as any);
              await updateMember(memberName, {
                active_loans: (memberRec?.activeLoans || 0) + 1,
                total_borrowed: (memberRec?.totalBorrowed || 0) + 1,
              } as any);
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
      await updateMember(member.memberId, { saved_books: next } as any);
    } catch (err) {
      console.error("Failed to sync saved books:", err);
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
      (async () => {
        try {
          await updateFrappeReturnRequest(req.frappeName, { status: "Confirmed" });
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
              }
            } catch (countErr) {
              console.error("Failed to update counters:", countErr);
            }
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

    if (role === null) return <LoginScreen onSelect={setRole} />;
    if (role === "librarian") return (
      <LibrarianApp
        onSwitchRole={() => { setRole(null); setCurrentMemberId(null); }}
        books={books}
        onBooksChange={setBooks}
        members={members}
        onAddMember={addMember}
        borrowRequests={borrowRequests}
        onUpdateBorrowRequest={updateBorrowRequest}
        returnRequests={returnRequests}
        onConfirmReturn={confirmReturn}
        loans={loans}
      />
    );
    if (role === "member") return (
      <MemberApp
        onSwitchRole={() => { setRole(null); setCurrentMemberId(null); }}
        books={books}
        members={members}
        currentMemberId={currentMemberId}
        onLogin={setCurrentMemberId}
        borrowRequests={borrowRequests}
        onAddRequest={addBorrowRequest}
        returnRequests={returnRequests}
        onAddReturnRequest={addReturnRequest}
        loans={loans}
        fines={fines}
        onToggleSavedBook={toggleSavedBook}
      />
    );
    return null;
  }
}
