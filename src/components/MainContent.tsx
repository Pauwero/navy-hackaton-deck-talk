"use client";

import { useState, useEffect } from "react";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "true") setCollapsed(true);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCollapsed(detail.collapsed);
    };
    window.addEventListener("sidebar-toggle", handler);
    return () => window.removeEventListener("sidebar-toggle", handler);
  }, []);

  return (
    <main className={`min-h-screen transition-all duration-200 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-8">
        {children}
      </div>
    </main>
  );
}
