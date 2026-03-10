"use client";

import { useState } from "react";
import {
  User, Shield, Save, Check, Brain, Cpu, BookOpen, Database,
  ChevronDown, ChevronRight, Sparkles, MessageSquare, Target,
  Layers, ArrowRight, Info, Zap, Eye, Lock,
} from "lucide-react";
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

// --- AI Intelligence Data ---

const AI_AGENTS = [
  {
    id: "challenge-architect",
    name: "Challenge Architect",
    icon: Target,
    color: "bg-gold-500/10 text-gold-600",
    badgeColor: "bg-gold-100 text-gold-700",
    status: "active" as const,
    purpose: "Turns operational needs into structured innovation challenges",
    description:
      "Helps naval and defense officers translate real operational problems into structured, AI-matchable challenge specifications. It acts as an experienced capability analyst — probing for the root need, validating requirements, and ensuring challenges are specific enough to attract the right solutions.",
    howItWorks: [
      "Officer describes an operational problem in plain language",
      "Agent asks targeted follow-up questions (max 5 rounds)",
      "Extracts structured data: scenario, impact, constraints, requirements",
      "Validates completeness against the Challenge Quality Gate",
      "Outputs a formatted challenge ready for matchmaking",
    ],
    capabilities: [
      "Operational scenario analysis",
      "Requirements extraction & validation",
      "SNIF-aligned challenge structuring",
      "OPSEC-aware content filtering",
      "Challenge Quality Gate enforcement",
    ],
  },
  {
    id: "onboarding-agent",
    name: "Onboarding Agent",
    icon: User,
    color: "bg-accent-500/10 text-accent-600",
    badgeColor: "bg-accent-100 text-accent-700",
    status: "active" as const,
    purpose: "Guides companies through registration with AI-ready profiles",
    description:
      "Walks companies through providing all the information needed for effective AI matchmaking. Validates each field against defense data standards, asks clarifying questions when data is incomplete, and ensures the final profile is structured and standardized.",
    howItWorks: [
      "Company starts a chat or fills the registration form",
      "Agent asks about sector, capabilities, TRL, team, use cases",
      "Validates responses against defense data standards",
      "Identifies gaps and asks follow-up questions",
      "Produces a quality-scored, AI-ready company profile",
    ],
    capabilities: [
      "Company profile validation",
      "Defense data standards compliance",
      "Gap analysis & clarification",
      "AI-ready data structuring",
      "Profile Quality Gate enforcement",
    ],
  },
];

const AI_SKILLS = [
  {
    id: "challenge-standards",
    name: "Challenge Standards",
    icon: Shield,
    color: "bg-purple-50 text-purple-600",
    purpose: "Defines what a well-structured challenge looks like",
    description:
      "A structured data schema that defines the required fields for innovation challenges. Ensures every challenge has consistent, complete information that the AI matchmaking engine can process effectively.",
    fields: [
      { name: "Operational scenario & context", why: "Helps AI understand the problem domain" },
      { name: "Current workaround", why: "Shows what's lacking today" },
      { name: "Mission impact", why: "Prioritizes by operational value" },
      { name: "Environmental constraints", why: "Filters unsuitable solutions" },
      { name: "Functional & performance requirements", why: "Enables precise matching" },
      { name: "Priority & timeline", why: "Aligns with provider availability" },
      { name: "Desired TRL range", why: "Matches technology maturity" },
    ],
  },
  {
    id: "data-standards",
    name: "Company Data Standards",
    icon: Database,
    color: "bg-teal-50 text-teal-600",
    purpose: "Defines what a complete company profile looks like",
    description:
      "A standardized schema for company profiles that ensures all the data the AI needs for accurate matchmaking is captured. Covers everything from sector classification to specific capability taxonomies.",
    fields: [
      { name: "Company identification & sector", why: "Categorizes the company domain" },
      { name: "Capability & technology taxonomy", why: "Core matching criteria" },
      { name: "Technology Readiness Level (TRL 1-9)", why: "Maturity-based filtering" },
      { name: "Team size & composition", why: "Capacity assessment" },
      { name: "Defense/maritime experience", why: "Domain relevance scoring" },
      { name: "Certifications & clearances", why: "Compliance pre-screening" },
      { name: "Use cases & past work", why: "Evidence of delivery capability" },
    ],
  },
];

const AGENT_MEMORY = [
  {
    id: "challenge-mem",
    name: "Challenge Architect Memory",
    agent: "Challenge Architect",
    status: "initialized" as const,
    entries: 0,
    description: "Learns from each challenge creation session — stores common operational needs, recurring requirement patterns, and domain-specific knowledge to improve future conversations.",
  },
  {
    id: "onboarding-mem",
    name: "Onboarding Agent Memory",
    agent: "Onboarding Agent",
    status: "initialized" as const,
    entries: 0,
    description: "Learns from each company registration — stores frequent capability combinations, common profile patterns, and validation insights to streamline future onboarding.",
  },
];

function SectionHeader({ icon: Icon, title, subtitle }: { icon: typeof Brain; title: string; subtitle: string }) {
  return (
    <div className="mb-4 pb-3 border-b border-navy-200">
      <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2 uppercase tracking-wide">
        <Icon className="w-4 h-4 text-accent-500" /> {title}
      </h2>
      <p className="text-xs text-navy-500 mt-1">{subtitle}</p>
    </div>
  );
}

export default function ProfilePage() {
  const store = useStore();
  const [profile, setProfile] = useState(store.userProfile);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "intelligence">("profile");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

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
              : "Understand how the AI agents, skills, and memory work together"}
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

      {/* ═══════════════ PROFILE TAB ═══════════════ */}
      {activeTab === "profile" && (
        <>
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

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
              saved
                ? "bg-success-500 text-white"
                : "bg-accent-500 hover:bg-accent-600 text-white"
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </>
      )}

      {/* ═══════════════ INTELLIGENCE TAB ═══════════════ */}
      {activeTab === "intelligence" && (
        <div className="space-y-8">

          {/* How it works — visual overview */}
          <section>
            <SectionHeader
              icon={Sparkles}
              title="How the AI Works"
              subtitle="Three layers work together to power intelligent matchmaking"
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="card-surface p-4 text-center relative">
                <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-5 h-5 text-accent-600" />
                </div>
                <p className="text-xs font-bold text-navy-900 mb-1">Agents</p>
                <p className="text-[0.65rem] text-navy-500 leading-relaxed">
                  Conversational AI that guides users through complex tasks step by step
                </p>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <ArrowRight className="w-3 h-3 text-navy-300" />
                </div>
              </div>
              <div className="card-surface p-4 text-center relative">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs font-bold text-navy-900 mb-1">Skills</p>
                <p className="text-[0.65rem] text-navy-500 leading-relaxed">
                  Data standards that define what complete, matchable profiles look like
                </p>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <ArrowRight className="w-3 h-3 text-navy-300" />
                </div>
              </div>
              <div className="card-surface p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                  <Database className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-bold text-navy-900 mb-1">Memory</p>
                <p className="text-[0.65rem] text-navy-500 leading-relaxed">
                  Learned patterns that improve agent accuracy over time
                </p>
              </div>
            </div>
          </section>

          {/* Agents */}
          <section>
            <SectionHeader
              icon={Cpu}
              title="AI Agents"
              subtitle="Specialized conversational agents that guide users through key workflows"
            />
            <div className="space-y-4">
              {AI_AGENTS.map((agent) => {
                const Icon = agent.icon;
                const isExpanded = expandedAgent === agent.id;
                return (
                  <div key={agent.id} className="card-surface overflow-hidden">
                    <button
                      onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                      className="w-full p-5 text-left hover:bg-navy-50/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${agent.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-navy-900">{agent.name}</span>
                            <span className={`text-[0.6rem] px-2 py-0.5 rounded-full font-semibold ${agent.badgeColor}`}>
                              Agent
                            </span>
                            <span className="flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                            </span>
                          </div>
                          <p className="text-sm text-navy-700 font-medium mb-1">{agent.purpose}</p>
                          <p className="text-xs text-navy-500 leading-relaxed">{agent.description}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-navy-400 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-navy-100">
                        <div className="grid md:grid-cols-2 gap-5 pt-4">
                          {/* How it works */}
                          <div>
                            <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5" /> How It Works
                            </h4>
                            <ol className="space-y-2">
                              {agent.howItWorks.map((step, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-navy-600">
                                  <span className="w-5 h-5 rounded-full bg-accent-500/10 text-accent-600 flex items-center justify-center text-[0.6rem] font-bold shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                          {/* Capabilities */}
                          <div>
                            <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5" /> Capabilities
                            </h4>
                            <ul className="space-y-2">
                              {agent.capabilities.map((cap) => (
                                <li key={cap} className="flex items-start gap-2 text-xs text-navy-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0 mt-1.5" />
                                  {cap}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Skills */}
          <section>
            <SectionHeader
              icon={BookOpen}
              title="Data Skills & Standards"
              subtitle="Structured schemas that define what complete, quality data looks like for AI matching"
            />
            <div className="space-y-4">
              {AI_SKILLS.map((skill) => {
                const Icon = skill.icon;
                const isExpanded = expandedSkill === skill.id;
                return (
                  <div key={skill.id} className="card-surface overflow-hidden">
                    <button
                      onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                      className="w-full p-5 text-left hover:bg-navy-50/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${skill.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-navy-900">{skill.name}</span>
                            <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-navy-100 text-navy-600 font-semibold">
                              Standard
                            </span>
                          </div>
                          <p className="text-sm text-navy-700 font-medium mb-1">{skill.purpose}</p>
                          <p className="text-xs text-navy-500 leading-relaxed">{skill.description}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-navy-400 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-navy-100 pt-4">
                        <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-3">
                          Schema Fields & Why They Matter
                        </h4>
                        <div className="space-y-2">
                          {skill.fields.map((field) => (
                            <div key={field.name} className="flex items-start gap-3 py-2 border-b border-navy-50 last:border-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-navy-300 shrink-0 mt-1.5" />
                              <div className="flex-1">
                                <span className="text-xs font-medium text-navy-800">{field.name}</span>
                                <span className="text-xs text-navy-400 ml-2">— {field.why}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Memory */}
          <section>
            <SectionHeader
              icon={Database}
              title="Agent Memory"
              subtitle="Agents learn from each interaction to improve accuracy over time"
            />
            <div className="space-y-3">
              {AGENT_MEMORY.map((mem) => (
                <div key={mem.id} className="card-surface p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-navy-900">{mem.name}</span>
                        <span className={`text-[0.6rem] px-2 py-0.5 rounded-full font-semibold ${
                          mem.entries > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {mem.entries > 0 ? `${mem.entries} entries` : "Empty — learning"}
                        </span>
                      </div>
                      <p className="text-xs text-navy-500 leading-relaxed">{mem.description}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 p-4 rounded-lg bg-navy-50">
                <Info className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" />
                <p className="text-xs text-navy-500 leading-relaxed">
                  Memory builds automatically as agents interact with users.
                  Each completed challenge creation or company onboarding session adds patterns that help the agent
                  ask better questions and produce higher-quality outputs in future sessions.
                  Memory is stored locally and never shared externally.
                </p>
              </div>
            </div>
          </section>

          {/* Transparency & Security note */}
          <section>
            <div className="card-surface p-5 border-l-4 border-accent-500">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-900 mb-1">Transparency & Security</h3>
                  <p className="text-xs text-navy-600 leading-relaxed mb-3">
                    All AI components on this page are fully visible and auditable. There are no hidden models or black-box decisions.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-navy-500">
                      <Lock className="w-3 h-3" /> All content kept at UNCLASSIFIED level
                    </span>
                    <span className="flex items-center gap-1.5 text-navy-500">
                      <Eye className="w-3 h-3" /> Agent prompts are auditable
                    </span>
                    <span className="flex items-center gap-1.5 text-navy-500">
                      <Shield className="w-3 h-3" /> OPSEC filtering built-in
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
