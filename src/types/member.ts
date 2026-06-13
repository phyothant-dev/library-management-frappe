// src/types/member.ts

export type MemberTier = "Bronze" | "Silver" | "Gold";
export type MemberStatus = "Active" | "Overdue" | "Suspended";

export interface FrappeMember {
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

export interface LibraryMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: MemberTier;
  status: MemberStatus;
  avatarUrl: string;
  memberSince: string;
  expiryDate: string;
  activeLoans: number;
  totalBorrowed: number;
  memberId: string;
  savedBooks?: string[];
}
