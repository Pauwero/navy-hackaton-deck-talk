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
  Crosshair,
  Menu,
  X,
  Shield,
  Settings,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Target },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/matches", label: "Matches", icon: Zap },
];

const actionNav = [
  { href: "/create-challenge", label: "New Challenge", icon: Crosshair },
  { href: "/onboarding", label: "Onboard Company", icon: UserPlus },
];

const toolNav = [
  { href: "/playlist", label: "Playlist", icon: ListMusic },
  { href: "/profile", label: "Profile & Settings", icon: Settings },
];

const mobileNav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Target },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/matches", label: "Matches", icon: Zap },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">Naval Innovation</span>
              <span className="text-[0.65rem] text-navy-400 font-medium tracking-wide uppercase">Hub Platform</span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          <p className="sidebar-section">Navigate</p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <p className="sidebar-section">Actions</p>
          {actionNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <p className="sidebar-section">Tools</p>
          {toolNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
              <Anchor className="w-4 h-4 text-accent-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-navy-200 truncate">RNLN Innovation</p>
              <p className="text-[0.6rem] text-navy-500">v1.0 Demo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <nav className="md:hidden bg-navy-950 border-b border-white/10 sticky top-0 z-40">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-400" />
              <span className="font-bold text-sm text-white">Naval Innovation Hub</span>
            </Link>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <button
                className="text-navy-300 hover:text-white p-2 rounded-lg hover:bg-white/10"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="pb-4 space-y-1">
              {[...mainNav, ...actionNav, ...toolNav].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-accent-500 text-white"
                        : "text-navy-300 hover:text-white hover:bg-white/10"
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

      {/* Desktop notification bell - top right */}
      <div className="hidden md:flex fixed top-4 right-6 z-50 items-center gap-2">
        <NotificationBell />
      </div>

      {/* Bottom tab bar (mobile) */}
      <div className="bottom-nav md:hidden">
        <div className="flex items-center justify-around px-2">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                  active ? "text-accent-400 font-semibold" : "text-navy-500"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-accent-400" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
