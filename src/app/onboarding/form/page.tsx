"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Shield,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  X,
} from "lucide-react";
import {
  DEFENSE_DOMAINS,
  CAPABILITY_CATEGORIES,
  ALL_CAPABILITIES,
  CERTIFICATIONS,
  PARTNERSHIP_TYPES,
  CLEARANCE_LEVELS,
  TRL_DESCRIPTIONS,
  createEmptyOnboardingProfile,
  validateOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboarding-agent";
import type { QualityGateResult } from "@/types";

type Step = "basics" | "capabilities" | "defense" | "compliance" | "review";

const STEPS: { key: Step; label: string; number: number }[] = [
  { key: "basics", label: "Company Basics", number: 1 },
  { key: "capabilities", label: "Capabilities & Tech", number: 2 },
  { key: "defense", label: "Defense Profile", number: 3 },
  { key: "compliance", label: "Compliance", number: 4 },
  { key: "review", label: "Review & Submit", number: 5 },
];

export default function OnboardingFormPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basics");
  const [profile, setProfile] = useState<OnboardingProfile>(createEmptyOnboardingProfile());
  const [validation, setValidation] = useState<QualityGateResult | null>(null);
  const [showCapDropdown, setShowCapDropdown] = useState<string | null>(null);

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  const updateField = useCallback((field: keyof OnboardingProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayItem = useCallback((field: keyof OnboardingProfile, item: string) => {
    setProfile((prev) => {
      const arr = (prev[field] as string[]) || [];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      };
    });
  }, []);

  const handleValidate = useCallback(() => {
    const result = validateOnboardingProfile(profile);
    setValidation(result);
    return result;
  }, [profile]);

  const handleNext = () => {
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx].key);
      if (nextIdx === STEPS.length - 1) {
        handleValidate();
      }
    }
  };

  const handleBack = () => {
    const prevIdx = currentStepIdx - 1;
    if (prevIdx >= 0) setStep(STEPS[prevIdx].key);
  };

  const handleSubmitToReview = () => {
    const result = handleValidate();
    // Store profile in sessionStorage for the review page
    sessionStorage.setItem("onboarding_profile", JSON.stringify(profile));
    sessionStorage.setItem("onboarding_method", "form");
    router.push("/onboarding/review");
  };

  const inputClass = "w-full bg-white border border-navy-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-navy-600 mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/onboarding" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Onboarding
      </Link>

      {/* Progress bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, idx) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                idx <= currentStepIdx ? "text-accent-500" : "text-navy-300"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                idx < currentStepIdx
                  ? "bg-success-500 text-white"
                  : idx === currentStepIdx
                    ? "bg-accent-500 text-white"
                    : "bg-navy-100 text-navy-400"
              }`}>
                {idx < currentStepIdx ? <CheckCircle2 className="w-4 h-4" /> : s.number}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-navy-100 rounded-full h-1.5">
          <div
            className="bg-accent-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card p-6">
        {/* Step 1: Basics */}
        {step === "basics" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Company Basics</h2>
                <p className="text-xs text-navy-400">Core identification and contact information</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Company Legal Name *</label>
              <input className={inputClass} value={profile.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Maritime Robotics BV" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sector / Industry *</label>
                <input className={inputClass} value={profile.sector} onChange={(e) => updateField("sector", e.target.value)} placeholder="e.g., Autonomous Systems" />
              </div>
              <div>
                <label className={labelClass}>Country (ISO code)</label>
                <input className={inputClass} value={profile.country} onChange={(e) => updateField("country", e.target.value)} placeholder="e.g., NL, US, UK" maxLength={2} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Company Description *</label>
              <textarea
                className={inputClass + " h-32"}
                value={profile.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your company, solutions, and defense value proposition (min 100 characters). Include: what you do, for whom, and your key differentiators."
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${profile.description.length >= 100 ? "text-success-500" : "text-navy-300"}`}>
                  {profile.description.length >= 100 ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : null}
                  {profile.description.length}/100 min
                </span>
                {profile.description.length > 0 && profile.description.length < 100 && (
                  <span className="text-xs text-warning-500">{100 - profile.description.length} more characters needed</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact Email *</label>
                <input type="email" className={inputClass} value={profile.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} placeholder="info@company.com" />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input className={inputClass} value={profile.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Team Size</label>
                <select className={inputClass} value={profile.team_size} onChange={(e) => updateField("team_size", e.target.value)}>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Founded Year</label>
                <input type="number" className={inputClass} value={profile.founded_year} onChange={(e) => updateField("founded_year", e.target.value)} placeholder="e.g., 2018" min={1800} max={2026} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Capabilities & Technologies */}
        {step === "capabilities" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Capabilities & Technologies</h2>
                <p className="text-xs text-navy-400">Select from the defense capability taxonomy (min 3)</p>
              </div>
            </div>

            {/* Capabilities by category */}
            {(["technical", "operational", "crossCutting"] as const).map((cat) => {
              const label = cat === "crossCutting" ? "Cross-Cutting" : cat.charAt(0).toUpperCase() + cat.slice(1);
              const items = CAPABILITY_CATEGORIES[cat];
              const isOpen = showCapDropdown === cat;
              return (
                <div key={cat}>
                  <button
                    type="button"
                    onClick={() => setShowCapDropdown(isOpen ? null : cat)}
                    className="flex items-center justify-between w-full text-sm font-medium text-navy-700 bg-navy-50 px-3 py-2.5 rounded-xl hover:bg-navy-100 transition-colors"
                  >
                    <span>{label} Capabilities ({items.filter((i) => profile.capabilities.includes(i)).length} selected)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 pl-1">
                      {items.map((cap) => {
                        const selected = profile.capabilities.includes(cap);
                        return (
                          <button
                            key={cap}
                            type="button"
                            onClick={() => toggleArrayItem("capabilities", cap)}
                            className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                              selected
                                ? "bg-accent-500 text-white border-accent-500"
                                : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                            }`}
                          >
                            {selected && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                            {cap}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {profile.capabilities.length > 0 && (
              <div>
                <label className={labelClass}>Selected Capabilities ({profile.capabilities.length})</label>
                <div className="flex flex-wrap gap-1.5">
                  {profile.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="tag-pill bg-accent-500/10 text-accent-600 border-accent-200 text-xs cursor-pointer hover:bg-danger-500/10 hover:text-danger-600 hover:border-danger-200 transition-colors"
                      onClick={() => toggleArrayItem("capabilities", cap)}
                    >
                      {cap} <X className="w-3 h-3 inline ml-0.5" />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Technologies * (comma-separated)</label>
              <input
                className={inputClass}
                value={profile.technologies.join(", ")}
                onChange={(e) => updateField("technologies", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="e.g., ROS2, machine learning, edge computing, Python, sensor fusion"
              />
              <p className="text-xs text-navy-300 mt-1">List specific technologies, frameworks, and tools (min 2)</p>
            </div>

            <div>
              <label className={labelClass}>
                TRL Level * (1-9)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TRL_DESCRIPTIONS.map((trl) => (
                  <button
                    key={trl.level}
                    type="button"
                    onClick={() => updateField("trl_level", trl.level)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      profile.trl_level === trl.level
                        ? "bg-accent-500 text-white border-accent-500"
                        : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                    }`}
                  >
                    <span className="font-bold">TRL {trl.level}</span>
                    <br />
                    <span className={profile.trl_level === trl.level ? "text-white/80" : "text-navy-400"}>
                      {trl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {profile.trl_level >= 6 && (
              <div>
                <label className={labelClass}>
                  TRL {profile.trl_level} Justification
                  <span className="text-warning-500 ml-1">(recommended for TRL 6+)</span>
                </label>
                <textarea
                  className={inputClass + " h-20"}
                  value={profile.trl_justification}
                  onChange={(e) => updateField("trl_justification", e.target.value)}
                  placeholder="Describe the relevant/operational environment where your technology was tested..."
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Use Cases (comma-separated)</label>
              <input
                className={inputClass}
                value={profile.use_cases.join(", ")}
                onChange={(e) => updateField("use_cases", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="e.g., Mine detection, Port security, Infrastructure inspection"
              />
            </div>
          </div>
        )}

        {/* Step 3: Defense Profile */}
        {step === "defense" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Defense Profile</h2>
                <p className="text-xs text-navy-400">Domain classification and defense experience</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Defense Domain(s) * — Select all that apply</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEFENSE_DOMAINS.map((domain) => {
                  const selected = profile.defense_domains.includes(domain.code);
                  return (
                    <button
                      key={domain.code}
                      type="button"
                      onClick={() => toggleArrayItem("defense_domains", domain.code)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        selected
                          ? "bg-accent-500 text-white border-accent-500"
                          : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{domain.code} — {domain.label}</span>
                        {selected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <p className={`text-xs mt-0.5 ${selected ? "text-white/70" : "text-navy-400"}`}>
                        {domain.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={labelClass}>CAGE / NCAGE Code</label>
              <input
                className={inputClass}
                value={profile.cage_code}
                onChange={(e) => updateField("cage_code", e.target.value)}
                placeholder="e.g., 1ABC2 (5 chars)"
                maxLength={10}
              />
              <p className="text-xs text-navy-300 mt-1">Commercial and Government Entity code, if available</p>
            </div>

            <div>
              <label className={labelClass}>Past Defense / Naval Experience</label>
              <textarea
                className={inputClass + " h-24"}
                value={profile.past_defense_experience}
                onChange={(e) => updateField("past_defense_experience", e.target.value)}
                placeholder="Briefly describe relevant defense contracts, projects, or collaborations. Names can be generalized for security."
              />
            </div>

            <div>
              <label className={labelClass}>Partnership Interests</label>
              <div className="flex flex-wrap gap-2">
                {PARTNERSHIP_TYPES.map((type) => {
                  const selected = profile.partnership_interest.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleArrayItem("partnership_interest", type)}
                      className={`tag-pill text-xs transition-all ${
                        selected
                          ? "bg-accent-500 text-white border-accent-500"
                          : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3 h-3" />}
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Compliance */}
        {step === "compliance" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Compliance & Certifications</h2>
                <p className="text-xs text-navy-400">Security clearance and compliance declarations</p>
              </div>
            </div>

            <div className="card p-4 bg-warning-500/5 border border-warning-500/20">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-warning-500 mt-0.5 shrink-0" />
                <p className="text-xs text-navy-600">
                  This platform operates at <strong>UNCLASSIFIED</strong> level only. Do not submit
                  controlled technical data. ITAR/EAR items should be described in general terms.
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Security Clearance Level</label>
              <div className="flex flex-wrap gap-2">
                {CLEARANCE_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField("clearance_level", level)}
                    className={`tag-pill text-xs transition-all ${
                      profile.clearance_level === level
                        ? "bg-accent-500 text-white border-accent-500"
                        : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                    }`}
                  >
                    {profile.clearance_level === level && <CheckCircle2 className="w-3 h-3" />}
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Certifications</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CERTIFICATIONS.map((cert) => {
                  const selected = profile.certifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleArrayItem("certifications", cert)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                        selected
                          ? "bg-accent-500 text-white border-accent-500"
                          : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className={labelClass}>Compliance Declarations</label>
              {[
                { key: "compliance_itar" as const, label: "ITAR Registration" },
                { key: "compliance_ear" as const, label: "EAR Compliance" },
                { key: "compliance_gdpr" as const, label: "GDPR Compliance (EU)" },
              ].map((comp) => (
                <div key={comp.key} className="flex items-center justify-between bg-navy-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-navy-700">{comp.label}</span>
                  <select
                    className="bg-white border border-navy-200 rounded-lg px-2 py-1 text-xs text-navy-600"
                    value={profile[comp.key]}
                    onChange={(e) => updateField(comp.key, e.target.value)}
                  >
                    <option value="not-applicable">Not Applicable</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === "review" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-accent-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Review & Submit</h2>
                <p className="text-xs text-navy-400">Verify your profile before Quality Gate review</p>
              </div>
            </div>

            {/* Quality score */}
            {validation && (
              <div className={`rounded-xl p-4 border ${
                validation.score >= 85 ? "bg-success-500/5 border-success-500/20" :
                validation.score >= 60 ? "bg-warning-500/5 border-warning-500/20" :
                "bg-danger-500/5 border-danger-500/20"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-navy-900">Quality Score</span>
                  <span className={`text-2xl font-bold ${
                    validation.score >= 85 ? "text-success-500" :
                    validation.score >= 60 ? "text-warning-500" :
                    "text-danger-500"
                  }`}>{validation.score}/100</span>
                </div>
                <div className="w-full bg-navy-100 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      validation.score >= 85 ? "bg-success-500" :
                      validation.score >= 60 ? "bg-warning-500" :
                      "bg-danger-500"
                    }`}
                    style={{ width: `${validation.score}%` }}
                  />
                </div>

                {validation.issues.length > 0 && (
                  <div className="space-y-1.5">
                    {validation.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {issue.severity === "error" ? (
                          <AlertCircle className="w-3.5 h-3.5 text-danger-500 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-warning-500 mt-0.5 shrink-0" />
                        )}
                        <span className="text-navy-600">
                          <strong className="text-navy-700">{issue.field}:</strong> {issue.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {validation.suggestions.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-navy-500">
                        <Info className="w-3.5 h-3.5 text-accent-500 mt-0.5 shrink-0" />
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile summary */}
            <div className="space-y-3">
              <SummarySection title="Company" items={[
                ["Name", profile.name],
                ["Sector", profile.sector],
                ["Country", profile.country],
                ["Team Size", profile.team_size],
                ["Email", profile.contact_email],
              ]} />
              <SummarySection title="Capabilities" items={[
                ["Capabilities", profile.capabilities.join(", ") || "—"],
                ["Technologies", profile.technologies.join(", ") || "—"],
                ["TRL Level", `${profile.trl_level}`],
                ["Use Cases", profile.use_cases.join(", ") || "—"],
              ]} />
              <SummarySection title="Defense" items={[
                ["Domains", profile.defense_domains.map((d) => DEFENSE_DOMAINS.find((dd) => dd.code === d)?.label || d).join(", ") || "—"],
                ["CAGE Code", profile.cage_code || "—"],
                ["Clearance", profile.clearance_level],
                ["Certifications", profile.certifications.join(", ") || "—"],
              ]} />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-navy-100">
          {currentStepIdx > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-navy-500 hover:text-navy-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step === "review" ? (
            <button
              onClick={handleSubmitToReview}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-sm"
            >
              <Shield className="w-4 h-4" /> Submit to Agent Review
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="bg-navy-50 rounded-xl p-3">
      <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="space-y-1.5">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-navy-500">{label}</span>
            <span className="text-navy-700 font-medium text-right max-w-[60%] truncate">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
