export interface CompanyProfile {
  id: string;
  name: string;
  logo_url?: string;
  sector: string;
  description: string;
  capabilities: string[];
  technologies: string[];
  trl_level: number; // Technology Readiness Level 1-9
  team_size: string;
  website?: string;
  contact_email: string;
  use_cases: string[];
  audio_snippet_url?: string;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface ResearchProfile {
  id: string;
  title: string;
  institution: string;
  principal_investigator: string;
  field: string;
  description: string;
  keywords: string[];
  publications: string[];
  trl_level: number;
  funding_status: string;
  collaboration_interest: string[];
  contact_email: string;
  audio_snippet_url?: string;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface NavyChallenge {
  id: string;
  title: string;
  classification: "unclassified" | "restricted";
  domain: string;
  description: string;
  operational_context: string;
  requirements: string[];
  desired_trl: number;
  timeline: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in_review" | "matched" | "closed";
  tags: string[];
  audio_snippet_url?: string;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  match_type: "challenge_to_company" | "challenge_to_research" | "company_to_company" | "company_to_research";
  source_id: string;
  source_type: "company" | "research" | "challenge";
  target_id: string;
  target_type: "company" | "research" | "challenge";
  score: number;
  reasoning: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface PlaylistItem {
  id: string;
  user_id: string;
  item_type: "company" | "research" | "challenge";
  item_id: string;
  item_title: string;
  audio_url?: string;
  added_at: string;
}

export interface QualityGateResult {
  passed: boolean;
  score: number;
  issues: QualityIssue[];
  suggestions: string[];
}

export interface QualityIssue {
  field: string;
  severity: "error" | "warning" | "info";
  message: string;
}

// --- New types for missing features ---

export interface Notification {
  id: string;
  type: "match_found" | "interest_received" | "new_challenge" | "profile_matched";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface Interest {
  id: string;
  challenge_id: string;
  entity_id: string;
  entity_type: "company" | "research";
  entity_name: string;
  message?: string;
  created_at: string;
}

export interface GroupMatch {
  id: string;
  challenge_id: string;
  members: GroupMatchMember[];
  combined_score: number;
  coverage: string[];
  reasoning: string;
  created_at: string;
}

export interface GroupMatchMember {
  entity_id: string;
  entity_type: "company" | "research";
  entity_name: string;
  contribution: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentItemId: string | null;
  currentTitle: string;
  currentDescription: string;
  currentType: "company" | "research" | "challenge";
}

// --- Onboarding types ---

export interface OnboardingSession {
  id: string;
  status: "in_progress" | "review" | "approved" | "submitted";
  input_method: "form" | "chat";
  profile_data: Record<string, unknown>;
  quality_score: number;
  agent_messages: OnboardingMessage[];
  created_at: string;
  updated_at: string;
}

export interface OnboardingMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  type: "text" | "question" | "validation" | "approval" | "file-upload";
  timestamp: string;
}
