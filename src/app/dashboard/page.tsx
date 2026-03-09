"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Target,
  Zap,
  ListMusic,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/lib/store";
import MatchCard from "@/components/MatchCard";

export default function DashboardPage() {
  const store = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (store.matches.length === 0) {
      store.runMatchmaking();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // AI-ranked search (#26) — results scored by relevance instead of simple substring match
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return store.searchWithRelevance(searchQuery);
  }, [searchQuery, store]);

  const topMatches = store.matches.slice(0, 6);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-6 h-6 text-accent-500" />
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        </div>
        <p className="text-sm text-navy-400 ml-9">Your innovation ecosystem at a glance</p>

        {/* Search */}
        <div className="relative mt-5 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, research, challenges..."
            className="w-full bg-white border border-navy-200 rounded-full pl-11 pr-4 py-3 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Search results */}
      {searchResults && (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Results for &quot;{searchQuery}&quot;</h2>

          {searchResults.companies.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-navy-500 mb-2 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" /> Companies ({searchResults.companies.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {searchResults.companies.map((c) => (
                  <Link key={c.id} href={`/companies/${c.id}`} className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full avatar-blue flex items-center justify-center text-white text-xs font-bold">
                      {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900 text-sm">{c.name}</p>
                      <p className="text-xs text-navy-400 truncate">{c.sector}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchResults.research.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-navy-500 mb-2 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-purple-500" /> Research ({searchResults.research.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {searchResults.research.map((r) => (
                  <Link key={r.id} href={`/research/${r.id}`} className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full avatar-purple flex items-center justify-center text-white text-xs font-bold">
                      {r.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900 text-sm">{r.title}</p>
                      <p className="text-xs text-navy-400">{r.institution}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchResults.challenges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-navy-500 mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-orange-500" /> Challenges ({searchResults.challenges.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {searchResults.challenges.map((ch) => (
                  <Link key={ch.id} href={`/challenges/${ch.id}`} className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full avatar-orange flex items-center justify-center text-white text-xs font-bold">
                      {ch.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900 text-sm">{ch.title}</p>
                      <p className="text-xs text-navy-400">{ch.domain} | {ch.priority}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchResults.companies.length === 0 && searchResults.research.length === 0 && searchResults.challenges.length === 0 && (
            <p className="text-navy-400 text-sm">No results found for &quot;{searchQuery}&quot;</p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <Link href="/companies" className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{store.companies.length}</p>
          <p className="text-xs text-navy-400">Companies</p>
        </Link>
        <Link href="/research" className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{store.research.length}</p>
          <p className="text-xs text-navy-400">Research</p>
        </Link>
        <Link href="/challenges" className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{store.challenges.length}</p>
          <p className="text-xs text-navy-400">Challenges</p>
        </Link>
        <Link href="/matches" className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-accent-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{store.matches.length}</p>
          <p className="text-xs text-navy-400">Matches</p>
        </Link>
        <Link href="/playlist" className="card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center mx-auto mb-2">
            <ListMusic className="w-5 h-5 text-success-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{store.playlist.length}</p>
          <p className="text-xs text-navy-400">Playlist</p>
        </Link>
      </div>

      {/* Top Matches */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-500" />
            Top Matches
          </h2>
          <Link href="/matches" className="text-accent-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {topMatches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Zap className="w-10 h-10 text-navy-200 mx-auto mb-2" />
            <p className="text-navy-400 text-sm">Matches will appear here after matchmaking runs.</p>
          </div>
        )}
      </div>

      {/* Open Challenges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Open Challenges
          </h2>
          <Link href="/challenges" className="text-accent-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {store.challenges.filter((c) => c.status === "open").slice(0, 3).map((ch) => (
            <Link key={ch.id} href={`/challenges/${ch.id}`} className="card p-4 flex items-center gap-4 block">
              <div className="w-11 h-11 rounded-full avatar-orange flex items-center justify-center text-white shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-900">{ch.title}</p>
                <p className="text-sm text-navy-400">{ch.domain} | TRL {ch.desired_trl} | {ch.timeline}</p>
              </div>
              <span className={`tag-pill shrink-0 ${
                ch.priority === "critical" ? "bg-danger-500/10 text-danger-500 border-danger-200" :
                ch.priority === "high" ? "bg-warning-500/10 text-warning-500 border-warning-200" :
                "bg-accent-500/10 text-accent-500 border-accent-200"
              }`}>
                {ch.priority}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
