"use client";

import { useState } from "react";
import { Play, Pause, ListPlus, ListMinus, Volume2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { PlaylistItem } from "@/types";

interface AudioSnippetProps {
  itemId: string;
  itemType: "company" | "research" | "challenge";
  title: string;
  description: string;
}

export default function AudioSnippet({ itemId, itemType, title, description }: AudioSnippetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const store = useStore();
  const inPlaylist = store.isInPlaylist(itemId);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In production, this would use Web Speech API or pre-generated audio
    if (!isPlaying && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${title}. ${description.substring(0, 300)}`
      );
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else if (isPlaying && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const togglePlaylist = () => {
    if (inPlaylist) {
      store.removeFromPlaylist(itemId);
    } else {
      const item: PlaylistItem = {
        id: Math.random().toString(36).substring(2),
        user_id: "current-user",
        item_type: itemType,
        item_id: itemId,
        item_title: title,
        added_at: new Date().toISOString(),
      };
      store.addToPlaylist(item);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePlay}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          isPlaying
            ? "bg-accent-500 text-navy-950"
            : "bg-navy-700 text-navy-200 hover:bg-navy-600"
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {isPlaying ? (
          <span className="flex items-center gap-0.5">
            <Volume2 className="w-3.5 h-3.5" />
            Playing
          </span>
        ) : (
          "Listen"
        )}
      </button>

      <button
        onClick={togglePlaylist}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
          inPlaylist
            ? "bg-accent-500/20 text-accent-400 border border-accent-500/30"
            : "bg-navy-700 text-navy-300 hover:bg-navy-600"
        }`}
        title={inPlaylist ? "Remove from playlist" : "Add to playlist"}
      >
        {inPlaylist ? <ListMinus className="w-3.5 h-3.5" /> : <ListPlus className="w-3.5 h-3.5" />}
        {inPlaylist ? "In Playlist" : "Add"}
      </button>
    </div>
  );
}
