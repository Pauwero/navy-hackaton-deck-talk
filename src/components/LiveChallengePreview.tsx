"use client";

import { Target, CheckCircle2, Shield } from "lucide-react";
import type { ChallengeProfile } from "@/lib/challenge-agent";

function Field({ label, value, filled }: { label: string; value: string; filled: boolean }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        filled ? "bg-success-500/20" : "bg-navy-100"
      }`}>
        {filled ? (
          <CheckCircle2 className="w-2.5 h-2.5 text-success-500" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-navy-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">{label}</p>
        {filled ? (
          <p className="text-xs text-navy-800 mt-0.5 line-clamp-2">{value}</p>
        ) : (
          <p className="text-xs text-navy-300 italic mt-0.5">Waiting for input...</p>
        )}
      </div>
    </div>
  );
}

function TagList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return (
    <div className="py-1.5">
      <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-navy-300" />
        {label}
      </p>
      <p className="text-xs text-navy-300 italic mt-0.5 ml-4">Not yet provided</p>
    </div>
  );

  return (
    <div className="py-1.5">
      <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide flex items-center gap-1.5">
        <CheckCircle2 className="w-2.5 h-2.5 text-success-500" />
        {label}
      </p>
      <div className="flex flex-wrap gap-1 mt-1 ml-4">
        {items.map((item) => (
          <span key={item} className="text-[0.6rem] bg-gold-500/10 text-gold-600 px-1.5 py-0.5 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LiveChallengePreview({ profile }: { profile: ChallengeProfile }) {
  const filledCount = [
    profile.title,
    profile.domain,
    profile.description,
    profile.operational_context,
    profile.requirements.length > 0,
    profile.desired_trl > 0,
    profile.timeline,
    profile.priority,
    profile.tags.length > 0,
  ].filter(Boolean).length;

  const progress = Math.round((filledCount / 9) * 100);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-gold-500" />
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide">Live Challenge</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-navy-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[0.65rem] font-semibold text-navy-500">{progress}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {/* Header preview */}
        {profile.title && (
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-navy-100">
            <div className="w-10 h-10 rounded-lg avatar-gold flex items-center justify-center text-white shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy-900 truncate">{profile.title}</p>
              {profile.domain && <p className="text-xs text-navy-500">{profile.domain}</p>}
            </div>
          </div>
        )}

        <Field label="Title" value={profile.title} filled={!!profile.title} />
        <Field label="Domain" value={profile.domain} filled={!!profile.domain} />
        <Field label="Description" value={profile.description} filled={!!profile.description} />
        <Field label="Operational Context" value={profile.operational_context} filled={!!profile.operational_context} />
        <Field label="Gap Type" value={profile.gap_type} filled={!!profile.gap_type} />
        <Field label="Desired TRL" value={profile.desired_trl > 0 ? `TRL ${profile.desired_trl}` : ""} filled={profile.desired_trl > 0} />
        <Field label="Timeline" value={profile.timeline} filled={!!profile.timeline} />
        <Field label="Priority" value={profile.priority} filled={!!profile.priority} />
        <Field label="Budget" value={profile.budget_indication} filled={!!profile.budget_indication} />
        <TagList label="Requirements" items={profile.requirements} />
        <TagList label="Tags" items={profile.tags} />
        {profile.affected_platforms.length > 0 && (
          <TagList label="Affected Platforms" items={profile.affected_platforms} />
        )}
      </div>
    </div>
  );
}
