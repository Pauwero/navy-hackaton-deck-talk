"use client";

import Link from "next/link";
import {
  Anchor,
  Target,
  Building2,
  FlaskConical,
  Zap,
  ArrowRight,
  Shield,
  Brain,
  Headphones,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="text-center pt-10 pb-4">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg">
              <Anchor className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-heart flex items-center justify-center shadow-md">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-3">
          Naval Innovation Hub
        </h1>
        <p className="text-lg text-navy-400 max-w-2xl mx-auto mb-8">
          AI-powered matchmaking connecting naval organizations with researchers and
          tech companies — so the right people find each other faster.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/matches"
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Discover Matches
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 bg-white hover:bg-navy-50 text-navy-700 border border-navy-200 px-6 py-3 rounded-full transition-all"
          >
            <Building2 className="w-5 h-5" />
            Register Company
          </Link>
          <Link
            href="/research/new"
            className="flex items-center gap-2 bg-white hover:bg-navy-50 text-navy-700 border border-navy-200 px-6 py-3 rounded-full transition-all"
          >
            <FlaskConical className="w-5 h-5" />
            Submit Research
          </Link>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 border-l-4 border-l-danger-500">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-danger-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-danger-500" />
            </span>
            The Problem Today
          </h2>
          <ul className="space-y-2.5 text-sm text-navy-500">
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 shrink-0" />
              Manual ideation board — unstructured and inconsistent
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 shrink-0" />
              Low-quality company input through inno4def, filtered manually
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 shrink-0" />
              No smart matching between challenges and solutions
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 shrink-0" />
              Companies with complementary solutions can&apos;t find each other
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-400 mt-1.5 shrink-0" />
              Dense, text-heavy knowledge that&apos;s hard to consume on the go
            </li>
          </ul>
        </div>

        <div className="card p-6 border-l-4 border-l-success-500">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-success-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-success-500" />
            </span>
            Our Solution
          </h2>
          <ul className="space-y-2.5 text-sm text-navy-500">
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5 shrink-0" />
              Structured challenge posting with Quality Gate Agent
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5 shrink-0" />
              Company Quality Gate enforces rich, AI-ready profiles
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5 shrink-0" />
              Three-way AI matchmaking (Challenge ↔ Company ↔ Research)
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5 shrink-0" />
              Collaboration matching between companies and researchers
            </li>
            <li className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 mt-1.5 shrink-0" />
              Audio snippets + personal playlist for on-the-go consumption
            </li>
          </ul>
        </div>
      </section>

      {/* Three Pillars - Card Design */}
      <section>
        <h2 className="text-2xl font-bold text-navy-900 text-center mb-2">Three Core Profile Types</h2>
        <p className="text-navy-400 text-center mb-8">Swipe through the innovation ecosystem</p>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="card p-6 text-center group">
            <div className="w-16 h-16 rounded-2xl avatar-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1">Company Profile</h3>
            <p className="text-sm text-navy-400 mb-4">
              Quality Gate Agent enforces structured, consistent data optimized for AI matchmaking.
            </p>
            <Link href="/companies" className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold hover:gap-2.5 transition-all">
              View Companies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card p-6 text-center group">
            <div className="w-16 h-16 rounded-2xl avatar-purple flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1">Research Profile</h3>
            <p className="text-sm text-navy-400 mb-4">
              Same Quality Gate flow tailored to research standards. Publications, keywords, and collaboration interests.
            </p>
            <Link href="/research" className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold hover:gap-2.5 transition-all">
              View Research <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card p-6 text-center group">
            <div className="w-16 h-16 rounded-2xl avatar-orange flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-1">Navy Challenge</h3>
            <p className="text-sm text-navy-400 mb-4">
              Dedicated Quality Gate using naval standards. Structured operational context, requirements, and TRL targets.
            </p>
            <Link href="/challenges" className="inline-flex items-center gap-1.5 text-accent-500 text-sm font-semibold hover:gap-2.5 transition-all">
              View Challenges <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-5">
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-accent-500" />
          </div>
          <h3 className="font-bold text-navy-900 mb-1">Quality Gate Agents</h3>
          <p className="text-sm text-navy-400">
            Each profile type has a dedicated Quality Gate Agent enforcing specific data
            standards for consistency and AI-readability.
          </p>
        </div>
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-heart/10 flex items-center justify-center mb-3">
            <Brain className="w-5 h-5 text-heart" />
          </div>
          <h3 className="font-bold text-navy-900 mb-1">Three-Way AI Matching</h3>
          <p className="text-sm text-navy-400">
            Challenge→Company, Company→Challenge, and Company↔Research matching.
            AI finds the most relevant connections.
          </p>
        </div>
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center mb-3">
            <Headphones className="w-5 h-5 text-success-500" />
          </div>
          <h3 className="font-bold text-navy-900 mb-1">Audio Playlist</h3>
          <p className="text-sm text-navy-400">
            Every profile auto-generates an audio snippet. Build a personal playlist
            and stay up to date on the go.
          </p>
        </div>
      </section>

      {/* Matchmaking diagram */}
      <section className="card p-8">
        <h2 className="text-xl font-bold text-navy-900 text-center mb-2">AI Matchmaking — Three Directions</h2>
        <p className="text-sm text-navy-400 text-center mb-6">Like a dating app, but for naval innovation</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-navy-50 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full avatar-orange flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-navy-300" />
              <div className="w-9 h-9 rounded-full avatar-blue flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-navy-300">/</span>
              <div className="w-9 h-9 rounded-full avatar-purple flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-navy-900 mb-1">Challenge → Solutions</h4>
            <p className="text-xs text-navy-400">Navy posts challenge, AI recommends relevant companies & research</p>
          </div>
          <div className="bg-navy-50 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full avatar-blue flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-navy-300" />
              <div className="w-9 h-9 rounded-full avatar-orange flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-navy-900 mb-1">Solutions → Challenge</h4>
            <p className="text-xs text-navy-400">Companies & researchers get recommended relevant open challenges</p>
          </div>
          <div className="bg-navy-50 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full avatar-blue flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <Heart className="w-4 h-4 text-heart" />
              <div className="w-9 h-9 rounded-full avatar-purple flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-navy-900 mb-1">Collaboration</h4>
            <p className="text-xs text-navy-400">AI matches collaborators who together can solve a challenge</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="card p-10 max-w-xl mx-auto bg-gradient-to-br from-accent-500 to-accent-600">
          <Users className="w-10 h-10 text-white/80 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Ready to innovate?</h2>
          <p className="text-white/70 mb-6">Join the platform and accelerate naval innovation together.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white hover:bg-navy-50 text-accent-600 font-bold px-8 py-3 rounded-full transition-colors shadow-md"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
