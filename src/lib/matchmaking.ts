import type { CompanyProfile, ResearchProfile, NavyChallenge, Match, GroupMatch, GroupMatchMember } from "@/types";

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

/**
 * Generate Group Matches — suggest pairs/groups of companies+researchers
 * that together cover a challenge's full solution space (#25)
 */
export function generateGroupMatches(
  challenge: NavyChallenge,
  companies: CompanyProfile[],
  research: ResearchProfile[],
  existingMatches: Match[]
): GroupMatch[] {
  const challengeMatches = existingMatches
    .filter((m) => m.source_id === challenge.id && m.score > 5)
    .sort((a, b) => b.score - a.score);

  if (challengeMatches.length < 2) return [];

  const groups: GroupMatch[] = [];
  const requirementWords = new Set(
    challenge.tags.concat(challenge.requirements.flatMap((r) => r.toLowerCase().split(/\s+/)))
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 3)
  );

  const companyMatches = challengeMatches.filter((m) => m.target_type === "company").slice(0, 4);
  const researchMatches = challengeMatches.filter((m) => m.target_type === "research").slice(0, 4);

  for (const cm of companyMatches) {
    for (const rm of researchMatches) {
      const company = companies.find((c) => c.id === cm.target_id);
      const res = research.find((r) => r.id === rm.target_id);
      if (!company || !res) continue;

      const allCoverage = new Set([
        ...company.capabilities.map((c) => c.toLowerCase()),
        ...company.technologies.map((t) => t.toLowerCase()),
        ...res.keywords.map((k) => k.toLowerCase()),
      ]);
      const covered = [...requirementWords].filter((w) =>
        [...allCoverage].some((c) => c.includes(w) || w.includes(c))
      );
      const coveragePercent = requirementWords.size > 0 ? (covered.length / requirementWords.size) * 100 : 0;
      const combinedScore = Math.round((cm.score + rm.score) / 2 + (coveragePercent > 30 ? 10 : 0));
      if (combinedScore < 10) continue;

      groups.push({
        id: generateId(),
        challenge_id: challenge.id,
        members: [
          { entity_id: company.id, entity_type: "company", entity_name: company.name, contribution: `Brings ${company.capabilities.slice(0, 2).join(", ")}` },
          { entity_id: res.id, entity_type: "research", entity_name: res.title.length > 40 ? res.title.substring(0, 40) + "..." : res.title, contribution: `Research in ${res.keywords.slice(0, 2).join(", ")}` },
        ],
        combined_score: combinedScore,
        coverage: covered,
        reasoning: `${company.name} provides implementation, ${res.institution} contributes research. ${Math.round(coveragePercent)}% requirement coverage together.`,
        created_at: new Date().toISOString(),
      });
    }
  }

  for (let i = 0; i < companyMatches.length; i++) {
    for (let j = i + 1; j < companyMatches.length; j++) {
      const c1 = companies.find((c) => c.id === companyMatches[i].target_id);
      const c2 = companies.find((c) => c.id === companyMatches[j].target_id);
      if (!c1 || !c2) continue;

      const allCaps = new Set([...c1.capabilities, ...c2.capabilities, ...c1.technologies, ...c2.technologies].map((s) => s.toLowerCase()));
      const covered = [...requirementWords].filter((w) => [...allCaps].some((c) => c.includes(w) || w.includes(c)));
      const coveragePercent = requirementWords.size > 0 ? (covered.length / requirementWords.size) * 100 : 0;
      const combinedScore = Math.round((companyMatches[i].score + companyMatches[j].score) / 2 + (coveragePercent > 30 ? 5 : 0));
      if (combinedScore < 10) continue;

      groups.push({
        id: generateId(),
        challenge_id: challenge.id,
        members: [
          { entity_id: c1.id, entity_type: "company", entity_name: c1.name, contribution: c1.capabilities.slice(0, 2).join(", ") },
          { entity_id: c2.id, entity_type: "company", entity_name: c2.name, contribution: c2.capabilities.slice(0, 2).join(", ") },
        ],
        combined_score: combinedScore,
        coverage: covered,
        reasoning: `Combined capabilities from ${c1.name} and ${c2.name} cover ${Math.round(coveragePercent)}% of requirements.`,
        created_at: new Date().toISOString(),
      });
    }
  }

  return groups.sort((a, b) => b.combined_score - a.combined_score).slice(0, 5);
}
