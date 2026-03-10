"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Upload,
  ClipboardList,
} from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center pt-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl avatar-blue flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Company Onboarding</h1>
        <p className="text-navy-400 max-w-lg mx-auto">
          Register your company on the Inno4Def 2.0. Our Quality Gate Agent will
          guide you through creating a defense-grade profile optimized for AI matchmaking.
        </p>
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-500" />
          How Onboarding Works
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Submit", desc: "Provide your company info via form or chat", icon: Upload },
            { step: 2, title: "Validate", desc: "Agent checks against defense data standards", icon: Shield },
            { step: 3, title: "Refine", desc: "Interactive Q&A to fill gaps and improve quality", icon: MessageSquare },
            { step: 4, title: "Approve", desc: "Profile is scored and ready for AI matching", icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-accent-500 text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                {s.step}
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mx-auto mb-2">
                <s.icon className="w-5 h-5 text-accent-500" />
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
        <Link href="/onboarding/form" className="group">
          <div className="card p-6 h-full border-2 border-transparent group-hover:border-accent-500 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-7 h-7 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Structured Form</h2>
            <p className="text-sm text-navy-400 mb-4">
              Fill in a guided form with all the required fields. Best when you know
              exactly what information to provide and want a quick, step-by-step process.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Pre-defined fields with defense taxonomy",
                "Real-time validation as you type",
                "Multi-select capabilities from standard list",
                "Instant quality score feedback",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-500">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-accent-500 font-semibold text-sm group-hover:gap-3 transition-all">
              Start with Form <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Chat / Document Upload */}
        <Link href="/onboarding/chat" className="group">
          <div className="card p-6 h-full border-2 border-transparent group-hover:border-accent-500 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Chat & Upload</h2>
            <p className="text-sm text-navy-400 mb-4">
              Upload documents (pitch decks, capability statements) or describe your
              company in natural language. The agent will extract and structure the data.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Upload pitch decks & capability briefs",
                "Describe your company in your own words",
                "AI extracts and structures the data",
                "Interactive Q&A fills in the gaps",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-500">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-accent-500 font-semibold text-sm group-hover:gap-3 transition-all">
              Start with Chat <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Data standards info */}
      <div className="card p-6 bg-navy-50 border border-navy-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-200 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <h3 className="font-semibold text-navy-900 mb-1">Defense Data Standards v1.0</h3>
            <p className="text-sm text-navy-500 mb-3">
              All profiles are validated against NATO-aligned data standards including domain
              taxonomy, capability classification, TRL definitions, and compliance frameworks.
            </p>
            <div className="flex flex-wrap gap-2">
              {["NATO Domains", "TRL 1-9", "CAGE/NCAGE", "Compliance", "Capability Taxonomy"].map((tag) => (
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
