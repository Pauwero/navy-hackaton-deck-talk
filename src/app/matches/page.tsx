"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Heart, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import MatchCard from "@/components/MatchCard";

type MatchFilter = "all" | "challenge_to_company" | "challenge_to_research" | "company_to_company" | "company_to_research";

export default function MatchesPage() {
  const store = useStore();
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (store.matches.length === 0) {
      store.runMatchmaking();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRunMatchmaking = () => {
    setIsRunning(true);
    setTimeout(() => {
      store.runMatchmaking();
      setIsRunning(false);
    }, 800);
  };

  const filteredMatches = filter === "all"
    ? store.matches
    : store.matches.filter((m) => m.match_type === filter);

  const filterOptions: { value: MatchFilter; label: string }[] = [
    { value: "all", label: "All Matches" },
    { value: "challenge_to_company", label: "Challenge → Company" },
    { value: "challenge_to_research", label: "Challenge → Research" },
    { value: "company_to_company", label: "Company ↔ Company" },
    { value: "company_to_research", label: "Company ↔ Research" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-heart" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">AI Matchmaking</h1>
              <p className="text-sm text-navy-400">{filteredMatches.length} matches found</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleRunMatchmaking}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-navy-200 text-white disabled:text-navy-400 font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-sm hover:shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Finding..." : "Find Matches"}
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === opt.value
                ? "bg-accent-500 text-white shadow-sm"
                : "bg-white text-navy-500 border border-navy-200 hover:border-accent-300 hover:text-accent-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredMatches.length === 0 ? (
        <div className="card p-16 text-center">
          <Sparkles className="w-12 h-12 text-navy-200 mx-auto mb-3" />
          <p className="text-navy-500 font-medium mb-1">No matches yet</p>
          <p className="text-navy-400 text-sm">Click &quot;Find Matches&quot; to discover connections.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.slice(0, 30).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
