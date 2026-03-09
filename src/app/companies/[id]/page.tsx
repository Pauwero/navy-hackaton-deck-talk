"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft, Star, Globe, Mail, Users, ExternalLink, Target, Sparkles } from "lucide-react";
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
      <Link href="/companies" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl avatar-blue flex items-center justify-center text-lg font-bold text-white">
              {company.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">{company.name}</h1>
              <p className="text-accent-500 font-medium">{company.sector}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-warning-500/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-warning-500" />
            <span className="text-sm text-warning-500 font-semibold">{company.quality_score}/100</span>
          </div>
        </div>

        <p className="text-navy-600 mb-5 leading-relaxed">{company.description}</p>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-1.5">
              {company.capabilities.map((cap) => (
                <span key={cap} className="tag-pill border-blue-200 text-blue-600 bg-blue-50">{cap}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-1.5">
              {company.technologies.map((tech) => (
                <span key={tech} className="tag-pill border-purple-200 text-purple-600 bg-purple-50">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-5">
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">TRL Level</p>
            <p className="text-xl font-bold text-navy-900">{company.trl_level}/9</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Team Size</p>
            <p className="text-lg font-bold text-navy-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-navy-400" /> {company.team_size}
            </p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Contact</p>
            <p className="text-sm text-accent-500 flex items-center gap-1 truncate">
              <Mail className="w-3.5 h-3.5" /> {company.contact_email}
            </p>
          </div>
        </div>

        {company.use_cases.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Use Cases</h3>
            <ul className="space-y-1.5">
              {company.use_cases.map((uc) => (
                <li key={uc} className="text-sm text-navy-600 flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0" /> {uc}
                </li>
              ))}
            </ul>
          </div>
        )}

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

        <div className="border-t border-navy-100 pt-4 mt-4">
          <AudioSnippet
            itemId={company.id}
            itemType="company"
            title={company.name}
            description={company.description}
          />
        </div>
      </div>

      {/* Recommended Challenges (#11) */}
      {challengeItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            Recommended Challenges for You
          </h2>
          <div className="space-y-3">
            {challengeItems.map(({ match, challenge }) => (
              <Link key={match.id} href={`/challenges/${challenge!.id}`} className="card p-4 flex items-center gap-4 block">
                <div className="w-11 h-11 rounded-full avatar-orange flex items-center justify-center text-white shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-900">{challenge!.title}</p>
                  <p className="text-xs text-navy-400">{challenge!.domain} | TRL {challenge!.desired_trl} | {match.score}% match</p>
                </div>
                <span className={`tag-pill shrink-0 bg-success-500/10 text-success-500 border-success-200`}>
                  {match.score}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-navy-900 mb-4">All AI Matches</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {matches.slice(0, 6).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
