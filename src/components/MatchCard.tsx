"use client";

import Link from "next/link";
import { Zap, ArrowRight, Building2, FlaskConical, Target } from "lucide-react";
import type { Match } from "@/types";
import { useStore } from "@/lib/store";

function getEntityName(type: string, id: string, store: ReturnType<typeof useStore>): string {
  if (type === "company") return store.companies.find((c) => c.id === id)?.name || "Unknown Company";
  if (type === "research") return store.research.find((r) => r.id === id)?.title || "Unknown Research";
  if (type === "challenge") return store.challenges.find((c) => c.id === id)?.title || "Unknown Challenge";
  return "Unknown";
}

function getEntityLink(type: string, id: string): string {
  if (type === "company") return `/companies/${id}`;
  if (type === "research") return `/research/${id}`;
  if (type === "challenge") return `/challenges/${id}`;
  return "#";
}

function TypeIcon({ type }: { type: string }) {
  if (type === "company") return <Building2 className="w-4 h-4" />;
  if (type === "research") return <FlaskConical className="w-4 h-4" />;
  return <Target className="w-4 h-4" />;
}

export default function MatchCard({ match }: { match: Match }) {
  const store = useStore();
  const sourceName = getEntityName(match.source_type, match.source_id, store);
  const targetName = getEntityName(match.target_type, match.target_id, store);

  const scoreColor =
    match.score >= 30 ? "text-success-400" : match.score >= 15 ? "text-warning-400" : "text-navy-400";

  return (
    <div className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-navy-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Zap className={`w-4 h-4 ${scoreColor}`} />
          <span className={`text-sm font-bold ${scoreColor}`}>{match.score}% match</span>
        </div>
        <span className="text-xs text-navy-400 bg-navy-700 px-2 py-0.5 rounded">
          {match.match_type.replace(/_/g, " ")}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm mb-2">
        <Link href={getEntityLink(match.source_type, match.source_id)} className="flex items-center gap-1 text-navy-100 hover:text-accent-400 transition-colors">
          <TypeIcon type={match.source_type} />
          <span className="truncate max-w-[180px]">{sourceName}</span>
        </Link>
        <ArrowRight className="w-3.5 h-3.5 text-navy-500 shrink-0" />
        <Link href={getEntityLink(match.target_type, match.target_id)} className="flex items-center gap-1 text-navy-100 hover:text-accent-400 transition-colors">
          <TypeIcon type={match.target_type} />
          <span className="truncate max-w-[180px]">{targetName}</span>
        </Link>
      </div>

      <p className="text-xs text-navy-400">{match.reasoning}</p>
    </div>
  );
}
