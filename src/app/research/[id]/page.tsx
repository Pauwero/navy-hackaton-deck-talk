"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FlaskConical, ArrowLeft, Star, Mail, BookOpen, Handshake, Target, Sparkles, Brain, CheckCircle2, Database } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

export default function ResearchDetailPage() {
  const params = useParams();
  const store = useStore();
  const research = store.research.find((r) => r.id === params.id);

  if (!research) {
    return (
      <div className="card p-16 text-center max-w-md mx-auto">
        <p className="text-navy-500">Research not found.</p>
        <Link href="/research" className="text-accent-500 hover:underline mt-2 inline-block text-sm">Back to Research</Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(research.id);
  const recommendedChallenges = store.getRecommendedChallenges(research.id);
  const challengeItems = recommendedChallenges
    .map((m) => {
      const chalId = m.source_type === "challenge" ? m.source_id : m.target_id;
      return { match: m, challenge: store.challenges.find((c) => c.id === chalId) };
    })
    .filter((x) => x.challenge);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/research" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Research
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl avatar-purple flex items-center justify-center text-lg font-bold text-white">
              {research.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">{research.title}</h1>
              <p className="text-purple-500 font-medium">{research.institution}</p>
              <p className="text-sm text-navy-400">PI: {research.principal_investigator}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-warning-500/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-warning-500" />
            <span className="text-sm text-warning-500 font-semibold">{research.quality_score}/100</span>
          </div>
        </div>

        <p className="text-navy-600 mb-5 leading-relaxed">{research.description}</p>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {research.keywords.map((kw) => (
                <span key={kw} className="tag-pill border-purple-200 text-purple-600 bg-purple-50">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" /> Collaboration Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {research.collaboration_interest.map((ci) => (
                <span key={ci} className="tag-pill border-accent-200 text-accent-500 bg-accent-500/5">{ci}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-5">
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">TRL Level</p>
            <p className="text-xl font-bold text-navy-900">{research.trl_level}/9</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Field</p>
            <p className="text-sm font-bold text-navy-900">{research.field}</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Funding</p>
            <p className="text-sm font-bold text-navy-900">{research.funding_status}</p>
          </div>
        </div>

        {research.publications.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Publications
            </h3>
            <ul className="space-y-1.5">
              {research.publications.map((pub) => (
                <li key={pub} className="text-sm text-navy-600 flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" /> {pub}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-accent-500 mb-4">
          <Mail className="w-3.5 h-3.5" /> {research.contact_email}
        </div>

        <div className="border-t border-navy-100 pt-4">
          <AudioSnippet itemId={research.id} itemType="research" title={research.title} description={research.description} />
        </div>
      </div>

      {/* AI Knowledge / Memory Section */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-navy-900">AI Knowledge Memory</h2>
        </div>
        <p className="text-sm text-navy-600 mb-4">
          The following data from this research profile has been indexed and is used by the AI for matchmaking and analysis.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {/* Indexed fields */}
          <div className="bg-purple-50/50 rounded-lg p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Indexed Data Points
            </h3>
            {[
              { label: "Title", value: research.title, indexed: true },
              { label: "Institution", value: research.institution, indexed: true },
              { label: "Field", value: research.field, indexed: true },
              { label: "TRL Level", value: `TRL ${research.trl_level}`, indexed: true },
              { label: "Keywords", value: `${research.keywords.length} keywords`, indexed: true },
              { label: "Publications", value: `${research.publications.length} papers`, indexed: research.publications.length > 0 },
              { label: "Description", value: `${research.description.length} characters`, indexed: research.description.length >= 100 },
              { label: "Collaboration Interests", value: `${research.collaboration_interest.length} topics`, indexed: research.collaboration_interest.length > 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.indexed ? "text-emerald-500" : "text-navy-300"}`} />
                  <span className="text-navy-700">{item.label}</span>
                </div>
                <span className="text-xs text-navy-500 truncate max-w-[200px]">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Match activity */}
          <div className="bg-navy-50 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Match Activity
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Total Matches Found</span>
                <span className="text-sm font-bold text-navy-900">{matches.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Challenge Matches</span>
                <span className="text-sm font-bold text-navy-900">{challengeItems.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Quality Score</span>
                <span className={`text-sm font-bold ${
                  research.quality_score >= 80 ? "text-emerald-600" :
                  research.quality_score >= 60 ? "text-amber-600" : "text-red-600"
                }`}>{research.quality_score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-600">Last Updated</span>
                <span className="text-xs text-navy-500">{new Date(research.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            {matches.length > 0 && (
              <div className="pt-2 border-t border-navy-200">
                <p className="text-xs text-navy-500">
                  Top match score: <span className="font-bold text-gold-600">{Math.max(...matches.map((m) => m.score))}%</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Keywords cloud */}
        <div className="mt-4 pt-4 border-t border-navy-100">
          <h3 className="text-xs font-bold text-navy-700 uppercase tracking-wide mb-2">Indexed Keywords (used for matching)</h3>
          <div className="flex flex-wrap gap-1.5">
            {research.keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {kw}
              </span>
            ))}
            {research.collaboration_interest.map((ci) => (
              <span key={ci} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700 border border-accent-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {ci}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Challenges (#17) */}
      {challengeItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            Recommended Challenges for This Research
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
                <span className="tag-pill shrink-0 bg-success-500/10 text-success-500 border-success-200">
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
