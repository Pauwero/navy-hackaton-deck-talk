"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Sparkles,
  Minimize2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiAssistantProps {
  agentType?: "analyze" | "assistant" | "onboarding" | "challenge";
  context?: Record<string, unknown>;
  placeholder?: string;
  title?: string;
  initialMessage?: string;
  className?: string;
  inline?: boolean; // if true, renders inline instead of floating
}

export default function AiAssistant({
  agentType = "assistant",
  context,
  placeholder = "Ask the AI assistant...",
  title = "AI Assistant",
  initialMessage,
  className = "",
  inline = false,
}: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(inline);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          agentType,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to get response");
        setIsLoading(false);
        return;
      }

      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setError("Network error — check your connection");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const chatPanel = (
    <div className={`flex flex-col ${inline ? "h-[500px]" : "h-[480px]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-200 bg-navy-50/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy-900">{title}</h3>
            <p className="text-[0.6rem] text-navy-400">Powered by Claude</p>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setIsOpen(false)} className="text-navy-400 hover:text-navy-600 transition-colors">
            <Minimize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-10 h-10 mx-auto text-navy-300 mb-2" />
            <p className="text-xs text-navy-500">
              {agentType === "analyze"
                ? "Ask me to analyze proposals, assess challenges, or provide innovation insights."
                : "Ask me anything about the Inno4Def 2.0 platform."}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-accent-500 text-white rounded-br-sm"
                : "bg-navy-100 text-navy-800 rounded-bl-sm"
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-navy-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3 h-3 text-navy-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-navy-100 text-navy-500 px-3 py-2 rounded-lg rounded-bl-sm text-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-navy-200 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none max-h-20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className={`card-surface overflow-hidden ${className}`}>
        {chatPanel}
      </div>
    );
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-accent-500 text-white shadow-lg hover:bg-accent-600 transition-all hover:scale-105 flex items-center justify-center"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-navy-200 overflow-hidden">
          {chatPanel}
        </div>
      )}
    </>
  );
}
