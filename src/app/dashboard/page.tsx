"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Target,
  Search,
  ArrowRight,
  TrendingUp,
  Shield,
  Filter,
  ChevronRight,
  User,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import MatchCard from "@/components/MatchCard";

export default function DashboardPage() {
  const store = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"matches" | "companies" | "research" | "challenges" | "proposals">("matches");
  const [domainFilter, setDomainFilter] = useState<string>("");

  useEffect(() => {
    if (store.matches.length === 0) {
      store.runMatchmaking();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return store.searchWithRelevance(searchQuery);
  }, [searchQuery, store]);

  const profileMatches = store.getProfileMatches();
  const { userProfile } = store;
  const proposalStats = store.getProposalStats();

  // Filtered companies/research for browse tabs
  const filteredCompanies = useMemo(() => {
    let items = store.companies;
    if (searchQuery.trim()) {
      const results = store.searchWithRelevance(searchQuery);
      items = results.companies;
    }
    if (domainFilter) {
      items = items.filter((c) =>
        c.sector.toLowerCase().includes(domainFilter.toLowerCase()) ||
        c.capabilities.some((cap) => cap.toLowerCase().includes(domainFilter.toLowerCase()))
      );
    }
    return items;
  }, [store, searchQuery, domainFilter]);

  const filteredResearch = useMemo(() => {
    let items = store.research;
    if (searchQuery.trim()) {
      const results = store.searchWithRelevance(searchQuery);
      items = results.research;
    }
    if (domainFilter) {
      items = items.filter((r) =>
        r.field.toLowerCase().includes(domainFilter.toLowerCase()) ||
        r.keywords.some((kw) => kw.toLowerCase().includes(domainFilter.toLowerCase()))
      );
    }
    return items;
  }, [store, searchQuery, domainFilter]);

  const filteredChallenges = useMemo(() => {
    let items = store.challenges;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (domainFilter) {
      items = items.filter((c) =>
        c.domain.toLowerCase().includes(domainFilter.toLowerCase())
      );
    }
    return items;
  }, [store, searchQuery, domainFilter]);

  const filteredProposals = useMemo(() => {
    let items = store.proposals;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q)
      );
    }
    return items;
  }, [store, searchQuery]);

  const domains = ["Autonomous Systems", "Cybersecurity", "Data Analytics", "Energy", "Materials"];

  const priorityColor: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-navy-100 text-navy-600",
  };

  const statusColor: Record<string, string> = {
    open: "bg-emerald-100 text-emerald-700",
    in_review: "bg-blue-100 text-blue-700",
    matched: "bg-purple-100 text-purple-700",
    closed: "bg-navy-100 text-navy-600",
  };

  const proposalStatusColor = (status: string) => {
    if (status === "approved" || status === "enrolled") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "discussion") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div>
      {/* Profile banner */}
      <div className="card p-5 mb-6 border-l-4 border-l-accent-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg avatar-navy flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-900">{userProfile.name}</h1>
              <p className="text-sm text-navy-500">{userProfile.organization} &middot; {userProfile.role.replace("_", " ")}</p>
            </div>
          </div>
          <Link href="/profile" className="text-accent-500 text-sm font-medium flex items-center gap-1 hover:underline">
            Edit Profile <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {userProfile.interests.map((interest) => (
            <span key={interest} className="tag-pill border-accent-500/30 text-accent-500 bg-accent-500/5">
              {interest}
            </span>
          ))}
          <span className="tag-pill border-navy-200 text-navy-500 bg-navy-50">
            TRL {userProfile.preferred_trl_range[0]}-{userProfile.preferred_trl_range[1]}
          </span>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, research, challenges, proposals..."
            className="w-full bg-white border border-navy-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="appearance-none bg-white border border-navy-200 rounded-lg pl-9 pr-8 py-2.5 text-sm text-navy-700 focus:outline-none focus:border-accent-500 cursor-pointer"
          >
            <option value="">All Domains</option>
            {domains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 mb-6 border-b border-navy-100 overflow-x-auto">
        {[
          { key: "matches" as const, label: "Your Matches", icon: TrendingUp, count: profileMatches.length },
          { key: "challenges" as const, label: "Challenges", icon: Target, count: filteredChallenges.length },
          { key: "proposals" as const, label: "Proposals", icon: ClipboardCheck, count: filteredProposals.length },
          { key: "companies" as const, label: "Companies", icon: Building2, count: filteredCompanies.length },
          { key: "research" as const, label: "Research", icon: FlaskConical, count: filteredResearch.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-accent-500 text-accent-500"
                  : "border-transparent text-navy-500 hover:text-navy-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeTab === tab.key ? "bg-accent-500/10 text-accent-500" : "bg-navy-100 text-navy-400"
              }`}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "matches" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-500" />
              <h2 className="text-sm font-semibold text-navy-700">AI-recommended matches based on your profile</h2>
            </div>
            <Link href="/matches" className="text-accent-500 text-sm font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {profileMatches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <TrendingUp className="w-8 h-8 text-navy-300 mx-auto mb-2" />
              <p className="text-navy-500 text-sm">Matches will appear here after matchmaking runs.</p>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-navy-900">{store.challenges.filter((c) => c.status === "open").length}</p>
              <p className="text-xs text-navy-500 mt-1">Open Challenges</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-navy-900">{proposalStats.total}</p>
              <p className="text-xs text-navy-500 mt-1">Proposals</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-navy-900">{store.companies.length}</p>
              <p className="text-xs text-navy-500 mt-1">Companies</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-bold text-navy-900">{store.research.length}</p>
              <p className="text-xs text-navy-500 mt-1">Research Projects</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "challenges" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-700">Active Naval Challenges</h2>
            <Link href="/create-challenge" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> New Challenge
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge) => {
              const proposalCount = store.getProposalsForChallenge(challenge.id).length;
              return (
                <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="card p-4 block group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded ${priorityColor[challenge.priority]}`}>
                      {challenge.priority}
                    </span>
                    <span className={`text-[0.6rem] font-medium px-1.5 py-0.5 rounded ${statusColor[challenge.status]}`}>
                      {challenge.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-navy-900 text-sm group-hover:text-accent-500 transition-colors mb-1 line-clamp-2">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-navy-500 line-clamp-2 mb-3">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[0.6rem] text-navy-500 bg-navy-50 px-1.5 py-0.5 rounded">{challenge.domain}</span>
                      <span className="text-[0.6rem] text-navy-400 bg-navy-50 px-1.5 py-0.5 rounded">TRL {challenge.desired_trl}</span>
                    </div>
                    {proposalCount > 0 && (
                      <span className="text-[0.6rem] font-medium text-accent-600 bg-accent-500/10 px-1.5 py-0.5 rounded">
                        {proposalCount} proposal{proposalCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
            {filteredChallenges.length === 0 && (
              <div className="col-span-full card p-8 text-center">
                <p className="text-navy-400 text-sm">No challenges match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "proposals" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-700">Proposal Pipeline</h2>
            <Link href="/proposals" className="text-accent-500 text-sm font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
              Full View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pipeline stats */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
            {[
              { label: "In Voting", count: proposalStats.byStatus["voting"] || 0, color: "text-blue-600" },
              { label: "Assessment", count: proposalStats.byStatus["sniff_assessment"] || 0, color: "text-amber-600" },
              { label: "Approved", count: proposalStats.byStatus["approved"] || 0, color: "text-emerald-600" },
              { label: "Discussion", count: proposalStats.byStatus["discussion"] || 0, color: "text-orange-600" },
              { label: "Enrolled", count: proposalStats.byStatus["enrolled"] || 0, color: "text-emerald-700" },
            ].map((s) => (
              <div key={s.label} className="card p-3 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-[0.6rem] text-navy-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {filteredProposals.map((proposal) => (
              <Link key={proposal.id} href={`/proposals/${proposal.id}`} className="card p-4 block group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    proposal.status === "approved" || proposal.status === "enrolled" ? "bg-emerald-100" :
                    proposal.status === "rejected" ? "bg-red-100" :
                    proposal.status === "discussion" ? "bg-orange-100" :
                    "bg-blue-100"
                  }`}>
                    {proposal.status === "approved" || proposal.status === "enrolled" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                     proposal.status === "rejected" ? <XCircle className="w-4 h-4 text-red-600" /> :
                     proposal.status === "discussion" ? <AlertTriangle className="w-4 h-4 text-orange-600" /> :
                     <ClipboardCheck className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-navy-900 group-hover:text-accent-500 transition-colors truncate">
                        {proposal.title}
                      </h3>
                      <span className={`text-[0.6rem] font-medium px-1.5 py-0.5 rounded ${proposalStatusColor(proposal.status)}`}>
                        {proposal.status.replace(/_/g, " ")}
                      </span>
                      {proposal.assessment && (
                        <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded ${
                          proposal.assessment.total_score >= 75 ? "bg-emerald-50 text-emerald-600" :
                          proposal.assessment.total_score >= 65 ? "bg-orange-50 text-orange-600" :
                          "bg-red-50 text-red-600"
                        }`}>
                          {proposal.assessment.total_score}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-500">{proposal.submitter_org} · {proposal.domain} · {proposal.votes.length} votes</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-navy-300 shrink-0" />
                </div>
              </Link>
            ))}
            {filteredProposals.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-navy-400 text-sm">No proposals match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "companies" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((c) => (
            <Link key={c.id} href={`/companies/${c.id}`} className="card p-4 block group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg avatar-blue flex items-center justify-center text-white text-xs font-bold">
                  {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900 text-sm group-hover:text-accent-500 transition-colors truncate">{c.name}</p>
                  <p className="text-xs text-navy-500">{c.sector}</p>
                </div>
                <span className="text-xs font-semibold text-navy-400 bg-navy-50 px-2 py-0.5 rounded">TRL {c.trl_level}</span>
              </div>
              <p className="text-xs text-navy-500 line-clamp-2 mb-2">{c.description}</p>
              <div className="flex flex-wrap gap-1">
                {c.capabilities.slice(0, 3).map((cap) => (
                  <span key={cap} className="text-[0.65rem] text-accent-600 bg-accent-500/8 px-1.5 py-0.5 rounded">{cap}</span>
                ))}
              </div>
            </Link>
          ))}
          {filteredCompanies.length === 0 && (
            <div className="col-span-full card p-8 text-center">
              <p className="text-navy-400 text-sm">No companies match your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "research" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResearch.map((r) => (
            <Link key={r.id} href={`/research/${r.id}`} className="card p-4 block group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg avatar-purple flex items-center justify-center text-white text-xs font-bold">
                  {r.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900 text-sm group-hover:text-accent-500 transition-colors truncate">{r.title}</p>
                  <p className="text-xs text-navy-500">{r.institution}</p>
                </div>
                <span className="text-xs font-semibold text-navy-400 bg-navy-50 px-2 py-0.5 rounded">TRL {r.trl_level}</span>
              </div>
              <p className="text-xs text-navy-500 line-clamp-2 mb-2">{r.description}</p>
              <div className="flex flex-wrap gap-1">
                {r.keywords.slice(0, 3).map((kw) => (
                  <span key={kw} className="text-[0.65rem] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{kw}</span>
                ))}
              </div>
            </Link>
          ))}
          {filteredResearch.length === 0 && (
            <div className="col-span-full card p-8 text-center">
              <p className="text-navy-400 text-sm">No research matches your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
