"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { validateCompanyProfile } from "@/lib/quality-gate";
import QualityGateDisplay from "@/components/QualityGateDisplay";
import type { CompanyProfile, QualityGateResult } from "@/types";

export default function NewCompanyPage() {
  const router = useRouter();
  const store = useStore();
  const [qualityResult, setQualityResult] = useState<QualityGateResult | null>(null);

  const [form, setForm] = useState({
    name: "",
    sector: "",
    description: "",
    capabilities: "",
    technologies: "",
    trl_level: 5,
    team_size: "11-50",
    website: "",
    contact_email: "",
    use_cases: "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildProfile = (): Partial<CompanyProfile> => ({
    name: form.name,
    sector: form.sector,
    description: form.description,
    capabilities: form.capabilities.split(",").map((s) => s.trim()).filter(Boolean),
    technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
    trl_level: form.trl_level,
    team_size: form.team_size,
    website: form.website || undefined,
    contact_email: form.contact_email,
    use_cases: form.use_cases.split(",").map((s) => s.trim()).filter(Boolean),
  });

  const handleValidate = () => {
    const result = validateCompanyProfile(buildProfile());
    setQualityResult(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCompanyProfile(buildProfile());
    setQualityResult(result);

    if (!result.passed) return;

    const profile: CompanyProfile = {
      id: "comp-" + Math.random().toString(36).substring(2, 8),
      ...buildProfile(),
      name: form.name,
      sector: form.sector,
      description: form.description,
      capabilities: form.capabilities.split(",").map((s) => s.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
      trl_level: form.trl_level,
      team_size: form.team_size,
      contact_email: form.contact_email,
      use_cases: form.use_cases.split(",").map((s) => s.trim()).filter(Boolean),
      quality_score: result.score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.addCompany(profile);
    router.push("/companies");
  };

  const inputClass = "w-full bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-navy-100 placeholder-navy-500 focus:outline-none focus:border-accent-500 transition-colors";
  const labelClass = "block text-sm font-medium text-navy-300 mb-1";

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/companies" className="flex items-center gap-1 text-navy-400 hover:text-navy-200 text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Register Company</h1>
            <p className="text-xs text-navy-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Quality Gate Agent ensures AI-ready profiles
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Company Name *</label>
            <input className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g., Maritime Robotics BV" />
          </div>

          <div>
            <label className={labelClass}>Sector / Industry *</label>
            <input className={inputClass} value={form.sector} onChange={(e) => updateField("sector", e.target.value)} placeholder="e.g., Autonomous Systems, Cybersecurity, Data Analytics" />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea className={inputClass + " h-28"} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe your company, solutions, and value proposition (min 50 chars)" />
          </div>

          <div>
            <label className={labelClass}>Capabilities * (comma-separated)</label>
            <input className={inputClass} value={form.capabilities} onChange={(e) => updateField("capabilities", e.target.value)} placeholder="e.g., autonomous navigation, sensor integration, data processing" />
          </div>

          <div>
            <label className={labelClass}>Technologies * (comma-separated)</label>
            <input className={inputClass} value={form.technologies} onChange={(e) => updateField("technologies", e.target.value)} placeholder="e.g., ROS2, machine learning, edge computing" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>TRL Level * (1-9)</label>
              <input type="number" min={1} max={9} className={inputClass} value={form.trl_level} onChange={(e) => updateField("trl_level", parseInt(e.target.value) || 1)} />
            </div>
            <div>
              <label className={labelClass}>Team Size</label>
              <select className={inputClass} value={form.team_size} onChange={(e) => updateField("team_size", e.target.value)}>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="500+">500+</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Contact Email *</label>
            <input type="email" className={inputClass} value={form.contact_email} onChange={(e) => updateField("contact_email", e.target.value)} placeholder="info@company.com" />
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <input className={inputClass} value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://..." />
          </div>

          <div>
            <label className={labelClass}>Use Cases (comma-separated)</label>
            <input className={inputClass} value={form.use_cases} onChange={(e) => updateField("use_cases", e.target.value)} placeholder="e.g., Mine detection, Port security, Infrastructure inspection" />
          </div>

          <QualityGateDisplay result={qualityResult} />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 bg-navy-700 hover:bg-navy-600 text-navy-200 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Shield className="w-4 h-4" /> Validate
            </button>
            <button
              type="submit"
              className="flex-1 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              Submit Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
