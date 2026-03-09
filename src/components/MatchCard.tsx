"use client";

import Link from "next/link";
import { ArrowRight, Building2, FlaskConical, Target, Heart, Link2 } from "lucide-react";
import type { Match } from "@/types";
import { useStore } from "@/lib/store";

const avatarColors = ["avatar-blue", "avatar-purple", "avatar-orange", "avatar-green", "avatar-pink"];

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

function getEntitySubtitle(type: string, id: string, store: ReturnType<typeof useStore>): string {
  if (type === "company") return store.companies.find((c) => c.id === id)?.sector || "";
  if (type === "research") return store.research.find((r) => r.id === id)?.institution || "";
  if (type === "challenge") return store.challenges.find((c) => c.id === id)?.domain || "";
  return "";
}

function getEntityTags(type: string, id: string, store: ReturnType<typeof useStore>): string[] {
  if (type === "company") return store.companies.find((c) => c.id === id)?.capabilities.slice(0, 3) || [];
  if (type === "research") return store.research.find((r) => r.id === id)?.keywords.slice(0, 3) || [];
  if (type === "challenge") return store.challenges.find((c) => c.id === id)?.tags.slice(0, 3) || [];
  return [];
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
  const targetSubtitle = getEntitySubtitle(match.target_type, match.target_id, store);
  const targetTags = getEntityTags(match.target_type, match.target_id, store);

  return (
    <div className="card p-5">
      {/* Top: match type label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-navy-400 bg-navy-100 px-2.5 py-1 rounded-full">
          {match.match_type.replace(/_/g, " ")}
        </span>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-heart" />
          <span className={`text-sm font-bold ${match.score >= 30 ? "text-success-500" : match.score >= 15 ? "text-warning-500" : "text-navy-400"}`}>
            {match.score}%
          </span>
        </div>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`avatar w-12 h-12 text-sm ${getAvatarColor(match.target_id)}`}>
          {getInitials(targetName)}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={getEntityLink(match.target_type, match.target_id)}
            className="font-semibold text-navy-900 hover:text-accent-500 transition-colors truncate block"
          >
            {targetName}
          </Link>
          <p className="text-xs text-navy-400 truncate">{targetSubtitle}</p>
        </div>
      </div>

      {/* Tags */}
      {targetTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {targetTags.map((tag) => (
            <span
              key={tag}
              className="tag-pill border-navy-200 text-navy-500 bg-navy-50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Reasoning */}
      <div className="flex items-start gap-1.5 mb-4">
        <Link2 className="w-3.5 h-3.5 text-accent-500 mt-0.5 shrink-0" />
        <p className="text-xs text-navy-400 line-clamp-2">{match.reasoning}</p>
      </div>

      {/* Source context + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-navy-100">
        <Link
          href={getEntityLink(match.source_type, match.source_id)}
          className="flex items-center gap-1.5 text-xs text-navy-400 hover:text-accent-500 transition-colors"
        >
          <TypeIcon type={match.source_type} className="w-3.5 h-3.5" />
          <span className="truncate max-w-[120px]">{sourceName}</span>
        </Link>
        <Link
          href={getEntityLink(match.target_type, match.target_id)}
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
        >
          Connect <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
