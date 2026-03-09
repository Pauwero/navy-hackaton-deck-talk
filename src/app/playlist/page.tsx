"use client";

import { useState } from "react";
import { ListMusic, Play, Pause, Trash2, Volume2, SkipForward, Building2, FlaskConical, Target } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

function TypeIcon({ type }: { type: string }) {
  if (type === "company") return <Building2 className="w-4 h-4 text-blue-400" />;
  if (type === "research") return <FlaskConical className="w-4 h-4 text-purple-400" />;
  return <Target className="w-4 h-4 text-orange-400" />;
}

function getItemLink(type: string, id: string): string {
  if (type === "company") return `/companies/${id}`;
  if (type === "research") return `/research/${id}`;
  return `/challenges/${id}`;
}

function getItemDescription(type: string, id: string, store: ReturnType<typeof useStore>): string {
  if (type === "company") return store.companies.find((c) => c.id === id)?.description || "";
  if (type === "research") return store.research.find((r) => r.id === id)?.description || "";
  return store.challenges.find((c) => c.id === id)?.description || "";
}

export default function PlaylistPage() {
  const store = useStore();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playItem = (itemId: string, title: string, description: string) => {
    if (currentlyPlaying === itemId && isPlaying) {
      // Pause
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Stop current
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();

    setCurrentlyPlaying(itemId);
    setIsPlaying(true);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`${title}. ${description.substring(0, 400)}`);
      utterance.rate = 0.9;
      utterance.onend = () => {
        setIsPlaying(false);
        // Auto-play next
        const currentIndex = store.playlist.findIndex((p) => p.item_id === itemId);
        if (currentIndex < store.playlist.length - 1) {
          const next = store.playlist[currentIndex + 1];
          const nextDesc = getItemDescription(next.item_type, next.item_id, store);
          setTimeout(() => playItem(next.item_id, next.item_title, nextDesc), 500);
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const playAll = () => {
    if (store.playlist.length === 0) return;
    const first = store.playlist[0];
    const desc = getItemDescription(first.item_type, first.item_id, store);
    playItem(first.item_id, first.item_title, desc);
  };

  const stopAll = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentlyPlaying(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ListMusic className="w-7 h-7 text-accent-400" />
            My Playlist
          </h1>
          <p className="text-sm text-navy-400 mt-1">{store.playlist.length} snippets</p>
        </div>
        <div className="flex gap-2">
          {isPlaying ? (
            <button onClick={stopAll} className="flex items-center gap-1.5 bg-danger-500/20 text-danger-400 px-4 py-2 rounded-lg text-sm hover:bg-danger-500/30 transition-colors">
              <Pause className="w-4 h-4" /> Stop
            </button>
          ) : (
            <button onClick={playAll} disabled={store.playlist.length === 0} className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-navy-700 text-navy-950 disabled:text-navy-400 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              <Play className="w-4 h-4" /> Play All
            </button>
          )}
        </div>
      </div>

      {/* Now playing bar */}
      {isPlaying && currentlyPlaying && (
        <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="audio-wave">
            <span style={{ height: "12px" }} />
            <span style={{ height: "18px" }} />
            <span style={{ height: "8px" }} />
            <span style={{ height: "16px" }} />
            <span style={{ height: "10px" }} />
          </div>
          <Volume2 className="w-5 h-5 text-accent-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Now Playing: {store.playlist.find((p) => p.item_id === currentlyPlaying)?.item_title}
            </p>
          </div>
          <button onClick={() => {
            const currentIndex = store.playlist.findIndex((p) => p.item_id === currentlyPlaying);
            if (currentIndex < store.playlist.length - 1) {
              stopAll();
              const next = store.playlist[currentIndex + 1];
              const desc = getItemDescription(next.item_type, next.item_id, store);
              setTimeout(() => playItem(next.item_id, next.item_title, desc), 200);
            }
          }}>
            <SkipForward className="w-4 h-4 text-navy-300 hover:text-white" />
          </button>
        </div>
      )}

      {store.playlist.length === 0 ? (
        <div className="text-center py-16">
          <ListMusic className="w-12 h-12 text-navy-600 mx-auto mb-3" />
          <p className="text-navy-400 mb-2">Your playlist is empty</p>
          <p className="text-sm text-navy-500">
            Browse <Link href="/companies" className="text-accent-400 hover:underline">companies</Link>,{" "}
            <Link href="/research" className="text-accent-400 hover:underline">research</Link>, or{" "}
            <Link href="/challenges" className="text-accent-400 hover:underline">challenges</Link> and
            add snippets to your playlist.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {store.playlist.map((item, index) => {
            const desc = getItemDescription(item.item_type, item.item_id, store);
            const isCurrent = currentlyPlaying === item.item_id && isPlaying;

            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isCurrent ? "bg-accent-500/10 border border-accent-500/30" : "bg-navy-800 border border-navy-700 hover:border-navy-600"
                }`}
              >
                <span className="text-xs text-navy-500 w-6 text-right">{index + 1}</span>

                <button
                  onClick={() => playItem(item.item_id, item.item_title, desc)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent ? "bg-accent-500 text-navy-950" : "bg-navy-700 text-navy-300 hover:bg-navy-600"
                  }`}
                >
                  {isCurrent ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>

                <TypeIcon type={item.item_type} />

                <div className="flex-1 min-w-0">
                  <Link
                    href={getItemLink(item.item_type, item.item_id)}
                    className="text-sm font-medium text-white hover:text-accent-400 truncate block"
                  >
                    {item.item_title}
                  </Link>
                  <p className="text-xs text-navy-500 capitalize">{item.item_type}</p>
                </div>

                <button
                  onClick={() => {
                    if (isCurrent) stopAll();
                    store.removeFromPlaylist(item.item_id);
                  }}
                  className="text-navy-500 hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
