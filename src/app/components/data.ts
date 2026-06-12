export interface BorrowRequest {
  id: number;
  bookId: number;
  memberId: number;
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
  loanId: number;
  bookId: number;
  memberId: number;
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
  id: number;
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
  tier: "Bronze" | "Silver" | "Gold";
  memberId: string;
  expiryDate: string;
}

export interface LoanRecord {
  id: number;
  bookId: number;
  memberId: number;
  bookTitle: string;
  memberName: string;
  borrowed: string;
  due: string;
  returned: string | null;
  status: "active" | "overdue" | "returned";
}

export const BOOKS: BookItem[] = [
  {
    id: 1, title: "The Name of the Rose", author: "Umberto Eco", genre: "Historical", year: 1980,
    available: true, rating: 4.7, totalCopies: 3, borrowedCopies: 1, isbn: "978-0151446476",
    coverUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A medieval murder mystery set in a labyrinthine Italian monastery, blending theology, semiotics, and detective fiction into an unforgettable tale."
  },
  {
    id: 2, title: "Middlemarch", author: "George Eliot", genre: "Victorian", year: 1871,
    available: true, rating: 4.8, totalCopies: 2, borrowedCopies: 0, isbn: "978-0141439549",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A sweeping portrait of English provincial life, exploring the aspirations and disappointments of its richly drawn characters."
  },
  {
    id: 3, title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón", genre: "Mystery", year: 2001,
    available: false, rating: 4.6, totalCopies: 2, borrowedCopies: 2, isbn: "978-0143034902",
    coverUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A young boy discovers a mysterious book in post-war Barcelona, setting off a chain of events involving passion, obsession, and dark secrets."
  },
  {
    id: 4, title: "The Count of Monte Cristo", author: "Alexandre Dumas", genre: "Adventure", year: 1844,
    available: true, rating: 4.9, totalCopies: 4, borrowedCopies: 2, isbn: "978-0140449266",
    coverUrl: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "An epic tale of wrongful imprisonment, daring escape, and elaborate revenge played out across the salons and dungeons of 19th-century France."
  },
  {
    id: 5, title: "Possession", author: "A.S. Byatt", genre: "Literary", year: 1990,
    available: true, rating: 4.5, totalCopies: 2, borrowedCopies: 1, isbn: "978-0679735908",
    coverUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "Two modern scholars uncover a secret love affair between two Victorian poets, weaving together past and present in a brilliant literary tapestry."
  },
  {
    id: 6, title: "The Magic Mountain", author: "Thomas Mann", genre: "Modernist", year: 1924,
    available: false, rating: 4.4, totalCopies: 2, borrowedCopies: 2, isbn: "978-0679772873",
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A young man's seven-year sojourn at a Swiss sanatorium becomes a meditation on time, illness, culture, and the meaning of life."
  },
  {
    id: 7, title: "Rebecca", author: "Daphne du Maurier", genre: "Gothic", year: 1938,
    available: true, rating: 4.7, totalCopies: 3, borrowedCopies: 1, isbn: "978-0380730407",
    coverUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A young bride is haunted by the memory of her husband's first wife at the brooding Cornish estate of Manderley."
  },
  {
    id: 8, title: "The Pillars of the Earth", author: "Ken Follett", genre: "Historical", year: 1989,
    available: true, rating: 4.8, totalCopies: 3, borrowedCopies: 0, isbn: "978-0451166890",
    coverUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "The building of a cathedral in 12th-century England becomes the backdrop for a sweeping saga of love, power, and faith."
  },
  {
    id: 9, title: "A Gentleman in Moscow", author: "Amor Towles", genre: "Literary", year: 2016,
    available: true, rating: 4.9, totalCopies: 4, borrowedCopies: 2, isbn: "978-0670026197",
    coverUrl: "https://images.unsplash.com/photo-1529589941132-43606325dfb4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A Russian count under house arrest in Moscow's Metropol Hotel finds purpose, friendship, and romance across four extraordinary decades."
  },
  {
    id: 10, title: "The Historian", author: "Elizabeth Kostova", genre: "Gothic", year: 2005,
    available: false, rating: 4.3, totalCopies: 2, borrowedCopies: 2, isbn: "978-0316067942",
    coverUrl: "https://images.unsplash.com/photo-1502979932800-33d311b7ce56?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A young woman uncovers her father's obsessive quest for Dracula through letters spanning continents and centuries."
  },
  {
    id: 11, title: "Pachinko", author: "Min Jin Lee", genre: "Literary", year: 2017,
    available: true, rating: 4.8, totalCopies: 3, borrowedCopies: 1, isbn: "978-1455563937",
    coverUrl: "https://images.unsplash.com/photo-1532348374062-fee19177e98f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "Four generations of a Korean family navigate identity, sacrifice, and belonging across Japan's turbulent 20th century."
  },
  {
    id: 12, title: "The Moors Last Sigh", author: "Salman Rushdie", genre: "Modernist", year: 1995,
    available: true, rating: 4.2, totalCopies: 2, borrowedCopies: 0, isbn: "978-0679744665",
    coverUrl: "https://images.unsplash.com/photo-1508169351866-777fc0047ac5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: "A sprawling, magical family saga set in Bombay and Spain, told by a narrator aging at twice the normal speed."
  },
];

export const MEMBERS: Member[] = [
  {
    id: 1, name: "Margaret Holloway", email: "m.holloway@example.com", phone: "+1 (555) 201-4892",
    memberSince: "Mar 2019", activeLoans: 3, totalBorrowed: 142, status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Gold", memberId: "ARC-00142", expiryDate: "Mar 2027"
  },
  {
    id: 2, name: "Theodore Ashworth", email: "t.ashworth@example.com", phone: "+1 (555) 384-2210",
    memberSince: "Jan 2021", activeLoans: 2, totalBorrowed: 87, status: "overdue",
    avatarUrl: "https://images.unsplash.com/photo-1543949806-2c9935e6aa78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Silver", memberId: "ARC-00087", expiryDate: "Jan 2026"
  },
  {
    id: 3, name: "Sylvia Chen", email: "s.chen@example.com", phone: "+1 (555) 476-9031",
    memberSince: "Oct 2020", activeLoans: 1, totalBorrowed: 204, status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Gold", memberId: "ARC-00204", expiryDate: "Oct 2026"
  },
  {
    id: 4, name: "Edmund Fitzgerald", email: "e.fitz@example.com", phone: "+1 (555) 512-7744",
    memberSince: "Jul 2022", activeLoans: 0, totalBorrowed: 33, status: "suspended",
    avatarUrl: "https://images.unsplash.com/photo-1543949806-2c9935e6aa78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Bronze", memberId: "ARC-00033", expiryDate: "Jul 2025"
  },
  {
    id: 5, name: "Isabelle Moreau", email: "i.moreau@example.com", phone: "+1 (555) 698-3320",
    memberSince: "Feb 2018", activeLoans: 4, totalBorrowed: 318, status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Gold", memberId: "ARC-00318", expiryDate: "Feb 2027"
  },
  {
    id: 6, name: "Conrad Blackwood", email: "c.blackwood@example.com", phone: "+1 (555) 723-0418",
    memberSince: "Nov 2021", activeLoans: 1, totalBorrowed: 61, status: "overdue",
    avatarUrl: "https://images.unsplash.com/photo-1543949806-2c9935e6aa78?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Bronze", memberId: "ARC-00061", expiryDate: "Nov 2026"
  },
  {
    id: 7, name: "Vivienne Sterling", email: "v.sterling@example.com", phone: "+1 (555) 847-2205",
    memberSince: "Aug 2019", activeLoans: 2, totalBorrowed: 178, status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=80&h=80&q=80",
    tier: "Silver", memberId: "ARC-00178", expiryDate: "Aug 2026"
  },
];

export const LOANS: LoanRecord[] = [
  { id: 1, bookId: 9, memberId: 1, bookTitle: "A Gentleman in Moscow", memberName: "Margaret Holloway", borrowed: "May 28, 2026", due: "Jun 18, 2026", returned: null, status: "active" },
  { id: 2, bookId: 3, memberId: 2, bookTitle: "The Shadow of the Wind", memberName: "Theodore Ashworth", borrowed: "May 10, 2026", due: "May 31, 2026", returned: null, status: "overdue" },
  { id: 3, bookId: 11, memberId: 5, bookTitle: "Pachinko", memberName: "Isabelle Moreau", borrowed: "Jun 1, 2026", due: "Jun 22, 2026", returned: null, status: "active" },
  { id: 4, bookId: 6, memberId: 6, bookTitle: "The Magic Mountain", memberName: "Conrad Blackwood", borrowed: "May 20, 2026", due: "Jun 10, 2026", returned: null, status: "overdue" },
  { id: 5, bookId: 10, memberId: 3, bookTitle: "The Historian", memberName: "Sylvia Chen", borrowed: "Jun 5, 2026", due: "Jun 26, 2026", returned: null, status: "active" },
  { id: 6, bookId: 2, memberId: 7, bookTitle: "Middlemarch", memberName: "Vivienne Sterling", borrowed: "Jun 2, 2026", due: "Jun 23, 2026", returned: null, status: "active" },
  { id: 7, bookId: 1, memberId: 1, bookTitle: "The Name of the Rose", memberName: "Margaret Holloway", borrowed: "Jun 8, 2026", due: "Jun 29, 2026", returned: null, status: "active" },
];

export const MONTHLY_DATA = [
  { month: "Jan", borrowed: 124, returned: 118, new: 8 },
  { month: "Feb", borrowed: 98, returned: 103, new: 5 },
  { month: "Mar", borrowed: 143, returned: 137, new: 12 },
  { month: "Apr", borrowed: 167, returned: 152, new: 9 },
  { month: "May", borrowed: 182, returned: 178, new: 14 },
  { month: "Jun", borrowed: 156, returned: 161, new: 7 },
];

export const GENRE_DATA = [
  { name: "Historical", value: 28, color: "#2c5f4a" },
  { name: "Literary", value: 22, color: "#c9973a" },
  { name: "Gothic", value: 16, color: "#b07fc9" },
  { name: "Mystery", value: 18, color: "#4a8fa8" },
  { name: "Modernist", value: 16, color: "#d4624a" },
];
