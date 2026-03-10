"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Mail,
  BookOpen,
  Handshake,
  Target,
  Sparkles,
  Brain,
  CheckCircle2,
  Database,
  FlaskConical,
  Tag,
  Activity,
  Info,
} from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

function SectionHeader({ icon: Icon, title, children }: { icon: typeof Brain; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-200">
      <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2 uppercase tracking-wide">
        <Icon className="w-4 h-4 text-accent-500" /> {title}
      </h2>
      {children}
    </div>
  );
}

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
  const recommendedChallenges = store.getRecommendedChallenges(research.id);
  const challengeItems = recommendedChallenges
    .map((m) => {
      const chalId = m.source_type === "challenge" ? m.source_id : m.target_id;
      return { match: m, challenge: store.challenges.find((c) => c.id === chalId) };
    })
    .filter((x) => x.challenge);

  const indexedFields = [
    { label: "Title", value: research.title, ok: true },
    { label: "Institution", value: research.institution, ok: true },
    { label: "Field", value: research.field, ok: true },
    { label: "TRL Level", value: `TRL ${research.trl_level}`, ok: true },
    { label: "Keywords", value: `${research.keywords.length} keywords`, ok: true },
    { label: "Publications", value: `${research.publications.length} papers`, ok: research.publications.length > 0 },
    { label: "Description", value: `${research.description.length} chars`, ok: research.description.length >= 100 },
    { label: "Collaboration", value: `${research.collaboration_interest.length} topics`, ok: research.collaboration_interest.length > 0 },
  ];
  const indexedCount = indexedFields.filter((f) => f.ok).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link href="/research" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Research
      </Link>

      {/* ─── HEADER ─── */}
      <div className="card p-6">
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

        <p className="text-navy-600 leading-relaxed mb-5">{research.description}</p>

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

        <div className="flex items-center gap-2 text-sm text-accent-500">
          <Mail className="w-3.5 h-3.5" /> {research.contact_email}
        </div>
      </div>

      {/* ─── SECTION: KEYWORDS & EXPERTISE ─── */}
      <section>
        <SectionHeader icon={Tag} title="Keywords & Expertise" />
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Research Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {research.keywords.map((kw) => (
                <span key={kw} className="tag-pill border-purple-200 text-purple-600 bg-purple-50">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5" /> Collaboration Interests
            </p>
            <div className="flex flex-wrap gap-1.5">
              {research.collaboration_interest.map((ci) => (
                <span key={ci} className="tag-pill border-accent-200 text-accent-500 bg-accent-500/5">{ci}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: PUBLICATIONS ─── */}
      {research.publications.length > 0 && (
        <section>
          <SectionHeader icon={BookOpen} title="Publications" />
          <ul className="space-y-2">
            {research.publications.map((pub) => (
              <li key={pub} className="card-surface px-4 py-3 text-sm text-navy-600 flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" /> {pub}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── SECTION: AI KNOWLEDGE INDEX ─── */}
      <section>
        <SectionHeader icon={Brain} title="AI Knowledge Index">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">{indexedCount}/{indexedFields.length} indexed</span>
          </div>
        </SectionHeader>

        <div className="card-surface p-5 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" />
            <p className="text-xs text-navy-500 leading-relaxed">
              This section shows what data the AI matchmaking engine has indexed from this research profile.
              Indexed fields are used to calculate match scores against open challenges and company capabilities.
              Missing data reduces match accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
            {indexedFields.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-navy-50 last:border-0">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.ok ? "text-emerald-500" : "text-navy-300"}`} />
                  <span className="text-sm text-navy-700">{item.label}</span>
                </div>
                <span className="text-xs text-navy-400 truncate max-w-[180px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <div className="card-surface px-4 py-3">
            <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Matches Found</p>
            <p className="text-2xl font-bold text-navy-900">{matches.length}</p>
          </div>
          <div className="card-surface px-4 py-3">
            <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Challenge Matches</p>
            <p className="text-2xl font-bold text-navy-900">{challengeItems.length}</p>
          </div>
          <div className="card-surface px-4 py-3">
            <p className="text-[0.65rem] font-medium text-navy-500 uppercase tracking-wide">Top Match Score</p>
            <p className="text-2xl font-bold text-gold-600">
              {matches.length > 0 ? `${Math.max(...matches.map((m) => m.score))}%` : "—"}
            </p>
          </div>
        </div>

        {/* Indexed keywords visualization */}
        <div className="card-surface p-4">
          <p className="text-xs font-bold text-navy-700 uppercase tracking-wide mb-2">Indexed Terms (used for matching)</p>
          <div className="flex flex-wrap gap-1.5">
            {research.keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {kw}
              </span>
            ))}
            {research.collaboration_interest.map((ci) => (
              <span key={ci} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700 border border-accent-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {ci}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION: RECOMMENDED CHALLENGES ─── */}
      {challengeItems.length > 0 && (
        <section>
          <SectionHeader icon={Sparkles} title="Recommended Challenges" />
          <div className="space-y-3">
            {challengeItems.map(({ match, challenge }) => (
              <Link key={match.id} href={`/challenges/${challenge!.id}`} className="card-surface p-4 flex items-center gap-4 block hover:border-accent-500/30 transition-colors">
                <div className="w-11 h-11 rounded-full avatar-orange flex items-center justify-center text-white shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-900">{challenge!.title}</p>
                  <p className="text-xs text-navy-400">{challenge!.domain} · TRL {challenge!.desired_trl}</p>
                </div>
                <span className="tag-pill shrink-0 bg-success-500/10 text-success-500 border-success-200 font-bold">
                  {match.score}%
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── SECTION: ALL AI MATCHES ─── */}
      {matches.length > 0 && (
        <section>
          <SectionHeader icon={Activity} title="All AI Matches" />
          <div className="grid md:grid-cols-2 gap-4">
            {matches.slice(0, 6).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* ─── AUDIO ─── */}
      <section>
        <div className="card-surface p-4">
          <AudioSnippet itemId={research.id} itemType="research" title={research.title} description={research.description} />
        </div>
      </section>
    </div>
  );
}
