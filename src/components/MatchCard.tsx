"use client";

import Link from "next/link";
import { ArrowRight, Building2, FlaskConical, Target, Link2, Star } from "lucide-react";
import type { Match } from "@/types";
import { useStore } from "@/lib/store";

const avatarColors = ["avatar-blue", "avatar-purple", "avatar-orange", "avatar-green", "avatar-navy"];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

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

function TypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === "company") return <Building2 className={className || "w-4 h-4"} />;
  if (type === "research") return <FlaskConical className={className || "w-4 h-4"} />;
  return <Target className={className || "w-4 h-4"} />;
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getScoreLabel(score: number): { label: string; color: string; barColor: string } {
  if (score >= 30) return { label: "Excellent", color: "text-emerald-600", barColor: "bg-emerald-500" };
  if (score >= 20) return { label: "Strong", color: "text-blue-600", barColor: "bg-blue-500" };
  if (score >= 15) return { label: "Good", color: "text-amber-600", barColor: "bg-amber-500" };
  return { label: "Partial", color: "text-navy-400", barColor: "bg-navy-300" };
}

function getMatchTypeLabel(type: string): { label: string; color: string } {
  switch (type) {
    case "challenge_to_company": return { label: "Challenge Match", color: "text-orange-600 bg-orange-50" };
    case "challenge_to_research": return { label: "Research Match", color: "text-purple-600 bg-purple-50" };
    case "company_to_company": return { label: "Collaboration", color: "text-blue-600 bg-blue-50" };
    case "company_to_research": return { label: "Tech Transfer", color: "text-emerald-600 bg-emerald-50" };
    default: return { label: type.replace(/_/g, " "), color: "text-navy-500 bg-navy-50" };
  }
}

export default function MatchCard({ match, compact }: { match: Match; compact?: boolean }) {
  const store = useStore();
  const sourceName = getEntityName(match.source_type, match.source_id, store);
  const targetName = getEntityName(match.target_type, match.target_id, store);
  const scoreInfo = getScoreLabel(match.score);
  const typeInfo = getMatchTypeLabel(match.match_type);

  if (compact) {
    return (
      <Link
        href={getEntityLink(match.target_type, match.target_id)}
        className="card p-3 block group hover:border-accent-300 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={`avatar w-9 h-9 text-xs shrink-0 ${getAvatarColor(match.target_id)}`}>
            {getInitials(targetName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-navy-900 group-hover:text-accent-500 transition-colors truncate">
              {targetName}
            </p>
            <p className="text-[0.65rem] text-navy-400 truncate">{match.reasoning.split(".")[0]}</p>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-sm font-bold ${scoreInfo.color}`}>{match.score}%</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[0.65rem] font-medium px-2 py-0.5 rounded ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
        <div className="flex items-center gap-1">
          {match.score >= 25 && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
          <span className={`text-xs font-bold ${scoreInfo.color}`}>
            {match.score}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className={`avatar w-10 h-10 text-xs ${getAvatarColor(match.target_id)}`}>
          {getInitials(targetName)}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={getEntityLink(match.target_type, match.target_id)}
            className="font-semibold text-sm text-navy-900 hover:text-accent-500 transition-colors truncate block"
          >
            {targetName}
          </Link>
          <span className="flex items-center gap-1 text-[0.65rem] text-navy-400">
            <TypeIcon type={match.target_type} className="w-3 h-3" />
            {match.target_type}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="w-full h-1.5 bg-navy-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${scoreInfo.barColor}`}
            style={{ width: `${Math.min(match.score * 2, 100)}%` }}
          />
        </div>
        <p className={`text-[0.6rem] mt-1 ${scoreInfo.color} font-medium`}>{scoreInfo.label} match</p>
      </div>

      <div className="flex items-start gap-1.5 mb-3">
        <Link2 className="w-3 h-3 text-accent-500 mt-0.5 shrink-0" />
        <p className="text-[0.7rem] text-navy-500 line-clamp-2">{match.reasoning}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-navy-100">
        <span className="flex items-center gap-1 text-[0.65rem] text-navy-400">
          <TypeIcon type={match.source_type} className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{sourceName}</span>
        </span>
        <Link
          href={getEntityLink(match.target_type, match.target_id)}
          className="flex items-center gap-1 bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          View <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
