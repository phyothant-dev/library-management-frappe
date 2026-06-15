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

const DAILY_RATES: Record<string, number> = {
  Bronze: 0.50,
  Silver: 0.25,
  Gold: 0,
};

export function calculateFineAmount(
  memberTier: string,
  dueDate: string,
  returnDate: string,
): number {
  const rate = DAILY_RATES[memberTier] ?? 0.50;
  if (rate === 0) return 0;
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const overdueDays = Math.ceil(
    (returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (overdueDays <= 0) return 0;
  return Math.round(overdueDays * rate * 100) / 100;
}

export interface FrappeFine {
  name: string;
  member: string;
  loan?: string;
  amount: number;
  reason: "Overdue Return" | "Lost Book" | "Damaged Book" | "Other";
  status: "Unpaid" | "Paid";
  fine_date: string;
  paid_date?: string;
  creation: string;
}

export async function getFines(): Promise<FrappeFine[]> {
  const res = await api.get("/api/resource/Fine", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function createFine(data: {
  member: string;
  loan?: string;
  amount: number;
  reason: "Overdue Return" | "Lost Book" | "Damaged Book" | "Other";
  fine_date: string;
}) {
  const res = await api.post("/api/resource/Fine", data);
  return res.data.data;
}

export async function updateFine(
  name: string,
  data: Partial<FrappeFine>,
) {
  const res = await api.put(
    `/api/resource/Fine/${encodeURIComponent(name)}`,
    data,
  );
  return res.data.data;
}

export function frappeFineToFineRecord(f: FrappeFine): import("../app/components/data").FineRecord {
  return {
    id: Date.now() + Math.random(),
    frappeName: f.name,
    member: f.member,
    loan: f.loan,
    amount: f.amount,
    reason: f.reason,
    status: f.status,
    fineDate: f.fine_date,
    paidDate: f.paid_date,
  };
}
