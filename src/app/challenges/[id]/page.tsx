"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Target, ArrowLeft, Star, Clock, AlertCircle, CheckCircle2, Shield, Hand, Users, Building2, FlaskConical, Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import AudioSnippet from "@/components/AudioSnippet";
import MatchCard from "@/components/MatchCard";

const priorityStyles: Record<string, string> = {
  critical: "bg-danger-500/10 text-danger-500 border-danger-200",
  high: "bg-warning-500/10 text-warning-500 border-warning-200",
  medium: "bg-accent-500/10 text-accent-500 border-accent-200",
  low: "bg-navy-100 text-navy-400 border-navy-200",
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const store = useStore();
  const challenge = store.challenges.find((c) => c.id === params.id);
  const [interestMessage, setInterestMessage] = useState("");
  const [showInterestForm, setShowInterestForm] = useState(false);

  if (!challenge) {
    return (
      <div className="card p-16 text-center max-w-md mx-auto">
        <p className="text-navy-500">Challenge not found.</p>
        <Link href="/challenges" className="text-accent-500 hover:underline mt-2 inline-block text-sm">Back to Challenges</Link>
      </div>
    );
  }

  const matches = store.getMatchesFor(challenge.id);
  const groupMatches = store.getGroupMatchesFor(challenge.id);
  const interests = store.getInterestsFor(challenge.id);

  // Simulate current user as a company for demo
  const demoCompany = store.companies[0];
  const hasExpressed = demoCompany ? store.hasExpressedInterest(challenge.id, demoCompany.id) : false;

  const handleExpressInterest = () => {
    if (!demoCompany) return;
    store.expressInterest(challenge.id, demoCompany.id, "company", demoCompany.name, interestMessage || undefined);
    setShowInterestForm(false);
    setInterestMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/challenges" className="flex items-center gap-1 text-navy-400 hover:text-accent-500 text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl avatar-orange flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900">{challenge.title}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`tag-pill ${priorityStyles[challenge.priority]}`}>
                  {challenge.priority === "critical" && <AlertCircle className="w-3 h-3" />}
                  {challenge.priority.toUpperCase()}
                </span>
                <span className="text-sm text-navy-400">{challenge.domain}</span>
                <span className="tag-pill bg-navy-50 text-navy-500 border-navy-200">{challenge.classification}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-warning-500/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-warning-500" />
            <span className="text-sm text-warning-500 font-semibold">{challenge.quality_score}/100</span>
          </div>
        </div>

        {/* Express Interest Button (#13) */}
        {challenge.status === "open" && (
          <div className="mb-5">
            {hasExpressed ? (
              <div className="bg-success-500/10 border border-success-500/20 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success-500" />
                <div>
                  <p className="text-sm font-semibold text-success-500">Interest Expressed</p>
                  <p className="text-xs text-navy-400">You&apos;ve expressed interest as {demoCompany?.name}. The navy officer will be notified.</p>
                </div>
              </div>
            ) : showInterestForm ? (
              <div className="bg-accent-500/5 border border-accent-500/20 rounded-2xl p-4">
                <p className="text-sm font-semibold text-navy-900 mb-2 flex items-center gap-2">
                  <Hand className="w-4 h-4 text-accent-500" /> Express Interest as {demoCompany?.name}
                </p>
                <textarea
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  placeholder="Optional: Add a message about why you're a good fit..."
                  className="w-full bg-white border border-navy-200 rounded-xl px-3 py-2 text-sm text-navy-700 placeholder-navy-300 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 mb-3 h-20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleExpressInterest}
                    className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2 rounded-full text-sm transition-all shadow-sm"
                  >
                    Submit Interest
                  </button>
                  <button
                    onClick={() => setShowInterestForm(false)}
                    className="text-navy-400 hover:text-navy-600 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowInterestForm(true)}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Hand className="w-4 h-4" /> I&apos;m Interested in This Challenge
              </button>
            )}
          </div>
        )}

        {/* Interests received */}
        {interests.length > 0 && (
          <div className="mb-5 bg-navy-50 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-heart" /> {interests.length} Interested {interests.length === 1 ? "Party" : "Parties"}
            </h3>
            <div className="space-y-2">
              {interests.map((interest) => (
                <div key={interest.id} className="flex items-center gap-2.5 bg-white rounded-xl p-2.5">
                  <div className={`avatar w-8 h-8 text-xs ${interest.entity_type === "company" ? "avatar-blue" : "avatar-purple"}`}>
                    {interest.entity_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{interest.entity_name}</p>
                    {interest.message && <p className="text-xs text-navy-400 truncate">{interest.message}</p>}
                  </div>
                  <span className="tag-pill border-navy-200 text-navy-400 bg-white text-xs">{interest.entity_type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-1.5">Description</h3>
          <p className="text-navy-600 leading-relaxed">{challenge.description}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-1.5">Operational Context</h3>
          <p className="text-navy-500 text-sm leading-relaxed">{challenge.operational_context}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Requirements
          </h3>
          <ul className="space-y-1.5">
            {challenge.requirements.map((req) => (
              <li key={req} className="text-sm text-navy-600 flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" /> {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-5">
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Desired TRL</p>
            <p className="text-xl font-bold text-navy-900">{challenge.desired_trl}/9</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Timeline</p>
            <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-navy-400" /> {challenge.timeline}
            </p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Status</p>
            <p className="text-sm font-bold text-success-500">{challenge.status.replace("_", " ")}</p>
          </div>
          <div className="bg-navy-50 rounded-xl p-4">
            <p className="text-xs text-navy-400 font-medium">Classification</p>
            <p className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-navy-400" /> {challenge.classification}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {challenge.tags.map((tag) => (
            <span key={tag} className="tag-pill border-orange-200 text-orange-600 bg-orange-50">{tag}</span>
          ))}
        </div>

        <div className="border-t border-navy-100 pt-4">
          <AudioSnippet itemId={challenge.id} itemType="challenge" title={challenge.title} description={challenge.description} />
        </div>
      </div>

      {/* Group Matches (#25) */}
      {groupMatches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-500" />
            Suggested Teams
          </h2>
          <div className="space-y-3">
            {groupMatches.map((gm) => (
              <div key={gm.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="tag-pill bg-accent-500/10 text-accent-500 border-accent-200 font-semibold">
                    {gm.combined_score}% combined match
                  </span>
                  <span className="text-xs text-navy-400">{gm.members.length} members</span>
                </div>
                <div className="space-y-2 mb-3">
                  {gm.members.map((member) => (
                    <Link
                      key={member.entity_id}
                      href={member.entity_type === "company" ? `/companies/${member.entity_id}` : `/research/${member.entity_id}`}
                      className="flex items-center gap-2.5 bg-navy-50 rounded-xl p-2.5 hover:bg-navy-100 transition-colors"
                    >
                      <div className={`avatar w-8 h-8 text-xs ${member.entity_type === "company" ? "avatar-blue" : "avatar-purple"}`}>
                        {member.entity_type === "company" ? <Building2 className="w-3.5 h-3.5" /> : <FlaskConical className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-900 truncate">{member.entity_name}</p>
                        <p className="text-xs text-navy-400">{member.contribution}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-navy-400">{gm.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Matches */}
      {matches.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-navy-900 mb-4">AI-Recommended Matches</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {matches.slice(0, 8).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
