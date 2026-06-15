import axios from "axios";

const BASE_URL = import.meta.env.VITE_FRAPPE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `token ${import.meta.env.VITE_FRAPPE_API_KEY}:${import.meta.env.VITE_FRAPPE_API_SECRET}`,
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
  renewals?: number;
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

