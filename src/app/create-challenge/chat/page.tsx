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
  Target,
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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingQuestions, currentQuestionIdx]);

  useEffect(() => {
    addAgentMsg(generateChallengeGreeting(), "text");
    addAgentMsg(
      "You can:\n\n1. **Describe your operational need** in your own words\n2. **Upload a document** (capability brief, needs statement, operational requirement)\n\nTell me about the problem you're trying to solve. Don't worry about structure — I'll help you shape it into a proper challenge specification.",
      "text"
    );
    setPhase("input");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch {
        addAgentMsg("AI service unavailable. Toggle off Claude AI to use the structured flow.", "text");
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
          addAgentMsg(`I have **${questions.length} question(s)** to help complete your challenge specification. Let me walk you through them.`, "text");
          addAgentMsg(questions[0].question, "question");
        }, 500);
      } else {
        setPhase("review");
        addAgentMsg("Your challenge looks complete! Ready to proceed to the review.", "approval");
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
      const tags = answer.split(",").map((s) => s.trim()).filter(Boolean);
      updated.tags = [...new Set([...updated.tags, ...tags])];
    } else if (question.field === "requirements") {
      const reqs = answer.split("\n").map((s) => s.trim()).filter((s) => s.length > 5);
      updated.requirements = [...updated.requirements, ...reqs];
    } else if (question.field === "affected_platforms") {
      const platforms = answer.split(",").map((s) => s.trim()).filter(Boolean);
      updated.affected_platforms = platforms;
    } else if (question.field === "domain") {
      const code = answer.split(" ")[0].replace("—", "").trim();
      updated.domain = code;
    } else if (question.field === "gap_type") {
      const code = answer.split(" ")[0].replace("—", "").trim();
      updated.gap_type = code;
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
        addAgentMsg("Let me re-validate your challenge specification...", "text");
        setTimeout(() => {
          addAgentMsg(summary, "validation");
          if (result.passed) {
            setPhase("review");
            addAgentMsg("Your challenge is ready for final review. Click the button below.", "approval");
          } else {
            const more = generateChallengeQuestions(updated);
            if (more.length > 0 && more.length < pendingQuestions.length) {
              setPendingQuestions(more);
              setCurrentQuestionIdx(0);
              addAgentMsg(`Almost there! ${more.length} more point(s) to address.`, "text");
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
        ? arr.filter((s) => s !== selection)
        : [...arr, selection];
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

  const currentQuestion = phase === "questions" && currentQuestionIdx < pendingQuestions.length
    ? pendingQuestions[currentQuestionIdx] : null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
      <Link href="/create-challenge" className="flex items-center gap-1 text-navy-400 hover:text-orange-500 text-sm mb-3 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Challenge Creation
      </Link>

      <div className="card flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-navy-100">
          <div className="w-10 h-10 rounded-full avatar-orange flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-navy-900">Challenge Architect Agent</h1>
            <p className="text-xs text-success-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" /> Online
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setUseClaudeAI(!useClaudeAI)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                useClaudeAI ? "bg-accent-500 text-white" : "bg-navy-50 hover:bg-navy-100 text-navy-600"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> {useClaudeAI ? "Claude AI On" : "Claude AI"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-600 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Brief
            </button>
            <input ref={fileInputRef} type="file" accept=".txt,.md,.pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "agent" ? "avatar-orange" : "avatar-blue"
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
                        : msg.type === "question"
                          ? "bg-orange-50 text-navy-700 border border-orange-200 rounded-bl-md"
                          : "bg-white text-navy-700 border border-navy-100 rounded-bl-md shadow-sm"
                }`}>
                  {msg.type === "validation" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Shield className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-500">Validation</span>
                    </div>
                  )}
                  {msg.type === "question" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Target className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-500">Agent Question</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{
                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>")
                  }} />
                </div>
                <div className="text-[10px] text-navy-300 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Quick-select */}
          {currentQuestion && currentQuestion.options && (
            <div className="pl-11">
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
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-navy-600 border-navy-200 hover:border-orange-400"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {currentQuestion.type === "multi-select" && (
                <button onClick={() => submitMultiSelect(currentQuestion)} className="text-xs font-medium text-orange-500 hover:text-orange-600">
                  Confirm selection →
                </button>
              )}
            </div>
          )}

          {aiLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full avatar-orange flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-navy-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-navy-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-navy-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-navy-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {phase === "review" && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleProceedToReview}
                className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all shadow-md"
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
              className="flex-1 bg-navy-50 border border-navy-200 rounded-full px-4 py-2.5 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                phase === "questions" ? "Type your answer..." :
                phase === "review" ? "Chat complete — proceed to review" :
                "Describe your operational need..."
              }
              disabled={phase === "review"}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || phase === "review"}
              className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all disabled:opacity-40"
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
    </div>
  );
}
