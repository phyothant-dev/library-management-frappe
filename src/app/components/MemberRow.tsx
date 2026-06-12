import React from "react";
import { BookOpen, Calendar } from "lucide-react";
import type { Member } from "./data";

interface MemberRowProps {
  member: Member;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: "rgba(109,184,122,0.15)", color: "#6db87a", label: "Active" },
  overdue: { bg: "rgba(212,98,74,0.15)", color: "#d4624a", label: "Overdue" },
  suspended: { bg: "rgba(138,155,176,0.15)", color: "#8a9bb0", label: "Suspended" },
};

export function MemberRow({ member }: MemberRowProps) {
  const status = STATUS_STYLES[member.status];

  return (
    <tr
      className="border-b border-border hover:bg-secondary/40 transition-colors duration-150"
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p className="text-sm" style={{ color: "var(--foreground)", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              {member.name}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "'DM Mono', monospace" }}>
              {member.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} color="var(--muted-foreground)" />
          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}>
            {member.memberSince}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          <BookOpen size={11} color="var(--primary)" />
          <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "var(--foreground)" }}>
            {member.activeLoans} active
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span
          className="text-xs"
          style={{ fontFamily: "'DM Mono', monospace", color: "var(--muted-foreground)" }}
        >
          {member.totalBorrowed} books
        </span>
      </td>
      <td className="py-3.5 px-4">
        <span
          className="text-xs px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "'DM Mono', monospace",
            background: status.bg,
            color: status.color,
          }}
        >
          {status.label}
        </span>
      </td>
    </tr>
  );
}
