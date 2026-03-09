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
      <div className="card p-16 text-center max-w-md mx-auto">
        <p className="text-navy-500">Research not found.</p>
        <Link href="/research" className="text-accent-500 hover:underline mt-2 inline-block text-sm">Back to Research</Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(research.id);

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

      {matches.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-navy-900 mb-4">AI Matches</h2>
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
