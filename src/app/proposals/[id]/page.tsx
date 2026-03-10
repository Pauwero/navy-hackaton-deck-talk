"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { ProposalStatus } from "@/types";
import {
  ArrowLeft,
  Vote,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Presentation,
  GraduationCap,
  Handshake,
  Trophy,
  Send,
  FileCheck,
  AlertTriangle,
  Zap,
  Building2,
  ExternalLink,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Link2,
} from "lucide-react";

// Pipeline stages in order
const PIPELINE_STEPS: { key: ProposalStatus; label: string; icon: typeof FileCheck }[] = [
  { key: "voting", label: "Vote", icon: Vote },
  { key: "sniff_assessment", label: "SNIF", icon: ClipboardCheck },
  { key: "approved", label: "Go/No-Go", icon: CheckCircle2 },
  { key: "innovation_board", label: "Board", icon: Presentation },
  { key: "professor_review", label: "Review", icon: GraduationCap },
  { key: "meetup", label: "Meetup", icon: Handshake },
  { key: "enrolled", label: "Enrolled", icon: Trophy },
];

function getStepIndex(status: ProposalStatus): number {
  if (status === "submitted") return -1;
  if (status === "discussion") return 2;
  if (status === "rejected") return 2;
  return PIPELINE_STEPS.findIndex((s) => s.key === status);
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: string }) {
  const color = score >= 75 ? "bg-emerald-500" : score >= 65 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-navy-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[0.6rem] text-navy-400">{weight}</span>
          <span className={`text-xs font-bold ${score >= 75 ? "text-emerald-600" : score >= 65 ? "text-orange-600" : "text-red-600"}`}>
            {score}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-navy-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, children }: { icon: typeof FileCheck; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-200">
      <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2 uppercase tracking-wide">
        <Icon className="w-4 h-4 text-accent-500" /> {title}
      </h2>
      {children}
    </div>
  );
}

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const proposal = store.getProposal(params.id as string);

  const [voteComment, setVoteComment] = useState("");

  if (!proposal) {
    return (
      <div className="text-center py-20">
        <p className="text-navy-500">Proposal not found</p>
        <Link href="/proposals" className="text-accent-600 text-sm mt-2 inline-block">Back to proposals</Link>
      </div>
    );
  }

  const interestedCount = proposal.votes.filter((v) => v.interested).length;
  const notInterestedCount = proposal.votes.filter((v) => !v.interested).length;
  const interestRatio = proposal.votes.length > 0 ? Math.round((interestedCount / proposal.votes.length) * 100) : 0;
  const currentStepIndex = getStepIndex(proposal.status);

  const challengeMatches = proposal.challenge_id ? store.getMatchesFor(proposal.challenge_id) : [];
  const matchedEntities = challengeMatches
    .filter((m) => m.target_type === "company" || m.source_type === "company")
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  const matchedCompanyIds = matchedEntities.map((m) =>
    m.target_type === "company" ? m.target_id : m.source_id
  );
  const matchedCompanies = matchedCompanyIds
    .map((id) => store.companies.find((c) => c.id === id))
    .filter(Boolean);

  function handleVote(interested: boolean) {
    store.addVote(proposal!.id, {
      voter_name: store.userProfile.name,
      voter_role: store.userProfile.role,
      interested,
      comment: voteComment || undefined,
    });
    setVoteComment("");
  }

  function handleAdvanceStatus(newStatus: ProposalStatus) {
    store.updateProposalStatus(proposal!.id, newStatus);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* ─── HEADER ─── */}
      <div>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-navy-400 hover:text-navy-600 text-sm mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-navy-900">{proposal.title}</h1>
          {proposal.assessment && (
            <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
              proposal.assessment.total_score >= 75 ? "bg-emerald-50 text-emerald-600" :
              proposal.assessment.total_score >= 65 ? "bg-orange-50 text-orange-600" :
              "bg-red-50 text-red-600"
            }`}>
              {proposal.assessment.total_score}%
            </span>
          )}
        </div>
        <p className="text-sm text-navy-500 mt-1">
          {proposal.submitter_org} · {proposal.domain} · Submitted {new Date(proposal.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* ─── PIPELINE STEPPER ─── */}
      <div className="card-surface p-4">
        <div className="flex items-center justify-between">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = step.key === proposal.status || (proposal.status === "discussion" && step.key === "approved");
            const isCompleted = i < currentStepIndex;
            const isRejected = proposal.status === "rejected" && step.key === "approved";

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isRejected ? "bg-red-100 text-red-600 ring-2 ring-red-300" :
                    isActive ? "bg-accent-500 text-white ring-2 ring-accent-300" :
                    isCompleted ? "bg-emerald-500 text-white" :
                    "bg-navy-100 text-navy-400"
                  }`}>
                    {isRejected ? <XCircle className="w-4 h-4" /> :
                     isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                     <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[0.6rem] font-medium mt-1 ${
                    isActive ? "text-accent-600" : isCompleted ? "text-emerald-600" : "text-navy-400"
                  }`}>
                    {isRejected ? "Rejected" : proposal.status === "discussion" && step.key === "approved" ? "Discussion" : step.label}
                  </span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded ${
                    i < currentStepIndex ? "bg-emerald-400" : "bg-navy-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── CURRENT ACTION ─── */}
      {proposal.status === "submitted" && (
        <div className="card-surface p-5 border-l-4 border-blue-500 flex items-center gap-4">
          <Vote className="w-6 h-6 text-blue-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Ready for Internal Voting</p>
            <p className="text-xs text-navy-500">Open this proposal for internal team voting</p>
          </div>
          <button onClick={() => handleAdvanceStatus("voting")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5 shrink-0">
            <Vote className="w-4 h-4" /> Open Voting
          </button>
        </div>
      )}

      {proposal.status === "voting" && (
        <div className="card-surface p-5 border-l-4 border-blue-500 flex items-center gap-4">
          <Vote className="w-6 h-6 text-blue-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Voting in Progress — {proposal.votes.length} vote{proposal.votes.length !== 1 ? "s" : ""} collected</p>
            <p className="text-xs text-navy-500">Cast your vote below, then advance to SNIF assessment when ready</p>
          </div>
          {proposal.votes.length >= 2 && (
            <button onClick={() => handleAdvanceStatus("sniff_assessment")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5 shrink-0">
              <ClipboardCheck className="w-4 h-4" /> Proceed to SNIF
            </button>
          )}
        </div>
      )}

      {proposal.status === "sniff_assessment" && (
        <div className="card-surface p-5 border-l-4 border-amber-500 flex items-center gap-4">
          <ClipboardCheck className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">SNIF Assessment Required</p>
            <p className="text-xs text-navy-500">Complete the Strategisch-Noodzakelijk-Innovatief-Functioneel scorecard</p>
          </div>
          <Link href={`/proposals/${proposal.id}/snif`} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5 shrink-0">
            <ClipboardCheck className="w-4 h-4" /> Start SNIF Procedure
          </Link>
        </div>
      )}

      {proposal.status === "approved" && (
        <div className="card-surface p-5 border-l-4 border-emerald-500 flex items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Proposal Approved — Score {proposal.assessment?.total_score}%</p>
            <p className="text-xs text-navy-500">Advance to the next stage in the pipeline</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => handleAdvanceStatus("innovation_board")} className="btn-primary text-sm px-4 py-2.5 flex items-center gap-1.5">
              <Presentation className="w-4 h-4" /> Innovation Board
            </button>
            <button onClick={() => handleAdvanceStatus("professor_review")} className="btn-outline text-sm px-4 py-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Professor Review
            </button>
          </div>
        </div>
      )}

      {proposal.status === "discussion" && (
        <div className="card-surface p-5 border-l-4 border-orange-500 flex items-center gap-4">
          <MessageSquare className="w-6 h-6 text-orange-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Under Discussion — Score {proposal.assessment?.total_score}%</p>
            <p className="text-xs text-navy-500">Board discussion required before advancing. Score between 65-75%.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => handleAdvanceStatus("innovation_board")} className="btn-primary text-sm px-4 py-2.5 flex items-center gap-1.5">
              <Presentation className="w-4 h-4" /> Advance to Board
            </button>
            <button onClick={() => handleAdvanceStatus("rejected")} className="text-sm px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>
      )}

      {proposal.status === "innovation_board" && (
        <div className="card-surface p-5 border-l-4 border-purple-500 flex items-center gap-4">
          <Presentation className="w-6 h-6 text-purple-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Innovation Board Presentation</p>
            <p className="text-xs text-navy-500">Present to the board, then advance to next stage</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/proposals/${proposal.id}/board`} className="btn-outline text-sm px-4 py-2.5 flex items-center gap-1.5">
              <Presentation className="w-4 h-4" /> View Board Deck
            </Link>
            <button onClick={() => handleAdvanceStatus("professor_review")} className="btn-primary text-sm px-4 py-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Professor Review
            </button>
          </div>
        </div>
      )}

      {proposal.status === "professor_review" && (
        <div className="card-surface p-5 border-l-4 border-indigo-500 flex items-center gap-4">
          <GraduationCap className="w-6 h-6 text-indigo-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Awaiting Professor State-of-the-Art Review</p>
            <p className="text-xs text-navy-500">{proposal.professor_review ? "Review completed — advance when ready" : "Waiting for academic assessment"}</p>
          </div>
          {proposal.professor_review && (
            <button onClick={() => handleAdvanceStatus("meetup")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5 shrink-0">
              <Handshake className="w-4 h-4" /> Schedule Meetup
            </button>
          )}
        </div>
      )}

      {proposal.status === "meetup" && (
        <div className="card-surface p-5 border-l-4 border-teal-500 flex items-center gap-4">
          <Handshake className="w-6 h-6 text-teal-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-navy-900">Startup Meetup & Validation</p>
            <p className="text-xs text-navy-500">
              {proposal.meetup_scheduled
                ? `Scheduled: ${new Date(proposal.meetup_scheduled).toLocaleDateString()}`
                : "Schedule meetings with potential providers below"}
            </p>
          </div>
          <button onClick={() => handleAdvanceStatus("enrolled")} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5 shrink-0">
            <Trophy className="w-4 h-4" /> Enroll in Challenge
          </button>
        </div>
      )}

      {proposal.status === "enrolled" && (
        <div className="card-surface p-5 border-l-4 border-emerald-500 bg-emerald-50/50 flex items-center gap-4">
          <Trophy className="w-6 h-6 text-emerald-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">Enrolled in Challenge</p>
            <p className="text-xs text-emerald-600">This proposal has been accepted and enrolled.</p>
          </div>
        </div>
      )}

      {proposal.status === "rejected" && (
        <div className="card-surface p-5 border-l-4 border-red-500 bg-red-50/50 flex items-center gap-4">
          <XCircle className="w-6 h-6 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">Proposal Rejected</p>
            <p className="text-xs text-red-600">Score below 65% threshold. Does not meet minimum requirements.</p>
          </div>
        </div>
      )}

      {/* ─── SECTION: OVERVIEW ─── */}
      <section>
        <SectionHeader icon={FileText} title="Proposal Overview">
          <div className="flex items-center gap-3 text-xs text-navy-500">
            <span>{proposal.submitter_name}</span>
            <span className="w-1 h-1 rounded-full bg-navy-300" />
            <span>{proposal.domain}</span>
          </div>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div className="card-surface px-4 py-3">
            <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Status</p>
            <p className={`text-sm font-bold mt-0.5 ${
              proposal.status === "approved" || proposal.status === "enrolled" ? "text-emerald-600" :
              proposal.status === "rejected" ? "text-red-600" :
              proposal.status === "discussion" ? "text-orange-600" :
              "text-blue-600"
            }`}>
              {proposal.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
          </div>
          <div className="card-surface px-4 py-3">
            <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Votes</p>
            <p className="text-sm font-bold text-navy-900 mt-0.5">{proposal.votes.length} ({interestRatio}% interest)</p>
          </div>
          {proposal.assessment && (
            <div className="card-surface px-4 py-3">
              <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">SNIF Score</p>
              <p className={`text-sm font-bold mt-0.5 ${
                proposal.assessment.total_score >= 75 ? "text-emerald-600" :
                proposal.assessment.total_score >= 65 ? "text-orange-600" : "text-red-600"
              }`}>{proposal.assessment.total_score}%</p>
            </div>
          )}
          <div className="card-surface px-4 py-3">
            <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Providers Matched</p>
            <p className="text-sm font-bold text-navy-900 mt-0.5">{matchedCompanies.length}</p>
          </div>
        </div>

        <div className="card-surface p-5">
          <p className="text-sm text-navy-700 leading-relaxed">{proposal.description}</p>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-navy-100">
            {proposal.challenge_id && (
              <Link href={`/challenges/${proposal.challenge_id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 hover:text-accent-700 transition-colors">
                <Link2 className="w-3.5 h-3.5" /> View Linked Challenge
              </Link>
            )}
            {proposal.company_id && (
              <Link href={`/companies/${proposal.company_id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 hover:text-accent-700 transition-colors">
                <Building2 className="w-3.5 h-3.5" /> View Company
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION: INTERNAL VOTING ─── */}
      <section>
        <SectionHeader icon={Vote} title="Internal Voting">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-600 font-medium">{interestedCount} interested</span>
            <span className="text-red-600 font-medium">{notInterestedCount} not interested</span>
          </div>
        </SectionHeader>

        {/* Vote bar */}
        {proposal.votes.length > 0 && (
          <div className="w-full h-3 bg-navy-100 rounded-full overflow-hidden flex mb-5">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${interestRatio}%` }} />
            <div className="h-full bg-red-400 transition-all" style={{ width: `${100 - interestRatio}%` }} />
          </div>
        )}

        {/* Cast vote form */}
        {(proposal.status === "voting" || proposal.status === "submitted") && (
          <div className="card-surface p-4 mb-5">
            <p className="text-xs font-medium text-navy-700 mb-2">Cast Your Vote</p>
            <textarea
              value={voteComment}
              onChange={(e) => setVoteComment(e.target.value)}
              placeholder="Optional comment..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none mb-3"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Interested
              </button>
              <button
                onClick={() => handleVote(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Not Interested
              </button>
            </div>
          </div>
        )}

        {/* Vote list */}
        <div className="space-y-2">
          {proposal.votes.map((vote) => (
            <div key={vote.id} className="card-surface px-4 py-3 flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                vote.interested ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}>
                {vote.interested ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-navy-900">{vote.voter_name}</p>
                  <span className="text-[0.6rem] text-navy-400">{vote.voter_role}</span>
                </div>
                {vote.comment && <p className="text-xs text-navy-600 mt-0.5">{vote.comment}</p>}
              </div>
              <span className="text-[0.6rem] text-navy-400 shrink-0">
                {new Date(vote.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {proposal.votes.length === 0 && (
            <p className="text-xs text-navy-400 text-center py-6">No votes yet</p>
          )}
        </div>
      </section>

      {/* ─── SECTION: SNIF ASSESSMENT ─── */}
      {(proposal.assessment || proposal.status === "sniff_assessment") && (
        <section>
          <SectionHeader icon={BarChart3} title="SNIF Assessment">
            {proposal.assessment && (
              <span className={`text-lg font-bold ${
                proposal.assessment.total_score >= 75 ? "text-emerald-600" :
                proposal.assessment.total_score >= 65 ? "text-orange-600" : "text-red-600"
              }`}>
                {proposal.assessment.total_score}%
              </span>
            )}
          </SectionHeader>

          {proposal.assessment ? (
            <div className="space-y-4">
              {/* Score result banner */}
              <div className={`rounded-lg p-3 flex items-center gap-2 ${
                proposal.assessment.total_score >= 75 ? "bg-emerald-50 border border-emerald-200" :
                proposal.assessment.total_score >= 65 ? "bg-orange-50 border border-orange-200" :
                "bg-red-50 border border-red-200"
              }`}>
                {proposal.assessment.total_score >= 75 ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span className="text-xs font-medium text-emerald-700">Score &ge; 75% — Automatic GO</span></>
                ) : proposal.assessment.total_score >= 65 ? (
                  <><AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" /><span className="text-xs font-medium text-orange-700">Score 65-75% — Under discussion</span></>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span className="text-xs font-medium text-red-700">Score &lt; 65% — Not eligible</span></>
                )}
              </div>

              <div className="card-surface p-5 space-y-3">
                <ScoreBar label="S — Strategisch (Strategic Fit)" score={proposal.assessment.strategic_fit} weight="30%" />
                <ScoreBar label="N — Noodzakelijk (Unmet Need)" score={proposal.assessment.unmet_need} weight="30%" />
                <ScoreBar label="I — Innovatief (Innovation)" score={proposal.assessment.innovative} weight="20%" />
                <ScoreBar label="F — Functioneel Haalbaar (Feasibility)" score={proposal.assessment.feasibility} weight="20%" />

                {proposal.assessment.assessor_notes && (
                  <div className="mt-4 pt-4 border-t border-navy-100">
                    <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-navy-700">{proposal.assessment.assessor_notes}</p>
                  </div>
                )}
                <p className="text-[0.6rem] text-navy-400 pt-2">
                  Assessed by {proposal.assessment.assessor_name} · {new Date(proposal.assessment.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Score thresholds legend */}
              <div className="flex items-center gap-6 text-xs text-navy-500 px-1">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &ge; 75% Auto GO</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 65-75% Discussion</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> &lt; 65% Not eligible</div>
              </div>
            </div>
          ) : (
            <div className="card-surface p-6 text-center">
              <ClipboardCheck className="w-10 h-10 mx-auto text-amber-400 mb-3" />
              <h3 className="text-sm font-bold text-navy-900 mb-1">SNIF Assessment Pending</h3>
              <p className="text-xs text-navy-500 mb-4">Complete the guided SNIF procedure to score this proposal</p>
              <Link
                href={`/proposals/${proposal.id}/snif`}
                className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-1.5"
              >
                <ClipboardCheck className="w-4 h-4" /> Start SNIF Procedure
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ─── SECTION: PROFESSOR REVIEW ─── */}
      {proposal.professor_review && (
        <section>
          <SectionHeader icon={GraduationCap} title="Professor Review — State of the Art" />

          <div className="card-surface p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">Reviewer</p>
                <p className="text-sm text-navy-800 font-medium">{proposal.professor_review.reviewer_name}</p>
                <p className="text-xs text-navy-500">{proposal.professor_review.institution}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">Novelty</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    proposal.professor_review.novelty_assessment === "highly_novel" ? "bg-emerald-100 text-emerald-700" :
                    proposal.professor_review.novelty_assessment === "moderately_novel" ? "bg-blue-100 text-blue-700" :
                    proposal.professor_review.novelty_assessment === "incremental" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {proposal.professor_review.novelty_assessment.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">Recommendation</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    proposal.professor_review.recommendation === "proceed" ? "bg-emerald-100 text-emerald-700" :
                    proposal.professor_review.recommendation === "revise" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {proposal.professor_review.recommendation}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-navy-100">
              <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">State of the Art Summary</p>
              <p className="text-sm text-navy-700 leading-relaxed">{proposal.professor_review.state_of_the_art_summary}</p>
            </div>
            {proposal.professor_review.comments && (
              <div className="pt-3 border-t border-navy-100">
                <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">Comments</p>
                <p className="text-sm text-navy-700">{proposal.professor_review.comments}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── SECTION: MATCHED PROVIDERS ─── */}
      {(proposal.status === "meetup" || proposal.status === "enrolled" || proposal.status === "innovation_board" || proposal.status === "professor_review") && (
        <section>
          <SectionHeader icon={Zap} title="Matched Providers">
            {proposal.challenge_id && (
              <Link href="/matches" className="text-xs text-accent-600 hover:text-accent-700 font-medium">
                View all matches
              </Link>
            )}
          </SectionHeader>

          {matchedCompanies.length > 0 ? (
            <div className="space-y-3">
              {matchedCompanies.map((company, i) => {
                const match = matchedEntities[i];
                return (
                  <div key={company!.id} className="card-surface p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-navy-900">{company!.name}</p>
                        {match && (
                          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700">
                            {match.score}% match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-navy-500 truncate">{company!.sector} · TRL {company!.trl_level} · {company!.capabilities.slice(0, 3).join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/companies/${company!.id}`} className="text-xs text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Profile
                      </Link>
                      {proposal.status === "meetup" && (
                        <button className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">
                          <Calendar className="w-3 h-3" /> Schedule
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card-surface p-8 text-center">
              <Users className="w-8 h-8 mx-auto text-navy-300 mb-2" />
              <p className="text-xs text-navy-500">
                {proposal.challenge_id
                  ? "No AI-matched providers yet. Run matchmaking from the Matches page to find potential providers."
                  : "Link this proposal to a challenge to see AI-matched providers."}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
