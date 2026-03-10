"use client";

import { useState, useCallback } from "react";
import type {
  CompanyProfile, ResearchProfile, NavyChallenge,
  PlaylistItem, Match, Notification, Interest, GroupMatch, AudioPlayerState,
  UserProfile,
} from "@/types";
import { sampleCompanies, sampleResearch, sampleChallenges } from "./sample-data";
import {
  matchChallengeToCompanies,
  matchChallengeToResearch,
  matchCompanyToCompany,
  matchCompanyToResearch,
  generateGroupMatches,
} from "./matchmaking";

// Simple global state (for hackathon - would use Zustand/Context in production)
let _companies: CompanyProfile[] = [...sampleCompanies];
let _research: ResearchProfile[] = [...sampleResearch];
let _challenges: NavyChallenge[] = [...sampleChallenges];
let _playlist: PlaylistItem[] = [];
let _matches: Match[] = [];
let _notifications: Notification[] = [];
let _interests: Interest[] = [];
let _groupMatches: GroupMatch[] = [];
let _audioPlayer: AudioPlayerState = {
  isPlaying: false,
  currentItemId: null,
  currentTitle: "",
  currentDescription: "",
  currentType: "company",
};
let _userProfile: UserProfile = {
  id: "user-1",
  name: "Commander A. de Vries",
  role: "naval_officer",
  organization: "Royal Netherlands Navy",
  interests: ["autonomous systems", "mine countermeasures", "cybersecurity", "underwater robotics"],
  preferred_domains: ["Mine Warfare", "Cyber Defense", "Autonomous Systems"],
  preferred_trl_range: [5, 9],
  match_entity_types: ["company", "research"],
  saved_searches: [],
};
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach((l) => l());
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function addNotification(n: Omit<Notification, "id" | "read" | "created_at">) {
  const notification: Notification = {
    ...n,
    id: generateId(),
    read: false,
    created_at: new Date().toISOString(),
  };
  _notifications = [notification, ..._notifications];
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
    notifications: _notifications,
    interests: _interests,
    groupMatches: _groupMatches,
    audioPlayer: _audioPlayer,
    userProfile: _userProfile,

    updateUserProfile(updates: Partial<UserProfile>) {
      _userProfile = { ..._userProfile, ...updates };
      notify();
    },

    addCompany(c: CompanyProfile) {
      _companies = [c, ..._companies];
      addNotification({
        type: "profile_matched",
        title: "Profile Created",
        message: `Company "${c.name}" registered. AI matching will find relevant challenges.`,
        link: `/companies/${c.id}`,
      });
      notify();
    },

    addResearch(r: ResearchProfile) {
      _research = [r, ..._research];
      addNotification({
        type: "profile_matched",
        title: "Profile Created",
        message: `Research "${r.title}" submitted. AI matching will find relevant challenges.`,
        link: `/research/${r.id}`,
      });
      notify();
    },

    addChallenge(ch: NavyChallenge) {
      _challenges = [ch, ..._challenges];
      addNotification({
        type: "new_challenge",
        title: "New Challenge Posted",
        message: `Challenge "${ch.title}" is now open for matching.`,
        link: `/challenges/${ch.id}`,
      });
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

      for (const challenge of _challenges) {
        newMatches.push(...matchChallengeToCompanies(challenge, _companies));
        newMatches.push(...matchChallengeToResearch(challenge, _research));
      }

      for (const company of _companies) {
        newMatches.push(...matchCompanyToCompany(company, _companies));
        newMatches.push(...matchCompanyToResearch(company, _research));
      }

      _matches = newMatches.sort((a, b) => b.score - a.score);

      _groupMatches = [];
      for (const challenge of _challenges) {
        _groupMatches.push(...generateGroupMatches(challenge, _companies, _research, _matches));
      }

      const topNew = _matches.slice(0, 3);
      if (topNew.length > 0) {
        addNotification({
          type: "match_found",
          title: "New Matches Found",
          message: `AI found ${_matches.length} matches. Top match scores ${topNew[0].score}%.`,
          link: "/matches",
        });
      }

      notify();
      return _matches;
    },

    getMatchesFor(id: string) {
      return _matches.filter((m) => m.source_id === id || m.target_id === id);
    },

    getGroupMatchesFor(challengeId: string) {
      return _groupMatches.filter((gm) => gm.challenge_id === challengeId);
    },

    getProfileMatches() {
      const profile = _userProfile;
      return _matches
        .filter((m) => {
          const targetType = m.target_type;
          const sourceType = m.source_type;
          const relevantTypes = profile.match_entity_types;
          if (!relevantTypes.includes(targetType as "company" | "research" | "challenge") &&
              !relevantTypes.includes(sourceType as "company" | "research" | "challenge")) {
            return false;
          }
          return true;
        })
        .filter((m) => {
          const [minTrl, maxTrl] = profile.preferred_trl_range;
          const targetId = m.target_id;
          const company = _companies.find((c) => c.id === targetId);
          const research = _research.find((r) => r.id === targetId);
          const trl = company?.trl_level || research?.trl_level;
          if (trl && (trl < minTrl || trl > maxTrl)) return false;
          return true;
        })
        .sort((a, b) => {
          const scoreA = a.score + getInterestBoost(a, profile);
          const scoreB = b.score + getInterestBoost(b, profile);
          return scoreB - scoreA;
        })
        .slice(0, 12);
    },

    getRecommendedChallenges(entityId: string) {
      return _matches
        .filter((m) => (m.target_id === entityId || m.source_id === entityId) &&
          (m.source_type === "challenge" || m.target_type === "challenge"))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    },

    expressInterest(challengeId: string, entityId: string, entityType: "company" | "research", entityName: string, message?: string) {
      if (_interests.find((i) => i.challenge_id === challengeId && i.entity_id === entityId)) return;

      const interest: Interest = {
        id: generateId(),
        challenge_id: challengeId,
        entity_id: entityId,
        entity_type: entityType,
        entity_name: entityName,
        message,
        created_at: new Date().toISOString(),
      };
      _interests = [..._interests, interest];

      const challenge = _challenges.find((c) => c.id === challengeId);
      addNotification({
        type: "interest_received",
        title: "Interest Received",
        message: `${entityName} expressed interest in "${challenge?.title || "a challenge"}".`,
        link: `/challenges/${challengeId}`,
      });

      notify();
    },

    getInterestsFor(challengeId: string) {
      return _interests.filter((i) => i.challenge_id === challengeId);
    },

    hasExpressedInterest(challengeId: string, entityId: string) {
      return _interests.some((i) => i.challenge_id === challengeId && i.entity_id === entityId);
    },

    markNotificationRead(id: string) {
      _notifications = _notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      notify();
    },

    markAllNotificationsRead() {
      _notifications = _notifications.map((n) => ({ ...n, read: true }));
      notify();
    },

    unreadNotificationCount() {
      return _notifications.filter((n) => !n.read).length;
    },

    playAudio(itemId: string, title: string, description: string, type: "company" | "research" | "challenge") {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();

      _audioPlayer = {
        isPlaying: true,
        currentItemId: itemId,
        currentTitle: title,
        currentDescription: description,
        currentType: type,
      };

      if ("speechSynthesis" in window) {
        const text = `${title}. ${description.substring(0, 400)}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = () => {
          _audioPlayer = { ..._audioPlayer, isPlaying: false };
          notify();
        };
        window.speechSynthesis.speak(utterance);
      }

      notify();
    },

    pauseAudio() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      _audioPlayer = { ..._audioPlayer, isPlaying: false };
      notify();
    },

    stopAudio() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      _audioPlayer = {
        isPlaying: false,
        currentItemId: null,
        currentTitle: "",
        currentDescription: "",
        currentType: "company",
      };
      notify();
    },

    searchWithRelevance(query: string) {
      if (!query.trim()) return { companies: [], research: [], challenges: [] };
      const q = query.toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 2);

      function scoreEntity(fields: string[]): number {
        let score = 0;
        const combined = fields.join(" ").toLowerCase();
        for (const word of words) {
          const count = (combined.match(new RegExp(word, "g")) || []).length;
          score += count * 10;
          if (combined.includes(q)) score += 25;
        }
        return score;
      }

      const companies = _companies
        .map((c) => ({
          item: c,
          relevance: scoreEntity([c.name, c.description, c.sector, ...c.capabilities, ...c.technologies, ...c.use_cases]),
        }))
        .filter((r) => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .map((r) => ({ ...r.item, _relevance: r.relevance }));

      const research = _research
        .map((r) => ({
          item: r,
          relevance: scoreEntity([r.title, r.description, r.institution, r.field, ...r.keywords]),
        }))
        .filter((r) => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .map((r) => ({ ...r.item, _relevance: r.relevance }));

      const challenges = _challenges
        .map((c) => ({
          item: c,
          relevance: scoreEntity([c.title, c.description, c.domain, ...c.tags, ...c.requirements]),
        }))
        .filter((r) => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .map((r) => ({ ...r.item, _relevance: r.relevance }));

      return { companies, research, challenges };
    },
  };
}

function getInterestBoost(match: Match, profile: UserProfile): number {
  let boost = 0;
  const reasoning = match.reasoning.toLowerCase();
  for (const interest of profile.interests) {
    if (reasoning.includes(interest.toLowerCase())) boost += 5;
  }
  return boost;
}
