"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  FlaskConical,
  Target,
  Zap,
  ListMusic,
  Search,
  TrendingUp,
  ArrowRight,
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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const companies = store.companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.capabilities.some((cap) => cap.toLowerCase().includes(q)) ||
        c.technologies.some((t) => t.toLowerCase().includes(q))
    );

    const research = store.research.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.keywords.some((kw) => kw.toLowerCase().includes(q))
    );

    const challenges = store.challenges.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );

    return { companies, research, challenges };
  }, [searchQuery, store.companies, store.research, store.challenges]);

  const topMatches = store.matches.slice(0, 6);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <LayoutDashboard className="w-7 h-7 text-accent-400" />
          Dashboard
        </h1>

        {/* Search */}
        <div className="relative mt-4 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, research, challenges..."
            className="w-full bg-navy-800 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-500 transition-colors"
          />
        </div>
      </div>

      {/* Search results */}
      {searchResults && (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-semibold text-white">Search Results for &quot;{searchQuery}&quot;</h2>

          {searchResults.companies.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-1">
                <Building2 className="w-4 h-4" /> Companies ({searchResults.companies.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {searchResults.companies.map((c) => (
                  <Link key={c.id} href={`/companies/${c.id}`} className="bg-navy-800 rounded-lg p-3 border border-navy-700 hover:border-blue-500/30 transition-colors">
                    <p className="font-medium text-white text-sm">{c.name}</p>
                    <p className="text-xs text-navy-400 truncate">{c.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchResults.research.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-1">
                <FlaskConical className="w-4 h-4" /> Research ({searchResults.research.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {searchResults.research.map((r) => (
                  <Link key={r.id} href={`/research/${r.id}`} className="bg-navy-800 rounded-lg p-3 border border-navy-700 hover:border-purple-500/30 transition-colors">
                    <p className="font-medium text-white text-sm">{r.title}</p>
                    <p className="text-xs text-navy-400">{r.institution}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchResults.challenges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-orange-400 mb-2 flex items-center gap-1">
                <Target className="w-4 h-4" /> Challenges ({searchResults.challenges.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {searchResults.challenges.map((ch) => (
                  <Link key={ch.id} href={`/challenges/${ch.id}`} className="bg-navy-800 rounded-lg p-3 border border-navy-700 hover:border-orange-500/30 transition-colors">
                    <p className="font-medium text-white text-sm">{ch.title}</p>
                    <p className="text-xs text-navy-400">{ch.domain} | {ch.priority}</p>
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
        <Link href="/companies" className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-blue-500/30 transition-colors">
          <Building2 className="w-5 h-5 text-blue-400 mb-1" />
          <p className="text-2xl font-bold text-white">{store.companies.length}</p>
          <p className="text-xs text-navy-400">Companies</p>
        </Link>
        <Link href="/research" className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-purple-500/30 transition-colors">
          <FlaskConical className="w-5 h-5 text-purple-400 mb-1" />
          <p className="text-2xl font-bold text-white">{store.research.length}</p>
          <p className="text-xs text-navy-400">Research</p>
        </Link>
        <Link href="/challenges" className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-orange-500/30 transition-colors">
          <Target className="w-5 h-5 text-orange-400 mb-1" />
          <p className="text-2xl font-bold text-white">{store.challenges.length}</p>
          <p className="text-xs text-navy-400">Challenges</p>
        </Link>
        <Link href="/matches" className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-accent-500/30 transition-colors">
          <Zap className="w-5 h-5 text-accent-400 mb-1" />
          <p className="text-2xl font-bold text-white">{store.matches.length}</p>
          <p className="text-xs text-navy-400">Matches</p>
        </Link>
        <Link href="/playlist" className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-accent-500/30 transition-colors">
          <ListMusic className="w-5 h-5 text-accent-400 mb-1" />
          <p className="text-2xl font-bold text-white">{store.playlist.length}</p>
          <p className="text-xs text-navy-400">Playlist</p>
        </Link>
      </div>

      {/* Top Matches */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" />
            Top AI Matches
          </h2>
          <Link href="/matches" className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {topMatches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="text-navy-400 text-sm">Matches will appear here after matchmaking runs.</p>
        )}
      </div>

      {/* Recent Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Open Challenges
          </h2>
          <Link href="/challenges" className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          {store.challenges.filter((c) => c.status === "open").slice(0, 3).map((ch) => (
            <Link key={ch.id} href={`/challenges/${ch.id}`} className="block bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-orange-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{ch.title}</p>
                  <p className="text-sm text-navy-400">{ch.domain} | TRL {ch.desired_trl} | {ch.timeline}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  ch.priority === "critical" ? "bg-danger-500/20 text-danger-400" :
                  ch.priority === "high" ? "bg-warning-500/20 text-warning-400" :
                  "bg-accent-500/20 text-accent-400"
                }`}>
                  {ch.priority}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
