"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Mail, Users, ExternalLink, Target, Zap, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

export default function CompanyDetailPage() {
  const params = useParams();
  const store = useStore();
  const company = store.companies.find((c) => c.id === params.id);

  if (!company) {
    return (
      <div className="card p-16 text-center max-w-md mx-auto">
        <p className="text-navy-500">Company not found.</p>
        <Link href="/companies" className="text-accent-500 hover:underline mt-2 inline-block text-sm">
          Back to Companies
        </Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(company.id);
  const recommendedChallenges = store.getRecommendedChallenges(company.id);
  const challengeItems = recommendedChallenges
    .map((m) => {
      const chalId = m.source_type === "challenge" ? m.source_id : m.target_id;
      return { match: m, challenge: store.challenges.find((c) => c.id === chalId) };
    })
    .filter((x) => x.challenge);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/companies" className="flex items-center gap-1 text-navy-500 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Companies
      </Link>

      {/* Header */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl avatar-blue flex items-center justify-center text-lg font-bold text-white">
              {company.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-900">{company.name}</h1>
              <p className="text-sm text-navy-500">{company.sector}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-navy-700 bg-navy-50 px-3 py-1.5 rounded-lg">TRL {company.trl_level}/9</span>
        </div>

        <p className="text-sm text-navy-700 leading-relaxed mb-4">{company.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-navy-50 rounded-lg p-3">
            <p className="text-xs text-navy-500 font-medium mb-1">Team</p>
            <p className="text-sm font-semibold text-navy-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-navy-400" /> {company.team_size}
            </p>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <p className="text-xs text-navy-500 font-medium mb-1">Contact</p>
            <p className="text-xs text-accent-500 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 shrink-0" /> {company.contact_email}
            </p>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <p className="text-xs text-navy-500 font-medium mb-1">Quality</p>
            <p className="text-sm font-semibold text-navy-800">{company.quality_score}/100</p>
          </div>
        </div>

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent-500 hover:underline"
          >
            <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <div className="border-t border-navy-100 pt-3 mt-3">
          <AudioSnippet itemId={company.id} itemType="company" title={company.name} description={company.description} />
        </div>
      </div>

      {/* Use Cases — main showcase */}
      {company.use_cases.length > 0 && (
        <div className="card p-6 mb-4">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-500" />
            Proven Use Cases & Track Record
          </h2>
          <div className="grid gap-3">
            {company.use_cases.map((uc, i) => (
              <div key={uc} className="flex items-start gap-3 p-3 bg-success-500/5 border border-success-500/10 rounded-lg">
                <div className="w-7 h-7 rounded-md bg-success-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-success-500">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-800">{uc}</p>
                  <p className="text-xs text-navy-500 mt-0.5">Demonstrated capability with defense-relevant application</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capabilities & Technologies */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="card p-5">
          <h3 className="text-xs font-bold text-navy-500 uppercase tracking-wide mb-3">Capabilities</h3>
          <div className="flex flex-wrap gap-1.5">
            {company.capabilities.map((cap) => (
              <span key={cap} className="tag-pill border-accent-500/20 text-accent-600 bg-accent-500/5">{cap}</span>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-xs font-bold text-navy-500 uppercase tracking-wide mb-3">Technologies</h3>
          <div className="flex flex-wrap gap-1.5">
            {company.technologies.map((tech) => (
              <span key={tech} className="tag-pill border-purple-200 text-purple-600 bg-purple-50">{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Challenges */}
      {challengeItems.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-gold-500" />
            Matching Challenges
          </h2>
          <div className="space-y-2">
            {challengeItems.map(({ match, challenge }) => (
              <Link key={match.id} href={`/challenges/${challenge!.id}`} className="card p-3 flex items-center gap-3 block group">
                <div className="w-9 h-9 rounded-lg avatar-gold flex items-center justify-center text-white shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 group-hover:text-accent-500 transition-colors">{challenge!.title}</p>
                  <p className="text-xs text-navy-500">{challenge!.domain} &middot; TRL {challenge!.desired_trl}</p>
                </div>
                <span className="text-xs font-bold text-success-500 bg-success-500/10 px-2 py-1 rounded">{match.score}%</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-500" />
            All AI Matches
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {matches.slice(0, 6).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
