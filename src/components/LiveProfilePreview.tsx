"use client";

import { Building2, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import type { OnboardingProfile } from "@/lib/onboarding-agent";

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
          <span key={item} className="text-[0.6rem] bg-accent-500/8 text-accent-600 px-1.5 py-0.5 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LiveProfilePreview({ profile }: { profile: OnboardingProfile }) {
  const filledCount = [
    profile.name,
    profile.sector,
    profile.description,
    profile.capabilities.length > 0,
    profile.technologies.length > 0,
    profile.trl_level > 0,
    profile.team_size,
    profile.contact_email,
    profile.use_cases.length > 0,
  ].filter(Boolean).length;

  const progress = Math.round((filledCount / 9) * 100);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-500" />
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide">Live Profile</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-navy-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[0.65rem] font-semibold text-navy-500">{progress}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {/* Header preview */}
        {profile.name && (
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-navy-100">
            <div className="w-10 h-10 rounded-lg avatar-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              {profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy-900 truncate">{profile.name}</p>
              {profile.sector && <p className="text-xs text-navy-500">{profile.sector}</p>}
            </div>
          </div>
        )}

        <Field label="Company Name" value={profile.name} filled={!!profile.name} />
        <Field label="Sector" value={profile.sector} filled={!!profile.sector} />
        <Field label="Description" value={profile.description} filled={!!profile.description} />
        <Field label="TRL Level" value={profile.trl_level > 0 ? `TRL ${profile.trl_level}` : ""} filled={profile.trl_level > 0} />
        <Field label="Team Size" value={profile.team_size} filled={!!profile.team_size} />
        <Field label="Contact" value={profile.contact_email} filled={!!profile.contact_email} />
        <TagList label="Capabilities" items={profile.capabilities} />
        <TagList label="Technologies" items={profile.technologies} />
        <TagList label="Use Cases" items={profile.use_cases} />

        {profile.defense_domains.length > 0 && (
          <TagList label="Defense Domains" items={profile.defense_domains} />
        )}
        {profile.certifications.length > 0 && (
          <TagList label="Certifications" items={profile.certifications} />
        )}
      </div>
    </div>
  );
}
