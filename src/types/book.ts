// src/types/book.ts

export type Genre = 
  | "Historical" 
  | "Literary" 
  | "Gothic" 
  | "Mystery" 
  | "Modernist" 
  | "Adventure" 
  | "Victorian";

export type LibraryBook = {
  name: string;              // Frappe document name (ISBN)
  title: string;
  author: string;
  isbn: string;
  genre: Genre;
  publication_year?: number;
  rating?: number;
  cover_image?: string;
  total_copies: number;
  borrowed_copies: number;
  available: boolean;        // Check field (1 = true, 0 = false)
  description?: string;
};