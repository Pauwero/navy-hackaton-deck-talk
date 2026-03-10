"use client";

import type { NavyChallenge, QualityGateResult, QualityIssue } from "@/types";

// --- Operational Domain Taxonomy ---

export const OPERATIONAL_DOMAINS = [
  { code: "SRF", label: "Surface Warfare", description: "Surface vessel operations, anti-surface warfare, naval gunfire" },
  { code: "SUB", label: "Submarine Operations", description: "Submarine warfare, underwater comms, stealth" },
  { code: "MCM", label: "Mine Countermeasures", description: "Mine detection, classification, neutralization, route survey" },
  { code: "AMP", label: "Amphibious Operations", description: "Ship-to-shore, beach landing, littoral operations" },
  { code: "MAS", label: "Maritime Security", description: "Port security, law enforcement, VBSS, anti-piracy" },
  { code: "LOG", label: "Naval Logistics", description: "Supply chain, replenishment at sea, fleet sustainment" },
  { code: "HYD", label: "Hydrography & Oceanography", description: "Charting, ocean survey, environmental monitoring" },
  { code: "C2", label: "Command & Control", description: "Tactical decision-making, COP, battle management" },
  { code: "ISR", label: "ISR", description: "SIGINT, IMINT, OSINT, persistent surveillance" },
  { code: "CYB", label: "Cyber Operations", description: "Network defense, offensive cyber, resilience" },
  { code: "TRN", label: "Training & Readiness", description: "Simulation, exercises, crew qualification" },
  { code: "MNT", label: "Maintenance & Sustainment", description: "Predictive maintenance, repair, fleet readiness" },
] as const;

export const GAP_TYPES = [
  { code: "OPERATIONAL", label: "Operational Gap", description: "Current operations cannot be performed effectively" },
  { code: "EFFICIENCY", label: "Efficiency Gap", description: "Operations work but are too slow, costly, or resource-intensive" },
  { code: "SAFETY", label: "Safety Concern", description: "Current methods pose risks to personnel or equipment" },
  { code: "EMERGING_THREAT", label: "Emerging Threat", description: "New threat requires new countermeasure capability" },
  { code: "INTEROPERABILITY", label: "Interoperability Gap", description: "Systems don't work together (allied, joint, or internal)" },
  { code: "OBSOLESCENCE", label: "Obsolescence", description: "Existing systems reaching end-of-life with no replacement" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "quick-win", label: "Quick Win (0-6 months)", trlRange: "TRL 7-9", description: "Need proven, deployable solutions" },
  { value: "short-term", label: "Short-Term (6-18 months)", trlRange: "TRL 5-7", description: "Demonstrated tech, needs naval integration" },
  { value: "medium-term", label: "Medium-Term (1-3 years)", trlRange: "TRL 3-6", description: "Proven concept, needs development" },
  { value: "long-term", label: "Long-Term (3+ years)", trlRange: "TRL 1-4", description: "Research and early development" },
] as const;

export const BUDGET_RANGES = [
  "<100K",
  "100K-500K",
  "500K-1M",
  "1M-5M",
  ">5M",
] as const;

export const PRIORITY_OPTIONS = [
  { value: "critical" as const, label: "Critical", description: "Directly impacts safety of life or mission success", color: "danger" },
  { value: "high" as const, label: "High", description: "Significant operational capability gap affecting readiness", color: "warning" },
  { value: "medium" as const, label: "Medium", description: "Meaningful improvement to operational effectiveness", color: "accent" },
  { value: "low" as const, label: "Low", description: "Enhancement or efficiency improvement", color: "navy" },
] as const;

export const REQUIREMENT_TEMPLATES = {
  functional: [
    "The solution shall detect [object type] at a range of [X] meters/km",
    "The solution shall process [data type] and provide [output] within [time]",
    "The solution shall autonomously navigate in [environment] for [duration]",
    "The solution shall identify and classify [targets] with [accuracy]% accuracy",
    "The solution shall communicate with [system] via [protocol/standard]",
  ],
  performance: [
    "The solution shall achieve [metric] of [value] under [conditions]",
    "Detection probability shall exceed [X]% in sea state [Y] or below",
    "Response time shall not exceed [X] seconds/minutes from [trigger]",
    "The solution shall maintain [availability]% operational availability",
    "Mean time between failures shall exceed [X] hours of operation",
  ],
  environmental: [
    "The solution shall operate in sea states [0-X] and temperatures [range]°C",
    "The solution shall withstand salt spray, humidity, and vibration per [standard]",
    "The solution shall operate in GPS-denied environments",
    "The solution shall function with intermittent/degraded communications",
    "The solution shall be deployable from [vessel class/type]",
  ],
  integration: [
    "The solution shall interface with NATO STANAG [number] compliant systems",
    "The solution shall provide data output compatible with [system/format]",
    "The solution shall integrate with existing [platform] combat management system",
    "The solution shall support remote monitoring via [network/protocol]",
  ],
  operational: [
    "The solution shall be deployable by [X]-person team within [Y] minutes",
    "Training for operators shall not exceed [X] days",
    "The solution shall require no specialized maintenance tools",
    "The solution shall be transportable by [vehicle/aircraft type]",
  ],
};

export const CHALLENGE_TAGS = [
  "autonomous systems", "AI/ML", "sensor systems", "cybersecurity",
  "underwater", "surface", "subsurface", "airborne",
  "communications", "navigation", "detection", "classification",
  "maintenance", "logistics", "simulation", "training",
  "situational awareness", "decision support", "data fusion",
  "mine warfare", "anti-submarine", "force protection",
  "interoperability", "sustainability", "resilience",
  "rapid deployment", "modular design", "dual-use",
];

// --- Challenge Profile ---

export interface ChallengeProfile {
  title: string;
  domain: string;
  gap_type: string;
  description: string;
  operational_context: string;
  requirements: string[];
  desired_trl: number;
  timeline: string;
  priority: "critical" | "high" | "medium" | "low";
  priority_justification: string;
  classification: "unclassified" | "restricted";
  tags: string[];
  current_workaround: string;
  impact_description: string;
  affected_platforms: string[];
  user_profile: string;
  environment_conditions: string;
  budget_indication: string;
  success_criteria: string[];
  constraints: string[];
  stakeholder_unit: string;
}

export function createEmptyChallengeProfile(): ChallengeProfile {
  return {
    title: "",
    domain: "",
    gap_type: "",
    description: "",
    operational_context: "",
    requirements: [],
    desired_trl: 5,
    timeline: "short-term",
    priority: "medium",
    priority_justification: "",
    classification: "unclassified",
    tags: [],
    current_workaround: "",
    impact_description: "",
    affected_platforms: [],
    user_profile: "",
    environment_conditions: "",
    budget_indication: "",
    success_criteria: [],
    constraints: [],
    stakeholder_unit: "",
  };
}

// --- Validation ---

export function validateChallengeProfile(data: Partial<ChallengeProfile>): QualityGateResult {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];

  // Critical fields
  if (!data.title?.trim() || (data.title?.length || 0) < 10) {
    issues.push({ field: "title", severity: "error", message: "Challenge title must be at least 10 characters and clearly describe the capability need" });
  }
  if (!data.domain?.trim()) {
    issues.push({ field: "domain", severity: "error", message: "Operational domain must be selected" });
  }
  if (!data.gap_type?.trim()) {
    issues.push({ field: "gap_type", severity: "error", message: "Capability gap type must be specified" });
  }
  if (!data.description || data.description.length < 100) {
    issues.push({
      field: "description",
      severity: "error",
      message: `Description must be at least 100 characters (currently ${data.description?.length || 0}). Describe the PROBLEM, not the solution.`,
    });
  }
  if (!data.operational_context || data.operational_context.length < 50) {
    issues.push({
      field: "operational_context",
      severity: "error",
      message: `Operational context must be at least 50 characters (currently ${data.operational_context?.length || 0}). Describe a real scenario where this gap occurs.`,
    });
  }
  if (!data.requirements || data.requirements.length < 3) {
    issues.push({ field: "requirements", severity: "error", message: "At least 3 requirements are needed (functional, performance, environmental)" });
  }
  if (!data.desired_trl || data.desired_trl < 1 || data.desired_trl > 9) {
    issues.push({ field: "desired_trl", severity: "error", message: "Desired TRL must be between 1 and 9" });
  }
  if (!data.timeline?.trim()) {
    issues.push({ field: "timeline", severity: "error", message: "Timeline must be selected" });
  }
  if (!data.priority) {
    issues.push({ field: "priority", severity: "error", message: "Priority level must be set" });
  }
  if (!data.priority_justification || data.priority_justification.length < 30) {
    issues.push({ field: "priority_justification", severity: "error", message: "Priority justification must explain why this priority level (min 30 chars)" });
  }
  if (!data.tags || data.tags.length < 2) {
    issues.push({ field: "tags", severity: "error", message: "At least 2 tags are required for discoverability" });
  }

  // TRL-Timeline alignment
  if (data.desired_trl && data.timeline) {
    if (data.timeline === "quick-win" && data.desired_trl < 7) {
      issues.push({
        field: "desired_trl",
        severity: "warning",
        message: `Quick-win timeline expects TRL 7-9, but you selected TRL ${data.desired_trl}. Research-phase technology cannot be deployed in 6 months.`,
      });
    }
    if (data.timeline === "long-term" && data.desired_trl >= 8) {
      issues.push({
        field: "desired_trl",
        severity: "warning",
        message: "If proven technology (TRL 8-9) exists, consider a shorter timeline.",
      });
    }
    if (data.priority === "critical" && data.desired_trl <= 3) {
      issues.push({
        field: "priority",
        severity: "warning",
        message: "Critical needs typically require higher TRL solutions that can be deployed quickly.",
      });
    }
  }

  // Content quality checks
  if (data.description) {
    const desc = data.description.toLowerCase();
    // Check if description prescribes a solution instead of describing the problem
    const solutionWords = ["we need a", "build us", "develop a", "create a system that", "we want a"];
    if (solutionWords.some((w) => desc.includes(w))) {
      issues.push({
        field: "description",
        severity: "warning",
        message: "Description appears to prescribe a solution rather than describe the capability gap. Focus on the PROBLEM, not the solution.",
      });
    }
  }

  // Check for potentially classified content
  if (data.description || data.operational_context) {
    const combined = `${data.description || ""} ${data.operational_context || ""}`.toLowerCase();
    const classifiedIndicators = ["secret", "top secret", "classified", "TS/SCI", "NOFORN", "specific frequencies", "exact coordinates"];
    if (classifiedIndicators.some((w) => combined.includes(w))) {
      issues.push({
        field: "classification",
        severity: "error",
        message: "Content may contain classified indicators. This platform operates at UNCLASSIFIED level only. Please sanitize.",
      });
    }
  }

  // Quality fields
  if (!data.current_workaround?.trim()) {
    issues.push({ field: "current_workaround", severity: "warning", message: "Describing the current workaround helps solutions providers understand the baseline" });
  }
  if (!data.impact_description?.trim()) {
    issues.push({ field: "impact_description", severity: "warning", message: "Describing operational impact strengthens the case for innovation" });
  }
  if (!data.affected_platforms || data.affected_platforms.length === 0) {
    suggestions.push("Listing affected platforms/unit types helps match with relevant solutions");
  }
  if (!data.success_criteria || data.success_criteria.length === 0) {
    suggestions.push("Defining success criteria helps solution providers understand what 'good enough' looks like");
  }
  if (!data.user_profile?.trim()) {
    suggestions.push("Describing end users helps match solutions to the right operator skill level");
  }

  // Requirement quality check
  if (data.requirements && data.requirements.length >= 3) {
    const vagueTerms = ["easy", "fast", "reliable", "intuitive", "robust", "flexible", "scalable"];
    const vagueReqs = data.requirements.filter((r) =>
      vagueTerms.some((t) => r.toLowerCase().includes(t)) && !r.match(/\d/)
    );
    if (vagueReqs.length > 0) {
      issues.push({
        field: "requirements",
        severity: "warning",
        message: `${vagueReqs.length} requirement(s) use subjective terms without measurable thresholds. Add specific metrics.`,
      });
    }
  }

  // Scoring
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const criticalTotal = 11;
  const criticalPassed = criticalTotal - errorCount;

  const criticalScore = criticalPassed / criticalTotal;
  const reqQuality = data.requirements && data.requirements.length >= 3
    ? Math.min(1, data.requirements.filter((r) => r.length > 20).length / data.requirements.length)
    : 0;
  const contextQuality = data.operational_context
    ? Math.min(1, data.operational_context.length / 200)
    : 0;
  const consistencyScore = errorCount === 0 && warningCount <= 1 ? 1.0 : warningCount <= 3 ? 0.7 : 0.4;

  const score = Math.round(
    (criticalScore * 0.45 + reqQuality * 0.25 + contextQuality * 0.20 + consistencyScore * 0.10) * 100
  );

  return {
    passed: errorCount === 0,
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
  };
}

// --- Agent Question Generator ---

export interface ChallengeQuestion {
  id: string;
  field: string;
  question: string;
  type: "text" | "select" | "multi-select" | "textarea";
  options?: string[];
  required: boolean;
  answered: boolean;
}

export function generateChallengeQuestions(profile: Partial<ChallengeProfile>): ChallengeQuestion[] {
  const questions: ChallengeQuestion[] = [];
  let idx = 0;

  if (!profile.domain?.trim()) {
    questions.push({
      id: `cq-${idx++}`,
      field: "domain",
      question: "What operational domain does this challenge fall under? Where does this problem occur?",
      type: "select",
      options: OPERATIONAL_DOMAINS.map((d) => `${d.code} — ${d.label}`),
      required: true,
      answered: false,
    });
  }

  if (!profile.gap_type?.trim()) {
    questions.push({
      id: `cq-${idx++}`,
      field: "gap_type",
      question: "What type of capability gap is this? Understanding the nature of the gap helps us match better solutions.",
      type: "select",
      options: GAP_TYPES.map((g) => `${g.code} — ${g.label}: ${g.description}`),
      required: true,
      answered: false,
    });
  }

  if (!profile.operational_context || profile.operational_context.length < 50) {
    questions.push({
      id: `cq-${idx++}`,
      field: "operational_context",
      question: "Can you describe a specific operational scenario where this problem occurs? Walk me through what happens — e.g., 'During a routine patrol, our crew needs to...' This context is critical for matching you with the right solutions.",
      type: "textarea",
      required: true,
      answered: false,
    });
  }

  if (!profile.current_workaround?.trim()) {
    questions.push({
      id: `cq-${idx++}`,
      field: "current_workaround",
      question: "How does your team currently handle this problem? What's the manual process or existing workaround? Understanding the baseline helps solutions providers know what they need to beat.",
      type: "textarea",
      required: false,
      answered: false,
    });
  }

  if (!profile.requirements || profile.requirements.length < 3) {
    questions.push({
      id: `cq-${idx++}`,
      field: "requirements",
      question: "What are the key requirements for a solution? Think about:\n- **Functional**: What must it DO? (e.g., 'detect objects at 500m range')\n- **Performance**: How WELL? (e.g., '>90% detection rate')\n- **Environmental**: What CONDITIONS? (e.g., 'sea state 0-4, -10 to 45°C')\n\nList at least 3 requirements, separated by new lines.",
      type: "textarea",
      required: true,
      answered: false,
    });
  }

  if (!profile.priority_justification || profile.priority_justification.length < 30) {
    questions.push({
      id: `cq-${idx++}`,
      field: "priority_justification",
      question: `You've set the priority to **${profile.priority || "medium"}**. Can you explain why? What's the operational impact if this isn't solved? (e.g., mission delays, safety risk, readiness impact)`,
      type: "textarea",
      required: true,
      answered: false,
    });
  }

  if (!profile.impact_description?.trim()) {
    questions.push({
      id: `cq-${idx++}`,
      field: "impact_description",
      question: "What are the consequences when this capability gap affects operations? Think about: mission success, time delays, resource waste, safety risks, or strategic disadvantage.",
      type: "textarea",
      required: false,
      answered: false,
    });
  }

  if (!profile.affected_platforms || profile.affected_platforms.length === 0) {
    questions.push({
      id: `cq-${idx++}`,
      field: "affected_platforms",
      question: "Which platforms or unit types are affected? (e.g., frigates, patrol vessels, mine hunters, shore installations). Comma-separated.",
      type: "text",
      required: false,
      answered: false,
    });
  }

  if (!profile.tags || profile.tags.length < 2) {
    questions.push({
      id: `cq-${idx++}`,
      field: "tags",
      question: "Select tags that describe this challenge for better discoverability.",
      type: "multi-select",
      options: CHALLENGE_TAGS,
      required: true,
      answered: false,
    });
  }

  return questions;
}

// --- Document Parser ---

export function extractChallengeFromText(text: string): Partial<ChallengeProfile> {
  const profile: Partial<ChallengeProfile> = {};
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const textLower = text.toLowerCase();

  // Extract title (first short line)
  if (lines.length > 0) {
    const first = lines[0].replace(/^#+\s*/, "").trim();
    if (first.length < 150 && first.length >= 5) {
      profile.title = first;
    }
  }

  // Use remaining text as description basis
  const descLines = lines.slice(1).join(" ");
  if (descLines.length >= 50) {
    profile.description = descLines.substring(0, 2000);
  }

  // Detect operational domain
  const domainKeywords: Record<string, string[]> = {
    SRF: ["surface warfare", "frigate", "destroyer", "patrol vessel", "naval gunfire"],
    SUB: ["submarine", "subsurface", "underwater communication", "torpedo"],
    MCM: ["mine countermeasure", "mine detection", "mine hunt", "mine clearance", "harbor clearance"],
    AMP: ["amphibious", "beach landing", "littoral", "ship-to-shore"],
    MAS: ["port security", "maritime security", "VBSS", "boarding", "piracy", "smuggling"],
    LOG: ["logistics", "supply chain", "replenishment", "spare parts", "sustainment"],
    HYD: ["hydrograph", "oceanograph", "depth survey", "charting", "environmental monitoring"],
    C2: ["command and control", "tactical picture", "decision support", "battle management", "COP"],
    ISR: ["intelligence", "surveillance", "reconnaissance", "SIGINT", "IMINT", "OSINT", "early warning"],
    CYB: ["cyber", "network defense", "cyber attack", "cyber resilience", "intrusion"],
    TRN: ["training", "simulation", "exercise", "crew qualification", "simulator"],
    MNT: ["maintenance", "predictive maintenance", "repair", "condition monitoring", "fleet readiness"],
  };
  for (const [code, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((kw) => textLower.includes(kw))) {
      profile.domain = code;
      break;
    }
  }

  // Detect gap type
  if (textLower.includes("safety") || textLower.includes("risk to personnel")) {
    profile.gap_type = "SAFETY";
  } else if (textLower.includes("obsolescence") || textLower.includes("end-of-life") || textLower.includes("legacy")) {
    profile.gap_type = "OBSOLESCENCE";
  } else if (textLower.includes("threat") || textLower.includes("countermeasure")) {
    profile.gap_type = "EMERGING_THREAT";
  } else if (textLower.includes("interoperab") || textLower.includes("don't work together")) {
    profile.gap_type = "INTEROPERABILITY";
  } else if (textLower.includes("too slow") || textLower.includes("too long") || textLower.includes("inefficient") || textLower.includes("time-consuming")) {
    profile.gap_type = "EFFICIENCY";
  } else if (textLower.includes("cannot") || textLower.includes("unable to") || textLower.includes("no capability")) {
    profile.gap_type = "OPERATIONAL";
  }

  // Detect priority
  if (textLower.includes("critical") || textLower.includes("urgent") || textLower.includes("safety of life")) {
    profile.priority = "critical";
  } else if (textLower.includes("high priority") || textLower.includes("significant gap")) {
    profile.priority = "high";
  }

  // Detect TRL
  const trlMatch = text.match(/TRL\s*(\d)/i);
  if (trlMatch) profile.desired_trl = parseInt(trlMatch[1]);

  // Detect tags
  const matchedTags = CHALLENGE_TAGS.filter((t) => textLower.includes(t));
  if (matchedTags.length > 0) profile.tags = matchedTags;

  // Detect platform mentions
  const platformKeywords = [
    "frigate", "destroyer", "corvette", "patrol vessel", "mine hunter", "mine sweeper",
    "submarine", "amphibious", "auxiliary", "landing craft", "shore installation",
    "helicopter", "UAV", "UUV", "USV", "coastal station",
  ];
  const platforms = platformKeywords.filter((p) => textLower.includes(p));
  if (platforms.length > 0) profile.affected_platforms = platforms;

  return profile;
}

// --- Agent Response Generators ---

export function generateChallengeGreeting(): string {
  return `Welcome, I'm the Challenge Architect Agent. I help naval officers translate operational needs into structured innovation challenges.

Whether you have a clear capability gap, a vague frustration, or a document describing the need — I'll help you structure it into a challenge specification that our AI can match with the best solutions.

Let's start building your challenge.`;
}

export function generateChallengeValidationSummary(result: QualityGateResult): string {
  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter((i) => i.severity === "warning");

  if (result.passed && result.score >= 85) {
    return `Your challenge scores **${result.score}/100** — well-structured and ready for matching. ${
      warnings.length > 0 ? `${warnings.length} minor suggestion(s) could improve match quality further.` : "Fully optimized for AI matching."
    }`;
  }

  if (result.passed) {
    return `Challenge scores **${result.score}/100**. All critical fields are present. ${
      warnings.length > 0 ? `${warnings.length} improvement(s) recommended for better matching.` : ""
    }`;
  }

  return `Challenge needs work (score: **${result.score}/100**). ${
    errors.length > 0 ? `**${errors.length} critical issue(s)** must be resolved. ` : ""
  }${warnings.length > 0 ? `Plus ${warnings.length} suggestion(s). ` : ""}Let me help you address these.`;
}

export function generateDocumentExtractionSummary(profile: Partial<ChallengeProfile>): string {
  const extracted: string[] = [];
  if (profile.title) extracted.push(`Title: **${profile.title}**`);
  if (profile.domain) {
    const d = OPERATIONAL_DOMAINS.find((dd) => dd.code === profile.domain);
    extracted.push(`Domain: ${d?.label || profile.domain}`);
  }
  if (profile.gap_type) {
    const g = GAP_TYPES.find((gg) => gg.code === profile.gap_type);
    extracted.push(`Gap type: ${g?.label || profile.gap_type}`);
  }
  if (profile.priority) extracted.push(`Priority: ${profile.priority}`);
  if (profile.desired_trl) extracted.push(`Desired TRL: ${profile.desired_trl}`);
  if (profile.tags?.length) extracted.push(`Tags: ${profile.tags.join(", ")}`);
  if (profile.affected_platforms?.length) extracted.push(`Platforms: ${profile.affected_platforms.join(", ")}`);

  if (extracted.length === 0) {
    return "I couldn't extract structured information from your input. Could you describe the operational need in more detail, or try the structured form instead?";
  }

  return `I've analyzed your input and extracted:\n\n${extracted.map((e) => `- ${e}`).join("\n")}\n\nLet me validate this against our challenge standards and ask some follow-up questions to fill gaps.`;
}

// --- Convert ChallengeProfile to NavyChallenge ---

export function challengeToNavyChallenge(data: ChallengeProfile): Omit<NavyChallenge, "id" | "quality_score" | "created_at" | "updated_at"> {
  const domainLabel = OPERATIONAL_DOMAINS.find((d) => d.code === data.domain)?.label || data.domain;
  return {
    title: data.title,
    classification: data.classification,
    domain: domainLabel,
    description: data.description,
    operational_context: data.operational_context,
    requirements: data.requirements,
    desired_trl: data.desired_trl,
    timeline: data.timeline,
    priority: data.priority,
    status: "open",
    tags: data.tags,
  };
}
