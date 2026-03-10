"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Shield,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Send,
  User,
  Target,
  ThumbsUp,
  Edit3,
  X,
} from "lucide-react";
import {
  validateChallengeProfile,
  generateChallengeValidationSummary,
  generateChallengeQuestions,
  challengeToNavyChallenge,
  OPERATIONAL_DOMAINS,
  GAP_TYPES,
  TIMELINE_OPTIONS,
  PRIORITY_OPTIONS,
  createEmptyChallengeProfile,
  type ChallengeProfile,
  type ChallengeQuestion,
} from "@/lib/challenge-agent";
import { useStore } from "@/lib/store";
import type { NavyChallenge, Proposal, QualityGateResult } from "@/types";

interface ReviewMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  type: "text" | "question" | "validation" | "approval";
  timestamp: string;
}

export default function ChallengeReviewPage() {
  const router = useRouter();
  const store = useStore();
  const [profile, setProfile] = useState<ChallengeProfile>(createEmptyChallengeProfile());
  const [validation, setValidation] = useState<QualityGateResult | null>(null);
  const [messages, setMessages] = useState<ReviewMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingQuestions, setPendingQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [phase, setPhase] = useState<"analyzing" | "questions" | "editing" | "approved">("analyzing");
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => {
    const stored = sessionStorage.getItem("challenge_profile");
    const method = sessionStorage.getItem("challenge_method") || "form";
    if (stored) {
      try {
        const p = JSON.parse(stored) as ChallengeProfile;
        setProfile(p);
        startReview(p, method);
      } catch {
        addMsg("agent", "Could not load challenge data. Please go back and resubmit.", "text");
      }
    } else {
      addMsg("agent", "No challenge data found. Please start the creation process first.", "text");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addMsg(role: "agent" | "user", content: string, type: ReviewMessage["type"]) {
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role, content, type, timestamp: new Date().toISOString(),
    }]);
  }

  function startReview(p: ChallengeProfile, method: string) {
    addMsg("agent", `Reviewing your challenge submitted via **${method}**. Let me validate against operational standards...`, "text");

    setTimeout(() => {
      const result = validateChallengeProfile(p);
      setValidation(result);
      const summary = generateChallengeValidationSummary(result);
      addMsg("agent", summary, "validation");

      if (result.passed && result.score >= 85) {
        setPhase("approved");
        setTimeout(() => {
          addMsg("agent", "Your challenge meets all requirements and is ready to be published. Review below and publish when ready.", "approval");
        }, 400);
      } else {
        const questions = generateChallengeQuestions(p);
        if (questions.length > 0) {
          setPendingQuestions(questions);
          setCurrentQuestionIdx(0);
          setPhase("questions");
          setTimeout(() => {
            const errors = result.issues.filter((i) => i.severity === "error");
            if (errors.length > 0) {
              addMsg("agent", `Let me help address the **${errors.length} critical issue(s)**.`, "text");
            }
            addMsg("agent", questions[0].question, "question");
          }, 600);
        } else {
          setPhase("editing");
          addMsg("agent", "Edit fields directly in the sidebar, or type corrections here.", "text");
        }
      }
    }, 800);
  }

  function handleAnswer(answer: string) {
    if (currentQuestionIdx >= pendingQuestions.length) return;
    const question = pendingQuestions[currentQuestionIdx];
    addMsg("user", answer, "text");

    const updated = { ...profile };
    if (["tags", "affected_platforms"].includes(question.field)) {
      const items = answer.split(",").map((s) => s.trim()).filter(Boolean);
      (updated as Record<string, unknown>)[question.field] = items;
    } else if (question.field === "requirements") {
      const reqs = answer.split("\n").map((s) => s.trim()).filter((s) => s.length > 5);
      updated.requirements = [...updated.requirements, ...reqs];
    } else if (question.field === "domain") {
      updated.domain = answer.split(" ")[0].replace("—", "").trim();
    } else if (question.field === "gap_type") {
      updated.gap_type = answer.split(" ")[0].replace("—", "").trim();
    } else {
      (updated as Record<string, unknown>)[question.field] = answer;
    }
    setProfile(updated);

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < pendingQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        addMsg("agent", "Noted.", "text");
        addMsg("agent", pendingQuestions[nextIdx].question, "question");
      }, 300);
    } else {
      setTimeout(() => {
        const result = validateChallengeProfile(updated);
        setValidation(result);
        addMsg("agent", generateChallengeValidationSummary(result), "validation");
        if (result.passed) {
          setPhase("approved");
          setTimeout(() => addMsg("agent", "Challenge is ready! Review and click **Publish** when satisfied.", "approval"), 400);
        } else {
          setPhase("editing");
          addMsg("agent", "Some gaps remain. Edit fields in the sidebar or type corrections.", "text");
        }
      }, 400);
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    if (phase === "questions") handleAnswer(text);
    else if (phase === "editing") {
      addMsg("user", text, "text");
      const updated = { ...profile };
      const result = validateChallengeProfile(updated);
      const firstError = result.issues.find((i) => i.severity === "error");
      if (firstError) (updated as Record<string, unknown>)[firstError.field] = text;
      setProfile(updated);
      setTimeout(() => {
        const r = validateChallengeProfile(updated);
        setValidation(r);
        if (r.passed) { setPhase("approved"); addMsg("agent", "Updated and validated! Ready to publish.", "approval"); }
        else addMsg("agent", `Score: **${r.score}/100**. Keep editing.`, "validation");
      }, 300);
    }
  }

  function handleInlineEdit(field: string, value: string) {
    setEditField(null);
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    const result = validateChallengeProfile(updated);
    setValidation(result);
    if (result.passed && phase !== "approved") {
      setPhase("approved");
      addMsg("agent", "Field updated — challenge now passes validation!", "approval");
    }
  }

  function handlePublish() {
    const result = validateChallengeProfile(profile);
    if (!result.passed && result.score < 60) {
      addMsg("agent", "Score is too low. Please address critical issues first.", "text");
      return;
    }

    const challengeData = challengeToNavyChallenge(profile);
    const challenge: NavyChallenge = {
      ...challengeData,
      id: "ch-" + Math.random().toString(36).substring(2, 8),
      quality_score: result.score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.addChallenge(challenge);
    store.runMatchmaking();

    // Auto-create a proposal in the pipeline for the new challenge
    const proposal: Proposal = {
      id: "prop-" + Math.random().toString(36).substring(2, 8),
      title: challenge.title,
      submitter_name: "Commander K. Peeters",
      submitter_org: "Belgian Navy",
      description: challenge.description || challenge.operational_context || "Challenge submitted via AI-assisted flow",
      domain: challenge.domain,
      challenge_id: challenge.id,
      status: "submitted",
      votes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.addProposal(proposal);

    addMsg("agent", `Challenge **"${challenge.title}"** published! AI is now matching it with companies and research. A proposal has been created in the **Proposal Pipeline**.`, "approval");
    setTimeout(() => router.push(`/challenges/${challenge.id}`), 1500);
  }

  const currentQuestion = phase === "questions" && currentQuestionIdx < pendingQuestions.length
    ? pendingQuestions[currentQuestionIdx] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/create-challenge" className="flex items-center gap-1 text-navy-400 hover:text-orange-500 text-sm mb-3 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Chat */}
        <div className="md:col-span-3">
          <div className="card flex flex-col" style={{ height: "calc(100vh - 14rem)" }}>
            <div className="flex items-center gap-3 p-4 border-b border-navy-100">
              <div className="w-10 h-10 rounded-full avatar-orange flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-navy-900">Challenge Review</h1>
                <p className="text-xs text-navy-400">
                  {phase === "analyzing" && "Analyzing..."}
                  {phase === "questions" && "Clarifying questions..."}
                  {phase === "editing" && "Edit mode"}
                  {phase === "approved" && "Approved!"}
                </p>
              </div>
              {validation && (
                <div className="ml-auto">
                  <span className={`text-lg font-bold ${
                    validation.score >= 85 ? "text-success-500" : validation.score >= 60 ? "text-warning-500" : "text-danger-500"
                  }`}>{validation.score}/100</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "agent" ? "avatar-orange" : "avatar-blue"
                  }`}>
                    {msg.role === "agent" ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                    <div className={`inline-block text-sm rounded-2xl px-3.5 py-2 ${
                      msg.role === "user" ? "bg-accent-500 text-white rounded-br-md"
                        : msg.type === "validation" ? "bg-navy-50 text-navy-700 border border-navy-200 rounded-bl-md"
                        : msg.type === "approval" ? "bg-success-500/10 text-navy-700 border border-success-500/20 rounded-bl-md"
                        : msg.type === "question" ? "bg-orange-50 text-navy-700 border border-orange-200 rounded-bl-md"
                        : "bg-white text-navy-700 border border-navy-100 rounded-bl-md shadow-sm"
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{
                        __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")
                      }} />
                    </div>
                  </div>
                </div>
              ))}

              {currentQuestion && currentQuestion.options && (
                <div className="pl-10">
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.options.map((opt) => {
                      const field = currentQuestion.field as keyof ChallengeProfile;
                      const val = profile[field];
                      const isSelected = Array.isArray(val) ? val.includes(opt) : val === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (currentQuestion.type === "multi-select") {
                              const updated = { ...profile };
                              const arr = (updated[field] as string[]) || [];
                              (updated as Record<string, unknown>)[field] = isSelected ? arr.filter((s) => s !== opt) : [...arr, opt];
                              setProfile(updated);
                            } else { handleAnswer(opt); }
                          }}
                          className={`tag-pill text-xs transition-all ${
                            isSelected ? "bg-orange-500 text-white border-orange-500" : "bg-white text-navy-600 border-navy-200 hover:border-orange-400"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}{opt}
                        </button>
                      );
                    })}
                  </div>
                  {currentQuestion.type === "multi-select" && (
                    <button
                      onClick={() => {
                        const arr = (profile[currentQuestion.field as keyof ChallengeProfile] as string[]) || [];
                        if (arr.length > 0) handleAnswer(arr.join(", "));
                      }}
                      className="mt-2 text-xs font-medium text-orange-500"
                    >
                      Confirm selection →
                    </button>
                  )}
                </div>
              )}

              {phase === "approved" && (
                <div className="flex justify-center pt-3">
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 bg-success-500 hover:bg-success-400 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    <ThumbsUp className="w-4 h-4" /> Publish Challenge
                  </button>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-navy-100">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-navy-50 border border-navy-200 rounded-full px-4 py-2 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={phase === "questions" ? "Type your answer..." : phase === "editing" ? "Type corrections..." : phase === "approved" ? "Approved — publish when ready" : "Analyzing..."}
                  disabled={phase === "analyzing" || phase === "approved"}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || phase === "analyzing" || phase === "approved"}
                  className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-2">
          <div className="card p-4 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-bold text-navy-900">Challenge Summary</h2>
              {validation && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                  validation.score >= 85 ? "bg-success-500/10 text-success-500" : validation.score >= 60 ? "bg-warning-500/10 text-warning-500" : "bg-danger-500/10 text-danger-500"
                }`}>{validation.score}%</span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <EditableField label="Title" value={profile.title} field="title" editField={editField} editValue={editValue} setEditField={setEditField} setEditValue={setEditValue} onSave={handleInlineEdit} validation={validation} />

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">Domain</span>
                <span className="text-navy-700 font-medium">{OPERATIONAL_DOMAINS.find((d) => d.code === profile.domain)?.label || "—"}</span>
              </div>

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">Gap Type</span>
                <span className="text-navy-700 font-medium">{GAP_TYPES.find((g) => g.code === profile.gap_type)?.label || "—"}</span>
              </div>

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">Priority</span>
                <span className={`font-medium capitalize ${
                  profile.priority === "critical" ? "text-danger-500" : profile.priority === "high" ? "text-warning-500" : "text-navy-700"
                }`}>{profile.priority}</span>
              </div>

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">Timeline</span>
                <span className="text-navy-700 font-medium">{TIMELINE_OPTIONS.find((t) => t.value === profile.timeline)?.label || "—"}</span>
              </div>

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">Desired TRL</span>
                <span className="text-navy-700 font-medium">{profile.desired_trl}</span>
              </div>

              <div className="border-t border-navy-100 pt-2">
                <span className="text-navy-400">Requirements ({profile.requirements.length})</span>
                {profile.requirements.length > 0 ? (
                  <div className="space-y-1 mt-1">
                    {profile.requirements.slice(0, 4).map((r, i) => (
                      <div key={i} className="text-[10px] text-navy-600 bg-navy-50 rounded-lg px-2 py-1">
                        <span className="font-bold text-orange-500">R{i + 1}</span> {r.length > 60 ? r.slice(0, 60) + "..." : r}
                      </div>
                    ))}
                    {profile.requirements.length > 4 && <span className="text-navy-400 text-[10px]">+{profile.requirements.length - 4} more</span>}
                  </div>
                ) : <span className="text-danger-500 block mt-1">Min 3 required</span>}
              </div>

              <div className="border-t border-navy-100 pt-2">
                <span className="text-navy-400">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.tags.length > 0 ? profile.tags.map((t) => (
                    <span key={t} className="tag-pill bg-orange-50 text-orange-600 border-orange-200 text-[10px]">{t}</span>
                  )) : <span className="text-danger-500">Min 2 required</span>}
                </div>
              </div>

              {profile.affected_platforms.length > 0 && (
                <div className="border-t border-navy-100 pt-2">
                  <span className="text-navy-400">Platforms</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.affected_platforms.map((p) => (
                      <span key={p} className="tag-pill bg-navy-50 text-navy-600 border-navy-200 text-[10px]">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {validation && validation.issues.length > 0 && (
                <div className="border-t border-navy-100 pt-2">
                  <span className="text-navy-400 block mb-1.5">Issues</span>
                  <div className="space-y-1">
                    {validation.issues.slice(0, 5).map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        {issue.severity === "error" ? <AlertCircle className="w-3 h-3 text-danger-500 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3 h-3 text-warning-500 mt-0.5 shrink-0" />}
                        <span className="text-[10px] text-navy-500">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, field, editField, editValue, setEditField, setEditValue, onSave, validation }: {
  label: string; value: string; field: string; editField: string | null; editValue: string;
  setEditField: (f: string | null) => void; setEditValue: (v: string) => void;
  onSave: (field: string, value: string) => void; validation: QualityGateResult | null;
}) {
  const hasError = validation?.issues.some((i) => i.field === field && i.severity === "error");
  if (editField === field) {
    return (
      <div className="border-t border-navy-100 pt-2">
        <span className="text-navy-400">{label}</span>
        <div className="flex items-center gap-1 mt-1">
          <input autoFocus className="flex-1 bg-white border border-orange-500 rounded-lg px-2 py-1 text-xs text-navy-700 focus:outline-none"
            value={editValue} onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSave(field, editValue); if (e.key === "Escape") setEditField(null); }} />
          <button onClick={() => onSave(field, editValue)} className="text-success-500"><CheckCircle2 className="w-4 h-4" /></button>
          <button onClick={() => setEditField(null)} className="text-navy-400"><X className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }
  return (
    <div className="border-t border-navy-100 pt-2 flex justify-between items-start group">
      <div>
        <span className="text-navy-400">{label}</span>
        <div className={`font-medium mt-0.5 ${hasError ? "text-danger-500" : "text-navy-700"}`}>{value || (hasError ? "Required" : "—")}</div>
      </div>
      <button onClick={() => { setEditField(field); setEditValue(value); }} className="opacity-0 group-hover:opacity-100 text-navy-300 hover:text-orange-500 transition-all">
        <Edit3 className="w-3 h-3" />
      </button>
    </div>
  );
}
