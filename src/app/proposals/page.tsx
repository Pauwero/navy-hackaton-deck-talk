"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  FileCheck,
  Vote,
  ClipboardCheck,
  CheckCircle2,
  MessageSquare,
  XCircle,
  Presentation,
  GraduationCap,
  Handshake,
  Trophy,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react";
import type { ProposalStatus } from "@/types";

const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; icon: typeof FileCheck }> = {
  submitted: { label: "Submitted", color: "bg-navy-100 text-navy-600", icon: FileCheck },
  voting: { label: "Voting", color: "bg-blue-100 text-blue-700", icon: Vote },
  sniff_assessment: { label: "Sniff Assessment", color: "bg-amber-100 text-amber-700", icon: ClipboardCheck },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  discussion: { label: "Discussion", color: "bg-orange-100 text-orange-700", icon: MessageSquare },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  innovation_board: { label: "Innovation Board", color: "bg-purple-100 text-purple-700", icon: Presentation },
  professor_review: { label: "Professor Review", color: "bg-indigo-100 text-indigo-700", icon: GraduationCap },
  meetup: { label: "Startup Meetup", color: "bg-teal-100 text-teal-700", icon: Handshake },
  enrolled: { label: "Enrolled", color: "bg-emerald-100 text-emerald-700", icon: Trophy },
};

const PIPELINE_STAGES: ProposalStatus[] = [
  "submitted", "voting", "sniff_assessment", "approved", "discussion", "rejected",
  "innovation_board", "professor_review", "meetup", "enrolled",
];

function StatusBadge({ status }: { status: ProposalStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? "text-emerald-600" : score >= 65 ? "text-orange-600" : "text-red-600";
  const bg = score >= 75 ? "bg-emerald-50" : score >= 65 ? "bg-orange-50" : "bg-red-50";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color} ${bg}`}>
      {score}%
    </span>
  );
}

export default function ProposalsPage() {
  const store = useStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProposalStatus | "all">("all");
  const stats = store.getProposalStats();

  const filtered = store.proposals
    .filter((p) => filterStatus === "all" || p.status === filterStatus)
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.submitter_name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Proposal Assessment Pipeline</h1>
          <p className="text-sm text-navy-500 mt-0.5">
            Track proposals through voting, SNIF assessment, and approval stages
          </p>
        </div>
        <Link
          href="/create-challenge"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> New Proposal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-navy-900">{stats.total}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">In Voting</p>
          <p className="text-2xl font-bold text-blue-600">{stats.byStatus["voting"] || 0}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.byStatus["approved"] || 0}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Discussion</p>
          <p className="text-2xl font-bold text-orange-600">{stats.byStatus["discussion"] || 0}</p>
        </div>
        <div className="card-surface px-4 py-3">
          <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Avg Score</p>
          <p className="text-2xl font-bold text-navy-900">{stats.avgScore}%</p>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="card-surface p-4">
        <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide mb-3">Assessment Pipeline</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {PIPELINE_STAGES.filter(s => s !== "rejected").map((stage, i) => {
            const config = STATUS_CONFIG[stage];
            const count = stats.byStatus[stage] || 0;
            return (
              <div key={stage} className="flex items-center shrink-0">
                <button
                  onClick={() => setFilterStatus(filterStatus === stage ? "all" : stage)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    filterStatus === stage
                      ? "bg-accent-500 text-white"
                      : count > 0
                      ? config.color
                      : "bg-navy-50 text-navy-400"
                  }`}
                >
                  <config.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{config.label}</span>
                  {count > 0 && (
                    <span className={`ml-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full ${
                      filterStatus === stage ? "bg-white/20" : "bg-white/60"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
                {i < PIPELINE_STAGES.filter(s => s !== "rejected").length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-navy-300 mx-0.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
        </div>
        {filterStatus !== "all" && (
          <button
            onClick={() => setFilterStatus("all")}
            className="text-xs text-accent-600 hover:text-accent-700 font-medium"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Proposal list */}
      <div className="space-y-3">
        {filtered.map((proposal) => (
          <Link
            key={proposal.id}
            href={`/proposals/${proposal.id}`}
            className="card-surface p-4 flex items-center gap-4 hover:border-accent-500/30 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-navy-900 truncate group-hover:text-accent-600 transition-colors">
                  {proposal.title}
                </h3>
                <StatusBadge status={proposal.status} />
                {proposal.assessment && <ScoreBadge score={proposal.assessment.total_score} />}
              </div>
              <p className="text-xs text-navy-500 line-clamp-1">{proposal.description}</p>
              <div className="flex items-center gap-3 mt-2 text-[0.65rem] text-navy-400">
                <span>{proposal.submitter_org}</span>
                <span className="w-1 h-1 rounded-full bg-navy-300" />
                <span>{proposal.domain}</span>
                <span className="w-1 h-1 rounded-full bg-navy-300" />
                <span>{proposal.votes.length} votes</span>
                <span className="w-1 h-1 rounded-full bg-navy-300" />
                <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Vote summary */}
            <div className="shrink-0 flex items-center gap-2">
              <div className="flex -space-x-1">
                {proposal.votes.slice(0, 4).map((v) => (
                  <div
                    key={v.id}
                    title={`${v.voter_name}: ${v.interested ? "Interested" : "Not interested"}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.5rem] font-bold border-2 border-white ${
                      v.interested ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.voter_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                ))}
              </div>
              <ChevronRight className="w-4 h-4 text-navy-300" />
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-navy-400">
            <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No proposals found</p>
          </div>
        )}
      </div>
    </div>
  );
}
