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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isPlaying
            ? "bg-accent-500 text-white shadow-sm"
            : "bg-navy-100 text-navy-500 hover:bg-navy-200"
        }`}
      >
        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        {isPlaying ? (
          <span className="flex items-center gap-0.5">
            <Volume2 className="w-3 h-3" />
            Playing
          </span>
        ) : (
          "Listen"
        )}
      </button>

      <button
        onClick={togglePlaylist}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
          inPlaylist
            ? "bg-accent-500/10 text-accent-500 border border-accent-300"
            : "bg-navy-100 text-navy-400 hover:bg-navy-200"
        }`}
        title={inPlaylist ? "Remove from playlist" : "Add to playlist"}
      >
        {inPlaylist ? <ListMinus className="w-3 h-3" /> : <ListPlus className="w-3 h-3" />}
        {inPlaylist ? "Added" : "Add"}
      </button>
    </div>
  );
}
