"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FlaskConical, ArrowLeft, Star, Mail, BookOpen, Handshake } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

export default function ResearchDetailPage() {
  const params = useParams();
  const store = useStore();
  const research = store.research.find((r) => r.id === params.id);

  if (!research) {
    return (
      <div className="text-center py-16">
        <p className="text-navy-400">Research not found.</p>
        <Link href="/research" className="text-accent-400 hover:underline mt-2 inline-block">Back to Research</Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(research.id);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/research" className="flex items-center gap-1 text-navy-400 hover:text-navy-200 text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Research
      </Link>

      <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FlaskConical className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{research.title}</h1>
              <p className="text-purple-400">{research.institution}</p>
              <p className="text-sm text-navy-400">PI: {research.principal_investigator}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning-400" />
            <span className="text-sm text-navy-300">{research.quality_score}/100</span>
          </div>
        </div>

        <p className="text-navy-200 mb-4">{research.description}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-navy-400 mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {research.keywords.map((kw) => (
                <span key={kw} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-400 mb-2 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" /> Collaboration Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {research.collaboration_interest.map((ci) => (
                <span key={ci} className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded">{ci}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">TRL Level</p>
            <p className="text-lg font-bold text-white">{research.trl_level}/9</p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Field</p>
            <p className="text-sm font-semibold text-white">{research.field}</p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Funding</p>
            <p className="text-sm font-semibold text-white">{research.funding_status}</p>
          </div>
        </div>

        {research.publications.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-navy-400 mb-2 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Publications
            </h3>
            <ul className="space-y-1">
              {research.publications.map((pub) => (
                <li key={pub} className="text-sm text-navy-300 flex gap-2">
                  <span className="text-purple-400">•</span> {pub}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-accent-400 mb-4">
          <Mail className="w-3.5 h-3.5" /> {research.contact_email}
        </div>

        <div className="border-t border-navy-700 pt-4">
          <AudioSnippet itemId={research.id} itemType="research" title={research.title} description={research.description} />
        </div>
      </div>

      {matches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">AI Matches</h2>
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
