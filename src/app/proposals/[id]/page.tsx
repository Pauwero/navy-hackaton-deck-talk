"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { ProposalStatus, SniffAssessment } from "@/types";
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
  ChevronRight,
  Send,
  BarChart3,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

const STATUS_LABELS: Record<ProposalStatus, string> = {
  submitted: "Submitted",
  voting: "Voting Phase",
  sniff_assessment: "Sniff Assessment",
  approved: "Approved",
  discussion: "Under Discussion",
  rejected: "Rejected",
  innovation_board: "Innovation Board",
  professor_review: "Professor Review",
  meetup: "Startup Meetup",
  enrolled: "Enrolled in Challenge",
};

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

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const proposal = store.getProposal(params.id as string);

  const [activeTab, setActiveTab] = useState<"overview" | "votes" | "scorecard" | "board">("overview");
  const [voteComment, setVoteComment] = useState("");
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    strategic_fit: 70,
    unmet_need: 70,
    feasibility: 70,
    innovative: 70,
    assessor_name: "Innovation Assessment Board",
    assessor_notes: "",
  });

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

  function handleVote(interested: boolean) {
    store.addVote(proposal!.id, {
      voter_name: store.userProfile.name,
      voter_role: store.userProfile.role,
      interested,
      comment: voteComment || undefined,
    });
    setVoteComment("");
  }

  function handleAssessment() {
    store.submitAssessment(proposal!.id, assessmentForm);
    setShowAssessmentForm(false);
  }

  function handleAdvanceStatus(newStatus: ProposalStatus) {
    store.updateProposalStatus(proposal!.id, newStatus);
  }

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: FileCheck },
    { key: "votes" as const, label: `Votes (${proposal.votes.length})`, icon: Vote },
    { key: "scorecard" as const, label: "Scorecard", icon: ClipboardCheck },
    { key: "board" as const, label: "Board View", icon: Presentation },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-navy-400 hover:text-navy-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-navy-900">{proposal.title}</h1>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              proposal.status === "approved" || proposal.status === "enrolled" ? "bg-emerald-100 text-emerald-700" :
              proposal.status === "rejected" ? "bg-red-100 text-red-700" :
              proposal.status === "discussion" ? "bg-orange-100 text-orange-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {STATUS_LABELS[proposal.status]}
            </span>
            {proposal.assessment && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                proposal.assessment.total_score >= 75 ? "bg-emerald-50 text-emerald-600" :
                proposal.assessment.total_score >= 65 ? "bg-orange-50 text-orange-600" :
                "bg-red-50 text-red-600"
              }`}>
                {proposal.assessment.total_score}%
              </span>
            )}
          </div>
          <p className="text-sm text-navy-500 mt-0.5">
            {proposal.submitter_org} · {proposal.domain} · Submitted {new Date(proposal.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Status advancement buttons */}
      {(proposal.status === "approved" || proposal.status === "discussion") && (
        <div className="card-surface p-4 flex items-center gap-3 border-l-4 border-accent-500">
          <BarChart3 className="w-5 h-5 text-accent-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy-900">
              {proposal.status === "approved" ? "Proposal approved! Advance to next stage?" : "Under discussion — advance when board consensus is reached."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleAdvanceStatus("innovation_board")}
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Presentation className="w-3.5 h-3.5" /> Innovation Board
            </button>
            <button
              onClick={() => handleAdvanceStatus("professor_review")}
              className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Professor Review
            </button>
          </div>
        </div>
      )}

      {proposal.status === "innovation_board" && (
        <div className="card-surface p-4 flex items-center gap-3 border-l-4 border-purple-500">
          <Presentation className="w-5 h-5 text-purple-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy-900">Ready for Innovation Board presentation</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => handleAdvanceStatus("meetup")} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" /> Schedule Meetup
            </button>
          </div>
        </div>
      )}

      {proposal.status === "professor_review" && !proposal.professor_review && (
        <div className="card-surface p-4 flex items-center gap-3 border-l-4 border-indigo-500">
          <GraduationCap className="w-5 h-5 text-indigo-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy-900">Awaiting professor state-of-the-art review</p>
          </div>
        </div>
      )}

      {proposal.status === "meetup" && (
        <div className="card-surface p-4 flex items-center gap-3 border-l-4 border-teal-500">
          <Handshake className="w-5 h-5 text-teal-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy-900">Startup meetup / validation phase</p>
            {proposal.meetup_scheduled && (
              <p className="text-xs text-navy-500 mt-0.5">Scheduled: {new Date(proposal.meetup_scheduled).toLocaleDateString()}</p>
            )}
          </div>
          <button onClick={() => handleAdvanceStatus("enrolled")} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Enroll in Challenge
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-navy-200 gap-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-accent-500 text-accent-600"
                  : "border-transparent text-navy-500 hover:text-navy-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="card-surface p-4">
              <h3 className="text-sm font-bold text-navy-900 mb-2">Description</h3>
              <p className="text-sm text-navy-700 leading-relaxed">{proposal.description}</p>
            </div>

            {proposal.challenge_id && (
              <Link href={`/challenges/${proposal.challenge_id}`} className="card-surface p-4 flex items-center gap-3 hover:border-accent-500/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 text-gold-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-navy-500">Linked Challenge</p>
                  <p className="text-sm font-medium text-navy-900">View challenge details</p>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-400" />
              </Link>
            )}

            {proposal.professor_review && (
              <div className="card-surface p-4">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-navy-900">Professor Review — State of the Art</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide">Reviewer</p>
                    <p className="text-sm text-navy-800">{proposal.professor_review.reviewer_name} — {proposal.professor_review.institution}</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide">State of the Art Summary</p>
                    <p className="text-sm text-navy-700 leading-relaxed">{proposal.professor_review.state_of_the_art_summary}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide">Novelty</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${
                        proposal.professor_review.novelty_assessment === "highly_novel" ? "bg-emerald-100 text-emerald-700" :
                        proposal.professor_review.novelty_assessment === "moderately_novel" ? "bg-blue-100 text-blue-700" :
                        proposal.professor_review.novelty_assessment === "incremental" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {proposal.professor_review.novelty_assessment.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide">Recommendation</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${
                        proposal.professor_review.recommendation === "proceed" ? "bg-emerald-100 text-emerald-700" :
                        proposal.professor_review.recommendation === "revise" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {proposal.professor_review.recommendation}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide">Comments</p>
                    <p className="text-sm text-navy-700">{proposal.professor_review.comments}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card-surface p-4">
              <h3 className="text-sm font-bold text-navy-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy-500">Internal Votes</span>
                  <span className="text-sm font-bold text-navy-900">{proposal.votes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy-500">Interest Rate</span>
                  <span className={`text-sm font-bold ${interestRatio >= 70 ? "text-emerald-600" : interestRatio >= 50 ? "text-orange-600" : "text-red-600"}`}>
                    {interestRatio}%
                  </span>
                </div>
                {proposal.assessment && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-navy-500">Sniff Score</span>
                    <span className={`text-sm font-bold ${
                      proposal.assessment.total_score >= 75 ? "text-emerald-600" :
                      proposal.assessment.total_score >= 65 ? "text-orange-600" : "text-red-600"
                    }`}>
                      {proposal.assessment.total_score}%
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy-500">Domain</span>
                  <span className="text-sm text-navy-900">{proposal.domain}</span>
                </div>
              </div>
            </div>

            {/* Score thresholds legend */}
            <div className="card-surface p-4">
              <h3 className="text-sm font-bold text-navy-900 mb-3">Score Thresholds</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-navy-600">&ge; 75% — Auto-approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-navy-600">65-75% — Under discussion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-navy-600">&lt; 65% — Not eligible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "votes" && (
        <div className="space-y-4">
          {/* Cast vote */}
          {(proposal.status === "voting" || proposal.status === "submitted") && (
            <div className="card-surface p-4">
              <h3 className="text-sm font-bold text-navy-900 mb-3">Cast Your Vote</h3>
              <div className="space-y-3">
                <textarea
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder="Optional comment..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none"
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
            </div>
          )}

          {/* Vote summary */}
          <div className="card-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy-900">Vote Summary</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-600 font-medium">{interestedCount} interested</span>
                <span className="text-red-600 font-medium">{notInterestedCount} not interested</span>
              </div>
            </div>
            {proposal.votes.length > 0 && (
              <div className="w-full h-3 bg-navy-100 rounded-full overflow-hidden flex mb-4">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${interestRatio}%` }} />
                <div className="h-full bg-red-400 transition-all" style={{ width: `${100 - interestRatio}%` }} />
              </div>
            )}

            <div className="space-y-3">
              {proposal.votes.map((vote) => (
                <div key={vote.id} className="flex items-start gap-3 py-2 border-b border-navy-100 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    vote.interested ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {vote.interested ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
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
            </div>
          </div>

          {/* Advance to sniff assessment */}
          {proposal.status === "voting" && proposal.votes.length >= 2 && (
            <button
              onClick={() => handleAdvanceStatus("sniff_assessment")}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <ClipboardCheck className="w-3.5 h-3.5" /> Proceed to Sniff Assessment
            </button>
          )}
        </div>
      )}

      {activeTab === "scorecard" && (
        <div className="space-y-4">
          {proposal.assessment ? (
            <div className="card-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy-900">Sniff Assessment Scorecard</h3>
                <div className={`text-lg font-bold ${
                  proposal.assessment.total_score >= 75 ? "text-emerald-600" :
                  proposal.assessment.total_score >= 65 ? "text-orange-600" : "text-red-600"
                }`}>
                  {proposal.assessment.total_score}%
                </div>
              </div>

              {/* Score result banner */}
              <div className={`rounded-lg p-3 mb-4 flex items-center gap-2 ${
                proposal.assessment.total_score >= 75 ? "bg-emerald-50 border border-emerald-200" :
                proposal.assessment.total_score >= 65 ? "bg-orange-50 border border-orange-200" :
                "bg-red-50 border border-red-200"
              }`}>
                {proposal.assessment.total_score >= 75 ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span className="text-xs font-medium text-emerald-700">Score &ge; 75% — Automatic GO. Proposal approved for next stage.</span></>
                ) : proposal.assessment.total_score >= 65 ? (
                  <><AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" /><span className="text-xs font-medium text-orange-700">Score 65-75% — Under discussion. Board review required.</span></>
                ) : (
                  <><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span className="text-xs font-medium text-red-700">Score &lt; 65% — Not eligible. Does not meet minimum threshold.</span></>
                )}
              </div>

              <div className="space-y-3">
                <ScoreBar label="Strategic Fit" score={proposal.assessment.strategic_fit} weight="30%" />
                <ScoreBar label="Unmet Need" score={proposal.assessment.unmet_need} weight="30%" />
                <ScoreBar label="Feasibility" score={proposal.assessment.feasibility} weight="20%" />
                <ScoreBar label="Innovative" score={proposal.assessment.innovative} weight="20%" />
              </div>

              {proposal.assessment.assessor_notes && (
                <div className="mt-4 pt-4 border-t border-navy-100">
                  <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide mb-1">Assessor Notes</p>
                  <p className="text-sm text-navy-700">{proposal.assessment.assessor_notes}</p>
                </div>
              )}

              <p className="text-[0.6rem] text-navy-400 mt-3">
                Assessed by {proposal.assessment.assessor_name} on {new Date(proposal.assessment.created_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <>
              {!showAssessmentForm ? (
                <div className="card-surface p-6 text-center">
                  <ClipboardCheck className="w-8 h-8 mx-auto text-navy-300 mb-2" />
                  <p className="text-sm text-navy-500 mb-3">No assessment yet</p>
                  {(proposal.status === "sniff_assessment" || proposal.status === "voting") && (
                    <button
                      onClick={() => setShowAssessmentForm(true)}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      Start Sniff Assessment
                    </button>
                  )}
                </div>
              ) : (
                <div className="card-surface p-5">
                  <h3 className="text-sm font-bold text-navy-900 mb-4">Sniff Assessment</h3>
                  <div className="space-y-4">
                    {[
                      { key: "strategic_fit" as const, label: "Strategic Fit", desc: "Alignment with naval strategy and priorities" },
                      { key: "unmet_need" as const, label: "Unmet Need", desc: "Addresses a genuine capability gap" },
                      { key: "feasibility" as const, label: "Feasibility", desc: "Technically and operationally achievable" },
                      { key: "innovative" as const, label: "Innovative", desc: "Novel approach beyond existing solutions" },
                    ].map(({ key, label, desc }) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-xs font-medium text-navy-700">{label}</span>
                            <p className="text-[0.6rem] text-navy-400">{desc}</p>
                          </div>
                          <span className="text-sm font-bold text-navy-900">{assessmentForm[key]}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={assessmentForm[key]}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, [key]: Number(e.target.value) })}
                          className="w-full h-2 bg-navy-100 rounded-full appearance-none cursor-pointer accent-accent-500"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="text-xs font-medium text-navy-700">Notes</label>
                      <textarea
                        value={assessmentForm.assessor_notes}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, assessor_notes: e.target.value })}
                        placeholder="Assessment notes..."
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Live preview of score */}
                    <div className="bg-navy-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-navy-500 mb-1">Preview Score</p>
                      <p className={`text-xl font-bold ${
                        (() => {
                          const s = Math.round(assessmentForm.strategic_fit * 0.3 + assessmentForm.unmet_need * 0.3 + assessmentForm.feasibility * 0.2 + assessmentForm.innovative * 0.2);
                          return s >= 75 ? "text-emerald-600" : s >= 65 ? "text-orange-600" : "text-red-600";
                        })()
                      }`}>
                        {Math.round(assessmentForm.strategic_fit * 0.3 + assessmentForm.unmet_need * 0.3 + assessmentForm.feasibility * 0.2 + assessmentForm.innovative * 0.2)}%
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={handleAssessment} className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Submit Assessment
                      </button>
                      <button onClick={() => setShowAssessmentForm(false)} className="btn-outline text-xs px-4 py-2">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "board" && (
        <div className="space-y-4">
          {/* Innovation Board Slide-style presentation */}
          <div className="card-surface overflow-hidden">
            {/* Slide header */}
            <div className="bg-navy-900 text-white px-8 py-6">
              <div className="flex items-center gap-2 mb-1">
                <Presentation className="w-5 h-5 text-gold-400" />
                <span className="text-[0.65rem] text-gold-400 uppercase tracking-widest font-medium">Innovation Board — Proposal Review</span>
              </div>
              <h2 className="text-xl font-bold mt-2">{proposal.title}</h2>
              <p className="text-sm text-navy-300 mt-1">{proposal.submitter_org} · {proposal.domain}</p>
            </div>

            {/* Slide body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">Problem & Solution</h3>
                <p className="text-sm text-navy-700 leading-relaxed">{proposal.description}</p>
              </div>

              <div className="space-y-4">
                {proposal.assessment && (
                  <div>
                    <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">Sniff Assessment</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Strategic Fit", score: proposal.assessment.strategic_fit },
                        { label: "Unmet Need", score: proposal.assessment.unmet_need },
                        { label: "Feasibility", score: proposal.assessment.feasibility },
                        { label: "Innovative", score: proposal.assessment.innovative },
                      ].map((item) => (
                        <div key={item.label} className="bg-navy-50 rounded-lg p-3 text-center">
                          <p className="text-[0.6rem] text-navy-500 uppercase">{item.label}</p>
                          <p className={`text-lg font-bold ${
                            item.score >= 75 ? "text-emerald-600" : item.score >= 65 ? "text-orange-600" : "text-red-600"
                          }`}>{item.score}%</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 bg-navy-50 rounded-lg p-3 text-center">
                      <p className="text-[0.6rem] text-navy-500 uppercase">Total Score</p>
                      <p className={`text-2xl font-bold ${
                        proposal.assessment.total_score >= 75 ? "text-emerald-600" :
                        proposal.assessment.total_score >= 65 ? "text-orange-600" : "text-red-600"
                      }`}>{proposal.assessment.total_score}%</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">Internal Vote</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{interestedCount}</p>
                      <p className="text-[0.6rem] text-navy-500 uppercase">Interested</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">{notInterestedCount}</p>
                      <p className="text-[0.6rem] text-navy-500 uppercase">Not Interested</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-navy-900">{interestRatio}%</p>
                      <p className="text-[0.6rem] text-navy-500 uppercase">Interest Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professor review in board view */}
            {proposal.professor_review && (
              <div className="px-8 pb-8">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">State-of-the-Art Review</h3>
                  </div>
                  <p className="text-sm text-indigo-800 leading-relaxed">{proposal.professor_review.state_of_the_art_summary}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-indigo-600 font-medium">
                      Novelty: {proposal.professor_review.novelty_assessment.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-indigo-600 font-medium">
                      Recommendation: {proposal.professor_review.recommendation}
                    </span>
                    <span className="text-xs text-indigo-500">
                      — {proposal.professor_review.reviewer_name}, {proposal.professor_review.institution}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Slide footer */}
            <div className="bg-navy-50 px-8 py-3 flex items-center justify-between border-t border-navy-200">
              <span className="text-[0.6rem] text-navy-400 uppercase tracking-wide">Naval Innovation Hub — Confidential</span>
              <span className="text-[0.6rem] text-navy-400">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
