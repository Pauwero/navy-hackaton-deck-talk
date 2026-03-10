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
  Sparkles,
  Send,
  User,
  Building2,
  ChevronRight,
  Edit3,
  ThumbsUp,
  X,
} from "lucide-react";
import {
  validateOnboardingProfile,
  generateValidationSummary,
  generateClarifyingQuestions,
  onboardingToCompanyProfile,
  DEFENSE_DOMAINS,
  ALL_CAPABILITIES,
  TRL_DESCRIPTIONS,
  type OnboardingProfile,
  type AgentMessage,
  type AgentQuestion,
  createEmptyOnboardingProfile,
} from "@/lib/onboarding-agent";
import { useStore } from "@/lib/store";
import type { CompanyProfile, QualityGateResult } from "@/types";

export default function OnboardingReviewPage() {
  const router = useRouter();
  const store = useStore();
  const [profile, setProfile] = useState<OnboardingProfile>(createEmptyOnboardingProfile());
  const [validation, setValidation] = useState<QualityGateResult | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingQuestions, setPendingQuestions] = useState<AgentQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [phase, setPhase] = useState<"analyzing" | "questions" | "editing" | "approved">("analyzing");
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [inputMethod, setInputMethod] = useState<string>("form");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  // Load profile from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem("onboarding_profile");
    const method = sessionStorage.getItem("onboarding_method") || "form";
    setInputMethod(method);

    if (stored) {
      try {
        const p = JSON.parse(stored) as OnboardingProfile;
        setProfile(p);
        startReview(p);
      } catch {
        addAgentMessage("Could not load your profile data. Please go back and resubmit.", "text");
      }
    } else {
      addAgentMessage("No profile data found. Please start the onboarding process first.", "text");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addAgentMessage(content: string, type: AgentMessage["type"]) {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "agent",
        content,
        type,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  function addUserMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "user",
        content,
        type: "text",
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  function startReview(p: OnboardingProfile) {
    // Initial analysis
    addAgentMessage(
      `I'm reviewing your company profile submitted via **${inputMethod}**. Let me validate it against our defense data standards...`,
      "text"
    );

    setTimeout(() => {
      const result = validateOnboardingProfile(p);
      setValidation(result);

      const summary = generateValidationSummary(result, p);
      addAgentMessage(summary, "validation");

      if (result.passed && result.score >= 85) {
        setPhase("approved");
        setTimeout(() => {
          addAgentMessage(
            "Your profile meets all requirements and is ready to be published on the platform. You can review the details below and submit when ready.",
            "approval"
          );
        }, 400);
      } else {
        // Generate targeted questions
        const questions = generateClarifyingQuestions(p);
        const issues = result.issues.filter((i) => i.severity === "error");

        if (questions.length > 0 || issues.length > 0) {
          setPendingQuestions(questions);
          setCurrentQuestionIdx(0);
          setPhase("questions");

          setTimeout(() => {
            if (issues.length > 0) {
              addAgentMessage(
                `Let me help you address the ${issues.length} critical issue(s). I'll guide you through each one.`,
                "text"
              );
            }
            if (questions.length > 0) {
              addAgentMessage(questions[0].question, "question");
            } else {
              setPhase("editing");
              addAgentMessage(
                "You can edit any field directly by clicking on it in the profile summary below. When you're satisfied, click **Approve & Publish**.",
                "text"
              );
            }
          }, 600);
        } else {
          setPhase("approved");
          addAgentMessage("Your profile is ready. Click below to publish.", "approval");
        }
      }
    }, 800);
  }

  function handleQuestionAnswer(answer: string) {
    if (currentQuestionIdx >= pendingQuestions.length) return;

    const question = pendingQuestions[currentQuestionIdx];
    addUserMessage(answer);

    // Apply answer
    const updated = { ...profile };
    if (["defense_domains", "capabilities", "partnership_interest", "certifications"].includes(question.field)) {
      const items = answer.split(",").map((s) => s.trim()).filter(Boolean);
      if (question.field === "defense_domains") {
        updated.defense_domains = items.map((s) => s.split(" ")[0]);
      } else {
        (updated as Record<string, unknown>)[question.field] = items;
      }
    } else {
      (updated as Record<string, unknown>)[question.field] = answer;
    }
    setProfile(updated);

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < pendingQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        addAgentMessage("Noted, thanks!", "text");
        addAgentMessage(pendingQuestions[nextIdx].question, "question");
      }, 300);
    } else {
      // Re-validate
      setTimeout(() => {
        const result = validateOnboardingProfile(updated);
        setValidation(result);
        const summary = generateValidationSummary(result, updated);
        addAgentMessage(summary, "validation");

        if (result.passed) {
          setPhase("approved");
          setTimeout(() => {
            addAgentMessage(
              "Your profile is now ready to be published! Review the summary below and click **Approve & Publish** when ready.",
              "approval"
            );
          }, 400);
        } else {
          setPhase("editing");
          addAgentMessage(
            "Your profile still has some gaps. You can edit fields directly in the summary below, or type corrections here.",
            "text"
          );
        }
      }, 400);
    }
  }

  function handleSendMessage() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    if (phase === "questions") {
      handleQuestionAnswer(text);
    } else if (phase === "editing") {
      addUserMessage(text);
      // Try to intelligently apply the edit
      addAgentMessage("Let me apply that to your profile...", "text");
      // Simple pattern matching for field updates
      const updated = { ...profile };
      const lower = text.toLowerCase();

      if (lower.includes("description")) {
        const descMatch = text.match(/description[:\s]+(.+)/i);
        if (descMatch) updated.description = descMatch[1].trim();
      } else if (lower.includes("email")) {
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) updated.contact_email = emailMatch[0];
      } else if (lower.includes("name")) {
        const nameMatch = text.match(/name[:\s]+(.+)/i);
        if (nameMatch) updated.name = nameMatch[1].trim();
      } else {
        // Try to use the whole text as the most-needed field
        const result = validateOnboardingProfile(updated);
        const firstError = result.issues.find((i) => i.severity === "error");
        if (firstError) {
          (updated as Record<string, unknown>)[firstError.field] = text;
        }
      }

      setProfile(updated);
      setTimeout(() => {
        const result = validateOnboardingProfile(updated);
        setValidation(result);
        if (result.passed) {
          setPhase("approved");
          addAgentMessage("Profile updated and now passes all checks! Ready to publish.", "approval");
        } else {
          addAgentMessage(`Updated. Current score: **${result.score}/100**. Keep editing fields below or type more corrections.`, "validation");
        }
      }, 300);
    }
  }

  function handleInlineEdit(field: string, value: string) {
    setEditField(null);
    const updated = { ...profile, [field]: value };
    setProfile(updated);

    const result = validateOnboardingProfile(updated);
    setValidation(result);

    if (result.passed && phase !== "approved") {
      setPhase("approved");
      addAgentMessage("Profile updated and now passes validation! Ready to publish.", "approval");
    }
  }

  function handlePublish() {
    const result = validateOnboardingProfile(profile);
    if (!result.passed && result.score < 60) {
      addAgentMessage("Profile score is too low to publish. Please address the critical issues first.", "text");
      return;
    }

    const companyData = onboardingToCompanyProfile(profile);
    const company: CompanyProfile = {
      ...companyData,
      id: "comp-" + Math.random().toString(36).substring(2, 8),
      quality_score: result.score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.addCompany(company);
    store.runMatchmaking();

    addAgentMessage(
      `Your company **"${company.name}"** has been published on the Inno4Def 2.0! AI matchmaking is now running to find relevant challenges and collaborators.`,
      "approval"
    );

    setTimeout(() => {
      router.push(`/companies/${company.id}`);
    }, 1500);
  }

  const currentQuestion = phase === "questions" && currentQuestionIdx < pendingQuestions.length
    ? pendingQuestions[currentQuestionIdx]
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/onboarding" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-3 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Onboarding
      </Link>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Chat column */}
        <div className="md:col-span-3">
          <div className="card flex flex-col" style={{ height: "calc(100vh - 14rem)" }}>
            <div className="flex items-center gap-3 p-4 border-b border-navy-100">
              <div className="w-10 h-10 rounded-full avatar-green flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-navy-900">Agent Review Session</h1>
                <p className="text-xs text-navy-400">
                  {phase === "analyzing" && "Analyzing your profile..."}
                  {phase === "questions" && "Asking clarifying questions..."}
                  {phase === "editing" && "Profile editing mode"}
                  {phase === "approved" && "Profile approved!"}
                </p>
              </div>
              {validation && (
                <div className="ml-auto">
                  <div className={`text-lg font-bold ${
                    validation.score >= 85 ? "text-success-500" :
                    validation.score >= 60 ? "text-warning-500" :
                    "text-danger-500"
                  }`}>
                    {validation.score}/100
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "agent" ? "avatar-green" : "avatar-blue"
                  }`}>
                    {msg.role === "agent" ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                    <div className={`inline-block text-sm rounded-2xl px-3.5 py-2 ${
                      msg.role === "user"
                        ? "bg-accent-500 text-white rounded-br-md"
                        : msg.type === "validation"
                          ? "bg-navy-50 text-navy-700 border border-navy-200 rounded-bl-md"
                          : msg.type === "approval"
                            ? "bg-success-500/10 text-navy-700 border border-success-500/20 rounded-bl-md"
                            : msg.type === "question"
                              ? "bg-accent-500/5 text-navy-700 border border-accent-500/20 rounded-bl-md"
                              : "bg-white text-navy-700 border border-navy-100 rounded-bl-md shadow-sm"
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br/>")
                      }} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick-select for current question */}
              {currentQuestion && currentQuestion.options && (
                <div className="pl-10">
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.options.map((opt) => {
                      const field = currentQuestion.field as keyof OnboardingProfile;
                      const arr = (profile[field] as string[] | undefined) || [];
                      const isSelected = Array.isArray(arr) && arr.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (currentQuestion.type === "multi-select") {
                              const updated = { ...profile };
                              const currentArr = (updated[field] as string[]) || [];
                              (updated as Record<string, unknown>)[field] = isSelected
                                ? currentArr.filter((s) => s !== opt)
                                : [...currentArr, opt];
                              setProfile(updated);
                            } else {
                              handleQuestionAnswer(opt);
                            }
                          }}
                          className={`tag-pill text-xs transition-all ${
                            isSelected
                              ? "bg-accent-500 text-white border-accent-500"
                              : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {currentQuestion.type === "multi-select" && (
                    <button
                      onClick={() => {
                        const field = currentQuestion.field as keyof OnboardingProfile;
                        const selected = (profile[field] as string[]) || [];
                        if (selected.length > 0) handleQuestionAnswer(selected.join(", "));
                      }}
                      className="mt-2 text-xs font-medium text-accent-500 hover:text-accent-600"
                    >
                      Confirm selection →
                    </button>
                  )}
                </div>
              )}

              {/* Publish button */}
              {phase === "approved" && (
                <div className="flex justify-center pt-3">
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 bg-success-500 hover:bg-success-400 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    <ThumbsUp className="w-4 h-4" /> Approve & Publish Profile
                  </button>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-navy-100">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-navy-50 border border-navy-200 rounded-full px-4 py-2 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={
                    phase === "questions" ? "Type your answer..." :
                    phase === "editing" ? "Type corrections (e.g., 'description: ...')" :
                    phase === "approved" ? "Profile approved — publish when ready" :
                    "Analyzing..."
                  }
                  disabled={phase === "analyzing" || phase === "approved"}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || phase === "analyzing" || phase === "approved"}
                  className="w-9 h-9 rounded-full bg-accent-500 hover:bg-accent-600 text-white flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile summary sidebar */}
        <div className="md:col-span-2">
          <div className="card p-4 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-accent-500" />
              <h2 className="text-sm font-bold text-navy-900">Profile Summary</h2>
              {validation && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                  validation.score >= 85 ? "bg-success-500/10 text-success-500" :
                  validation.score >= 60 ? "bg-warning-500/10 text-warning-500" :
                  "bg-danger-500/10 text-danger-500"
                }`}>
                  {validation.score}%
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <EditableField
                label="Company Name"
                value={profile.name}
                field="name"
                editField={editField}
                editValue={editValue}
                setEditField={setEditField}
                setEditValue={setEditValue}
                onSave={handleInlineEdit}
                validation={validation}
              />
              <EditableField
                label="Sector"
                value={profile.sector}
                field="sector"
                editField={editField}
                editValue={editValue}
                setEditField={setEditField}
                setEditValue={setEditValue}
                onSave={handleInlineEdit}
                validation={validation}
              />
              <EditableField
                label="Email"
                value={profile.contact_email}
                field="contact_email"
                editField={editField}
                editValue={editValue}
                setEditField={setEditField}
                setEditValue={setEditValue}
                onSave={handleInlineEdit}
                validation={validation}
              />

              <div className="border-t border-navy-100 pt-2">
                <span className="text-navy-400">Defense Domains</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.defense_domains.length > 0 ? profile.defense_domains.map((d) => (
                    <span key={d} className="tag-pill bg-accent-500/10 text-accent-600 border-accent-200 text-[10px]">
                      {DEFENSE_DOMAINS.find((dd) => dd.code === d)?.label || d}
                    </span>
                  )) : <span className="text-danger-500">Not set</span>}
                </div>
              </div>

              <div className="border-t border-navy-100 pt-2">
                <span className="text-navy-400">Capabilities ({profile.capabilities.length})</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.capabilities.length > 0 ? profile.capabilities.slice(0, 5).map((c) => (
                    <span key={c} className="tag-pill bg-purple-50 text-purple-600 border-purple-200 text-[10px]">
                      {c}
                    </span>
                  )) : <span className="text-danger-500">Min 3 required</span>}
                  {profile.capabilities.length > 5 && (
                    <span className="text-navy-400 text-[10px]">+{profile.capabilities.length - 5} more</span>
                  )}
                </div>
              </div>

              <div className="border-t border-navy-100 pt-2">
                <span className="text-navy-400">Technologies</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.technologies.length > 0 ? profile.technologies.map((t) => (
                    <span key={t} className="tag-pill bg-blue-50 text-blue-600 border-blue-200 text-[10px]">
                      {t}
                    </span>
                  )) : <span className="text-danger-500">Min 2 required</span>}
                </div>
              </div>

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">TRL Level</span>
                <span className="font-medium text-navy-700">
                  {profile.trl_level} — {TRL_DESCRIPTIONS.find((t) => t.level === profile.trl_level)?.title}
                </span>
              </div>

              <div className="border-t border-navy-100 pt-2 flex justify-between">
                <span className="text-navy-400">Clearance</span>
                <span className="font-medium text-navy-700">{profile.clearance_level}</span>
              </div>

              {profile.certifications.length > 0 && (
                <div className="border-t border-navy-100 pt-2">
                  <span className="text-navy-400">Certifications</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.certifications.map((c) => (
                      <span key={c} className="tag-pill bg-green-50 text-green-600 border-green-200 text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation issues */}
              {validation && validation.issues.length > 0 && (
                <div className="border-t border-navy-100 pt-2">
                  <span className="text-navy-400 block mb-1.5">Issues</span>
                  <div className="space-y-1">
                    {validation.issues.slice(0, 5).map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        {issue.severity === "error" ? (
                          <AlertCircle className="w-3 h-3 text-danger-500 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-warning-500 mt-0.5 shrink-0" />
                        )}
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

function EditableField({
  label,
  value,
  field,
  editField,
  editValue,
  setEditField,
  setEditValue,
  onSave,
  validation,
}: {
  label: string;
  value: string;
  field: string;
  editField: string | null;
  editValue: string;
  setEditField: (f: string | null) => void;
  setEditValue: (v: string) => void;
  onSave: (field: string, value: string) => void;
  validation: QualityGateResult | null;
}) {
  const hasError = validation?.issues.some((i) => i.field === field && i.severity === "error");

  if (editField === field) {
    return (
      <div className="border-t border-navy-100 pt-2">
        <span className="text-navy-400">{label}</span>
        <div className="flex items-center gap-1 mt-1">
          <input
            autoFocus
            className="flex-1 bg-white border border-accent-500 rounded-lg px-2 py-1 text-xs text-navy-700 focus:outline-none"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave(field, editValue);
              if (e.key === "Escape") setEditField(null);
            }}
          />
          <button onClick={() => onSave(field, editValue)} className="text-success-500 hover:text-success-400">
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button onClick={() => setEditField(null)} className="text-navy-400 hover:text-navy-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-navy-100 pt-2 flex justify-between items-start group">
      <div>
        <span className="text-navy-400">{label}</span>
        <div className={`font-medium mt-0.5 ${hasError ? "text-danger-500" : "text-navy-700"}`}>
          {value || (hasError ? "Required" : "—")}
        </div>
      </div>
      <button
        onClick={() => { setEditField(field); setEditValue(value); }}
        className="opacity-0 group-hover:opacity-100 text-navy-300 hover:text-accent-500 transition-all"
      >
        <Edit3 className="w-3 h-3" />
      </button>
    </div>
  );
}
