"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Shield,
  Lightbulb,
  Wrench,
  Compass,
} from "lucide-react";

interface SnifStep {
  key: "strategic_fit" | "innovative" | "feasibility" | "unmet_need";
  title: string;
  subtitle: string;
  icon: typeof Shield;
  color: string;
  weight: string;
  description: string;
  guiding_questions: string[];
}

const SNIF_STEPS: SnifStep[] = [
  {
    key: "strategic_fit",
    title: "S — Strategisch",
    subtitle: "Strategic Fit",
    icon: Compass,
    color: "text-blue-600 bg-blue-100",
    weight: "30%",
    description:
      "Does this proposal align with the strategic priorities and operational needs of the Belgian Navy? Consider the long-term vision, current capability gaps, and NATO commitments.",
    guiding_questions: [
      "Does this address a documented capability gap?",
      "Is it aligned with current defense white papers and innovation roadmaps?",
      "Does it support NATO interoperability goals?",
      "Does it align with the fleet modernization priorities?",
      "Could this strengthen our competitive position within allied forces?",
    ],
  },
  {
    key: "unmet_need",
    title: "N — Noodzakelijk",
    subtitle: "Unmet Need",
    icon: Shield,
    color: "text-amber-600 bg-amber-100",
    weight: "30%",
    description:
      "Is there a genuine unmet need for this solution? Is this problem currently unsolved, or are existing solutions inadequate? Consider whether the operational community has expressed this need.",
    guiding_questions: [
      "Has the operational community explicitly requested this capability?",
      "Are current solutions inadequate or non-existent?",
      "Is this a recurring pain point in exercises or deployments?",
      "Would this solve a problem that currently requires workarounds?",
      "Is there urgency — could inaction lead to operational risk?",
    ],
  },
  {
    key: "innovative",
    title: "I — Innovatief",
    subtitle: "Innovative",
    icon: Lightbulb,
    color: "text-purple-600 bg-purple-100",
    weight: "20%",
    description:
      "Is this proposal genuinely innovative? Does it go beyond incremental improvements? Consider the novelty of the approach, the use of emerging technologies, and the potential for breakthrough impact.",
    guiding_questions: [
      "Does this use a novel approach or technology?",
      "Is it differentiated from commercially available solutions?",
      "Does it have potential for breakthrough impact beyond incremental improvement?",
      "Could the underlying technology have dual-use or spin-off applications?",
      "Is the innovation backed by research or proven in adjacent domains?",
    ],
  },
  {
    key: "feasibility",
    title: "F — Functioneel Haalbaar",
    subtitle: "Feasibility",
    icon: Wrench,
    color: "text-emerald-600 bg-emerald-100",
    weight: "20%",
    description:
      "Is this proposal technically and operationally feasible within the given constraints? Consider the maturity of the technology, integration challenges, timelines, budget, and the team's ability to deliver.",
    guiding_questions: [
      "Is the proposed TRL realistic for the timeline?",
      "Can it integrate with existing naval systems and infrastructure?",
      "Does the team have the track record and expertise to deliver?",
      "Are the budget and resource requirements realistic?",
      "Are there regulatory, security, or certification hurdles?",
    ],
  },
];

export default function SnifProcedurePage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const proposal = store.getProposal(params.id as string);

  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({
    strategic_fit: 50,
    unmet_need: 50,
    innovative: 50,
    feasibility: 50,
  });
  const [notes, setNotes] = useState({
    strategic_fit: "",
    unmet_need: "",
    innovative: "",
    feasibility: "",
  });
  const [overallNotes, setOverallNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!proposal) {
    return (
      <div className="text-center py-20">
        <p className="text-navy-500">Proposal not found</p>
        <Link href="/proposals" className="text-accent-600 text-sm mt-2 inline-block">Back to proposals</Link>
      </div>
    );
  }

  const totalScore = Math.round(
    scores.strategic_fit * 0.3 +
    scores.unmet_need * 0.3 +
    scores.innovative * 0.2 +
    scores.feasibility * 0.2
  );

  const step = SNIF_STEPS[currentStep];
  const isLastStep = currentStep === SNIF_STEPS.length - 1;
  const isReviewStep = currentStep === SNIF_STEPS.length;

  function handleSubmit() {
    store.submitAssessment(proposal!.id, {
      strategic_fit: scores.strategic_fit,
      unmet_need: scores.unmet_need,
      feasibility: scores.feasibility,
      innovative: scores.innovative,
      assessor_name: store.userProfile.name,
      assessor_notes: overallNotes || undefined,
    });
    setSubmitted(true);
  }

  if (submitted) {
    const resultLabel = totalScore >= 75 ? "AUTO-APPROVED" : totalScore >= 65 ? "UNDER DISCUSSION" : "NOT ELIGIBLE";
    const resultColor = totalScore >= 75 ? "text-emerald-600" : totalScore >= 65 ? "text-orange-600" : "text-red-600";
    const resultBg = totalScore >= 75 ? "bg-emerald-50 border-emerald-200" : totalScore >= 65 ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";
    const ResultIcon = totalScore >= 75 ? CheckCircle2 : totalScore >= 65 ? AlertTriangle : XCircle;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-surface p-8 text-center">
          <ResultIcon className={`w-16 h-16 mx-auto mb-4 ${resultColor}`} />
          <h2 className="text-2xl font-bold text-navy-900 mb-1">SNIF Assessment Complete</h2>
          <p className={`text-4xl font-black mb-2 ${resultColor}`}>{totalScore}%</p>
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${resultBg} ${resultColor} mb-6`}>
            {resultLabel}
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {SNIF_STEPS.map((s) => (
              <div key={s.key} className="bg-navy-50 rounded-lg p-3 text-center">
                <p className="text-[0.6rem] text-navy-500 uppercase font-medium">{s.subtitle}</p>
                <p className={`text-xl font-bold ${
                  scores[s.key] >= 75 ? "text-emerald-600" : scores[s.key] >= 65 ? "text-orange-600" : "text-red-600"
                }`}>{scores[s.key]}%</p>
                <p className="text-[0.55rem] text-navy-400">{s.weight}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href={`/proposals/${proposal.id}`} className="btn-primary text-sm px-5 py-2.5">
              View Proposal
            </Link>
            <Link href="/proposals" className="btn-outline text-sm px-5 py-2.5">
              All Proposals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-navy-400 hover:text-navy-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-navy-900">SNIF Assessment Procedure</h1>
          <p className="text-sm text-navy-500">{proposal.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {SNIF_STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <div key={s.key} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full justify-center ${
                  isActive ? "bg-accent-500 text-white shadow-sm" :
                  isDone ? "bg-emerald-100 text-emerald-700" :
                  "bg-navy-50 text-navy-400"
                }`}
              >
                <StepIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{s.title.split(" — ")[0]}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 shrink-0" />}
              </button>
              {i < SNIF_STEPS.length - 1 && <div className="w-3 shrink-0" />}
            </div>
          );
        })}
        {/* Review step */}
        <div className="flex items-center">
          <button
            onClick={() => currentStep >= SNIF_STEPS.length - 1 && setCurrentStep(SNIF_STEPS.length)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isReviewStep ? "bg-accent-500 text-white shadow-sm" :
              "bg-navy-50 text-navy-400"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Submit</span>
          </button>
        </div>
      </div>

      {/* Step content */}
      {!isReviewStep && step && (
        <div className="space-y-4">
          {/* Step header */}
          <div className="card-surface p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${step.color}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-navy-900">{step.title}</h2>
                <p className="text-xs text-navy-500">{step.subtitle} · Weight: {step.weight}</p>
              </div>
            </div>
            <p className="text-sm text-navy-700 leading-relaxed">{step.description}</p>
          </div>

          {/* Proposal context */}
          <div className="card-surface p-4 bg-navy-50/50">
            <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide font-medium mb-1">Proposal Summary</p>
            <p className="text-sm text-navy-700 line-clamp-3">{proposal.description}</p>
          </div>

          {/* Guiding questions */}
          <div className="card-surface p-4">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-3">Guiding Questions</h3>
            <div className="space-y-2">
              {step.guiding_questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-500 flex items-center justify-center text-[0.6rem] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-navy-600">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Score slider */}
          <div className="card-surface p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-navy-900">Your Assessment</h3>
              <span className={`text-2xl font-black ${
                scores[step.key] >= 75 ? "text-emerald-600" : scores[step.key] >= 65 ? "text-orange-600" : "text-red-600"
              }`}>
                {scores[step.key]}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={scores[step.key]}
              onChange={(e) => setScores({ ...scores, [step.key]: Number(e.target.value) })}
              className="w-full h-3 bg-navy-100 rounded-full appearance-none cursor-pointer accent-accent-500 mb-3"
            />

            <div className="flex items-center justify-between text-[0.6rem] text-navy-400 mb-4">
              <span>0% — Not at all</span>
              <span>50% — Moderate</span>
              <span>100% — Excellent</span>
            </div>

            {/* Score zone indicator */}
            <div className="flex items-center gap-2 mb-4">
              {scores[step.key] >= 75 ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">Strong — contributes to GO zone</span>
                </div>
              ) : scores[step.key] >= 65 ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-700">Moderate — may require discussion</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-red-700">Weak — drags score below threshold</span>
                </div>
              )}
            </div>

            <textarea
              value={notes[step.key]}
              onChange={(e) => setNotes({ ...notes, [step.key]: e.target.value })}
              placeholder={`Notes on ${step.subtitle.toLowerCase()}...`}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none"
            />
          </div>

          {/* Running total */}
          <div className="card-surface p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-navy-500 font-medium">Running Total Score</p>
              <p className="text-[0.6rem] text-navy-400">
                S({scores.strategic_fit}) × 0.3 + N({scores.unmet_need}) × 0.3 + I({scores.innovative}) × 0.2 + F({scores.feasibility}) × 0.2
              </p>
            </div>
            <p className={`text-2xl font-black ${
              totalScore >= 75 ? "text-emerald-600" : totalScore >= 65 ? "text-orange-600" : "text-red-600"
            }`}>
              {totalScore}%
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-outline text-sm px-4 py-2 flex items-center gap-1.5 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5"
            >
              {isLastStep ? "Review & Submit" : "Next"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Review step */}
      {isReviewStep && (
        <div className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="text-base font-bold text-navy-900 mb-4">Review SNIF Assessment</h2>

            {/* Score summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {SNIF_STEPS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setCurrentStep(SNIF_STEPS.indexOf(s))}
                  className="bg-navy-50 rounded-lg p-3 text-center hover:bg-navy-100 transition-colors"
                >
                  <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color.split(" ")[0]}`} />
                  <p className="text-[0.6rem] text-navy-500 uppercase font-medium">{s.subtitle}</p>
                  <p className={`text-xl font-bold ${
                    scores[s.key] >= 75 ? "text-emerald-600" : scores[s.key] >= 65 ? "text-orange-600" : "text-red-600"
                  }`}>{scores[s.key]}%</p>
                  <p className="text-[0.55rem] text-navy-400">weight {s.weight}</p>
                </button>
              ))}
            </div>

            {/* Total */}
            <div className={`rounded-lg p-4 mb-6 text-center border ${
              totalScore >= 75 ? "bg-emerald-50 border-emerald-200" :
              totalScore >= 65 ? "bg-orange-50 border-orange-200" :
              "bg-red-50 border-red-200"
            }`}>
              <p className="text-xs text-navy-500 uppercase font-medium mb-1">Weighted Total Score</p>
              <p className={`text-4xl font-black ${
                totalScore >= 75 ? "text-emerald-600" : totalScore >= 65 ? "text-orange-600" : "text-red-600"
              }`}>{totalScore}%</p>
              <p className={`text-sm font-medium mt-1 ${
                totalScore >= 75 ? "text-emerald-700" : totalScore >= 65 ? "text-orange-700" : "text-red-700"
              }`}>
                {totalScore >= 75 ? "AUTO-APPROVED — Automatic GO" :
                 totalScore >= 65 ? "DISCUSSION — Board review required" :
                 "NOT ELIGIBLE — Below minimum threshold"}
              </p>
            </div>

            {/* Step notes summary */}
            {SNIF_STEPS.filter(s => notes[s.key]).length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-2">Assessment Notes</h3>
                <div className="space-y-2">
                  {SNIF_STEPS.filter(s => notes[s.key]).map((s) => (
                    <div key={s.key} className="bg-navy-50 rounded-lg p-3">
                      <p className="text-[0.65rem] text-navy-500 font-medium uppercase">{s.subtitle}</p>
                      <p className="text-sm text-navy-700">{notes[s.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-medium text-navy-700 block mb-1">Overall Assessment Notes</label>
              <textarea
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                placeholder="Summary notes for the assessment record..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(SNIF_STEPS.length - 1)}
                className="btn-outline text-sm px-4 py-2 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary text-sm px-6 py-2.5 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Submit SNIF Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
