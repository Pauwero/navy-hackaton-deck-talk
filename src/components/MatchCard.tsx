"use client";

import Link from "next/link";
import { ArrowRight, Building2, FlaskConical, Target, Link2 } from "lucide-react";
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

export default function MatchCard({ match }: { match: Match }) {
  const store = useStore();
  const sourceName = getEntityName(match.source_type, match.source_id, store);
  const targetName = getEntityName(match.target_type, match.target_id, store);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.65rem] font-medium text-navy-400 bg-navy-50 px-2 py-0.5 rounded">
          {match.match_type.replace(/_/g, " ")}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          match.score >= 30 ? "text-success-500 bg-success-500/10" :
          match.score >= 15 ? "text-warning-500 bg-warning-500/10" :
          "text-navy-400 bg-navy-50"
        }`}>
          {match.score}%
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2">
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
        </div>
      </div>

      <div className="flex items-start gap-1.5 mb-3">
        <Link2 className="w-3 h-3 text-accent-500 mt-0.5 shrink-0" />
        <p className="text-[0.7rem] text-navy-500 line-clamp-2">{match.reasoning}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-navy-100">
        <span className="flex items-center gap-1 text-[0.65rem] text-navy-400">
          <TypeIcon type={match.source_type} className="w-3 h-3" />
          <span className="truncate max-w-[100px]">{sourceName}</span>
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
