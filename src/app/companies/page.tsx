"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Building2, Plus, ArrowRight, Search } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CompaniesPage() {
  const { companies } = useStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return companies;
    const q = query.toLowerCase();
    return companies.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.capabilities.some((cap) => cap.toLowerCase().includes(q)) ||
      c.technologies.some((t) => t.toLowerCase().includes(q)) ||
      c.use_cases.some((uc) => uc.toLowerCase().includes(q))
    );
  }, [companies, query]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Companies</h1>
          <p className="text-sm text-navy-500">{companies.length} registered</p>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Register
        </Link>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, capability, technology..."
          className="w-full bg-white border border-navy-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <Link key={company.id} href={`/companies/${company.id}`} className="card p-4 block group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-lg avatar-blue flex items-center justify-center text-white text-sm font-bold shrink-0">
                {company.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-navy-900 text-sm group-hover:text-accent-500 transition-colors truncate">{company.name}</p>
                <p className="text-xs text-navy-500">{company.sector}</p>
              </div>
              <span className="text-xs font-bold text-navy-600 bg-navy-50 px-2 py-1 rounded shrink-0">TRL {company.trl_level}</span>
            </div>

            <p className="text-xs text-navy-600 line-clamp-2 mb-3">{company.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {company.capabilities.slice(0, 3).map((cap) => (
                <span key={cap} className="tag-pill border-accent-500/20 text-accent-600 bg-accent-500/5">{cap}</span>
              ))}
              {company.capabilities.length > 3 && (
                <span className="tag-pill border-navy-200 text-navy-400 bg-navy-50">+{company.capabilities.length - 3}</span>
              )}
            </div>

            {company.use_cases.length > 0 && (
              <p className="text-[0.7rem] text-navy-400 italic truncate">
                Use case: {company.use_cases[0]}
              </p>
            )}

            <div className="flex items-center justify-end pt-3 mt-3 border-t border-navy-100">
              <span className="flex items-center gap-1 text-accent-500 text-xs font-semibold group-hover:gap-1.5 transition-all">
                View Profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Building2 className="w-8 h-8 text-navy-300 mx-auto mb-2" />
          <p className="text-navy-400 text-sm">No companies match &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
