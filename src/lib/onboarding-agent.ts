"use client";

import type { CompanyProfile, QualityGateResult, QualityIssue } from "@/types";

// --- Defense Data Standards ---

export const DEFENSE_DOMAINS = [
  { code: "MAR", label: "Maritime Systems", description: "Surface vessels, submarines, underwater systems, port infrastructure" },
  { code: "CYB", label: "Cyber & IT", description: "Cybersecurity, network defense, secure communications" },
  { code: "AUT", label: "Autonomous Systems", description: "UAS, USV, UUV, autonomous navigation, swarm systems, robotics" },
  { code: "SEW", label: "Sensing & EW", description: "Sensors, radar, sonar, electronic warfare, signal processing" },
  { code: "WPN", label: "Weapons & Protection", description: "Weapons systems, armor, CBRN protection, countermeasures" },
  { code: "LOG", label: "Logistics & Sustainment", description: "Supply chain, predictive maintenance, fleet readiness" },
  { code: "C4I", label: "C4ISR", description: "Command, control, comms, computers, intelligence, surveillance, recon" },
  { code: "SPC", label: "Space & Satellite", description: "Satellite communications, space situational awareness, PNT" },
  { code: "ENR", label: "Energy & Propulsion", description: "Alternative energy, propulsion systems, power management" },
  { code: "HFI", label: "Human Factors & Training", description: "Training systems, simulation, human-machine interface" },
] as const;

export const CAPABILITY_CATEGORIES = {
  technical: [
    "Autonomous Navigation & Control",
    "Sensor Integration & Fusion",
    "Data Analytics & AI/ML",
    "Cybersecurity & Network Defense",
    "Signal Processing & Communications",
    "Robotics & Mechatronics",
    "Software Development & Integration",
    "Systems Engineering",
    "Simulation & Modeling",
    "Edge Computing & IoT",
  ],
  operational: [
    "Maritime Domain Awareness",
    "Underwater Operations",
    "Mine Countermeasures",
    "Port & Harbor Security",
    "Anti-Submarine Warfare",
    "Surface Warfare Systems",
    "Logistics Optimization",
    "Predictive Maintenance",
    "Training & Simulation",
    "Intelligence Analysis",
  ],
  crossCutting: [
    "Rapid Prototyping",
    "Technology Transfer",
    "Dual-Use Technology Development",
    "International Collaboration",
    "Certification & Compliance",
    "Program Management",
    "Test & Evaluation",
    "Integration & Interoperability",
  ],
};

export const ALL_CAPABILITIES = [
  ...CAPABILITY_CATEGORIES.technical,
  ...CAPABILITY_CATEGORIES.operational,
  ...CAPABILITY_CATEGORIES.crossCutting,
];

export const CERTIFICATIONS = [
  "ISO 27001 (Information Security)",
  "ISO 9001 (Quality Management)",
  "ISO 14001 (Environmental)",
  "AQAP-2110 (NATO Quality Assurance)",
  "AQAP-2210 (NATO Software Quality)",
  "CMMI Level 3+",
  "SOC 2 Type II",
  "Cyber Essentials",
  "Common Criteria (CC)",
  "TEMPEST Certified",
];

export const PARTNERSHIP_TYPES = [
  "Joint Development",
  "Technology Licensing",
  "Subcontracting",
  "Research Collaboration",
  "System Integration",
  "Testing & Evaluation",
  "Training & Support",
  "Investment / Funding",
];

export const CLEARANCE_LEVELS = [
  "Unclassified",
  "Restricted",
  "Confidential",
  "Secret",
  "Not Applicable",
] as const;

export const TRL_DESCRIPTIONS = [
  { level: 1, title: "Basic Principles", description: "Fundamental research published, no defense application identified" },
  { level: 2, title: "Technology Concept", description: "Defense application conceptualized, feasibility assessed" },
  { level: 3, title: "Proof of Concept", description: "Laboratory demonstration of key defense-relevant functions" },
  { level: 4, title: "Lab Validation", description: "Component tested in lab with defense-representative conditions" },
  { level: 5, title: "Relevant Environment", description: "Component tested in simulated defense environment" },
  { level: 6, title: "Demo in Relevant Env", description: "System prototype demonstrated in defense-relevant environment" },
  { level: 7, title: "Demo in Operational Env", description: "Prototype demonstrated in actual operational environment" },
  { level: 8, title: "System Complete", description: "System qualified through test & demo in operational environment" },
  { level: 9, title: "Proven in Operations", description: "System proven through successful mission operations" },
];

// --- Onboarding Profile (extended company profile with defense fields) ---

export interface OnboardingProfile {
  // Core (maps to CompanyProfile)
  name: string;
  sector: string;
  description: string;
  capabilities: string[];
  technologies: string[];
  trl_level: number;
  team_size: string;
  website: string;
  contact_email: string;
  use_cases: string[];

  // Defense-specific extensions
  defense_domains: string[];
  cage_code: string;
  certifications: string[];
  clearance_level: string;
  past_defense_experience: string;
  country: string;
  founded_year: string;
  partnership_interest: string[];
  trl_justification: string;
  compliance_itar: string;
  compliance_ear: string;
  compliance_gdpr: string;
}

export function createEmptyOnboardingProfile(): OnboardingProfile {
  return {
    name: "",
    sector: "",
    description: "",
    capabilities: [],
    technologies: [],
    trl_level: 5,
    team_size: "11-50",
    website: "",
    contact_email: "",
    use_cases: [],
    defense_domains: [],
    cage_code: "",
    certifications: [],
    clearance_level: "Unclassified",
    past_defense_experience: "",
    country: "",
    founded_year: "",
    partnership_interest: [],
    trl_justification: "",
    compliance_itar: "not-applicable",
    compliance_ear: "not-applicable",
    compliance_gdpr: "not-applicable",
  };
}

// --- Agent Message Types ---

export interface AgentMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  type: "text" | "question" | "validation" | "approval" | "file-upload";
  questions?: AgentQuestion[];
  validationResult?: QualityGateResult;
  timestamp: string;
}

export interface AgentQuestion {
  id: string;
  field: string;
  question: string;
  type: "text" | "select" | "multi-select" | "number" | "textarea";
  options?: string[];
  required: boolean;
  answered: boolean;
  answer?: string;
}

// --- Enhanced Quality Gate for Onboarding ---

export function validateOnboardingProfile(data: Partial<OnboardingProfile>): QualityGateResult {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];

  // Critical fields
  if (!data.name?.trim()) {
    issues.push({ field: "name", severity: "error", message: "Company legal name is required" });
  }
  if (!data.defense_domains || data.defense_domains.length === 0) {
    issues.push({ field: "defense_domains", severity: "error", message: "At least one defense domain must be selected for AI matching" });
  }
  if (!data.sector?.trim()) {
    issues.push({ field: "sector", severity: "error", message: "Industry sector is required" });
  }
  if (!data.description || data.description.length < 100) {
    issues.push({
      field: "description",
      severity: "error",
      message: `Description must be at least 100 characters (currently ${data.description?.length || 0}). Include: what you do, for whom, and your defense value proposition`,
    });
  }
  if (!data.capabilities || data.capabilities.length < 3) {
    issues.push({ field: "capabilities", severity: "error", message: "At least 3 capabilities are required from the standardized list" });
  }
  if (!data.technologies || data.technologies.length < 2) {
    issues.push({ field: "technologies", severity: "error", message: "At least 2 technologies must be listed" });
  }
  if (!data.trl_level || data.trl_level < 1 || data.trl_level > 9) {
    issues.push({ field: "trl_level", severity: "error", message: "TRL level must be between 1 and 9" });
  }
  if (!data.contact_email?.includes("@")) {
    issues.push({ field: "contact_email", severity: "error", message: "Valid contact email is required" });
  }

  // TRL consistency check
  if (data.trl_level && data.trl_level >= 6 && (!data.trl_justification || data.trl_justification.length < 30)) {
    issues.push({
      field: "trl_justification",
      severity: "warning",
      message: "TRL 6+ claims should include justification describing the relevant environment where testing occurred",
    });
  }
  if (data.trl_level && data.trl_level >= 8 && !data.past_defense_experience?.trim()) {
    issues.push({
      field: "trl_level",
      severity: "warning",
      message: "TRL 8+ typically requires reference to actual deployment or qualification program",
    });
  }

  // Quality fields
  if (!data.cage_code?.trim()) {
    suggestions.push("Adding your CAGE/NCAGE code improves credibility with defense stakeholders");
  }
  if (!data.past_defense_experience?.trim()) {
    issues.push({ field: "past_defense_experience", severity: "warning", message: "Past defense experience helps establish credibility" });
  }
  if (!data.use_cases || data.use_cases.length === 0) {
    issues.push({ field: "use_cases", severity: "warning", message: "Specific use cases improve AI match quality" });
  }
  if (data.certifications && data.certifications.length === 0) {
    suggestions.push("Listing certifications (ISO 27001, ISO 9001, etc.) strengthens your profile");
  }
  if (!data.country?.trim()) {
    suggestions.push("Specifying your country helps with partnership and export control matching");
  }
  if (data.partnership_interest && data.partnership_interest.length === 0) {
    suggestions.push("Specifying partnership interests improves collaboration matching");
  }

  // Content quality checks
  if (data.description && data.description.length >= 100) {
    const desc = data.description.toLowerCase();
    const hasDefenseContext = ["defense", "naval", "maritime", "military", "security", "operational"].some(
      (w) => desc.includes(w)
    );
    if (!hasDefenseContext) {
      issues.push({
        field: "description",
        severity: "warning",
        message: "Description should reference defense/naval/maritime context for better matching",
      });
    }

    const buzzwordRatio = ["leveraging", "synergy", "disrupt", "paradigm", "ecosystem", "holistic"]
      .filter((w) => desc.includes(w)).length;
    if (buzzwordRatio >= 3) {
      issues.push({
        field: "description",
        severity: "warning",
        message: "Description is heavy on buzzwords — add specific technical details for better AI matching",
      });
    }
  }

  // Email quality check
  if (data.contact_email) {
    const genericDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
    const domain = data.contact_email.split("@")[1]?.toLowerCase();
    if (genericDomains.includes(domain)) {
      issues.push({
        field: "contact_email",
        severity: "warning",
        message: "Using a corporate email address is recommended for defense platform profiles",
      });
    }
  }

  // Scoring
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const criticalTotal = 8; // number of critical fields
  const criticalPassed = criticalTotal - errorCount;
  const qualityTotal = 6;
  const qualityPassed = qualityTotal - warningCount;

  const criticalScore = (criticalPassed / criticalTotal);
  const qualityScore = Math.max(0, qualityPassed / qualityTotal);
  const contentScore = data.description && data.description.length >= 200 ? 1.0 :
    data.description && data.description.length >= 100 ? 0.7 : 0.3;
  const consistencyScore = errorCount === 0 ? 1.0 : 0.5;

  const score = Math.round(
    (criticalScore * 0.60 + qualityScore * 0.20 + contentScore * 0.15 + consistencyScore * 0.05) * 100
  );

  return {
    passed: errorCount === 0,
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
  };
}

// --- Agent Question Generator ---

export function generateClarifyingQuestions(profile: Partial<OnboardingProfile>): AgentQuestion[] {
  const questions: AgentQuestion[] = [];
  let qIdx = 0;

  if (!profile.defense_domains || profile.defense_domains.length === 0) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "defense_domains",
      question: "Which defense domain(s) does your technology serve? Select all that apply.",
      type: "multi-select",
      options: DEFENSE_DOMAINS.map((d) => `${d.code} — ${d.label}`),
      required: true,
      answered: false,
    });
  }

  if (!profile.capabilities || profile.capabilities.length < 3) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "capabilities",
      question: "Select your core capabilities (minimum 3). These are used for AI matching with naval challenges.",
      type: "multi-select",
      options: ALL_CAPABILITIES,
      required: true,
      answered: false,
    });
  }

  if (!profile.description || profile.description.length < 100) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "description",
      question: "Please provide a detailed description of your company (min 100 chars). Include: what you do, who your defense customers are, and your value proposition for naval operations.",
      type: "textarea",
      required: true,
      answered: false,
    });
  }

  if (profile.trl_level && profile.trl_level >= 6 && (!profile.trl_justification || profile.trl_justification.length < 30)) {
    const trlDesc = TRL_DESCRIPTIONS.find((t) => t.level === profile.trl_level);
    questions.push({
      id: `q-${qIdx++}`,
      field: "trl_justification",
      question: `You selected TRL ${profile.trl_level} (${trlDesc?.title}): "${trlDesc?.description}". Can you describe the specific environment where your technology was tested or demonstrated?`,
      type: "textarea",
      required: false,
      answered: false,
    });
  }

  if (!profile.past_defense_experience?.trim()) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "past_defense_experience",
      question: "Do you have past defense/naval contract experience? If yes, briefly describe (names can be generalized for security).",
      type: "textarea",
      required: false,
      answered: false,
    });
  }

  if (!profile.partnership_interest || profile.partnership_interest.length === 0) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "partnership_interest",
      question: "What type of partnerships are you seeking on the platform?",
      type: "multi-select",
      options: PARTNERSHIP_TYPES,
      required: false,
      answered: false,
    });
  }

  if (!profile.certifications || profile.certifications.length === 0) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "certifications",
      question: "Do you hold any relevant certifications?",
      type: "multi-select",
      options: CERTIFICATIONS,
      required: false,
      answered: false,
    });
  }

  if (!profile.country?.trim()) {
    questions.push({
      id: `q-${qIdx++}`,
      field: "country",
      question: "What country is your company headquartered in? (ISO code, e.g., NL, US, UK, DE)",
      type: "text",
      required: false,
      answered: false,
    });
  }

  return questions;
}

// --- Document Parser (simulated AI extraction) ---

export function extractProfileFromText(text: string): Partial<OnboardingProfile> {
  const profile: Partial<OnboardingProfile> = {};

  // Extract company name (first line or heading-like text)
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    // Take first short line as potential name
    const firstLine = lines[0].replace(/^#+\s*/, "").trim();
    if (firstLine.length < 100) {
      profile.name = firstLine;
    }
  }

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) profile.contact_email = emailMatch[0];

  // Extract website
  const urlMatch = text.match(/https?:\/\/[\w.-]+(?:\/[\w.-]*)?/);
  if (urlMatch) profile.website = urlMatch[0];

  // Use full text as description basis
  const descLines = lines.slice(1).join(" ");
  if (descLines.length >= 50) {
    profile.description = descLines.substring(0, 2000);
  }

  // Extract technologies by keyword matching
  const techKeywords = [
    "machine learning", "deep learning", "AI", "ROS", "ROS2", "Python", "Java",
    "cloud computing", "AWS", "Azure", "edge computing", "IoT", "blockchain",
    "computer vision", "NLP", "sensor fusion", "lidar", "radar", "sonar",
    "5G", "mesh networking", "encryption", "FPGA", "embedded systems",
    "digital twin", "simulation", "GIS", "satellite", "GPS", "INS",
  ];
  const foundTech = techKeywords.filter((t) => text.toLowerCase().includes(t.toLowerCase()));
  if (foundTech.length > 0) profile.technologies = foundTech;

  // Detect defense domains
  const domainKeywords: Record<string, string[]> = {
    MAR: ["maritime", "naval", "submarine", "vessel", "underwater", "port", "harbor"],
    CYB: ["cyber", "cybersecurity", "network defense", "secure communication"],
    AUT: ["autonomous", "drone", "UAS", "USV", "UUV", "unmanned", "swarm", "robotics"],
    SEW: ["sensor", "radar", "sonar", "electronic warfare", "signal processing", "EW"],
    LOG: ["logistics", "supply chain", "maintenance", "predictive maintenance", "sustainment"],
    C4I: ["C4ISR", "command and control", "intelligence", "surveillance", "reconnaissance"],
    SPC: ["satellite", "space", "GPS", "PNT"],
    ENR: ["energy", "propulsion", "battery", "fuel cell", "power management"],
    HFI: ["training", "simulation", "human factors", "HMI", "VR", "AR"],
  };
  const detectedDomains: string[] = [];
  const textLower = text.toLowerCase();
  for (const [code, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((kw) => textLower.includes(kw.toLowerCase()))) {
      detectedDomains.push(code);
    }
  }
  if (detectedDomains.length > 0) profile.defense_domains = detectedDomains;

  // Detect capabilities
  const capMatches = ALL_CAPABILITIES.filter((cap) =>
    textLower.includes(cap.toLowerCase()) ||
    cap.toLowerCase().split(" & ").some((part) => textLower.includes(part.toLowerCase()))
  );
  if (capMatches.length > 0) profile.capabilities = capMatches;

  // Detect TRL mentions
  const trlMatch = text.match(/TRL\s*(\d)/i);
  if (trlMatch) profile.trl_level = parseInt(trlMatch[1]);

  // Detect team size
  const teamMatch = text.match(/(\d+)\s*(?:employees|staff|team members|people)/i);
  if (teamMatch) {
    const size = parseInt(teamMatch[1]);
    if (size <= 10) profile.team_size = "1-10";
    else if (size <= 50) profile.team_size = "11-50";
    else if (size <= 200) profile.team_size = "51-200";
    else if (size <= 500) profile.team_size = "201-500";
    else profile.team_size = "500+";
  }

  return profile;
}

// --- Agent Response Generator ---

export function generateAgentGreeting(): string {
  return `Welcome to the Naval Innovation Hub onboarding! I'm your Quality Gate Agent.

I'll help you create a defense-grade company profile optimized for AI matchmaking with naval challenges, research institutions, and potential collaborators.

I'll guide you through the process and ensure your profile meets our data standards for maximum match quality. Let's get started!`;
}

export function generateValidationSummary(result: QualityGateResult, profile: Partial<OnboardingProfile>): string {
  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter((i) => i.severity === "warning");

  if (result.passed && result.score >= 85) {
    return `Excellent! Your profile scores **${result.score}/100** and meets all data standards. ${
      warnings.length > 0
        ? `I have ${warnings.length} suggestion(s) that could improve your match quality even further.`
        : "Your profile is fully optimized for AI matchmaking."
    }`;
  }

  if (result.passed && result.score >= 60) {
    return `Good progress! Your profile scores **${result.score}/100**. All critical fields are present. ${
      warnings.length > 0
        ? `I have ${warnings.length} recommendation(s) to improve your match quality.`
        : ""
    }`;
  }

  return `Your profile needs some work before it's ready (score: **${result.score}/100**). ${
    errors.length > 0
      ? `There are **${errors.length} critical issue(s)** that must be resolved.`
      : ""
  } ${warnings.length > 0 ? `Plus ${warnings.length} improvement suggestion(s).` : ""} Let me help you fill in the gaps.`;
}

export function generateDocumentAnalysisSummary(profile: Partial<OnboardingProfile>): string {
  const extracted: string[] = [];
  if (profile.name) extracted.push(`Company name: **${profile.name}**`);
  if (profile.contact_email) extracted.push(`Email: ${profile.contact_email}`);
  if (profile.website) extracted.push(`Website: ${profile.website}`);
  if (profile.defense_domains?.length) {
    const domainLabels = profile.defense_domains.map(
      (d) => DEFENSE_DOMAINS.find((dd) => dd.code === d)?.label || d
    );
    extracted.push(`Defense domains: ${domainLabels.join(", ")}`);
  }
  if (profile.capabilities?.length) extracted.push(`${profile.capabilities.length} capabilities detected`);
  if (profile.technologies?.length) extracted.push(`Technologies: ${profile.technologies.join(", ")}`);
  if (profile.trl_level) extracted.push(`TRL level: ${profile.trl_level}`);
  if (profile.team_size) extracted.push(`Team size: ${profile.team_size}`);

  if (extracted.length === 0) {
    return "I couldn't extract structured information from your document. Could you try providing the information in a different format, or use the structured form instead?";
  }

  return `I extracted the following from your document:\n\n${extracted.map((e) => `- ${e}`).join("\n")}\n\nLet me verify this against our data standards and ask some follow-up questions to fill in any gaps.`;
}

// --- Convert OnboardingProfile to CompanyProfile ---

export function onboardingToCompanyProfile(data: OnboardingProfile): Omit<CompanyProfile, "id" | "quality_score" | "created_at" | "updated_at"> {
  return {
    name: data.name,
    sector: data.sector,
    description: data.description,
    capabilities: data.capabilities,
    technologies: data.technologies,
    trl_level: data.trl_level,
    team_size: data.team_size,
    website: data.website || undefined,
    contact_email: data.contact_email,
    use_cases: data.use_cases,
  };
}
