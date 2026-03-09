"use client";

import Link from "next/link";
import { Target, Plus, Star, ArrowRight, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";

const priorityStyles: Record<string, string> = {
  critical: "bg-danger-500/10 text-danger-500 border-danger-200",
  high: "bg-warning-500/10 text-warning-500 border-warning-200",
  medium: "bg-accent-500/10 text-accent-500 border-accent-200",
  low: "bg-navy-100 text-navy-400 border-navy-200",
};

const statusStyles: Record<string, string> = {
  open: "bg-success-500/10 text-success-500 border-success-200",
  in_review: "bg-warning-500/10 text-warning-500 border-warning-200",
  matched: "bg-accent-500/10 text-accent-500 border-accent-200",
  closed: "bg-navy-100 text-navy-400 border-navy-200",
};

export default function ChallengesPage() {
  const { challenges } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Navy Challenges</h1>
            <p className="text-sm text-navy-400">{challenges.length} active challenges</p>
          </div>
        </div>
        <Link
          href="/challenges/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Post Challenge
        </Link>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full avatar-orange flex items-center justify-center text-white shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link href={`/challenges/${challenge.id}`} className="text-lg font-bold text-navy-900 hover:text-accent-500 transition-colors">
                      {challenge.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`tag-pill ${priorityStyles[challenge.priority]}`}>
                        {challenge.priority === "critical" && <AlertCircle className="w-3 h-3" />}
                        {challenge.priority}
                      </span>
                      <span className={`tag-pill ${statusStyles[challenge.status]}`}>
                        {challenge.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-navy-400">{challenge.domain}</span>
                      <span className="text-xs text-navy-300">TRL {challenge.desired_trl} | {challenge.timeline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-warning-500/10 px-2 py-1 rounded-full shrink-0">
                    <Star className="w-3.5 h-3.5 text-warning-500" />
                    <span className="text-warning-500 font-semibold text-xs">{challenge.quality_score}</span>
                  </div>
                </div>

                <p className="text-sm text-navy-500 mb-3 line-clamp-2">{challenge.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {challenge.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="tag-pill border-orange-200 text-orange-600 bg-orange-50">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy-100">
                  <AudioSnippet itemId={challenge.id} itemType="challenge" title={challenge.title} description={challenge.description} />
                  <Link href={`/challenges/${challenge.id}`} className="flex items-center gap-1.5 text-accent-500 text-sm font-semibold hover:gap-2 transition-all">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
