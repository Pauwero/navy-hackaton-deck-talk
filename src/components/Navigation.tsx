"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  Building2,
  FlaskConical,
  Target,
  Zap,
  ListMusic,
  LayoutDashboard,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Target },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/matches", label: "Matches", icon: Zap },
  { href: "/onboarding", label: "Onboard", icon: UserPlus },
  { href: "/playlist", label: "Playlist", icon: ListMusic },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top navigation */}
      <nav className="bg-white border-b border-navy-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-navy-900">Naval Innovation Hub</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-accent-500 text-white shadow-sm"
                        : "text-navy-500 hover:text-navy-700 hover:bg-navy-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <NotificationBell />
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center gap-1">
              <NotificationBell />
            </div>
            <button
              className="md:hidden text-navy-500 hover:text-navy-700 p-2 rounded-xl hover:bg-navy-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? "bg-accent-500 text-white"
                        : "text-navy-500 hover:text-navy-700 hover:bg-navy-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom tab bar (mobile) */}
      <div className="bottom-nav md:hidden">
        <div className="flex items-center justify-around px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                  isActive
                    ? "text-accent-500 font-semibold"
                    : "text-navy-400"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-accent-500" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
