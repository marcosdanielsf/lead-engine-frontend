"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Database,
  GitMerge,
  Upload,
  Cpu,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/sources", label: "Sources", icon: Database },
  { href: "/funnel", label: "Funnel", icon: GitMerge },
  { href: "/leads/import", label: "Import", icon: Upload },
  { href: "/enrichment", label: "Enrichment", icon: Cpu },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-60 min-h-screen flex-shrink-0"
      style={{
        background: "#161718",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="flex items-center justify-center h-7 w-7 rounded-lg"
          style={{ background: "#5e6ad2" }}
        >
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span
          className="font-semibold text-sm tracking-tight"
          style={{ color: "#f7f8f8", letterSpacing: "-0.2px" }}
        >
          Lead Engine
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/leads" && pathname.startsWith(href)) ||
            (href === "/leads" &&
              (pathname === "/leads" || pathname === "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150",
                active
                  ? "text-white"
                  : "hover:text-white"
              )}
              style={
                active
                  ? {
                      background: "rgba(94,106,210,0.20)",
                      color: "#f7f8f8",
                      border: "1px solid rgba(94,106,210,0.25)",
                    }
                  : {
                      color: "#8a8f98",
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color = "#d0d6e0";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#8a8f98";
                }
              }}
            >
              <Icon
                className="h-4 w-4 flex-shrink-0"
                style={{ color: active ? "#7170ff" : "currentColor" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{ background: "#10b981" }}
          />
          <span className="text-xs" style={{ color: "#8a8f98" }}>
            API Connected
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: "#62666d" }}>
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
