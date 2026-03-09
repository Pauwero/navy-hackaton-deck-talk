"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft, Star, Globe, Mail, Users, ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

export default function CompanyDetailPage() {
  const params = useParams();
  const store = useStore();
  const company = store.companies.find((c) => c.id === params.id);

  if (!company) {
    return (
      <div className="text-center py-16">
        <p className="text-navy-400">Company not found.</p>
        <Link href="/companies" className="text-accent-400 hover:underline mt-2 inline-block">
          Back to Companies
        </Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(company.id);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/companies" className="flex items-center gap-1 text-navy-400 hover:text-navy-200 text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
              <p className="text-accent-400">{company.sector}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning-400" />
            <span className="text-sm text-navy-300">Quality: {company.quality_score}/100</span>
          </div>
        </div>

        <p className="text-navy-200 mb-4">{company.description}</p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-navy-400 mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-1.5">
              {company.capabilities.map((cap) => (
                <span key={cap} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  {cap}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-400 mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-1.5">
              {company.technologies.map((tech) => (
                <span key={tech} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">TRL Level</p>
            <p className="text-lg font-bold text-white">{company.trl_level}/9</p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Team Size</p>
            <p className="text-lg font-bold text-white flex items-center gap-1">
              <Users className="w-4 h-4 text-navy-400" /> {company.team_size}
            </p>
          </div>
          <div className="bg-navy-900 rounded-lg p-3">
            <p className="text-xs text-navy-400">Contact</p>
            <p className="text-sm text-accent-400 flex items-center gap-1 truncate">
              <Mail className="w-3.5 h-3.5" /> {company.contact_email}
            </p>
          </div>
        </div>

        {company.use_cases.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-navy-400 mb-2">Use Cases</h3>
            <ul className="space-y-1">
              {company.use_cases.map((uc) => (
                <li key={uc} className="text-sm text-navy-300 flex gap-2">
                  <span className="text-accent-400">•</span> {uc}
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
            className="inline-flex items-center gap-1 text-sm text-accent-400 hover:underline"
          >
            <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <div className="border-t border-navy-700 pt-4 mt-4">
          <AudioSnippet
            itemId={company.id}
            itemType="company"
            title={company.name}
            description={company.description}
          />
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
