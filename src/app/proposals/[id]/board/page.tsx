"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  ArrowLeft,
  Presentation,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function BoardViewPage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const proposal = store.getProposal(params.id as string);

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

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-navy-400 hover:text-navy-600 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Proposal
      </button>

      {/* Innovation Board Slide */}
      <div className="card-surface overflow-hidden shadow-lg">
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
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">SNIF Assessment</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "S — Strategisch", score: proposal.assessment.strategic_fit },
                    { label: "N — Noodzakelijk", score: proposal.assessment.unmet_need },
                    { label: "I — Innovatief", score: proposal.assessment.innovative },
                    { label: "F — Functioneel", score: proposal.assessment.feasibility },
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

                {/* Result banner */}
                <div className={`mt-3 rounded-lg p-2.5 flex items-center gap-2 ${
                  proposal.assessment.total_score >= 75 ? "bg-emerald-50 border border-emerald-200" :
                  proposal.assessment.total_score >= 65 ? "bg-orange-50 border border-orange-200" :
                  "bg-red-50 border border-red-200"
                }`}>
                  {proposal.assessment.total_score >= 75 ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span className="text-xs font-medium text-emerald-700">GO — Approved</span></>
                  ) : proposal.assessment.total_score >= 65 ? (
                    <><AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" /><span className="text-xs font-medium text-orange-700">Discussion Required</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-red-600 shrink-0" /><span className="text-xs font-medium text-red-700">NO-GO</span></>
                  )}
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

        {/* Professor review */}
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
          <span className="text-[0.6rem] text-navy-400 uppercase tracking-wide">Inno4Def 2.0 — Confidential</span>
          <span className="text-[0.6rem] text-navy-400">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
