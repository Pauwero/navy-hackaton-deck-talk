import type { CompanyProfile, ResearchProfile, NavyChallenge, QualityGateResult, QualityIssue } from "@/types";

/**
 * Quality Gate Agent for Company Profiles
 * Enforces structured, consistent data standards optimized for AI matchmaking
 */
export function validateCompanyProfile(
  data: Partial<CompanyProfile>
): QualityGateResult {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];

  // Required fields
  if (!data.name?.trim()) {
    issues.push({ field: "name", severity: "error", message: "Company name is required" });
  }
  if (!data.sector?.trim()) {
    issues.push({ field: "sector", severity: "error", message: "Sector/industry is required for matchmaking" });
  }
  if (!data.description || data.description.length < 50) {
    issues.push({ field: "description", severity: "error", message: "Description must be at least 50 characters for meaningful AI matching" });
  }
  if (!data.capabilities || data.capabilities.length === 0) {
    issues.push({ field: "capabilities", severity: "error", message: "At least one capability is required" });
  }
  if (!data.technologies || data.technologies.length === 0) {
    issues.push({ field: "technologies", severity: "error", message: "At least one technology must be listed" });
  }
  if (!data.trl_level || data.trl_level < 1 || data.trl_level > 9) {
    issues.push({ field: "trl_level", severity: "error", message: "TRL level must be between 1 and 9" });
  }
  if (!data.contact_email?.includes("@")) {
    issues.push({ field: "contact_email", severity: "error", message: "Valid contact email is required" });
  }

  // Quality warnings
  if (data.capabilities && data.capabilities.length < 3) {
    issues.push({ field: "capabilities", severity: "warning", message: "Adding more capabilities improves matchmaking accuracy" });
    suggestions.push("Consider listing at least 3-5 core capabilities for better AI matching");
  }
  if (data.use_cases && data.use_cases.length === 0) {
    issues.push({ field: "use_cases", severity: "warning", message: "Use cases help match with specific challenges" });
    suggestions.push("Add concrete use cases to increase match relevance");
  }
  if (data.description && data.description.length < 200) {
    suggestions.push("A more detailed description (200+ chars) significantly improves match quality");
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const score = Math.max(0, 100 - errorCount * 20 - issues.filter((i) => i.severity === "warning").length * 5);

  return {
    passed: errorCount === 0,
    score,
    issues,
    suggestions,
  };
}

/**
 * Quality Gate Agent for Research Profiles
 * Tailored to research standards
 */
export function validateResearchProfile(
  data: Partial<ResearchProfile>
): QualityGateResult {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];

  if (!data.title?.trim()) {
    issues.push({ field: "title", severity: "error", message: "Research title is required" });
  }
  if (!data.institution?.trim()) {
    issues.push({ field: "institution", severity: "error", message: "Institution is required" });
  }
  if (!data.principal_investigator?.trim()) {
    issues.push({ field: "principal_investigator", severity: "error", message: "Principal investigator name is required" });
  }
  if (!data.field?.trim()) {
    issues.push({ field: "field", severity: "error", message: "Research field is required" });
  }
  if (!data.description || data.description.length < 100) {
    issues.push({ field: "description", severity: "error", message: "Research description must be at least 100 characters" });
  }
  if (!data.keywords || data.keywords.length < 3) {
    issues.push({ field: "keywords", severity: "error", message: "At least 3 keywords are required for discoverability" });
  }
  if (!data.trl_level || data.trl_level < 1 || data.trl_level > 9) {
    issues.push({ field: "trl_level", severity: "error", message: "TRL level must be between 1 and 9" });
  }
  if (!data.contact_email?.includes("@")) {
    issues.push({ field: "contact_email", severity: "error", message: "Valid contact email is required" });
  }

  if (data.publications && data.publications.length === 0) {
    suggestions.push("Adding relevant publications strengthens your research profile");
  }
  if (data.collaboration_interest && data.collaboration_interest.length === 0) {
    suggestions.push("Specifying collaboration interests improves matchmaking");
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const score = Math.max(0, 100 - errorCount * 15 - issues.filter((i) => i.severity === "warning").length * 5);

  return {
    passed: errorCount === 0,
    score,
    issues,
    suggestions,
  };
}

/**
 * Quality Gate Agent for Navy Challenges
 * Uses naval standards (different structure)
 */
export function validateNavyChallenge(
  data: Partial<NavyChallenge>
): QualityGateResult {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];

  if (!data.title?.trim()) {
    issues.push({ field: "title", severity: "error", message: "Challenge title is required" });
  }
  if (!data.domain?.trim()) {
    issues.push({ field: "domain", severity: "error", message: "Operational domain is required" });
  }
  if (!data.description || data.description.length < 100) {
    issues.push({ field: "description", severity: "error", message: "Challenge description must be at least 100 characters for effective matching" });
  }
  if (!data.operational_context || data.operational_context.length < 50) {
    issues.push({ field: "operational_context", severity: "error", message: "Operational context must be at least 50 characters" });
  }
  if (!data.requirements || data.requirements.length === 0) {
    issues.push({ field: "requirements", severity: "error", message: "At least one requirement must be specified" });
  }
  if (!data.desired_trl || data.desired_trl < 1 || data.desired_trl > 9) {
    issues.push({ field: "desired_trl", severity: "error", message: "Desired TRL must be between 1 and 9" });
  }
  if (!data.timeline?.trim()) {
    issues.push({ field: "timeline", severity: "error", message: "Timeline is required" });
  }
  if (!data.priority) {
    issues.push({ field: "priority", severity: "error", message: "Priority level must be set" });
  }
  if (!data.tags || data.tags.length < 2) {
    issues.push({ field: "tags", severity: "warning", message: "At least 2 tags are recommended for better discoverability" });
  }

  if (data.requirements && data.requirements.length < 3) {
    suggestions.push("More detailed requirements improve the quality of AI-matched solutions");
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const score = Math.max(0, 100 - errorCount * 12 - issues.filter((i) => i.severity === "warning").length * 5);

  return {
    passed: errorCount === 0,
    score,
    issues,
    suggestions,
  };
}
