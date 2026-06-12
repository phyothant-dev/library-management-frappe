import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  accent?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, accent }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border p-6 transition-all duration-300 hover:border-accent/40 ${
        accent
          ? "bg-primary border-primary/60"
          : "bg-card border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: accent ? "rgba(13,27,42,0.7)" : "var(--muted-foreground)",
            }}
          >
            {title}
          </p>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 600,
              color: accent ? "var(--primary-foreground)" : "var(--foreground)",
              lineHeight: 1.1,
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className="mt-1 text-xs"
              style={{
                color: accent ? "rgba(13,27,42,0.6)" : "var(--muted-foreground)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className="mt-3 text-xs"
              style={{
                color: trend.value >= 0 ? "#6db87a" : "#d4624a",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div
          className="rounded-md p-2.5"
          style={{
            background: accent ? "rgba(13,27,42,0.15)" : "rgba(201,151,58,0.12)",
          }}
        >
          <Icon
            size={20}
            style={{ color: accent ? "var(--primary-foreground)" : "var(--primary)" }}
          />
        </div>
      </div>
    </div>
  );
}
