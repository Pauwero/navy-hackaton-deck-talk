"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { validateNavyChallenge } from "@/lib/quality-gate";
import QualityGateDisplay from "@/components/QualityGateDisplay";
import type { NavyChallenge, QualityGateResult } from "@/types";

export default function NewChallengePage() {
  const router = useRouter();
  const store = useStore();
  const [qualityResult, setQualityResult] = useState<QualityGateResult | null>(null);

  const [form, setForm] = useState({
    title: "",
    classification: "unclassified" as "unclassified" | "restricted",
    domain: "",
    description: "",
    operational_context: "",
    requirements: "",
    desired_trl: 6,
    timeline: "",
    priority: "medium" as "critical" | "high" | "medium" | "low",
    tags: "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildChallenge = (): Partial<NavyChallenge> => ({
    title: form.title,
    classification: form.classification,
    domain: form.domain,
    description: form.description,
    operational_context: form.operational_context,
    requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
    desired_trl: form.desired_trl,
    timeline: form.timeline,
    priority: form.priority,
    tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
  });

  const handleValidate = () => {
    const result = validateNavyChallenge(buildChallenge());
    setQualityResult(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateNavyChallenge(buildChallenge());
    setQualityResult(result);
    if (!result.passed) return;

    const challenge: NavyChallenge = {
      id: "chal-" + Math.random().toString(36).substring(2, 8),
      title: form.title,
      classification: form.classification,
      domain: form.domain,
      description: form.description,
      operational_context: form.operational_context,
      requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
      desired_trl: form.desired_trl,
      timeline: form.timeline,
      priority: form.priority,
      status: "open",
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      quality_score: result.score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.addChallenge(challenge);
    router.push("/challenges");
  };

  const inputClass = "w-full bg-white border border-navy-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-navy-600 mb-1";

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/challenges" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900">Post Navy Challenge</h1>
            <p className="text-xs text-navy-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Naval Quality Gate Agent ensures operational standards
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Challenge Title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g., Autonomous Mine Countermeasures in Shallow Waters" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Classification</label>
              <select className={inputClass} value={form.classification} onChange={(e) => updateField("classification", e.target.value)}>
                <option value="unclassified">Unclassified</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Domain *</label>
              <input className={inputClass} value={form.domain} onChange={(e) => updateField("domain", e.target.value)} placeholder="e.g., Mine Warfare, Cyber Defense" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description * (min 100 chars)</label>
            <textarea className={inputClass + " h-32"} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Detailed description of the challenge, including background and desired outcome..." />
          </div>

          <div>
            <label className={labelClass}>Operational Context * (min 50 chars)</label>
            <textarea className={inputClass + " h-20"} value={form.operational_context} onChange={(e) => updateField("operational_context", e.target.value)} placeholder="Describe the operational environment, conditions, and constraints..." />
          </div>

          <div>
            <label className={labelClass}>Requirements * (one per line)</label>
            <textarea className={inputClass + " h-24"} value={form.requirements} onChange={(e) => updateField("requirements", e.target.value)} placeholder="Autonomous operation for 8+ hours&#10;Multi-sensor detection&#10;NATO STANAG compliant communications" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Desired TRL * (1-9)</label>
              <input type="number" min={1} max={9} className={inputClass} value={form.desired_trl} onChange={(e) => updateField("desired_trl", parseInt(e.target.value) || 1)} />
            </div>
            <div>
              <label className={labelClass}>Timeline *</label>
              <input className={inputClass} value={form.timeline} onChange={(e) => updateField("timeline", e.target.value)} placeholder="e.g., 18 months" />
            </div>
            <div>
              <label className={labelClass}>Priority *</label>
              <select className={inputClass} value={form.priority} onChange={(e) => updateField("priority", e.target.value)}>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Tags (comma-separated, min 2 recommended)</label>
            <input className={inputClass} value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="e.g., autonomous systems, mine warfare, underwater robotics" />
          </div>

          <QualityGateDisplay result={qualityResult} />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-600 px-4 py-2.5 rounded-full text-sm font-medium transition-colors">
              <Shield className="w-4 h-4" /> Validate
            </button>
            <button type="submit" className="flex-1 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-sm">
              Post Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
