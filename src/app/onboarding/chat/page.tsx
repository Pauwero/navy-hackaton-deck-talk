"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Upload,
  FileText,
  Bot,
  User,
  Shield,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  createEmptyOnboardingProfile,
  extractProfileFromText,
  generateAgentGreeting,
  generateDocumentAnalysisSummary,
  generateClarifyingQuestions,
  validateOnboardingProfile,
  generateValidationSummary,
  DEFENSE_DOMAINS,
  ALL_CAPABILITIES,
  PARTNERSHIP_TYPES,
  CERTIFICATIONS,
  type OnboardingProfile,
  type AgentMessage,
  type AgentQuestion,
} from "@/lib/onboarding-agent";

export default function OnboardingChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile>(createEmptyOnboardingProfile());
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingQuestions, setPendingQuestions] = useState<AgentQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [phase, setPhase] = useState<"welcome" | "input" | "questions" | "review">("welcome");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingQuestions, currentQuestionIdx]);

  // Start with agent greeting
  useEffect(() => {
    const greeting = generateAgentGreeting();
    addAgentMessage(greeting, "text");
    addAgentMessage(
      "You can either:\n\n1. **Paste or type** a description of your company\n2. **Upload a document** (pitch deck, capability statement, company overview)\n\nI'll extract the relevant information and help you build a structured profile.",
      "text"
    );
    setPhase("input");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addAgentMessage(content: string, type: AgentMessage["type"], questions?: AgentQuestion[]) {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "agent",
        content,
        type,
        questions,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  function addUserMessage(content: string, type: AgentMessage["type"] = "text") {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "user",
        content,
        type,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  function handleSendMessage() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    if (phase === "input") {
      addUserMessage(text);
      processUserInput(text);
    } else if (phase === "questions") {
      handleQuestionAnswer(text);
    }
  }

  function processUserInput(text: string) {
    // Extract profile from text
    const extracted = extractProfileFromText(text);
    const merged = { ...profile, ...extracted };

    // Only override non-empty fields
    const updated = { ...profile };
    for (const [key, value] of Object.entries(extracted)) {
      if (value && (typeof value === "string" ? value.length > 0 : Array.isArray(value) ? value.length > 0 : true)) {
        (updated as Record<string, unknown>)[key] = value;
      }
    }
    setProfile(updated);

    // Analyze and summarize
    setTimeout(() => {
      const summary = generateDocumentAnalysisSummary(extracted);
      addAgentMessage(summary, "text");

      // Run validation
      const result = validateOnboardingProfile(updated);
      const validationMsg = generateValidationSummary(result, updated);
      addAgentMessage(validationMsg, "validation");

      // Generate questions for gaps
      const questions = generateClarifyingQuestions(updated);
      if (questions.length > 0) {
        setPendingQuestions(questions);
        setCurrentQuestionIdx(0);
        setPhase("questions");
        setTimeout(() => {
          addAgentMessage(
            `I have **${questions.length} question(s)** to help complete your profile. Let's go through them one by one.`,
            "text"
          );
          addAgentMessage(questions[0].question, "question", [questions[0]]);
        }, 500);
      } else {
        setPhase("review");
        addAgentMessage("Your profile looks complete! Ready to proceed to the review.", "approval");
      }
    }, 300);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setUploadedFile(file.name);
      addUserMessage(`📎 Uploaded: ${file.name}`, "file-upload");
      processUserInput(content);
    };
    reader.readAsText(file);
  }

  function handleQuestionAnswer(answer: string) {
    if (currentQuestionIdx >= pendingQuestions.length) return;

    const question = pendingQuestions[currentQuestionIdx];
    addUserMessage(answer);

    // Apply answer to profile
    const updated = { ...profile };
    if (question.field === "defense_domains") {
      const codes = answer.split(",").map((s) => s.trim().split(" ")[0]).filter(Boolean);
      updated.defense_domains = codes;
    } else if (question.field === "capabilities") {
      const caps = answer.split(",").map((s) => s.trim()).filter(Boolean);
      updated.capabilities = [...new Set([...updated.capabilities, ...caps])];
    } else if (question.field === "partnership_interest") {
      const interests = answer.split(",").map((s) => s.trim()).filter(Boolean);
      updated.partnership_interest = interests;
    } else if (question.field === "certifications") {
      const certs = answer.split(",").map((s) => s.trim()).filter(Boolean);
      updated.certifications = certs;
    } else {
      (updated as Record<string, unknown>)[question.field] = answer;
    }
    setProfile(updated);

    // Move to next question or finish
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < pendingQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        addAgentMessage("Got it, thanks!", "text");
        addAgentMessage(pendingQuestions[nextIdx].question, "question", [pendingQuestions[nextIdx]]);
      }, 300);
    } else {
      // All questions answered — validate again
      setTimeout(() => {
        const result = validateOnboardingProfile(updated);
        const summary = generateValidationSummary(result, updated);
        addAgentMessage("Got it! Let me re-validate your profile...", "text");
        setTimeout(() => {
          addAgentMessage(summary, "validation");
          if (result.passed) {
            setPhase("review");
            addAgentMessage(
              "Your profile is ready for final review. Click the button below to proceed.",
              "approval"
            );
          } else {
            // Generate more questions
            const moreQuestions = generateClarifyingQuestions(updated);
            if (moreQuestions.length > 0 && moreQuestions.length < pendingQuestions.length) {
              setPendingQuestions(moreQuestions);
              setCurrentQuestionIdx(0);
              addAgentMessage(
                `Almost there! ${moreQuestions.length} more question(s) to address.`,
                "text"
              );
              addAgentMessage(moreQuestions[0].question, "question", [moreQuestions[0]]);
            } else {
              setPhase("review");
              addAgentMessage(
                "You can still proceed to review — the agent will highlight areas that need attention.",
                "approval"
              );
            }
          }
        }, 400);
      }, 300);
    }
  }

  function handleQuickSelect(question: AgentQuestion, selection: string) {
    if (question.type === "multi-select") {
      // For multi-select, toggle the selection in a local state approach
      const updated = { ...profile };
      const field = question.field as keyof OnboardingProfile;
      const arr = (updated[field] as string[]) || [];

      if (arr.includes(selection)) {
        (updated as Record<string, unknown>)[field] = arr.filter((s) => s !== selection);
      } else {
        (updated as Record<string, unknown>)[field] = [...arr, selection];
      }
      setProfile(updated);
    } else {
      handleQuestionAnswer(selection);
    }
  }

  function submitMultiSelect(question: AgentQuestion) {
    const field = question.field as keyof OnboardingProfile;
    const selected = (profile[field] as string[]) || [];
    if (selected.length > 0) {
      handleQuestionAnswer(selected.join(", "));
    }
  }

  function handleProceedToReview() {
    sessionStorage.setItem("onboarding_profile", JSON.stringify(profile));
    sessionStorage.setItem("onboarding_method", "chat");
    router.push("/onboarding/review");
  }

  const currentQuestion = phase === "questions" && currentQuestionIdx < pendingQuestions.length
    ? pendingQuestions[currentQuestionIdx]
    : null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
      <Link href="/onboarding" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-3 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Onboarding
      </Link>

      <div className="card flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-navy-100">
          <div className="w-10 h-10 rounded-full avatar-green flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-navy-900">Quality Gate Agent</h1>
            <p className="text-xs text-success-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" /> Online
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-600 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "agent" ? "avatar-green" : "avatar-blue"
              }`}>
                {msg.role === "agent" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] ${msg.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block text-sm rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-accent-500 text-white rounded-br-md"
                    : msg.type === "validation"
                      ? "bg-navy-50 text-navy-700 border border-navy-200 rounded-bl-md"
                      : msg.type === "approval"
                        ? "bg-success-500/10 text-navy-700 border border-success-500/20 rounded-bl-md"
                        : "bg-white text-navy-700 border border-navy-100 rounded-bl-md shadow-sm"
                }`}>
                  {msg.type === "validation" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Shield className="w-3.5 h-3.5 text-accent-500" />
                      <span className="text-xs font-semibold text-accent-500">Validation Result</span>
                    </div>
                  )}
                  {msg.type === "approval" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-success-500" />
                      <span className="text-xs font-semibold text-success-500">Ready</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br/>")
                  }} />
                </div>
                <div className="text-[10px] text-navy-300 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Quick-select options for current question */}
          {currentQuestion && currentQuestion.options && (
            <div className="pl-11">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentQuestion.options.map((opt) => {
                  const field = currentQuestion.field as keyof OnboardingProfile;
                  const arr = (profile[field] as string[] | undefined) || [];
                  const isSelected = Array.isArray(arr) && arr.includes(opt);

                  return (
                    <button
                      key={opt}
                      onClick={() => handleQuickSelect(currentQuestion, opt)}
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
                  onClick={() => submitMultiSelect(currentQuestion)}
                  className="text-xs font-medium text-accent-500 hover:text-accent-600 transition-colors"
                >
                  Confirm selection →
                </button>
              )}
            </div>
          )}

          {/* Proceed to review button */}
          {phase === "review" && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleProceedToReview}
                className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-md"
              >
                <Shield className="w-4 h-4" /> Proceed to Agent Review
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-navy-100">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 bg-navy-50 border border-navy-200 rounded-full px-4 py-2.5 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                phase === "questions"
                  ? "Type your answer..."
                  : phase === "review"
                    ? "Chat is complete — proceed to review"
                    : "Describe your company or paste content..."
              }
              disabled={phase === "review"}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || phase === "review"}
              className="w-10 h-10 rounded-full bg-accent-500 hover:bg-accent-600 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {uploadedFile && (
            <div className="flex items-center gap-2 mt-2 text-xs text-navy-400">
              <FileText className="w-3 h-3" />
              {uploadedFile}
              <button onClick={() => setUploadedFile(null)} className="text-navy-300 hover:text-navy-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
