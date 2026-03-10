"use client";

import Link from "next/link";
import {
  Target,
  FileText,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Upload,
  ClipboardList,
  Crosshair,
  AlertTriangle,
} from "lucide-react";

export default function CreateChallengePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center pt-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl avatar-orange flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center shadow-md">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Create a Challenge</h1>
        <p className="text-navy-400 max-w-lg mx-auto">
          Transform your operational need into a structured innovation challenge.
          The Challenge Architect Agent will help you define precise requirements
          that our AI can match with the best solutions.
        </p>
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-500" />
          How Challenge Creation Works
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Describe", desc: "Tell us about your operational need or capability gap", icon: FileText },
            { step: 2, title: "Structure", desc: "Agent helps formulate precise requirements", icon: Crosshair },
            { step: 3, title: "Validate", desc: "Challenge checked against operational standards", icon: Shield },
            { step: 4, title: "Match", desc: "AI finds companies and research that can help", icon: Target },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                {s.step}
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-2">
                <s.icon className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold text-sm text-navy-900">{s.title}</h3>
              <p className="text-xs text-navy-400 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two paths */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Structured form */}
        <Link href="/create-challenge/form" className="group">
          <div className="card p-6 h-full border-2 border-transparent group-hover:border-orange-500 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-7 h-7 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Structured Form</h2>
            <p className="text-sm text-navy-400 mb-4">
              Fill in a guided form step-by-step. Best when you have a clear picture
              of the capability gap and can articulate specific requirements.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Operational domain taxonomy selection",
                "Guided requirement templates",
                "TRL-timeline alignment check",
                "Priority justification framework",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-500">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all">
              Start with Form <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Chat / Briefing */}
        <Link href="/create-challenge/chat" className="group">
          <div className="card p-6 h-full border-2 border-transparent group-hover:border-orange-500 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Brief the Agent</h2>
            <p className="text-sm text-navy-400 mb-4">
              Describe your operational need in your own words, or upload an existing
              capability brief. The agent will ask the right questions to structure it.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Describe the problem naturally",
                "Upload capability briefs or need statements",
                "Agent probes for operational context",
                "Interactive Q&A builds the specification",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-500">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm group-hover:gap-3 transition-all">
              Brief the Agent <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Standards info */}
      <div className="card p-6 bg-navy-50 border border-navy-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <h3 className="font-semibold text-navy-900 mb-1">UNCLASSIFIED Only</h3>
            <p className="text-sm text-navy-500 mb-3">
              This platform operates at UNCLASSIFIED level. Describe capability gaps in
              general terms without specific system designations, performance parameters,
              or intelligence sources. The agent will help you articulate the need while
              maintaining operational security.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Operational Domains", "Requirement Templates", "TRL-Timeline Matrix", "Priority Framework", "Gap Types"].map((tag) => (
                <span key={tag} className="tag-pill bg-white text-navy-600 border-navy-200 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
