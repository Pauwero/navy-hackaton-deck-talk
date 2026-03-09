"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { validateResearchProfile } from "@/lib/quality-gate";
import QualityGateDisplay from "@/components/QualityGateDisplay";
import type { ResearchProfile, QualityGateResult } from "@/types";

export default function NewResearchPage() {
  const router = useRouter();
  const store = useStore();
  const [qualityResult, setQualityResult] = useState<QualityGateResult | null>(null);

  const [form, setForm] = useState({
    title: "",
    institution: "",
    principal_investigator: "",
    field: "",
    description: "",
    keywords: "",
    publications: "",
    trl_level: 3,
    funding_status: "",
    collaboration_interest: "",
    contact_email: "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildProfile = (): Partial<ResearchProfile> => ({
    title: form.title,
    institution: form.institution,
    principal_investigator: form.principal_investigator,
    field: form.field,
    description: form.description,
    keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
    publications: form.publications.split("\n").map((s) => s.trim()).filter(Boolean),
    trl_level: form.trl_level,
    funding_status: form.funding_status,
    collaboration_interest: form.collaboration_interest.split(",").map((s) => s.trim()).filter(Boolean),
    contact_email: form.contact_email,
  });

  const handleValidate = () => {
    const result = validateResearchProfile(buildProfile());
    setQualityResult(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateResearchProfile(buildProfile());
    setQualityResult(result);
    if (!result.passed) return;

    const profile: ResearchProfile = {
      id: "res-" + Math.random().toString(36).substring(2, 8),
      title: form.title,
      institution: form.institution,
      principal_investigator: form.principal_investigator,
      field: form.field,
      description: form.description,
      keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
      publications: form.publications.split("\n").map((s) => s.trim()).filter(Boolean),
      trl_level: form.trl_level,
      funding_status: form.funding_status,
      collaboration_interest: form.collaboration_interest.split(",").map((s) => s.trim()).filter(Boolean),
      contact_email: form.contact_email,
      quality_score: result.score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.addResearch(profile);
    router.push("/research");
  };

  const inputClass = "w-full bg-white border border-navy-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all";
  const labelClass = "block text-sm font-medium text-navy-600 mb-1";

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/research" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Research
      </Link>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900">Submit Research</h1>
            <p className="text-xs text-navy-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Research Quality Gate ensures academic rigor
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Research Title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g., Autonomous Swarm Intelligence for Maritime Operations" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Institution *</label>
              <input className={inputClass} value={form.institution} onChange={(e) => updateField("institution", e.target.value)} placeholder="e.g., TU Delft" />
            </div>
            <div>
              <label className={labelClass}>Principal Investigator *</label>
              <input className={inputClass} value={form.principal_investigator} onChange={(e) => updateField("principal_investigator", e.target.value)} placeholder="e.g., Prof. Dr. Jan van der Berg" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Research Field *</label>
            <input className={inputClass} value={form.field} onChange={(e) => updateField("field", e.target.value)} placeholder="e.g., Autonomous Systems, Cybersecurity, Materials Science" />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea className={inputClass + " h-32"} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe your research, methodology, and key findings (min 100 chars)" />
          </div>

          <div>
            <label className={labelClass}>Keywords * (comma-separated, min 3)</label>
            <input className={inputClass} value={form.keywords} onChange={(e) => updateField("keywords", e.target.value)} placeholder="e.g., swarm intelligence, autonomous vessels, multi-agent systems" />
          </div>

          <div>
            <label className={labelClass}>Publications (one per line)</label>
            <textarea className={inputClass + " h-20"} value={form.publications} onChange={(e) => updateField("publications", e.target.value)} placeholder="Title (Journal Year)&#10;Title (Journal Year)" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>TRL Level * (1-9)</label>
              <input type="number" min={1} max={9} className={inputClass} value={form.trl_level} onChange={(e) => updateField("trl_level", parseInt(e.target.value) || 1)} />
            </div>
            <div>
              <label className={labelClass}>Funding Status</label>
              <input className={inputClass} value={form.funding_status} onChange={(e) => updateField("funding_status", e.target.value)} placeholder="e.g., EU Horizon funded" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Collaboration Interests (comma-separated)</label>
            <input className={inputClass} value={form.collaboration_interest} onChange={(e) => updateField("collaboration_interest", e.target.value)} placeholder="e.g., industry testing, naval exercises, sensor integration" />
          </div>

          <div>
            <label className={labelClass}>Contact Email *</label>
            <input type="email" className={inputClass} value={form.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} placeholder="researcher@university.edu" />
          </div>

          <QualityGateDisplay result={qualityResult} />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 bg-navy-100 hover:bg-navy-200 text-navy-600 px-4 py-2.5 rounded-full text-sm font-medium transition-colors">
              <Shield className="w-4 h-4" /> Validate
            </button>
            <button type="submit" className="flex-1 bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2.5 rounded-full text-sm transition-all shadow-sm">
              Submit Research
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
