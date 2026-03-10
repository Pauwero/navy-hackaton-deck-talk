"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  PanelRightClose,
  PanelRightOpen,
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
import { sendChatMessage, type ChatMessage } from "@/lib/claude-chat";
import LiveProfilePreview from "@/components/LiveProfilePreview";

export default function OnboardingChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile>(createEmptyOnboardingProfile());
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingQuestions, setPendingQuestions] = useState<AgentQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [phase, setPhase] = useState<"welcome" | "input" | "questions" | "review">("welcome");
  const [useClaudeAI, setUseClaudeAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<ChatMessage[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingQuestions, currentQuestionIdx]);

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

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
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

  async function handleSendMessage() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (useClaudeAI) {
      addUserMessage(text);
      const extracted = extractProfileFromText(text);
      const updated = { ...profile };
      for (const [key, value] of Object.entries(extracted)) {
        if (value && (typeof value === "string" ? value.length > 0 : Array.isArray(value) ? value.length > 0 : true)) {
          (updated as Record<string, unknown>)[key] = value;
        }
      }
      setProfile(updated);

      const newHistory: ChatMessage[] = [...aiHistory, { role: "user", content: text }];
      setAiHistory(newHistory);
      setAiLoading(true);
      try {
        const response = await sendChatMessage(newHistory, "onboarding");
        setAiHistory([...newHistory, { role: "assistant", content: response }]);
        addAgentMessage(response, "text");
        const result = validateOnboardingProfile(updated);
        if (result.passed) setPhase("review");
      } catch (err) {
        addAgentMessage("Sorry, I couldn't reach the AI service. Toggle off Claude AI to use the structured flow.", "text");
      }
      setAiLoading(false);
      return;
    }

    if (phase === "input") {
      addUserMessage(text);
      processUserInput(text);
    } else if (phase === "questions") {
      handleQuestionAnswer(text);
    }
  }

  function processUserInput(text: string) {
    const extracted = extractProfileFromText(text);
    const updated = { ...profile };
    for (const [key, value] of Object.entries(extracted)) {
      if (value && (typeof value === "string" ? value.length > 0 : Array.isArray(value) ? value.length > 0 : true)) {
        (updated as Record<string, unknown>)[key] = value;
      }
    }
    setProfile(updated);

    setTimeout(() => {
      const summary = generateDocumentAnalysisSummary(extracted);
      addAgentMessage(summary, "text");
      const result = validateOnboardingProfile(updated);
      const validationMsg = generateValidationSummary(result, updated);
      addAgentMessage(validationMsg, "validation");

      const questions = generateClarifyingQuestions(updated);
      if (questions.length > 0) {
        setPendingQuestions(questions);
        setCurrentQuestionIdx(0);
        setPhase("questions");
        setTimeout(() => {
          addAgentMessage(`I have **${questions.length} question(s)** to help complete your profile.`, "text");
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
      addUserMessage(`Uploaded: ${file.name}`, "file-upload");
      processUserInput(content);
    };
    reader.readAsText(file);
  }

  function handleQuestionAnswer(answer: string) {
    if (currentQuestionIdx >= pendingQuestions.length) return;
    const question = pendingQuestions[currentQuestionIdx];
    addUserMessage(answer);

    const updated = { ...profile };
    if (question.field === "defense_domains") {
      updated.defense_domains = answer.split(",").map((s) => s.trim().split(" ")[0]).filter(Boolean);
    } else if (question.field === "capabilities") {
      updated.capabilities = [...new Set([...updated.capabilities, ...answer.split(",").map((s) => s.trim()).filter(Boolean)])];
    } else if (question.field === "partnership_interest") {
      updated.partnership_interest = answer.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (question.field === "certifications") {
      updated.certifications = answer.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      (updated as Record<string, unknown>)[question.field] = answer;
    }
    setProfile(updated);

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < pendingQuestions.length) {
      setCurrentQuestionIdx(nextIdx);
      setTimeout(() => {
        addAgentMessage("Got it, thanks!", "text");
        addAgentMessage(pendingQuestions[nextIdx].question, "question", [pendingQuestions[nextIdx]]);
      }, 300);
    } else {
      setTimeout(() => {
        const result = validateOnboardingProfile(updated);
        const summary = generateValidationSummary(result, updated);
        addAgentMessage("Got it! Let me re-validate your profile...", "text");
        setTimeout(() => {
          addAgentMessage(summary, "validation");
          if (result.passed) {
            setPhase("review");
            addAgentMessage("Your profile is ready for final review.", "approval");
          } else {
            const moreQuestions = generateClarifyingQuestions(updated);
            if (moreQuestions.length > 0 && moreQuestions.length < pendingQuestions.length) {
              setPendingQuestions(moreQuestions);
              setCurrentQuestionIdx(0);
              addAgentMessage(`Almost there! ${moreQuestions.length} more question(s).`, "text");
              addAgentMessage(moreQuestions[0].question, "question", [moreQuestions[0]]);
            } else {
              setPhase("review");
              addAgentMessage("You can proceed to review — the agent will highlight areas that need attention.", "approval");
            }
          }
        }, 400);
      }, 300);
    }
  }

  function handleQuickSelect(question: AgentQuestion, selection: string) {
    if (question.type === "multi-select") {
      const updated = { ...profile };
      const field = question.field as keyof OnboardingProfile;
      const arr = (updated[field] as string[]) || [];
      (updated as Record<string, unknown>)[field] = arr.includes(selection)
        ? arr.filter((s) => s !== selection)
        : [...arr, selection];
      setProfile(updated);
    } else {
      handleQuestionAnswer(selection);
    }
  }

  function submitMultiSelect(question: AgentQuestion) {
    const field = question.field as keyof OnboardingProfile;
    const selected = (profile[field] as string[]) || [];
    if (selected.length > 0) handleQuestionAnswer(selected.join(", "));
  }

  function handleProceedToReview() {
    sessionStorage.setItem("onboarding_profile", JSON.stringify(profile));
    sessionStorage.setItem("onboarding_method", "chat");
    router.push("/onboarding/review");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentQuestion = phase === "questions" && currentQuestionIdx < pendingQuestions.length
    ? pendingQuestions[currentQuestionIdx] : null;

  const hasContent = messages.length > 2;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
      <div className="flex items-center justify-between mb-3">
        <Link href="/onboarding" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        {hasContent && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-navy-500 hover:text-navy-700 transition-colors"
          >
            {showPreview ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        )}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chat panel */}
        <div className={`card flex flex-col flex-1 overflow-hidden min-w-0 ${hasContent && showPreview ? "md:max-w-[60%]" : ""}`}>
          <div className="flex items-center gap-3 p-3 border-b border-navy-100">
            <div className="w-9 h-9 rounded-lg avatar-green flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold text-navy-900">Quality Gate Agent</h1>
              <p className="text-[0.65rem] text-success-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" /> Online
              </p>
            </div>
            <button
              onClick={() => setUseClaudeAI(!useClaudeAI)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.65rem] font-medium transition-colors ${
                useClaudeAI ? "bg-accent-500 text-white" : "bg-navy-50 hover:bg-navy-100 text-navy-600"
              }`}
            >
              <Sparkles className="w-3 h-3" /> {useClaudeAI ? "AI On" : "Claude AI"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 bg-navy-50 hover:bg-navy-100 text-navy-600 px-2.5 py-1 rounded-lg text-[0.65rem] font-medium transition-colors"
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
            <input ref={fileInputRef} type="file" accept=".txt,.md,.pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "agent" ? "avatar-green" : "avatar-blue"
                }`}>
                  {msg.role === "agent" ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block text-[0.8rem] rounded-xl px-3.5 py-2 ${
                    msg.role === "user"
                      ? "bg-accent-500 text-white rounded-br-sm"
                      : msg.type === "validation"
                        ? "bg-navy-50 text-navy-700 border border-navy-200 rounded-bl-sm"
                        : msg.type === "approval"
                          ? "bg-success-500/10 text-navy-700 border border-success-500/20 rounded-bl-sm"
                          : "bg-white text-navy-700 border border-navy-100 rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.type === "validation" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Shield className="w-3 h-3 text-accent-500" />
                        <span className="text-[0.6rem] font-semibold text-accent-500">Validation</span>
                      </div>
                    )}
                    {msg.type === "approval" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-success-500" />
                        <span className="text-[0.6rem] font-semibold text-success-500">Ready</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                      __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")
                    }} />
                  </div>
                </div>
              </div>
            ))}

            {currentQuestion && currentQuestion.options && (
              <div className="pl-10">
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
                          isSelected ? "bg-accent-500 text-white border-accent-500" : "bg-white text-navy-600 border-navy-200 hover:border-accent-400"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {currentQuestion.type === "multi-select" && (
                  <button onClick={() => submitMultiSelect(currentQuestion)} className="text-xs font-medium text-accent-500 hover:text-accent-600">
                    Confirm selection →
                  </button>
                )}
              </div>
            )}

            {aiLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg avatar-green flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-navy-100 rounded-xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {phase === "review" && (
              <div className="flex justify-center pt-2">
                <button onClick={handleProceedToReview} className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-all">
                  <Shield className="w-4 h-4" /> Proceed to Agent Review
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-navy-100">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                className="flex-1 bg-navy-50 border border-navy-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-700 placeholder-navy-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all resize-none overflow-hidden"
                rows={1}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={phase === "questions" ? "Type your answer..." : phase === "review" ? "Chat complete" : "Describe your company or paste content..."}
                disabled={phase === "review"}
                style={{ minHeight: "40px", maxHeight: "160px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || phase === "review"}
                className="w-10 h-10 rounded-xl bg-accent-500 hover:bg-accent-600 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {uploadedFile && (
              <div className="flex items-center gap-2 mt-2 text-xs text-navy-400">
                <FileText className="w-3 h-3" />{uploadedFile}
                <button onClick={() => setUploadedFile(null)} className="text-navy-300 hover:text-navy-500"><X className="w-3 h-3" /></button>
              </div>
            )}
          </div>
        </div>

        {/* Live preview panel */}
        {hasContent && showPreview && (
          <div className="hidden md:block w-[40%] card overflow-hidden">
            <LiveProfilePreview profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
