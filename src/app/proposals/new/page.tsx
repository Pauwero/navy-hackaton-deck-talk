"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowLeft, Send, Target, Building2 } from "lucide-react";

function NewProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useStore();

  const challengeId = searchParams.get("challenge") || "";
  const challenge = store.challenges.find((c) => c.id === challengeId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    submitter_name: "",
    submitter_org: "",
    domain: challenge?.domain || "",
    company_id: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.submitter_name.trim()) return;

    const id = "prop-" + Math.random().toString(36).substring(2, 8);
    store.addProposal({
      id,
      title: form.title,
      description: form.description,
      submitter_name: form.submitter_name,
      submitter_org: form.submitter_org || form.submitter_name,
      domain: form.domain || challenge?.domain || "General",
      challenge_id: challengeId || undefined,
      company_id: form.company_id || undefined,
      status: "voting",
      votes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    router.push(`/proposals/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={challengeId ? `/challenges/${challengeId}` : "/proposals"} className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {challengeId ? "Back to Challenge" : "Back to Proposals"}
      </Link>

      <h1 className="text-xl font-bold text-navy-900 mb-1">Submit a Proposal</h1>
      <p className="text-sm text-navy-500 mb-6">
        Your proposal will enter the assessment pipeline: internal voting, SNIF assessment, and board review.
      </p>

      {/* Linked challenge */}
      {challenge && (
        <div className="card-surface p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-gold-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.65rem] text-navy-500 uppercase tracking-wide">Responding to Challenge</p>
            <p className="text-sm font-bold text-navy-900">{challenge.title}</p>
            <p className="text-xs text-navy-400">{challenge.domain} · TRL {challenge.desired_trl} · {challenge.timeline}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-700 block mb-1">Proposal Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. AI-Powered Mine Detection Swarm System"
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-navy-700 block mb-1">Submitter Name *</label>
            <input
              type="text"
              required
              value={form.submitter_name}
              onChange={(e) => setForm({ ...form, submitter_name: e.target.value })}
              placeholder="Your name or company"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-700 block mb-1">Organization</label>
            <input
              type="text"
              value={form.submitter_org}
              onChange={(e) => setForm({ ...form, submitter_org: e.target.value })}
              placeholder="Organization name"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-navy-700 block mb-1">Domain</label>
          <input
            type="text"
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            placeholder="e.g. Mine Warfare, Cyber Defense"
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
        </div>

        {/* Link to existing company */}
        <div>
          <label className="text-xs font-medium text-navy-700 block mb-1">Link to Company Profile (optional)</label>
          <select
            value={form.company_id}
            onChange={(e) => setForm({ ...form, company_id: e.target.value })}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 bg-white"
          >
            <option value="">— None —</option>
            {store.companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-navy-700 block mb-1">Proposal Description *</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your proposed solution, approach, and why it fits this challenge..."
            rows={6}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Submit Proposal
          </button>
          <Link
            href={challengeId ? `/challenges/${challengeId}` : "/proposals"}
            className="btn-outline text-sm px-5 py-2.5"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-navy-400 text-sm">Loading...</div>}>
      <NewProposalForm />
    </Suspense>
  );
}
