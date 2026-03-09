"use client";

import Link from "next/link";
import { Building2, Plus, Star, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";

const avatarColors = ["avatar-blue", "avatar-green", "avatar-purple", "avatar-pink"];

export default function CompaniesPage() {
  const { companies } = useStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Company Profiles</h1>
            <p className="text-sm text-navy-400">{companies.length} registered companies</p>
          </div>
        </div>
        <Link
          href="/companies/new"
          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Register
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {companies.map((company, i) => (
          <div key={company.id} className="card p-5">
            {/* Header with avatar */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`avatar w-12 h-12 text-sm ${avatarColors[i % avatarColors.length]}`}>
                {company.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/companies/${company.id}`} className="font-bold text-navy-900 hover:text-accent-500 transition-colors block truncate">
                  {company.name}
                </Link>
                <p className="text-sm text-accent-500">{company.sector}</p>
              </div>
              <div className="flex items-center gap-1 text-sm bg-warning-500/10 px-2 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-warning-500" />
                <span className="text-warning-500 font-semibold text-xs">{company.quality_score}</span>
              </div>
            </div>

            <p className="text-sm text-navy-500 mb-3 line-clamp-2">{company.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {company.capabilities.slice(0, 3).map((cap) => (
                <span key={cap} className="tag-pill border-blue-200 text-blue-600 bg-blue-50">
                  {cap}
                </span>
              ))}
              <span className="tag-pill border-navy-200 text-navy-500 bg-navy-50">
                TRL {company.trl_level}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-navy-100">
              <AudioSnippet
                itemId={company.id}
                itemType="company"
                title={company.name}
                description={company.description}
              />
              <Link
                href={`/companies/${company.id}`}
                className="flex items-center gap-1.5 text-accent-500 text-sm font-semibold hover:gap-2 transition-all"
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
