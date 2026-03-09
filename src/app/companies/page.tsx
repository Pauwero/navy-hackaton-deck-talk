"use client";

import Link from "next/link";
import { Building2, Plus, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";

export default function CompaniesPage() {
  const { companies } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-400" />
            Company Profiles
          </h1>
          <p className="text-sm text-navy-400 mt-1">{companies.length} registered companies</p>
        </div>
        <Link
          href="/companies/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Register Company
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-navy-800 rounded-xl p-5 border border-navy-700 hover:border-navy-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <Link href={`/companies/${company.id}`} className="text-lg font-semibold text-white hover:text-accent-400 transition-colors">
                  {company.name}
                </Link>
                <p className="text-sm text-accent-400">{company.sector}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 text-warning-400" />
                <span className="text-navy-300">{company.quality_score}</span>
              </div>
            </div>

            <p className="text-sm text-navy-300 mb-3 line-clamp-2">{company.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {company.capabilities.slice(0, 3).map((cap) => (
                <span key={cap} className="text-xs bg-navy-700 text-navy-300 px-2 py-0.5 rounded">
                  {cap}
                </span>
              ))}
              <span className="text-xs bg-navy-900 text-navy-400 px-2 py-0.5 rounded">
                TRL {company.trl_level}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <AudioSnippet
                itemId={company.id}
                itemType="company"
                title={company.name}
                description={company.description}
              />
              <Link
                href={`/companies/${company.id}`}
                className="text-accent-400 text-sm flex items-center gap-1 hover:underline"
              >
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
