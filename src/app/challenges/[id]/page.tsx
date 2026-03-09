"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Target, ArrowLeft, Star, Clock, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

const priorityStyles: Record<string, string> = {
  critical: "bg-danger-500/10 text-danger-500 border-danger-200",
  high: "bg-warning-500/10 text-warning-500 border-warning-200",
  medium: "bg-accent-500/10 text-accent-500 border-accent-200",
  low: "bg-navy-100 text-navy-400 border-navy-200",
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const store = useStore();
  const challenge = store.challenges.find((c) => c.id === params.id);

  if (!challenge) {
    return (
      <div className="card p-16 text-center max-w-md mx-auto">
        <p className="text-navy-500">Challenge not found.</p>
        <Link href="/challenges" className="text-accent-500 hover:underline mt-2 inline-block text-sm">Back to Challenges</Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(challenge.id);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/challenges" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl avatar-orange flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">{challenge.title}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`tag-pill ${priorityStyles[challenge.priority]}`}>
                  {challenge.priority === "critical" && <AlertCircle className="w-3 h-3" />}
                  {challenge.priority.toUpperCase()}
                </span>
                <span className="text-sm text-navy-400">{challenge.domain}</span>
                <span className="tag-pill bg-navy-50 text-navy-500 border-navy-200">{challenge.classification}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-warning-500/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-warning-500" />
            <span className="text-sm text-warning-500 font-semibold">{challenge.quality_score}/100</span>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-1.5">Description</h3>
          <p className="text-navy-600 leading-relaxed">{challenge.description}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-1.5">Operational Context</h3>
          <p className="text-navy-500 text-sm leading-relaxed">{challenge.operational_context}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Requirements
          </h3>
          <ul className="space-y-1.5">
            {challenge.requirements.map((req) => (
              <li key={req} className="text-sm text-navy-600 flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" /> {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-5">
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Desired TRL</p>
            <p className="text-xl font-bold text-navy-900">{challenge.desired_trl}/9</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Timeline</p>
            <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-navy-400" /> {challenge.timeline}
            </p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Status</p>
            <p className="text-sm font-bold text-success-500">{challenge.status.replace("_", " ")}</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Classification</p>
            <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-navy-400" /> {challenge.classification}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {challenge.tags.map((tag) => (
            <span key={tag} className="tag-pill border-orange-200 text-orange-600 bg-orange-50">{tag}</span>
          ))}
        </div>

        <div className="border-t border-navy-100 pt-4">
          <AudioSnippet itemId={challenge.id} itemType="challenge" title={challenge.title} description={challenge.description} />
        </div>
      </div>

      {matches.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-navy-900 mb-4">AI-Recommended Matches</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {matches.slice(0, 8).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
