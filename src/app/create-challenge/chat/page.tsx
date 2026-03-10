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
  Target,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import {
  createEmptyChallengeProfile,
  extractChallengeFromText,
  generateChallengeGreeting,
  generateDocumentExtractionSummary,
  generateChallengeQuestions,
  validateChallengeProfile,
  generateChallengeValidationSummary,
  OPERATIONAL_DOMAINS,
  GAP_TYPES,
  CHALLENGE_TAGS,
  type ChallengeProfile,
  type ChallengeQuestion,
} from "@/lib/challenge-agent";
import { sendChatMessage, type ChatMessage as AIChatMessage } from "@/lib/claude-chat";
import LiveChallengePreview from "@/components/LiveChallengePreview";

interface ChatMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  type: "text" | "question" | "validation" | "approval" | "file-upload";
  timestamp: string;
}

export default function ChallengeChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChallengeProfile>(createEmptyChallengeProfile());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingQuestions, setPendingQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [phase, setPhase] = useState<"welcome" | "input" | "questions" | "review">("welcome");
  const [useClaudeAI, setUseClaudeAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<AIChatMessage[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingQuestions, currentQuestionIdx]);

  useEffect(() => {
    addAgentMsg(generateChallengeGreeting(), "text");
    addAgentMsg(
      "You can:\n\n1. **Describe your operational need** in your own words\n2. **Upload a document** (capability brief, needs statement, operational requirement)\n\nTell me about the problem you're trying to solve.",
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

  function addAgentMsg(content: string, type: ChatMessage["type"]) {
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: "agent", content, type, timestamp: new Date().toISOString(),
    }]);
  }

  function addUserMsg(content: string, type: ChatMessage["type"] = "text") {
    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: "user", content, type, timestamp: new Date().toISOString(),
    }]);
  }

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (useClaudeAI) {
      addUserMsg(text);
      const extracted = extractChallengeFromText(text);
      const updated = { ...profile };
      for (const [key, value] of Object.entries(extracted)) {
        if (value && (typeof value === "string" ? value.length > 0 : Array.isArray(value) ? value.length > 0 : true)) {
          (updated as Record<string, unknown>)[key] = value;
        }
      }
      setProfile(updated);

      const newHistory: AIChatMessage[] = [...aiHistory, { role: "user", content: text }];
      setAiHistory(newHistory);
      setAiLoading(true);
      try {
        const response = await sendChatMessage(newHistory, "challenge");
        setAiHistory([...newHistory, { role: "assistant", content: response }]);
        addAgentMsg(response, "text");
        const result = validateChallengeProfile(updated);
        if (result.passed) setPhase("review");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error"; addAgentMsg(`AI temporarily unavailable (${msg}). Retrying or toggle off Claude AI for structured flow.`, "text");
      }
      setAiLoading(false);
      return;
    }

    if (phase === "input") { addUserMsg(text); processInput(text); }
    else if (phase === "questions") handleAnswer(text);
  }

  function processInput(text: string) {
    const extracted = extractChallengeFromText(text);
    const updated = { ...profile };
    for (const [key, value] of Object.entries(extracted)) {
      if (value && (typeof value === "string" ? value.length > 0 : Array.isArray(value) ? value.length > 0 : true)) {
        (updated as Record<string, unknown>)[key] = value;
      }
    }
    setProfile(updated);

    setTimeout(() => {
      const summary = generateDocumentExtractionSummary(extracted);
      addAgentMsg(summary, "text");
      const result = validateChallengeProfile(updated);
      const valMsg = generateChallengeValidationSummary(result);
      addAgentMsg(valMsg, "validation");

      const questions = generateChallengeQuestions(updated);
      if (questions.length > 0) {
        setPendingQuestions(questions);
        setCurrentQuestionIdx(0);
        setPhase("questions");
        setTimeout(() => {
          addAgentMsg(`I have **${questions.length} question(s)** to complete your challenge specification.`, "text");
          addAgentMsg(questions[0].question, "question");
        }, 500);
      } else {
        setPhase("review");
        addAgentMsg("Your challenge looks complete! Ready to proceed to review.", "approval");
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
      addUserMsg(`Uploaded: ${file.name}`, "file-upload");
      processInput(content);
    };
    reader.readAsText(file);
  }

  function handleAnswer(answer: string) {
    if (currentQuestionIdx >= pendingQuestions.length) return;
    const question = pendingQuestions[currentQuestionIdx];
    addUserMsg(answer);

    const updated = { ...profile };
    if (question.field === "tags") {
      updated.tags = [...new Set([...updated.tags, ...answer.split(",").map((s) => s.trim()).filter(Boolean)])];
    } else if (question.field === "requirements") {
      updated.requirements = [...updated.requirements, ...answer.split("\n").map((s) => s.trim()).filter((s) => s.length > 5)];
    } else if (question.field === "affected_platforms") {
      updated.affected_platforms = answer.split(",").map((s) => s.trim()).filter(Boolean);
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
        addAgentMsg("Understood, thank you.", "text");
        addAgentMsg(pendingQuestions[nextIdx].question, "question");
      }, 300);
    } else {
      setTimeout(() => {
        const result = validateChallengeProfile(updated);
        const summary = generateChallengeValidationSummary(result);
        addAgentMsg("Let me re-validate your challenge...", "text");
        setTimeout(() => {
          addAgentMsg(summary, "validation");
          if (result.passed) {
            setPhase("review");
            addAgentMsg("Your challenge is ready for final review.", "approval");
          } else {
            const more = generateChallengeQuestions(updated);
            if (more.length > 0 && more.length < pendingQuestions.length) {
              setPendingQuestions(more);
              setCurrentQuestionIdx(0);
              addAgentMsg(`Almost there! ${more.length} more point(s).`, "text");
              addAgentMsg(more[0].question, "question");
            } else {
              setPhase("review");
              addAgentMsg("You can proceed to review — the agent will highlight remaining areas.", "approval");
            }
          }
        }, 400);
      }, 300);
    }
  }

  function handleQuickSelect(question: ChallengeQuestion, selection: string) {
    if (question.type === "multi-select") {
      const updated = { ...profile };
      const field = question.field as keyof ChallengeProfile;
      const arr = (updated[field] as string[]) || [];
      (updated as Record<string, unknown>)[field] = arr.includes(selection)
        ? arr.filter((s) => s !== selection) : [...arr, selection];
      setProfile(updated);
    } else {
      handleAnswer(selection);
    }
  }

  function submitMultiSelect(question: ChallengeQuestion) {
    const field = question.field as keyof ChallengeProfile;
    const selected = (profile[field] as string[]) || [];
    if (selected.length > 0) handleAnswer(selected.join(", "));
  }

  function handleProceedToReview() {
    sessionStorage.setItem("challenge_profile", JSON.stringify(profile));
    sessionStorage.setItem("challenge_method", "chat");
    router.push("/create-challenge/review");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const currentQuestion = phase === "questions" && currentQuestionIdx < pendingQuestions.length
    ? pendingQuestions[currentQuestionIdx] : null;

  const hasContent = messages.length > 2;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
      <div className="flex items-center justify-between mb-3">
        <Link href="/create-challenge" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm transition-colors">
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
            <div className="w-9 h-9 rounded-lg avatar-gold flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-bold text-navy-900">Challenge Architect Agent</h1>
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
                  msg.role === "agent" ? "avatar-gold" : "avatar-blue"
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
                          : msg.type === "question"
                            ? "bg-gold-500/5 text-navy-700 border border-gold-500/20 rounded-bl-sm"
                            : "bg-white text-navy-700 border border-navy-100 rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.type === "validation" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Shield className="w-3 h-3 text-gold-500" />
                        <span className="text-[0.6rem] font-semibold text-gold-500">Validation</span>
                      </div>
                    )}
                    {msg.type === "question" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Target className="w-3 h-3 text-gold-500" />
                        <span className="text-[0.6rem] font-semibold text-gold-500">Question</span>
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
                    const field = currentQuestion.field as keyof ChallengeProfile;
                    const arr = (profile[field] as string[] | undefined) || [];
                    const isSelected = Array.isArray(arr) ? arr.includes(opt) : profile[field] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleQuickSelect(currentQuestion, opt)}
                        className={`tag-pill text-xs transition-all ${
                          isSelected ? "bg-gold-500 text-white border-gold-500" : "bg-white text-navy-600 border-navy-200 hover:border-gold-400"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {currentQuestion.type === "multi-select" && (
                  <button onClick={() => submitMultiSelect(currentQuestion)} className="text-xs font-medium text-gold-500 hover:text-gold-600">
                    Confirm selection →
                  </button>
                )}
              </div>
            )}

            {aiLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg avatar-gold flex items-center justify-center shrink-0">
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
                placeholder={phase === "questions" ? "Type your answer..." : phase === "review" ? "Chat complete" : "Describe your operational need..."}
                disabled={phase === "review"}
                style={{ minHeight: "40px", maxHeight: "160px" }}
              />
              <button
                onClick={handleSend}
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
            <LiveChallengePreview profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
