"use client";

import { useState, useEffect } from "react";
import { Zap, RefreshCw, Filter } from "lucide-react";
import { useStore } from "@/lib/store";
import MatchCard from "@/components/MatchCard";

type MatchFilter = "all" | "challenge_to_company" | "challenge_to_research" | "company_to_company" | "company_to_research";

export default function MatchesPage() {
  const store = useStore();
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [isRunning, setIsRunning] = useState(false);

  // Run matchmaking on first load if no matches exist
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-7 h-7 text-accent-400" />
            AI Matchmaking
          </h1>
          <p className="text-sm text-navy-400 mt-1">{filteredMatches.length} matches found</p>
        </div>
        <button
          onClick={handleRunMatchmaking}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-navy-700 text-navy-950 disabled:text-navy-400 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running..." : "Run Matchmaking"}
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-navy-400 shrink-0" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              filter === opt.value
                ? "bg-accent-500/20 text-accent-400 border border-accent-500/30"
                : "bg-navy-800 text-navy-400 hover:text-navy-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredMatches.length === 0 ? (
        <div className="text-center py-16">
          <Zap className="w-12 h-12 text-navy-600 mx-auto mb-3" />
          <p className="text-navy-400">No matches yet. Click &quot;Run Matchmaking&quot; to start.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMatches.slice(0, 30).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
