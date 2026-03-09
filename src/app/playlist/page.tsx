"use client";

import { ListMusic, Play, Pause, Trash2, SkipForward, Building2, FlaskConical, Target } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

function TypeIcon({ type }: { type: string }) {
  if (type === "company") return <Building2 className="w-4 h-4 text-blue-500" />;
  if (type === "research") return <FlaskConical className="w-4 h-4 text-purple-500" />;
  return <Target className="w-4 h-4 text-orange-500" />;
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
  const { audioPlayer } = store;

  const playItem = (itemId: string, title: string, description: string, type: "company" | "research" | "challenge") => {
    if (audioPlayer.currentItemId === itemId && audioPlayer.isPlaying) {
      store.pauseAudio();
      return;
    }
    store.playAudio(itemId, title, description, type);
  };

  const playAll = () => {
    if (store.playlist.length === 0) return;
    const first = store.playlist[0];
    const desc = getItemDescription(first.item_type, first.item_id, store);
    store.playAudio(first.item_id, first.item_title, desc, first.item_type);
  };

  const skipToNext = () => {
    if (!audioPlayer.currentItemId) return;
    const currentIndex = store.playlist.findIndex((p) => p.item_id === audioPlayer.currentItemId);
    if (currentIndex < store.playlist.length - 1) {
      const next = store.playlist[currentIndex + 1];
      const desc = getItemDescription(next.item_type, next.item_id, store);
      store.playAudio(next.item_id, next.item_title, desc, next.item_type);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center">
            <ListMusic className="w-5 h-5 text-success-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">My Playlist</h1>
            <p className="text-sm text-navy-400">{store.playlist.length} snippets</p>
          </div>
        </div>
        <div className="flex gap-2">
          {audioPlayer.isPlaying ? (
            <button onClick={() => store.pauseAudio()} className="flex items-center gap-1.5 bg-danger-500/10 text-danger-500 border border-danger-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-danger-500/20 transition-colors">
              <Pause className="w-4 h-4" /> Pause
            </button>
          ) : (
            <button onClick={playAll} disabled={store.playlist.length === 0} className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-navy-200 text-white disabled:text-navy-400 font-semibold px-5 py-2 rounded-full text-sm transition-all shadow-sm">
              <Play className="w-4 h-4" /> Play All
            </button>
          )}
        </div>
      </div>

      {store.playlist.length === 0 ? (
        <div className="card p-16 text-center">
          <ListMusic className="w-12 h-12 text-navy-200 mx-auto mb-3" />
          <p className="text-navy-500 font-medium mb-1">Your playlist is empty</p>
          <p className="text-sm text-navy-400">
            Browse <Link href="/companies" className="text-accent-500 hover:underline">companies</Link>,{" "}
            <Link href="/research" className="text-accent-500 hover:underline">research</Link>, or{" "}
            <Link href="/challenges" className="text-accent-500 hover:underline">challenges</Link> and
            add snippets to your playlist.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {store.playlist.map((item, index) => {
            const desc = getItemDescription(item.item_type, item.item_id, store);
            const isCurrent = audioPlayer.currentItemId === item.item_id && audioPlayer.isPlaying;

            return (
              <div
                key={item.id}
                className={`card flex items-center gap-3 p-3 ${
                  isCurrent ? "border-l-4 border-l-accent-500" : ""
                }`}
              >
                <span className="text-xs text-navy-300 w-6 text-right font-medium">{index + 1}</span>

                <button
                  onClick={() => playItem(item.item_id, item.item_title, desc, item.item_type)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCurrent ? "bg-accent-500 text-white shadow-md" : "bg-navy-100 text-navy-500 hover:bg-navy-200"
                  }`}
                >
                  {isCurrent ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>

                <TypeIcon type={item.item_type} />

                <div className="flex-1 min-w-0">
                  <Link
                    href={getItemLink(item.item_type, item.item_id)}
                    className="text-sm font-medium text-navy-900 hover:text-accent-500 truncate block transition-colors"
                  >
                    {item.item_title}
                  </Link>
                  <p className="text-xs text-navy-400 capitalize">{item.item_type}</p>
                </div>

                {isCurrent && (
                  <button onClick={skipToNext} className="text-navy-400 hover:text-accent-500 transition-colors">
                    <SkipForward className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (isCurrent) store.stopAudio();
                    store.removeFromPlaylist(item.item_id);
                  }}
                  className="text-navy-300 hover:text-danger-500 transition-colors"
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
