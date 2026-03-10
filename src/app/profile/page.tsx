"use client";

import { useState } from "react";
import { User, Shield, Save, Check } from "lucide-react";
import { useStore } from "@/lib/store";

const AVAILABLE_INTERESTS = [
  "autonomous systems", "mine countermeasures", "cybersecurity", "underwater robotics",
  "maritime surveillance", "data analytics", "energy systems", "propulsion",
  "communications", "sensor technology", "AI/ML", "satellite systems",
  "anti-fouling", "drone systems", "quantum computing", "logistics",
];

const AVAILABLE_DOMAINS = [
  "Mine Warfare", "Cyber Defense", "Surface Warfare", "Submarine Operations",
  "Autonomous Systems", "Maritime Security", "Logistics & Sustainment",
  "Command & Control", "ISR", "Training & Readiness",
];

const ROLES = [
  { value: "naval_officer", label: "Naval Officer" },
  { value: "procurement", label: "Procurement" },
  { value: "innovation_manager", label: "Innovation Manager" },
  { value: "researcher", label: "Researcher" },
  { value: "company_rep", label: "Company Representative" },
];

export default function ProfilePage() {
  const store = useStore();
  const [profile, setProfile] = useState(store.userProfile);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (interest: string) => {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  };

  const toggleDomain = (domain: string) => {
    setProfile((p) => ({
      ...p,
      preferred_domains: p.preferred_domains.includes(domain)
        ? p.preferred_domains.filter((d) => d !== domain)
        : [...p.preferred_domains, domain],
    }));
  };

  const toggleEntityType = (type: "company" | "research" | "challenge") => {
    setProfile((p) => ({
      ...p,
      match_entity_types: p.match_entity_types.includes(type)
        ? p.match_entity_types.filter((t) => t !== type)
        : [...p.match_entity_types, type],
    }));
  };

  const handleSave = () => {
    store.updateUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg avatar-navy flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-900">Profile & Match Settings</h1>
          <p className="text-sm text-navy-500">Configure your matchmaking preferences</p>
        </div>
      </div>

      {/* Basic info */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:outline-none focus:border-accent-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-1">Organization</label>
            <input
              type="text"
              value={profile.organization}
              onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
              className="w-full bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:outline-none focus:border-accent-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-navy-600 mb-1">Role</label>
            <select
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value as typeof profile.role })}
              className="w-full bg-white border border-navy-200 rounded-lg px-3 py-2 text-sm text-navy-800 focus:outline-none focus:border-accent-500"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-2">Technology Interests</h2>
        <p className="text-xs text-navy-500 mb-3">Select topics to improve match relevance</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                profile.interests.includes(interest)
                  ? "bg-accent-500 text-white"
                  : "bg-navy-50 text-navy-600 hover:bg-navy-100"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred domains */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-2">Preferred Domains</h2>
        <p className="text-xs text-navy-500 mb-3">Focus matching on specific operational domains</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                profile.preferred_domains.includes(domain)
                  ? "bg-accent-500 text-white"
                  : "bg-navy-50 text-navy-600 hover:bg-navy-100"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Match preferences */}
      <div className="card p-5 mb-4">
        <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-4">Match Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-2">Show matches for</label>
            <div className="flex gap-2">
              {(["company", "research", "challenge"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => toggleEntityType(type)}
                  className={`text-xs px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    profile.match_entity_types.includes(type)
                      ? "bg-accent-500 text-white"
                      : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                  }`}
                >
                  {type === "company" ? "Companies" : type === "research" ? "Research" : "Challenges"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-2">
              TRL Range: {profile.preferred_trl_range[0]} - {profile.preferred_trl_range[1]}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={9}
                value={profile.preferred_trl_range[0]}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    preferred_trl_range: [parseInt(e.target.value), profile.preferred_trl_range[1]],
                  })
                }
                className="flex-1 accent-accent-500"
              />
              <input
                type="range"
                min={1}
                max={9}
                value={profile.preferred_trl_range[1]}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    preferred_trl_range: [profile.preferred_trl_range[0], parseInt(e.target.value)],
                  })
                }
                className="flex-1 accent-accent-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
          saved
            ? "bg-success-500 text-white"
            : "bg-accent-500 hover:bg-accent-600 text-white"
        }`}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" /> Saved
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Save Profile
          </>
        )}
      </button>
    </div>
  );
}
