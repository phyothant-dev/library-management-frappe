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

export interface FrappeBook {
  name: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publication_year: number;
  rating: number;
  cover_image: string;
  total_copies: number;
  borrowed_copies: number;
  available: number;
  description: string;
  creation: string;
  modified: string;
}

export async function getBooks(): Promise<FrappeBook[]> {
  const res = await api.get("/api/resource/Library%20Book", {
    params: { fields: JSON.stringify(["*"]), limit_page_length: 50 },
  });
  return res.data.data;
}

export async function getBook(isbn: string): Promise<FrappeBook> {
  const res = await api.get(`/api/resource/Library%20Book/${encodeURIComponent(isbn)}`);
  return res.data.data;
}

export async function createBook(data: Partial<FrappeBook>) {
  const res = await api.post("/api/resource/Library%20Book", data);
  return res.data.data;
}

export async function updateBook(isbn: string, data: Partial<FrappeBook>) {
  const res = await api.put(`/api/resource/Library%20Book/${encodeURIComponent(isbn)}`, data);
  return res.data.data;
}

export async function deleteBook(isbn: string) {
  const res = await api.delete(`/api/resource/Library%20Book/${encodeURIComponent(isbn)}`);
  return res.data;
}

export function bookToItem(b: FrappeBook) {
  return {
    id: b.name,
    title: b.title,
    author: b.author,
    genre: b.genre,
    year: b.publication_year,
    available: b.available === 1,
    rating: b.rating,
    totalCopies: b.total_copies,
    borrowedCopies: b.borrowed_copies,
    isbn: b.isbn,
    coverUrl: b.cover_image
      ? (b.cover_image.startsWith("http") ? b.cover_image : `${BASE_URL}${b.cover_image}`)
      : "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=300&h=420&q=80",
    description: b.description ? b.description.replace(/<[^>]*>/g, "") : "",
  };
}

export function itemToBook(item: any) {
  return {
    title: item.title,
    author: item.author,
    isbn: item.isbn,
    genre: item.genre,
    publication_year: item.year,
    rating: item.rating,
    cover_image: item.coverUrl
      ? item.coverUrl.replace(`${BASE_URL}`, "")
      : "",
    total_copies: item.totalCopies,
    borrowed_copies: item.borrowedCopies || 0,
    available: item.available ? 1 : 0,
    description: item.description || "",
  };
}
