import axios from "axios";
import type { BorrowRequest, ReturnRequest, LoanRecord } from "../app/components/data";

const BASE_URL = "https://phyothant.j.frappe.cloud";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "token 74665ad15a4aea0:12c4b2f10b7b837",
  },
});

export interface FrappeBorrowRequest {
  name: string;
  book: string;
  book_title: string;
  book_author: string;
  book_cover: string;
  member: string;
  member_name: string;
  status: "Pending" | "Approved" | "Rejected";
  requested_date: string;
  due_date?: string;
  creation: string;
}

export interface FrappeLoan {
  name: string;
  book: string;
  book_title: string;
  member: string;
  member_name: string;
  status: "Active" | "Overdue" | "Returned";
  borrowed_date: string;
  due_date: string;
  return_date?: string;
  creation: string;
}

export interface FrappeReturnRequest {
  name: string;
  loan: string;
  book: string;
  book_title: string;
  book_author: string;
  book_cover: string;
  member: string;
  member_name: string;
  status: "Pending" | "Confirmed";
  borrowed_date: string;
  due_date: string;
  return_requested_date: string;
  creation: string;
}

/* ─── Borrow Requests ─────────────────────────────────────────────────── */

export async function getBorrowRequests(): Promise<FrappeBorrowRequest[]> {
  const res = await api.get("/api/resource/Borrow%20Request", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function createBorrowRequest(data: {
  book: string;
  member: string;
  requested_date: string;
}) {
  const res = await api.post("/api/resource/Borrow%20Request", data);
  return res.data.data;
}

export async function updateBorrowRequest(
  name: string,
  data: Partial<FrappeBorrowRequest>,
) {
  const res = await api.put(
    `/api/resource/Borrow%20Request/${encodeURIComponent(name)}`,
    data,
  );
  return res.data.data;
}

/* ─── Library Loans ──────────────────────────────────────────────────── */

export async function getLoans(): Promise<FrappeLoan[]> {
  const res = await api.get("/api/resource/Library%20Loan", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function createLoan(data: {
  book: string;
  member: string;
  borrowed_date: string;
  due_date: string;
}) {
  const res = await api.post("/api/resource/Library%20Loan", data);
  return res.data.data;
}

export async function updateLoan(
  name: string,
  data: Partial<FrappeLoan>,
) {
  const res = await api.put(
    `/api/resource/Library%20Loan/${encodeURIComponent(name)}`,
    data,
  );
  return res.data.data;
}

/* ─── Return Requests ────────────────────────────────────────────────── */

export async function getReturnRequests(): Promise<FrappeReturnRequest[]> {
  const res = await api.get("/api/resource/Return%20Request", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function createReturnRequest(data: {
  loan: string;
  book: string;
  member: string;
  return_requested_date: string;
}) {
  const res = await api.post("/api/resource/Return%20Request", data);
  return res.data.data;
}

export async function updateReturnRequest(
  name: string,
  data: Partial<FrappeReturnRequest>,
) {
  const res = await api.put(
    `/api/resource/Return%20Request/${encodeURIComponent(name)}`,
    data,
  );
  return res.data.data;
}

export function frappeLoanToLoanRecord(
  l: FrappeLoan,
  memberLookup: Map<string, { avatar?: string }>,
): LoanRecord {
  const m = memberLookup.get(l.member);
  const now = new Date();
  const due = new Date(l.due_date);
  const isOverdue = l.status === "Active" && due < now;
  return {
    id: Date.now() + Math.random(),
    frappeName: l.name,
    bookId: l.book,
    bookIsbn: l.book,
    memberId: 0,
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
  };
}
