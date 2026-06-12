import React from "react";
import { Book, Star, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

export interface BookItem {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  available: boolean;
  rating: number;
  coverColor: string;
  totalCopies: number;
  borrowedCopies: number;
  isbn: string;
}

interface BookCardProps {
  book: BookItem;
  onBorrow: (book: BookItem) => void;
  onDetails: (book: BookItem) => void;
}

const SPINE_COLORS: Record<string, string> = {
  navy: "#1a3a5c",
  teal: "#1a5c4a",
  burgundy: "#5c1a1a",
  forest: "#1a4a2a",
  plum: "#3a1a5c",
  bronze: "#5c3a1a",
};

export function BookCard({ book, onBorrow, onDetails }: BookCardProps) {
  const spineColor = SPINE_COLORS[book.coverColor] || SPINE_COLORS.navy;

  return (
    <div
      className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-accent/50 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
      onClick={() => onDetails(book)}
    >
      {/* Book cover */}
      <div
        className="relative h-44 flex items-end p-4"
        style={{
          background: `linear-gradient(160deg, ${spineColor} 0%, ${spineColor}cc 60%, rgba(13,27,42,0.95) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 28px,
              rgba(201,151,58,0.3) 28px,
              rgba(201,151,58,0.3) 29px
            )`,
          }}
        />
        <Book className="absolute top-4 right-4 opacity-20" size={40} color="var(--primary)" />
        <div className="relative">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: "'DM Mono', monospace", color: "rgba(232,220,200,0.6)" }}
          >
            {book.genre}
          </p>
          <h3
            className="leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#e8dcc8",
            }}
          >
            {book.title}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "'Inter', sans-serif" }}>
            {book.author}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}
          >
            {book.isbn} · {book.year}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              fill={i < Math.floor(book.rating) ? "var(--primary)" : "transparent"}
              color={i < Math.floor(book.rating) ? "var(--primary)" : "var(--muted-foreground)"}
            />
          ))}
          <span
            className="ml-1 text-xs"
            style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}
          >
            {book.rating}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock size={11} color={book.available ? "#6db87a" : "#d4624a"} />
            <span
              className="text-xs"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: book.available ? "#6db87a" : "#d4624a",
              }}
            >
              {book.totalCopies - book.borrowedCopies}/{book.totalCopies} avail.
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (book.available) onBorrow(book);
            }}
            disabled={!book.available}
            className="text-xs px-3 py-1.5 rounded transition-all duration-200"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              background: book.available ? "var(--primary)" : "var(--muted)",
              color: book.available ? "var(--primary-foreground)" : "var(--muted-foreground)",
              cursor: book.available ? "pointer" : "not-allowed",
              border: "none",
            }}
          >
            {book.available ? "Borrow" : "Unavail."}
          </button>
        </div>
      </div>
    </div>
  );
}
