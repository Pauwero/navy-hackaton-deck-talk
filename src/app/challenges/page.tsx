"use client";

import Link from "next/link";
import { Target, Plus, Star, ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";

const priorityColors: Record<string, string> = {
  critical: "bg-danger-500/20 text-danger-400",
  high: "bg-warning-500/20 text-warning-400",
  medium: "bg-accent-500/20 text-accent-400",
  low: "bg-navy-700 text-navy-400",
};

const statusColors: Record<string, string> = {
  open: "bg-success-500/20 text-success-400",
  in_review: "bg-warning-500/20 text-warning-400",
  matched: "bg-accent-500/20 text-accent-400",
  closed: "bg-navy-700 text-navy-400",
};

export default function ChallengesPage() {
  const { challenges } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-orange-400" />
            Navy Challenges
          </h1>
          <p className="text-sm text-navy-400 mt-1">{challenges.length} active challenges</p>
        </div>
        <Link
          href="/challenges/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Post Challenge
        </Link>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-navy-800 rounded-xl p-5 border border-navy-700 hover:border-navy-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/challenges/${challenge.id}`} className="text-lg font-semibold text-white hover:text-accent-400 transition-colors">
                    {challenge.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[challenge.priority]}`}>
                    {challenge.priority === "critical" && <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                    {challenge.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColors[challenge.status]}`}>
                    {challenge.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-navy-400">{challenge.domain}</span>
                  <span className="text-xs text-navy-500">TRL {challenge.desired_trl} | {challenge.timeline}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 text-warning-400" />
                <span className="text-navy-300">{challenge.quality_score}</span>
              </div>
            </div>

            <p className="text-sm text-navy-300 mb-3 line-clamp-2">{challenge.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {challenge.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <AudioSnippet itemId={challenge.id} itemType="challenge" title={challenge.title} description={challenge.description} />
              <Link href={`/challenges/${challenge.id}`} className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
