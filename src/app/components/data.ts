export interface BorrowRequest {
  id: number;
  frappeName?: string;
  bookId: string;
  bookIsbn?: string;
  memberId: number;
  memberFrappeName?: string;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  memberName: string;
  memberAvatar: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected";
  dueDate?: string;
}

export interface ReturnRequest {
  id: number;
  frappeName?: string;
  loanId: number;
  loanFrappeName?: string;
  bookId: string;
  bookIsbn?: string;
  memberId: number;
  memberFrappeName?: string;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  memberName: string;
  memberAvatar: string;
  borrowedDate: string;
  dueDate: string;
  returnRequestedDate: string;
  status: "pending" | "confirmed";
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  available: boolean;
  rating: number;
  totalCopies: number;
  borrowedCopies: number;
  isbn: string;
  coverUrl: string;
  description: string;
}

export interface FineRecord {
  id: number;
  frappeName?: string;
  member: string;
  loan?: string;
  amount: number;
  reason: "Overdue Return" | "Lost Book" | "Damaged Book" | "Other";
  status: "Unpaid" | "Paid";
  fineDate: string;
  paidDate?: string;
  memberName?: string;
}

export interface Reservation {
  id: number;
  frappeName?: string;
  book: string;
  bookTitle?: string;
  bookCover?: string;
  member: string;
  memberName?: string;
  reservedDate: string;
  status: "Active" | "Fulfilled" | "Cancelled";
  priority: "Normal" | "Priority";
  loan?: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  activeLoans: number;
  totalBorrowed: number;
  status: "active" | "overdue" | "suspended";
  avatarUrl: string;
  tier: "Gold" | "Silver" | "Bronze";
  memberId: string;
  memberFrappeName?: string;
  expiryDate: string;
  savedBooks?: string[];
}

export interface LoanRecord {
  id: number;
  frappeName?: string;
  bookId: string;
  bookIsbn?: string;
  memberId: number;
  memberFrappeName?: string;
  bookTitle: string;
  memberName: string;
  borrowed: string;
  due: string;
  returned: string | null;
  status: "active" | "overdue" | "returned";
  renewals: number;
}

const GENRE_COLORS: Record<string, string> = {
  Historical: "#2c5f4a", Literary: "#c9973a", Gothic: "#b07fc9",
  Mystery: "#4a8fa8", Modernist: "#d4624a", Victorian: "#8b7355",
  Adventure: "#e67e22",
};

export function computeGenreData(books: BookItem[]) {
  const counts: Record<string, number> = {};
  for (const b of books) {
    counts[b.genre] = (counts[b.genre] || 0) + 1;
  }
  const total = books.length || 1;
  return Object.entries(counts).map(([name, value]) => ({
    name,
    value: Math.round((value / total) * 100),
    color: GENRE_COLORS[name] || "#78716c",
  }));
}

export function computeMonthlyData(loans: LoanRecord[]) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const map: Record<string, { borrowed: number; returned: number }> = {};
  for (const l of loans) {
    const bm = months[new Date(l.borrowed).getMonth()];
    if (bm) { map[bm] = map[bm] || { borrowed: 0, returned: 0 }; map[bm].borrowed++; }
    if (l.returned) {
      const rm = months[new Date(l.returned).getMonth()];
      if (rm) { map[rm] = map[rm] || { borrowed: 0, returned: 0 }; map[rm].returned++; }
    }
  }
  return months.map(month => ({ month, borrowed: map[month]?.borrowed || 0, returned: map[month]?.returned || 0, new: 0 }));
}


