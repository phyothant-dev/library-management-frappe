import axios from "axios";
import type { Reservation } from "../app/components/data";

const BASE_URL = import.meta.env.VITE_FRAPPE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `token ${import.meta.env.VITE_FRAPPE_API_KEY}:${import.meta.env.VITE_FRAPPE_API_SECRET}`,
  },
});

export interface FrappeReservation {
  name: string;
  book: string;
  member: string;
  reserved_date: string;
  status: "Active" | "Fulfilled" | "Cancelled";
  priority: "Normal" | "Priority";
  loan?: string;
  creation: string;
}

export async function getReservations(): Promise<FrappeReservation[]> {
  const res = await api.get("/api/resource/Library%20Reservation", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function createReservation(data: {
  book: string;
  member: string;
  priority: "Normal" | "Priority";
}) {
  const res = await api.post("/api/resource/Library%20Reservation", {
    ...data,
    reserved_date: new Date().toISOString().slice(0, 10),
    status: "Active",
  });
  return res.data.data;
}

export async function updateReservation(
  name: string,
  data: Partial<FrappeReservation>,
) {
  const res = await api.put(
    `/api/resource/Library%20Reservation/${encodeURIComponent(name)}`,
    data,
  );
  return res.data.data;
}

export function frappeReservationToReservation(r: FrappeReservation): Reservation {
  return {
    id: Date.now() + Math.random(),
    frappeName: r.name,
    book: r.book,
    member: r.member,
    reservedDate: r.reserved_date,
    status: r.status,
    priority: r.priority,
    loan: r.loan,
  };
}
