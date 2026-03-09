import type { CompanyProfile, ResearchProfile, NavyChallenge, Match } from "@/types";

/**
 * AI Matchmaking Engine
 * Provides three-way matching between challenges, companies, and research
 */

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

function calculateArrayOverlap(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1.map(s => s.toLowerCase()));
  const set2 = new Set(arr2.map(s => s.toLowerCase()));
  const intersection = new Set([...set1].filter(s => set2.has(s)));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

function calculateTrlCompatibility(trl1: number, trl2: number): number {
  const diff = Math.abs(trl1 - trl2);
  if (diff === 0) return 1.0;
  if (diff === 1) return 0.8;
  if (diff === 2) return 0.5;
  return Math.max(0, 1 - diff * 0.2);
}

/**
 * Match a Navy Challenge to Companies
 */
export function matchChallengeToCompanies(
  challenge: NavyChallenge,
  companies: CompanyProfile[]
): Match[] {
  return companies
    .map((company) => {
      const descScore = calculateTextSimilarity(challenge.description + " " + challenge.operational_context, company.description);
      const tagCapScore = calculateArrayOverlap(challenge.tags, company.capabilities);
      const reqTechScore = calculateArrayOverlap(challenge.requirements, company.technologies);
      const trlScore = calculateTrlCompatibility(challenge.desired_trl, company.trl_level);

      const score = Math.round(
        (descScore * 25 + tagCapScore * 30 + reqTechScore * 25 + trlScore * 20) * 100
      ) / 100;

      const reasons: string[] = [];
      if (tagCapScore > 0.2) reasons.push("Strong capability alignment");
      if (reqTechScore > 0.2) reasons.push("Technology match with requirements");
      if (trlScore > 0.7) reasons.push("Compatible TRL level");
      if (descScore > 0.15) reasons.push("Description relevance");
      if (reasons.length === 0) reasons.push("Partial overlap in domain");

      return {
        id: generateId(),
        match_type: "challenge_to_company" as const,
        source_id: challenge.id,
        source_type: "challenge" as const,
        target_id: company.id,
        target_type: "company" as const,
        score,
        reasoning: reasons.join(". ") + ".",
        status: "pending" as const,
        created_at: new Date().toISOString(),
      };
    })
    .filter((m) => m.score > 5)
    .sort((a, b) => b.score - a.score);
}

/**
 * Match a Navy Challenge to Research
 */
export function matchChallengeToResearch(
  challenge: NavyChallenge,
  research: ResearchProfile[]
): Match[] {
  return research
    .map((r) => {
      const descScore = calculateTextSimilarity(challenge.description + " " + challenge.operational_context, r.description);
      const tagKeyScore = calculateArrayOverlap(challenge.tags, r.keywords);
      const trlScore = calculateTrlCompatibility(challenge.desired_trl, r.trl_level);
      const collabScore = r.collaboration_interest.length > 0 ? 0.2 : 0;

      const score = Math.round(
        (descScore * 25 + tagKeyScore * 35 + trlScore * 20 + collabScore * 20) * 100
      ) / 100;

      const reasons: string[] = [];
      if (tagKeyScore > 0.2) reasons.push("Keyword alignment with challenge tags");
      if (descScore > 0.15) reasons.push("Research description relevance");
      if (trlScore > 0.7) reasons.push("Compatible TRL level");
      if (collabScore > 0) reasons.push("Open to collaboration");
      if (reasons.length === 0) reasons.push("Potential domain overlap");

      return {
        id: generateId(),
        match_type: "challenge_to_research" as const,
        source_id: challenge.id,
        source_type: "challenge" as const,
        target_id: r.id,
        target_type: "research" as const,
        score,
        reasoning: reasons.join(". ") + ".",
        status: "pending" as const,
        created_at: new Date().toISOString(),
      };
    })
    .filter((m) => m.score > 5)
    .sort((a, b) => b.score - a.score);
}

/**
 * Match Companies to each other for collaboration
 */
export function matchCompanyToCompany(
  company: CompanyProfile,
  others: CompanyProfile[]
): Match[] {
  return others
    .filter((c) => c.id !== company.id)
    .map((other) => {
      const capOverlap = calculateArrayOverlap(company.capabilities, other.capabilities);
      const techOverlap = calculateArrayOverlap(company.technologies, other.technologies);
      const descScore = calculateTextSimilarity(company.description, other.description);
      // Complementarity: some overlap is good, but too much means they're competitors
      const complementarity = capOverlap > 0.1 && capOverlap < 0.6 ? 0.3 : 0;

      const score = Math.round(
        (descScore * 20 + capOverlap * 25 + techOverlap * 25 + complementarity * 30) * 100
      ) / 100;

      const reasons: string[] = [];
      if (complementarity > 0) reasons.push("Complementary capabilities");
      if (techOverlap > 0.2) reasons.push("Shared technology stack");
      if (descScore > 0.15) reasons.push("Similar domain focus");
      if (reasons.length === 0) reasons.push("Potential synergy");

      return {
        id: generateId(),
        match_type: "company_to_company" as const,
        source_id: company.id,
        source_type: "company" as const,
        target_id: other.id,
        target_type: "company" as const,
        score,
        reasoning: reasons.join(". ") + ".",
        status: "pending" as const,
        created_at: new Date().toISOString(),
      };
    })
    .filter((m) => m.score > 5)
    .sort((a, b) => b.score - a.score);
}

/**
 * Match Company to Research for collaboration
 */
export function matchCompanyToResearch(
  company: CompanyProfile,
  research: ResearchProfile[]
): Match[] {
  return research
    .map((r) => {
      const descScore = calculateTextSimilarity(company.description, r.description);
      const techKeyScore = calculateArrayOverlap(company.technologies, r.keywords);
      const capCollabScore = calculateArrayOverlap(company.capabilities, r.collaboration_interest);
      const trlScore = calculateTrlCompatibility(company.trl_level, r.trl_level);

      const score = Math.round(
        (descScore * 20 + techKeyScore * 30 + capCollabScore * 25 + trlScore * 25) * 100
      ) / 100;

      const reasons: string[] = [];
      if (techKeyScore > 0.2) reasons.push("Technology-research alignment");
      if (capCollabScore > 0.2) reasons.push("Capability matches collaboration interests");
      if (trlScore > 0.7) reasons.push("Compatible maturity levels");
      if (descScore > 0.15) reasons.push("Domain relevance");
      if (reasons.length === 0) reasons.push("Potential for tech transfer");

      return {
        id: generateId(),
        match_type: "company_to_research" as const,
        source_id: company.id,
        source_type: "company" as const,
        target_id: r.id,
        target_type: "research" as const,
        score,
        reasoning: reasons.join(". ") + ".",
        status: "pending" as const,
        created_at: new Date().toISOString(),
      };
    })
    .filter((m) => m.score > 5)
    .sort((a, b) => b.score - a.score);
}
