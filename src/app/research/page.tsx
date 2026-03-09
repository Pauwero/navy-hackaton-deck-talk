"use client";

import Link from "next/link";
import { FlaskConical, Plus, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";

const avatarColors = ["avatar-purple", "avatar-green", "avatar-pink", "avatar-blue"];

export default function ResearchPage() {
  const { research } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Research Profiles</h1>
            <p className="text-sm text-navy-400">{research.length} research projects</p>
          </div>
        </div>
        <Link
          href="/research/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Submit
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {research.map((r, i) => (
          <div key={r.id} className="card p-5">
            {/* Header with avatar */}
            <div className="flex items-center gap-3 mb-2">
              <div className={`avatar w-12 h-12 text-sm ${avatarColors[i % avatarColors.length]}`}>
                {r.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/research/${r.id}`} className="font-bold text-navy-900 hover:text-accent-500 transition-colors block truncate">
                  {r.title}
                </Link>
                <p className="text-sm text-purple-500">{r.institution}</p>
                <p className="text-xs text-navy-400">PI: {r.principal_investigator}</p>
              </div>
              <div className="flex items-center gap-1 text-sm bg-warning-500/10 px-2 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-warning-500" />
                <span className="text-warning-500 font-semibold text-xs">{r.quality_score}</span>
              </div>
            </div>

            <p className="text-sm text-navy-500 mb-3 line-clamp-2">{r.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {r.keywords.slice(0, 4).map((kw) => (
                <span key={kw} className="tag-pill border-purple-200 text-purple-600 bg-purple-50">
                  {kw}
                </span>
              ))}
              <span className="tag-pill border-navy-200 text-navy-500 bg-navy-50">
                TRL {r.trl_level}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-navy-100">
              <AudioSnippet itemId={r.id} itemType="research" title={r.title} description={r.description} />
              <Link href={`/research/${r.id}`} className="flex items-center gap-1.5 text-accent-500 text-sm font-semibold hover:gap-2 transition-all">
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
