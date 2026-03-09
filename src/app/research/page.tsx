"use client";

import Link from "next/link";
import { FlaskConical, Plus, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";

export default function ResearchPage() {
  const { research } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-purple-400" />
            Research Profiles
          </h1>
          <p className="text-sm text-navy-400 mt-1">{research.length} research projects</p>
        </div>
        <Link
          href="/research/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Submit Research
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {research.map((r) => (
          <div
            key={r.id}
            className="bg-navy-800 rounded-xl p-5 border border-navy-700 hover:border-navy-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link href={`/research/${r.id}`} className="text-lg font-semibold text-white hover:text-accent-400 transition-colors">
                  {r.title}
                </Link>
                <p className="text-sm text-purple-400">{r.institution}</p>
                <p className="text-xs text-navy-400">PI: {r.principal_investigator}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 text-warning-400" />
                <span className="text-navy-300">{r.quality_score}</span>
              </div>
            </div>

            <p className="text-sm text-navy-300 mb-3 line-clamp-2">{r.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {r.keywords.slice(0, 4).map((kw) => (
                <span key={kw} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  {kw}
                </span>
              ))}
              <span className="text-xs bg-navy-900 text-navy-400 px-2 py-0.5 rounded">
                TRL {r.trl_level}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <AudioSnippet itemId={r.id} itemType="research" title={r.title} description={r.description} />
              <Link href={`/research/${r.id}`} className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
