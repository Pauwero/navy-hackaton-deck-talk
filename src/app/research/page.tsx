"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FlaskConical, Plus, ArrowRight, Search, Star, Brain, Zap, BookOpen } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ResearchPage() {
  const { research } = useStore();
  const [query, setQuery] = useState("");

  const { matches } = useStore();

  const filtered = useMemo(() => {
    if (!query.trim()) return research;
    const q = query.toLowerCase();
    return research.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.institution.toLowerCase().includes(q) ||
      r.field.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  }, [research, query]);

  // Stats
  const avgQuality = research.length > 0 ? Math.round(research.reduce((s, r) => s + r.quality_score, 0) / research.length) : 0;
  const uniqueFields = [...new Set(research.map((r) => r.field))].length;
  const totalKeywords = [...new Set(research.flatMap((r) => r.keywords))].length;
  const researchMatches = matches.filter((m) => m.source_type === "research" || m.target_type === "research").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Research Intelligence</h1>
          <p className="text-sm text-navy-500 mt-0.5">
            Academic & institutional knowledge base for AI-powered challenge matching
          </p>
        </div>
        <Link
          href="/research/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Submit Research
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Projects</p>
          <p className="text-2xl font-bold text-navy-900">{research.length}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Avg Quality</p>
          <p className="text-2xl font-bold text-purple-600">{avgQuality}/100</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Fields</p>
          <p className="text-2xl font-bold text-navy-900">{uniqueFields}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Keywords Indexed</p>
          <p className="text-2xl font-bold text-navy-900">{totalKeywords}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">AI Matches</p>
          <p className="text-2xl font-bold text-gold-600">{researchMatches}</p>
        </div>
      </div>

      {/* AI Memory indicator */}
      <div className="card-surface p-4 flex items-center gap-4 border-l-4 border-purple-500">
        <Brain className="w-6 h-6 text-purple-500 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-navy-900">AI Knowledge Base Active</p>
          <p className="text-xs text-navy-500">
            {research.length} research profiles indexed · {totalKeywords} keywords mapped · {researchMatches} AI matches generated.
            All submitted research is automatically analyzed and matched against open challenges.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Live</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, field, keywords..."
          className="w-full bg-white border border-navy-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Link key={r.id} href={`/research/${r.id}`} className="card p-4 block group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-lg avatar-purple flex items-center justify-center text-white text-sm font-bold shrink-0">
                {r.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-navy-900 text-sm group-hover:text-accent-500 transition-colors line-clamp-1">{r.title}</p>
                <p className="text-xs text-navy-500">{r.institution}</p>
              </div>
            </div>

            <p className="text-xs text-navy-600 line-clamp-2 mb-3">{r.description}</p>

            <div className="flex flex-wrap gap-1 mb-2">
              {r.keywords.slice(0, 3).map((kw) => (
                <span key={kw} className="tag-pill border-purple-200 text-purple-600 bg-purple-50">{kw}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-navy-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-600 bg-navy-50 px-2 py-0.5 rounded">TRL {r.trl_level}</span>
                <span className="text-[0.65rem] text-navy-400">{r.funding_status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full ${
                  r.quality_score >= 80 ? "bg-emerald-50 text-emerald-600" :
                  r.quality_score >= 60 ? "bg-amber-50 text-amber-600" :
                  "bg-red-50 text-red-600"
                }`}>
                  <Star className="w-3 h-3" />{r.quality_score}
                </span>
                <span className="flex items-center gap-1 text-accent-500 text-xs font-semibold group-hover:gap-1.5 transition-all">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <FlaskConical className="w-8 h-8 text-navy-300 mx-auto mb-2" />
          <p className="text-navy-400 text-sm">No research matches &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
