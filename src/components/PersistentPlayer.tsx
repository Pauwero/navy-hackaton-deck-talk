"use client";

import { Play, Pause, X, Volume2, Building2, FlaskConical, Target } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

function TypeIcon({ type }: { type: string }) {
  if (type === "company") return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
  if (type === "research") return <FlaskConical className="w-3.5 h-3.5 text-purple-500" />;
  return <Target className="w-3.5 h-3.5 text-orange-500" />;
}

function getLink(type: string, id: string): string {
  if (type === "company") return `/companies/${id}`;
  if (type === "research") return `/research/${id}`;
  return `/challenges/${id}`;
}

export default function PersistentPlayer() {
  const store = useStore();
  const { audioPlayer } = store;

  if (!audioPlayer.currentItemId) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 bg-white border-t border-navy-200 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={() => {
            if (audioPlayer.isPlaying) {
              store.pauseAudio();
            } else {
              store.playAudio(
                audioPlayer.currentItemId!,
                audioPlayer.currentTitle,
                audioPlayer.currentDescription,
                audioPlayer.currentType
              );
            }
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
            audioPlayer.isPlaying
              ? "bg-accent-500 text-white shadow-md"
              : "bg-navy-100 text-navy-600 hover:bg-navy-200"
          }`}
        >
          {audioPlayer.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Wave animation */}
        {audioPlayer.isPlaying && (
          <div className="audio-wave shrink-0">
            <span style={{ height: "10px" }} />
            <span style={{ height: "16px" }} />
            <span style={{ height: "8px" }} />
            <span style={{ height: "14px" }} />
            <span style={{ height: "10px" }} />
          </div>
        )}

        {/* Info */}
        <TypeIcon type={audioPlayer.currentType} />
        <div className="flex-1 min-w-0">
          <Link
            href={getLink(audioPlayer.currentType, audioPlayer.currentItemId!)}
            className="text-sm font-medium text-navy-900 hover:text-accent-500 truncate block transition-colors"
          >
            {audioPlayer.currentTitle}
          </Link>
          {audioPlayer.isPlaying && (
            <p className="text-xs text-accent-500 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Now playing
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => store.stopAudio()}
          className="text-navy-300 hover:text-navy-500 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
