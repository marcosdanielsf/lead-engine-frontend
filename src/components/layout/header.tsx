"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/lib/hooks/use-settings";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: health } = useHealth();

  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "#161718",
      }}
    >
      <div>
        <h1
          className="text-lg font-semibold"
          style={{ color: "#f7f8f8", letterSpacing: "-0.3px" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "#8a8f98" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "#62666d" }}
          />
          <Input
            placeholder="Search leads..."
            className="pl-9 w-64 text-sm"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#d0d6e0",
            }}
          />
        </div>

        {health && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={
              health.healthy
                ? {
                    background: "rgba(16,185,129,0.15)",
                    color: "#34d399",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }
                : {
                    background: "rgba(239,68,68,0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }
            }
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: health.healthy ? "#10b981" : "#ef4444",
              }}
            />
            {health.healthy ? "Healthy" : "Degraded"}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          style={{ color: "#8a8f98" }}
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
