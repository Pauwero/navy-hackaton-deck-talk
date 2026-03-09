"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Target, ArrowLeft, Star, Clock, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

const priorityColors: Record<string, string> = {
  critical: "text-danger-400",
  high: "text-warning-400",
  medium: "text-accent-400",
  low: "text-navy-400",
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const store = useStore();
  const challenge = store.challenges.find((c) => c.id === params.id);

  if (!challenge) {
    return (
      <div className="text-center py-16">
        <p className="text-navy-400">Challenge not found.</p>
        <Link href="/challenges" className="text-accent-400 hover:underline mt-2 inline-block">Back to Challenges</Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(challenge.id);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/challenges" className="flex items-center gap-1 text-navy-400 hover:text-navy-200 text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Target className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-semibold ${priorityColors[challenge.priority]}`}>
                  {challenge.priority === "critical" && <AlertCircle className="w-3.5 h-3.5 inline mr-0.5" />}
                  {challenge.priority.toUpperCase()}
                </span>
                <span className="text-navy-500">|</span>
                <span className="text-sm text-navy-400">{challenge.domain}</span>
                <span className="text-navy-500">|</span>
                <span className="text-xs bg-navy-700 text-navy-300 px-2 py-0.5 rounded">{challenge.classification}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning-400" />
            <span className="text-sm text-navy-300">{challenge.quality_score}/100</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-navy-400 mb-1">Description</h3>
          <p className="text-navy-200">{challenge.description}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-navy-400 mb-1">Operational Context</h3>
          <p className="text-navy-300 text-sm">{challenge.operational_context}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-navy-400 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Requirements
          </h3>
          <ul className="space-y-1">
            {challenge.requirements.map((req) => (
              <li key={req} className="text-sm text-navy-300 flex gap-2">
                <span className="text-orange-400 mt-0.5">•</span> {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Desired TRL</p>
            <p className="text-lg font-bold text-white">{challenge.desired_trl}/9</p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Timeline</p>
            <p className="text-sm font-semibold text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-navy-400" /> {challenge.timeline}
            </p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Status</p>
            <p className="text-sm font-semibold text-success-400">{challenge.status.replace("_", " ")}</p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Classification</p>
            <p className="text-sm font-semibold text-white flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-navy-400" /> {challenge.classification}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {challenge.tags.map((tag) => (
            <span key={tag} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>

        <div className="border-t border-navy-700 pt-4">
          <AudioSnippet itemId={challenge.id} itemType="challenge" title={challenge.title} description={challenge.description} />
        </div>
      </div>

      {matches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">AI-Recommended Matches</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {matches.slice(0, 8).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
