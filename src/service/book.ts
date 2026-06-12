// src/service/book.ts
import axios from "axios";
import type { LibraryBook, Genre } from "../types/book";

const frappe = axios.create({
  baseURL: "https://phyothant.j.frappe.cloud",
  withCredentials: true,
});

const mapBookDoc = (doc: any): LibraryBook => ({
  name: doc.name,
  title: doc.title,
  author: doc.author,
  isbn: doc.isbn,
  genre: doc.genre || "Mystery",
  publication_year: doc.publication_year,
  rating: doc.rating,
  cover_image: doc.cover_image,
  total_copies: doc.total_copies || 1,
  borrowed_copies: doc.borrowed_copies || 0,
  available: doc.available === 1,
  description: doc.description,
});

export const getBooks = async (): Promise<LibraryBook[]> => {
  const response = await frappe.get("/api/resource/Library Book?as_dict=1&limit=100");
  const docs = response.data.data || [];
  return docs.map(mapBookDoc);
};

export const createBook = async (book: {
  title: string;
  author: string;
  isbn: string;
  genre?: Genre;
  publication_year?: number;
  rating?: number;
  cover_image?: string;
  total_copies?: number;
  description?: string;
}): Promise<LibraryBook> => {
  const payload = {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre || "Mystery",
    publication_year: book.publication_year,
    rating: book.rating,
    cover_image: book.cover_image,
    total_copies: book.total_copies || 1,
    borrowed_copies: 0,
    available: 1,
    description: book.description,
  };

  const response = await frappe.post("/api/resource/Library Book", payload);
  const newDoc = response.data.data;
  return mapBookDoc({ ...payload, name: newDoc.name });
};

export const deleteBook = async (name: string): Promise<void> => {
  await frappe.delete(`/api/resource/Library Book/${name}`);
};