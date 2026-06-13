// src/service/member.ts
import axios from "axios";
import type { FrappeMember, LibraryMember, MemberTier, MemberStatus } from "../types/member";
import type { Member } from "../app/components/data";

const BASE_URL = "https://phyothant.j.frappe.cloud";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "token 74665ad15a4aea0:12c4b2f10b7b837",
  },
});

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function toMySQLDate(d: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const m = d.match(/^(\w{3})\s+(\d{4})$/);
  if (m) {
    const month = String(MONTHS.indexOf(m[1]) + 1).padStart(2, "0");
    return `${m[2]}-${month}-01`;
  }
  return d;
}

function toDisplayDate(d: string): string {
  const m = d.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (m) {
    const monthIndex = parseInt(m[2], 10) - 1;
    return `${MONTHS[monthIndex]} ${m[1]}`;
  }
  return d;
}

export interface FrappeMemberRaw {
  name: string;
  full_name: string;
  email: string;
  phone?: string;
  tier: MemberTier;
  status: MemberStatus;
  avatar?: string;
  member_since: string;
  expiry_date: string;
  user?: string;
  active_loans: number;
  total_borrowed: number;
  saved_books?: string[];
  creation: string;
  modified: string;
}

export async function getMembers(): Promise<FrappeMember[]> {
  const res = await api.get("/api/resource/Library%20Member", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function getMember(name: string): Promise<FrappeMember> {
  const res = await api.get(`/api/resource/Library%20Member/${encodeURIComponent(name)}`);
  return res.data.data;
}

export async function createMember(data: Partial<FrappeMember>) {
  const res = await api.post("/api/resource/Library%20Member", data);
  return res.data.data;
}

export async function createUser(email: string, firstName: string, roles: string[] = []) {
  const res = await api.post("/api/resource/User", {
    email,
    first_name: firstName,
    send_welcome_email: 1,
    roles: roles.map(r => ({ role: r })),
  });
  return res.data.data;
}

export async function updateMember(name: string, data: Partial<FrappeMember>) {
  const res = await api.put(`/api/resource/Library%20Member/${encodeURIComponent(name)}`, data);
  return res.data.data;
}

export async function deleteMember(name: string) {
  const res = await api.delete(`/api/resource/Library%20Member/${encodeURIComponent(name)}`);
  return res.data;
}

export function memberToItem(m: FrappeMemberRaw): LibraryMember {
  return {
    id: m.name,
    name: m.full_name,
    email: m.email,
    phone: m.phone || "",
    tier: m.tier,
    status: m.status,
    avatarUrl: m.avatar
      ? (m.avatar.startsWith("http") ? m.avatar : `${BASE_URL}${m.avatar}`)
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    memberSince: toDisplayDate(m.member_since),
    expiryDate: toDisplayDate(m.expiry_date),
    activeLoans: m.active_loans,
    totalBorrowed: m.total_borrowed,
    memberId: m.name,
    savedBooks: Array.isArray(m.saved_books) ? m.saved_books : [],
  };
}

export function itemToMember(item: Partial<LibraryMember>) {
  return {
    full_name: item.name,
    email: item.email,
    phone: item.phone,
    tier: item.tier,
    status: item.status || "Active",
    avatar: item.avatarUrl
      ? item.avatarUrl.replace(`${BASE_URL}`, "")
      : "",
    member_since: item.memberSince ? toMySQLDate(item.memberSince) : "",
    expiry_date: item.expiryDate ? toMySQLDate(item.expiryDate) : "",
    active_loans: item.activeLoans || 0,
    total_borrowed: item.totalBorrowed || 0,
    saved_books: item.savedBooks || [],
  };
}

export function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function frappeMemberToMember(m: FrappeMemberRaw): Member {
  const id = hashId(m.name);
  return {
    id,
    name: m.full_name,
    email: m.email,
    phone: m.phone || "",
    memberSince: m.member_since ? toDisplayDate(m.member_since) : "Unknown",
    activeLoans: m.active_loans || 0,
    totalBorrowed: m.total_borrowed || 0,
    status: (m.status?.toLowerCase() || "active") as Member["status"],
    avatarUrl: m.avatar
      ? (m.avatar.startsWith("http") ? m.avatar : `${BASE_URL}${m.avatar}`)
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: m.tier,
    memberId: m.name,
    expiryDate: m.expiry_date ? toDisplayDate(m.expiry_date) : "Unknown",
    savedBooks: Array.isArray(m.saved_books) ? m.saved_books : [],
  };
}

export function memberToFrappePayload(member: Member) {
  return {
    full_name: member.name,
    email: member.email,
    phone: member.phone || "",
    tier: member.tier,
    status: member.status.charAt(0).toUpperCase() + member.status.slice(1),
    avatar: member.avatarUrl || "",
    member_since: toMySQLDate(member.memberSince),
    expiry_date: toMySQLDate(member.expiryDate),
    active_loans: member.activeLoans || 0,
    total_borrowed: member.totalBorrowed || 0,
    saved_books: member.savedBooks || [],
  };
}
