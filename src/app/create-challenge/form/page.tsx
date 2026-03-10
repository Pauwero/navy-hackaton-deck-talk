"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Shield,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Plus,
  Crosshair,
  Clock,
  Flag,
} from "lucide-react";
import {
  OPERATIONAL_DOMAINS,
  GAP_TYPES,
  TIMELINE_OPTIONS,
  BUDGET_RANGES,
  PRIORITY_OPTIONS,
  REQUIREMENT_TEMPLATES,
  CHALLENGE_TAGS,
  createEmptyChallengeProfile,
  validateChallengeProfile,
  type ChallengeProfile,
} from "@/lib/challenge-agent";
import type { QualityGateResult } from "@/types";

type Step = "need" | "requirements" | "context" | "priority" | "review";

const STEPS: { key: Step; label: string; number: number }[] = [
  { key: "need", label: "The Need", number: 1 },
  { key: "requirements", label: "Requirements", number: 2 },
  { key: "context", label: "Operational Context", number: 3 },
  { key: "priority", label: "Priority & Timeline", number: 4 },
  { key: "review", label: "Review", number: 5 },
];

export default function ChallengeFormPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("need");
  const [profile, setProfile] = useState<ChallengeProfile>(createEmptyChallengeProfile());
  const [validation, setValidation] = useState<QualityGateResult | null>(null);
  const [newRequirement, setNewRequirement] = useState("");
  const [newSuccessCriteria, setNewSuccessCriteria] = useState("");
  const [newPlatform, setNewPlatform] = useState("");
  const [showTemplates, setShowTemplates] = useState<string | null>(null);

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  const updateField = useCallback((field: keyof ChallengeProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  }, []);

  const addToArray = useCallback((field: keyof ChallengeProfile, value: string) => {
    if (!value.trim()) return;
    setProfile((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }));
  }, []);

  const removeFromArray = useCallback((field: keyof ChallengeProfile, index: number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  }, []);

  const handleValidate = useCallback(() => {
    const result = validateChallengeProfile(profile);
    setValidation(result);
    return result;
  }, [profile]);

  const handleNext = () => {
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx].key);
      if (nextIdx === STEPS.length - 1) handleValidate();
    }
  };

  const handleBack = () => {
    const prevIdx = currentStepIdx - 1;
    if (prevIdx >= 0) setStep(STEPS[prevIdx].key);
  };

  const handleSubmitToReview = () => {
    handleValidate();
    sessionStorage.setItem("challenge_profile", JSON.stringify(profile));
    sessionStorage.setItem("challenge_method", "form");
    router.push("/create-challenge/review");
  };

  const inputClass = "w-full bg-white border border-navy-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-navy-600 mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/create-challenge" className="flex items-center gap-1 text-navy-400 hover:text-orange-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Challenge Creation
      </Link>

      {/* Progress */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, idx) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                idx <= currentStepIdx ? "text-orange-500" : "text-navy-300"
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                idx < currentStepIdx ? "bg-success-500 text-white" : idx === currentStepIdx ? "bg-orange-500 text-white" : "bg-navy-100 text-navy-400"
              }`}>
                {idx < currentStepIdx ? <CheckCircle2 className="w-4 h-4" /> : s.number}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-navy-100 rounded-full h-1.5">
          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentStepIdx + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="card p-6">
        {/* Step 1: The Need */}
        {step === "need" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Define the Need</h2>
                <p className="text-xs text-navy-400">What capability gap are you trying to address?</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Challenge Title *</label>
              <input className={inputClass} value={profile.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g., Autonomous Mine Detection for Harbor Approach Lanes" />
              <p className="text-xs text-navy-300 mt-1">Clear, descriptive title starting with the capability need (min 10 chars)</p>
            </div>

            <div>
              <label className={labelClass}>Operational Domain *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OPERATIONAL_DOMAINS.map((d) => (
                  <button
                    key={d.code}
                    type="button"
                    onClick={() => updateField("domain", d.code)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                      profile.domain === d.code
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-navy-600 border-navy-200 hover:border-orange-400"
                    }`}
                  >
                    <span className="font-bold">{d.code}</span>
                    <br />
                    <span className={profile.domain === d.code ? "text-white/80" : "text-navy-400"}>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Capability Gap Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {GAP_TYPES.map((g) => (
                  <button
                    key={g.code}
                    type="button"
                    onClick={() => updateField("gap_type", g.code)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      profile.gap_type === g.code
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-navy-600 border-navy-200 hover:border-orange-400"
                    }`}
                  >
                    <span className="font-semibold text-sm">{g.label}</span>
                    <p className={`text-xs mt-0.5 ${profile.gap_type === g.code ? "text-white/70" : "text-navy-400"}`}>{g.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Challenge Description *</label>
              <textarea
                className={inputClass + " h-32"}
                value={profile.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the PROBLEM, not the solution. What can't you do today? What capability is missing? What operational impact does this have? (min 100 characters)"
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${profile.description.length >= 100 ? "text-success-500" : "text-navy-300"}`}>
                  {profile.description.length >= 100 ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : null}
                  {profile.description.length}/100 min
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Classification</label>
              <div className="flex gap-3">
                {(["unclassified", "restricted"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateField("classification", c)}
                    className={`tag-pill text-xs transition-all ${
                      profile.classification === c ? "bg-orange-500 text-white border-orange-500" : "bg-white text-navy-600 border-navy-200"
                    }`}
                  >
                    {profile.classification === c && <CheckCircle2 className="w-3 h-3" />}
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === "requirements" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Requirements</h2>
                <p className="text-xs text-navy-400">Define specific, measurable requirements (min 3)</p>
              </div>
            </div>

            {/* Requirement templates */}
            <div className="space-y-2">
              {(["functional", "performance", "environmental", "integration", "operational"] as const).map((cat) => (
                <div key={cat}>
                  <button
                    type="button"
                    onClick={() => setShowTemplates(showTemplates === cat ? null : cat)}
                    className="text-xs font-medium text-navy-500 bg-navy-50 px-3 py-2 rounded-lg hover:bg-navy-100 transition-colors w-full text-left"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} requirement templates ▸
                  </button>
                  {showTemplates === cat && (
                    <div className="mt-1 space-y-1 pl-2">
                      {REQUIREMENT_TEMPLATES[cat].map((tmpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setNewRequirement(tmpl);
                            setShowTemplates(null);
                          }}
                          className="block text-xs text-navy-500 hover:text-orange-500 py-1 transition-colors"
                        >
                          → {tmpl}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add requirement */}
            <div>
              <label className={labelClass}>Add Requirement</label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="e.g., The solution shall detect objects >0.5m at >200m range"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToArray("requirements", newRequirement);
                      setNewRequirement("");
                    }
                  }}
                />
                <button
                  onClick={() => { addToArray("requirements", newRequirement); setNewRequirement(""); }}
                  className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Requirements list */}
            {profile.requirements.length > 0 && (
              <div className="space-y-2">
                <label className={labelClass}>Requirements ({profile.requirements.length})</label>
                {profile.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-navy-50 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-orange-500 mt-0.5 shrink-0">R{idx + 1}</span>
                    <span className="text-xs text-navy-700 flex-1">{req}</span>
                    <button onClick={() => removeFromArray("requirements", idx)} className="text-navy-300 hover:text-danger-500 shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TRL */}
            <div>
              <label className={labelClass}>Desired TRL Level *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((trl) => (
                  <button
                    key={trl}
                    type="button"
                    onClick={() => updateField("desired_trl", trl)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      profile.desired_trl === trl
                        ? "bg-orange-500 text-white"
                        : "bg-navy-50 text-navy-500 hover:bg-navy-100"
                    }`}
                  >
                    {trl}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className={labelClass}>Tags * (min 2)</label>
              <div className="flex flex-wrap gap-1.5">
                {CHALLENGE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`tag-pill text-xs transition-all ${
                      profile.tags.includes(tag)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-navy-500 border-navy-200 hover:border-orange-400"
                    }`}
                  >
                    {profile.tags.includes(tag) && <CheckCircle2 className="w-3 h-3" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Operational Context */}
        {step === "context" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Operational Context</h2>
                <p className="text-xs text-navy-400">Help solution providers understand the real-world scenario</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Operational Scenario *</label>
              <textarea
                className={inputClass + " h-28"}
                value={profile.operational_context}
                onChange={(e) => updateField("operational_context", e.target.value)}
                placeholder="Walk through a typical scenario: 'During a routine mine clearance operation, our crew needs to survey a 2km harbor approach lane. Currently this takes 8 hours with divers, exposing them to risk...'"
              />
              <span className={`text-xs ${profile.operational_context.length >= 50 ? "text-success-500" : "text-navy-300"}`}>
                {profile.operational_context.length}/50 min
              </span>
            </div>

            <div>
              <label className={labelClass}>Current Workaround</label>
              <textarea
                className={inputClass + " h-20"}
                value={profile.current_workaround}
                onChange={(e) => updateField("current_workaround", e.target.value)}
                placeholder="How do your teams handle this today? What's the manual/existing process and its limitations?"
              />
            </div>

            <div>
              <label className={labelClass}>Operational Impact</label>
              <textarea
                className={inputClass + " h-20"}
                value={profile.impact_description}
                onChange={(e) => updateField("impact_description", e.target.value)}
                placeholder="What happens when this capability gap affects operations? Mission delays, safety risks, resource waste?"
              />
            </div>

            <div>
              <label className={labelClass}>Affected Platforms / Units</label>
              <div className="flex gap-2 mb-2">
                <input
                  className={inputClass}
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  placeholder="e.g., mine hunters, frigates, patrol vessels"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { addToArray("affected_platforms", newPlatform); setNewPlatform(""); }
                  }}
                />
                <button
                  onClick={() => { addToArray("affected_platforms", newPlatform); setNewPlatform(""); }}
                  className="w-10 h-10 rounded-xl bg-navy-100 hover:bg-navy-200 text-navy-500 flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {profile.affected_platforms.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.affected_platforms.map((p, i) => (
                    <span key={i} className="tag-pill bg-orange-50 text-orange-600 border-orange-200 text-xs cursor-pointer hover:bg-danger-50 hover:text-danger-600" onClick={() => removeFromArray("affected_platforms", i)}>
                      {p} <X className="w-3 h-3 inline ml-0.5" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>End User Profile</label>
                <input className={inputClass} value={profile.user_profile} onChange={(e) => updateField("user_profile", e.target.value)} placeholder="e.g., Bridge operators, technicians" />
              </div>
              <div>
                <label className={labelClass}>Environmental Conditions</label>
                <input className={inputClass} value={profile.environment_conditions} onChange={(e) => updateField("environment_conditions", e.target.value)} placeholder="e.g., Sea state 0-4, -10 to 40°C" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Sponsoring Unit / Command</label>
              <input className={inputClass} value={profile.stakeholder_unit} onChange={(e) => updateField("stakeholder_unit", e.target.value)} placeholder="e.g., Mine Warfare Command, Belgian Navy" />
            </div>
          </div>
        )}

        {/* Step 4: Priority & Timeline */}
        {step === "priority" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Flag className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">Priority & Timeline</h2>
                <p className="text-xs text-navy-400">Set urgency and expected delivery timeframe</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Priority Level *</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => updateField("priority", p.value)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      profile.priority === p.value
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-navy-600 border-navy-200 hover:border-orange-400"
                    }`}
                  >
                    <span className="font-semibold text-sm">{p.label}</span>
                    <p className={`text-xs mt-0.5 ${profile.priority === p.value ? "text-white/70" : "text-navy-400"}`}>{p.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Priority Justification *</label>
              <textarea
                className={inputClass + " h-20"}
                value={profile.priority_justification}
                onChange={(e) => updateField("priority_justification", e.target.value)}
                placeholder="Why this priority level? What's the operational impact? (min 30 characters)"
              />
            </div>

            <div>
              <label className={labelClass}>Timeline *</label>
              <div className="grid grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => updateField("timeline", t.value)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      profile.timeline === t.value
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-navy-600 border-navy-200 hover:border-orange-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{t.label}</span>
                      <Clock className={`w-3.5 h-3.5 ${profile.timeline === t.value ? "text-white/70" : "text-navy-300"}`} />
                    </div>
                    <p className={`text-xs mt-0.5 ${profile.timeline === t.value ? "text-white/70" : "text-navy-400"}`}>{t.trlRange} — {t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Budget Indication</label>
              <div className="flex gap-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => updateField("budget_indication", b)}
                    className={`tag-pill text-xs transition-all ${
                      profile.budget_indication === b
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-navy-500 border-navy-200 hover:border-orange-400"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Success criteria */}
            <div>
              <label className={labelClass}>Success Criteria</label>
              <div className="flex gap-2 mb-2">
                <input
                  className={inputClass}
                  value={newSuccessCriteria}
                  onChange={(e) => setNewSuccessCriteria(e.target.value)}
                  placeholder="e.g., 80% reduction in clearance time"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { addToArray("success_criteria", newSuccessCriteria); setNewSuccessCriteria(""); }
                  }}
                />
                <button
                  onClick={() => { addToArray("success_criteria", newSuccessCriteria); setNewSuccessCriteria(""); }}
                  className="w-10 h-10 rounded-xl bg-navy-100 hover:bg-navy-200 text-navy-500 flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {profile.success_criteria.length > 0 && (
                <div className="space-y-1">
                  {profile.success_criteria.map((sc, i) => (
                    <div key={i} className="flex items-center gap-2 bg-navy-50 rounded-lg px-3 py-1.5 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success-500 shrink-0" />
                      <span className="flex-1 text-navy-700">{sc}</span>
                      <button onClick={() => removeFromArray("success_criteria", i)} className="text-navy-300 hover:text-danger-500"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
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
                <p className="text-xs text-navy-400">Verify your challenge before Agent review</p>
              </div>
            </div>

            {validation && (
              <div className={`rounded-xl p-4 border ${
                validation.score >= 85 ? "bg-success-500/5 border-success-500/20" :
                validation.score >= 60 ? "bg-warning-500/5 border-warning-500/20" :
                "bg-danger-500/5 border-danger-500/20"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-navy-900">Quality Score</span>
                  <span className={`text-2xl font-bold ${
                    validation.score >= 85 ? "text-success-500" : validation.score >= 60 ? "text-warning-500" : "text-danger-500"
                  }`}>{validation.score}/100</span>
                </div>
                <div className="w-full bg-navy-100 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full transition-all ${
                    validation.score >= 85 ? "bg-success-500" : validation.score >= 60 ? "bg-warning-500" : "bg-danger-500"
                  }`} style={{ width: `${validation.score}%` }} />
                </div>
                {validation.issues.length > 0 && (
                  <div className="space-y-1.5">
                    {validation.issues.map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {issue.severity === "error" ? <AlertCircle className="w-3.5 h-3.5 text-danger-500 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-warning-500 mt-0.5 shrink-0" />}
                        <span className="text-navy-600"><strong>{issue.field}:</strong> {issue.message}</span>
                      </div>
                    ))}
                  </div>
                )}
                {validation.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {validation.suggestions.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-navy-500">
                        <Info className="w-3.5 h-3.5 text-accent-500 mt-0.5 shrink-0" />{s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="space-y-3">
              <div className="bg-navy-50 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Challenge</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-navy-500">Title</span><span className="text-navy-700 font-medium text-right max-w-[60%] truncate">{profile.title || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Domain</span><span className="text-navy-700 font-medium">{OPERATIONAL_DOMAINS.find((d) => d.code === profile.domain)?.label || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Gap Type</span><span className="text-navy-700 font-medium">{GAP_TYPES.find((g) => g.code === profile.gap_type)?.label || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Classification</span><span className="text-navy-700 font-medium">{profile.classification}</span></div>
                </div>
              </div>
              <div className="bg-navy-50 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Requirements & TRL</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-navy-500">Requirements</span><span className="text-navy-700 font-medium">{profile.requirements.length} defined</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Desired TRL</span><span className="text-navy-700 font-medium">{profile.desired_trl}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Tags</span><span className="text-navy-700 font-medium text-right max-w-[60%] truncate">{profile.tags.join(", ") || "—"}</span></div>
                </div>
              </div>
              <div className="bg-navy-50 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">Priority & Timeline</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-navy-500">Priority</span><span className="text-navy-700 font-medium capitalize">{profile.priority}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Timeline</span><span className="text-navy-700 font-medium">{TIMELINE_OPTIONS.find((t) => t.value === profile.timeline)?.label || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Budget</span><span className="text-navy-700 font-medium">{profile.budget_indication || "—"}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-navy-100">
          {currentStepIdx > 0 ? (
            <button onClick={handleBack} className="flex items-center gap-1.5 text-navy-500 hover:text-navy-700 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step === "review" ? (
            <button onClick={handleSubmitToReview} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-sm">
              <Shield className="w-4 h-4" /> Submit to Agent Review
            </button>
          ) : (
            <button onClick={handleNext} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
