"use client";

import { useState, useCallback } from "react";
import type { CompanyProfile, ResearchProfile, NavyChallenge, PlaylistItem, Match } from "@/types";
import { sampleCompanies, sampleResearch, sampleChallenges } from "./sample-data";
import {
  matchChallengeToCompanies,
  matchChallengeToResearch,
  matchCompanyToCompany,
  matchCompanyToResearch,
} from "./matchmaking";

// Simple global state (for hackathon - would use Zustand/Context in production)
let _companies: CompanyProfile[] = [...sampleCompanies];
let _research: ResearchProfile[] = [...sampleResearch];
let _challenges: NavyChallenge[] = [...sampleChallenges];
let _playlist: PlaylistItem[] = [];
let _matches: Match[] = [];
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach((l) => l());
}

export function useStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    companies: _companies,
    research: _research,
    challenges: _challenges,
    playlist: _playlist,
    matches: _matches,

    addCompany(c: CompanyProfile) {
      _companies = [c, ..._companies];
      notify();
    },

    addResearch(r: ResearchProfile) {
      _research = [r, ..._research];
      notify();
    },

    addChallenge(ch: NavyChallenge) {
      _challenges = [ch, ..._challenges];
      notify();
    },

    addToPlaylist(item: PlaylistItem) {
      if (!_playlist.find((p) => p.item_id === item.item_id)) {
        _playlist = [..._playlist, item];
        notify();
      }
    },

    removeFromPlaylist(itemId: string) {
      _playlist = _playlist.filter((p) => p.item_id !== itemId);
      notify();
    },

    isInPlaylist(itemId: string) {
      return _playlist.some((p) => p.item_id === itemId);
    },

    runMatchmaking() {
      const newMatches: Match[] = [];

      // Challenge → Company & Research
      for (const challenge of _challenges) {
        newMatches.push(...matchChallengeToCompanies(challenge, _companies));
        newMatches.push(...matchChallengeToResearch(challenge, _research));
      }

      // Company → Company & Research
      for (const company of _companies) {
        newMatches.push(...matchCompanyToCompany(company, _companies));
        newMatches.push(...matchCompanyToResearch(company, _research));
      }

      _matches = newMatches.sort((a, b) => b.score - a.score);
      notify();
      return _matches;
    },

    getMatchesFor(id: string) {
      return _matches.filter((m) => m.source_id === id || m.target_id === id);
    },
  };
}
