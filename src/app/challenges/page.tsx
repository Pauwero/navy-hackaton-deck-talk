"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Target, Plus, ArrowRight, AlertCircle, Search, ClipboardCheck } from "lucide-react";
import { useStore } from "@/lib/store";

const priorityStyles: Record<string, string> = {
  critical: "bg-danger-500/10 text-danger-500 border-danger-500/20",
  high: "bg-warning-500/10 text-warning-500 border-warning-500/20",
  medium: "bg-accent-500/10 text-accent-500 border-accent-500/20",
  low: "bg-navy-100 text-navy-400 border-navy-200",
};

const statusStyles: Record<string, string> = {
  open: "bg-success-500/10 text-success-500 border-success-500/20",
  in_review: "bg-warning-500/10 text-warning-500 border-warning-500/20",
  matched: "bg-accent-500/10 text-accent-500 border-accent-500/20",
  closed: "bg-navy-100 text-navy-400 border-navy-200",
};

export default function ChallengesPage() {
  const store = useStore();
  const { challenges } = store;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return challenges;
    const q = query.toLowerCase();
    return challenges.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [challenges, query]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Challenges</h1>
          <p className="text-sm text-navy-500">{challenges.length} active</p>
        </div>
        <Link
          href="/create-challenge"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Post Challenge
        </Link>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, domain, tags..."
          className="w-full bg-white border border-navy-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((challenge) => (
          <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="card p-4 flex items-start gap-4 block group">
            <div className="w-10 h-10 rounded-lg avatar-gold flex items-center justify-center text-white shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-navy-900 text-sm group-hover:text-accent-500 transition-colors mb-1">{challenge.title}</p>
              <p className="text-xs text-navy-500 line-clamp-2 mb-2">{challenge.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`tag-pill ${priorityStyles[challenge.priority]}`}>
                  {challenge.priority === "critical" && <AlertCircle className="w-3 h-3" />}
                  {challenge.priority}
                </span>
                <span className={`tag-pill ${statusStyles[challenge.status]}`}>
                  {challenge.status.replace("_", " ")}
                </span>
                <span className="text-xs text-navy-400">{challenge.domain}</span>
                <span className="text-xs text-navy-400">TRL {challenge.desired_trl} &middot; {challenge.timeline}</span>
                {store.getProposalsForChallenge(challenge.id).length > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-accent-500 font-medium">
                    <ClipboardCheck className="w-3 h-3" />
                    {store.getProposalsForChallenge(challenge.id).length} proposal{store.getProposalsForChallenge(challenge.id).length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-navy-300 group-hover:text-accent-500 shrink-0 mt-1 transition-colors" />
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Target className="w-8 h-8 text-navy-300 mx-auto mb-2" />
          <p className="text-navy-400 text-sm">No challenges match &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
