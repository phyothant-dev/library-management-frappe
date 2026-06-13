import axios from "axios";

const BASE_URL = "https://phyothant.j.frappe.cloud";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "token 74665ad15a4aea0:12c4b2f10b7b837",
  },
});

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

export async function getMemberFines(member: string): Promise<FrappeFine[]> {
  const res = await api.get("/api/resource/Fine", {
    params: {
      fields: JSON.stringify(["*"]),
      filters: JSON.stringify([["member", "=", member]]),
      limit_page_length: 50,
    },
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
