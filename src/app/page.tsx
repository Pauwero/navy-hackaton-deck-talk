"use client";

import Link from "next/link";
import {
  Anchor,
  Target,
  Building2,
  FlaskConical,
  Zap,
  ListMusic,
  ArrowRight,
  Shield,
  Brain,
  Headphones,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="text-center pt-12 pb-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-accent-500/20 flex items-center justify-center">
            <Anchor className="w-10 h-10 text-accent-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Naval Innovation Hub
        </h1>
        <p className="text-lg text-navy-300 max-w-2xl mx-auto mb-8">
          AI-powered matchmaking connecting naval organizations with researchers and
          tech companies — so innovation challenges get solved faster and relevant
          knowledge becomes instantly findable and listenable.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/challenges"
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Target className="w-5 h-5" />
            Browse Challenges
          </Link>
          <Link
            href="/companies/new"
            className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-navy-100 px-6 py-3 rounded-xl transition-colors"
          >
            <Building2 className="w-5 h-5" />
            Register Company
          </Link>
          <Link
            href="/research/new"
            className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-navy-100 px-6 py-3 rounded-xl transition-colors"
          >
            <FlaskConical className="w-5 h-5" />
            Submit Research
          </Link>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-navy-900 rounded-2xl p-6 border border-danger-500/20">
          <h2 className="text-xl font-bold text-danger-400 mb-4">The Problem Today</h2>
          <ul className="space-y-3 text-sm text-navy-300">
            <li className="flex gap-2">
              <span className="text-danger-400 mt-0.5">•</span>
              Manual ideation board — unstructured and inconsistent
            </li>
            <li className="flex gap-2">
              <span className="text-danger-400 mt-0.5">•</span>
              Low-quality company input through inno4def, filtered manually
            </li>
            <li className="flex gap-2">
              <span className="text-danger-400 mt-0.5">•</span>
              No smart matching between challenges and solutions
            </li>
            <li className="flex gap-2">
              <span className="text-danger-400 mt-0.5">•</span>
              Companies with complementary solutions can&apos;t find each other
            </li>
            <li className="flex gap-2">
              <span className="text-danger-400 mt-0.5">•</span>
              Dense, text-heavy knowledge that&apos;s hard to consume on the go
            </li>
          </ul>
        </div>

        <div className="bg-navy-900 rounded-2xl p-6 border border-success-500/20">
          <h2 className="text-xl font-bold text-success-400 mb-4">Our Solution</h2>
          <ul className="space-y-3 text-sm text-navy-300">
            <li className="flex gap-2">
              <span className="text-success-400 mt-0.5">•</span>
              Structured challenge posting with Quality Gate Agent
            </li>
            <li className="flex gap-2">
              <span className="text-success-400 mt-0.5">•</span>
              Company Quality Gate enforces rich, AI-ready profiles
            </li>
            <li className="flex gap-2">
              <span className="text-success-400 mt-0.5">•</span>
              Three-way AI matchmaking (Challenge ↔ Company ↔ Research)
            </li>
            <li className="flex gap-2">
              <span className="text-success-400 mt-0.5">•</span>
              Collaboration matching between companies and researchers
            </li>
            <li className="flex gap-2">
              <span className="text-success-400 mt-0.5">•</span>
              Audio snippets + personal playlist for on-the-go consumption
            </li>
          </ul>
        </div>
      </section>

      {/* Three Pillars */}
      <section>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Three Core Profile Types</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-accent-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Company Profile</h3>
            <p className="text-sm text-navy-300 mb-4">
              Built with a Quality Gate Agent that enforces structured, consistent data
              standards optimized for AI matchmaking. Auto-converted to audio snippet.
            </p>
            <Link href="/companies" className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
              View Companies <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-accent-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Research Profile</h3>
            <p className="text-sm text-navy-300 mb-4">
              Same Quality Gate flow tailored to research standards. Publications,
              keywords, and collaboration interests for precise matching.
            </p>
            <Link href="/research" className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
              View Research <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-navy-800 rounded-2xl p-6 border border-navy-700 hover:border-accent-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Navy Challenge</h3>
            <p className="text-sm text-navy-300 mb-4">
              Dedicated Quality Gate Agent using naval standards. Structured operational
              context, requirements, and TRL targets for precise matching.
            </p>
            <Link href="/challenges" className="text-accent-400 text-sm flex items-center gap-1 hover:underline">
              View Challenges <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-700">
          <Shield className="w-8 h-8 text-accent-400 mb-3" />
          <h3 className="font-semibold text-white mb-2">Quality Gate Agents</h3>
          <p className="text-sm text-navy-300">
            Each profile type has a dedicated Quality Gate Agent enforcing specific data
            standards for consistency, quality, and AI-readability.
          </p>
        </div>
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-700">
          <Brain className="w-8 h-8 text-accent-400 mb-3" />
          <h3 className="font-semibold text-white mb-2">Three-Way AI Matching</h3>
          <p className="text-sm text-navy-300">
            Challenge→Company, Company→Challenge, and Company↔Research matching.
            AI recommends the most relevant connections in all directions.
          </p>
        </div>
        <div className="bg-navy-900 rounded-2xl p-6 border border-navy-700">
          <Headphones className="w-8 h-8 text-accent-400 mb-3" />
          <h3 className="font-semibold text-white mb-2">Audio Playlist</h3>
          <p className="text-sm text-navy-300">
            Every profile auto-generates an audio snippet. Build a personal playlist
            and stay up to date during your commute — no screen time needed.
          </p>
        </div>
      </section>

      {/* Matchmaking diagram */}
      <section className="bg-navy-900 rounded-2xl p-8 border border-navy-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">AI Matchmaking — Three Directions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-navy-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-400" />
              <ArrowRight className="w-4 h-4 text-navy-500" />
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-navy-500">/</span>
              <FlaskConical className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="font-semibold text-sm text-white mb-1">Challenge → Solutions</h4>
            <p className="text-xs text-navy-400">Navy posts challenge, AI recommends relevant companies & research</p>
          </div>
          <div className="bg-navy-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-navy-500">/</span>
              <FlaskConical className="w-5 h-5 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-navy-500" />
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <h4 className="font-semibold text-sm text-white mb-1">Solutions → Challenge</h4>
            <p className="text-xs text-navy-400">Companies & researchers get recommended relevant open challenges</p>
          </div>
          <div className="bg-navy-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <Zap className="w-4 h-4 text-accent-400" />
              <FlaskConical className="w-5 h-5 text-purple-400" />
              <span className="text-navy-500">/</span>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="font-semibold text-sm text-white mb-1">Collaboration</h4>
            <p className="text-xs text-navy-400">AI matches collaborators who together can solve a challenge</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to innovate?</h2>
        <p className="text-navy-300 mb-6">Join the platform and accelerate naval innovation together.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Go to Dashboard <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
