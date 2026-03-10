"use client";

import { useState } from "react";
import { User, Shield, Save, Check, Brain, Cpu, BookOpen, Database, ChevronRight } from "lucide-react";
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

// AI component data - summaries of the .md files in the project
const AI_AGENTS = [
  {
    name: "Challenge Architect",
    type: "Agent",
    icon: Shield,
    status: "active",
    description:
      "Helps naval/defense officers transform operational needs into structured, AI-matchable challenge specifications. Uses operational analysis techniques to probe the root need, validate requirements, and ensure challenges are specific enough to attract relevant solutions while maintaining operational security.",
    capabilities: [
      "Operational scenario analysis",
      "Requirements extraction & validation",
      "Challenge structuring with SNIF alignment",
      "OPSEC-aware content filtering",
      "Quality Gate gatekeeper for challenges",
    ],
    source: ".claude/agents/challenge-architect.md",
  },
  {
    name: "Onboarding Agent",
    type: "Agent",
    icon: User,
    status: "active",
    description:
      "Guides companies through the Naval Innovation Hub onboarding process. Validates submitted profiles against defense data standards, asks clarifying questions to fill gaps, and ensures all company data is structured, standardized, and AI-ready for matchmaking.",
    capabilities: [
      "Company profile validation",
      "Defense data standards compliance",
      "Gap analysis & clarification",
      "AI-ready data structuring",
      "Quality Gate gatekeeper for profiles",
    ],
    source: ".claude/agents/onboarding-agent.md",
  },
];

const AI_SKILLS = [
  {
    name: "Challenge Standards",
    type: "Skill",
    icon: BookOpen,
    version: "v1.0",
    description:
      "Defines the structured data schema for innovation challenges. Ensures all challenges have consistent fields: operational context, current workaround, impact assessment, environmental constraints, user profiles, functional & performance requirements, priority/timeline, and desired TRL level.",
    fields: [
      "Operational scenario & context",
      "Current workaround description",
      "Mission impact assessment",
      "Environmental constraints",
      "Functional & performance requirements",
      "Priority level & timeline",
      "Desired TRL range",
    ],
    source: ".claude/skills/challenge-standards.md",
  },
  {
    name: "Data Standards",
    type: "Skill",
    icon: Database,
    version: "v1.0",
    description:
      "Defines the company profile data schema for the innovation platform. Standardizes company information including sector classification, capability taxonomy, TRL levels, team composition, defense experience, certifications, and use cases — all optimized for AI matchmaking.",
    fields: [
      "Company identification & sector",
      "Capability & technology taxonomy",
      "Technology Readiness Level (TRL 1-9)",
      "Team size & composition",
      "Defense/maritime experience",
      "Certifications & clearances",
      "Use cases & past work",
    ],
    source: ".claude/skills/data-standards.md",
  },
];

const AGENT_MEMORY = [
  {
    name: "Challenge Architect Memory",
    agent: "Challenge Architect",
    status: "initialized",
    entries: 0,
    description: "Stores learned patterns from challenge creation sessions — common operational needs, recurring requirement patterns, and domain-specific knowledge accumulated over interactions.",
    source: ".claude/agent-memory/challenge-architect/MEMORY.md",
  },
  {
    name: "Onboarding Agent Memory",
    agent: "Onboarding Agent",
    status: "initialized",
    entries: 0,
    description: "Stores learned patterns from company onboarding sessions — common company profiles, frequent capability combinations, and validation patterns accumulated over interactions.",
    source: ".claude/agent-memory/onboarding-agent/MEMORY.md",
  },
];

export default function ProfilePage() {
  const store = useStore();
  const [profile, setProfile] = useState(store.userProfile);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "intelligence">("profile");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg avatar-navy flex items-center justify-center">
          {activeTab === "profile" ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Brain className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-900">
            {activeTab === "profile" ? "Profile & Match Settings" : "AI Intelligence"}
          </h1>
          <p className="text-sm text-navy-500">
            {activeTab === "profile"
              ? "Configure your matchmaking preferences"
              : "AI agents, skills, and memory powering the platform"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-navy-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
            activeTab === "profile"
              ? "bg-white text-navy-900 shadow-sm"
              : "text-navy-500 hover:text-navy-700"
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("intelligence")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
            activeTab === "intelligence"
              ? "bg-white text-navy-900 shadow-sm"
              : "text-navy-500 hover:text-navy-700"
          }`}
        >
          <Brain className="w-4 h-4" />
          Intelligence
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <>
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
        </>
      )}

      {/* Intelligence Tab */}
      {activeTab === "intelligence" && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-accent-600">2</div>
              <div className="text-xs text-navy-500 font-medium">AI Agents</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-accent-600">2</div>
              <div className="text-xs text-navy-500 font-medium">Skills</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-accent-600">2</div>
              <div className="text-xs text-navy-500 font-medium">Memory Stores</div>
            </div>
          </div>

          {/* Agents section */}
          <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent-500" />
            AI Agents
          </h2>
          <div className="space-y-3 mb-6">
            {AI_AGENTS.map((agent) => {
              const Icon = agent.icon;
              const isExpanded = expandedCard === agent.name;
              return (
                <div key={agent.name} className="card overflow-hidden">
                  <button
                    onClick={() => toggleExpand(agent.name)}
                    className="w-full p-4 flex items-start gap-3 text-left hover:bg-navy-50/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-navy-900">{agent.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 font-semibold uppercase">
                          {agent.type}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-100 text-success-700 font-semibold">
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-navy-500 line-clamp-2">{agent.description}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-navy-400 flex-shrink-0 mt-1 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-navy-100">
                      <div className="pt-3">
                        <h4 className="text-xs font-bold text-navy-600 uppercase tracking-wide mb-2">Capabilities</h4>
                        <ul className="space-y-1.5">
                          {agent.capabilities.map((cap) => (
                            <li key={cap} className="flex items-start gap-2 text-xs text-navy-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0 mt-1" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t border-navy-100">
                          <span className="text-[10px] text-navy-400 font-mono">{agent.source}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Skills section */}
          <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-500" />
            Skills & Standards
          </h2>
          <div className="space-y-3 mb-6">
            {AI_SKILLS.map((skill) => {
              const Icon = skill.icon;
              const isExpanded = expandedCard === skill.name;
              return (
                <div key={skill.name} className="card overflow-hidden">
                  <button
                    onClick={() => toggleExpand(skill.name)}
                    className="w-full p-4 flex items-start gap-3 text-left hover:bg-navy-50/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-navy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-navy-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-navy-900">{skill.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-100 text-navy-600 font-semibold uppercase">
                          {skill.type}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-50 text-navy-500 font-mono">
                          {skill.version}
                        </span>
                      </div>
                      <p className="text-xs text-navy-500 line-clamp-2">{skill.description}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-navy-400 flex-shrink-0 mt-1 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-navy-100">
                      <div className="pt-3">
                        <h4 className="text-xs font-bold text-navy-600 uppercase tracking-wide mb-2">Schema Fields</h4>
                        <ul className="space-y-1.5">
                          {skill.fields.map((field) => (
                            <li key={field} className="flex items-start gap-2 text-xs text-navy-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-navy-300 flex-shrink-0 mt-1" />
                              {field}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t border-navy-100">
                          <span className="text-[10px] text-navy-400 font-mono">{skill.source}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Memory section */}
          <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-accent-500" />
            Agent Memory
          </h2>
          <div className="space-y-3 mb-6">
            {AGENT_MEMORY.map((mem) => (
              <div key={mem.name} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                    <Database className="w-4.5 h-4.5 text-warning-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-navy-900">{mem.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        mem.entries > 0
                          ? "bg-success-100 text-success-700"
                          : "bg-warning-100 text-warning-700"
                      }`}>
                        {mem.entries > 0 ? `${mem.entries} entries` : "empty"}
                      </span>
                    </div>
                    <p className="text-xs text-navy-500">{mem.description}</p>
                    <div className="mt-2">
                      <span className="text-[10px] text-navy-400 font-mono">{mem.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="card p-4 bg-accent-50 border-accent-200">
            <div className="flex gap-3">
              <Brain className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-accent-900 mb-1">How Intelligence Works</h3>
                <p className="text-xs text-accent-700 leading-relaxed">
                  AI agents use specialized prompts and skills to guide conversations. The Challenge Architect helps officers structure operational needs into matchable challenges, while the Onboarding Agent ensures company profiles meet defense data standards. Both agents build memory over time to improve their responses.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
