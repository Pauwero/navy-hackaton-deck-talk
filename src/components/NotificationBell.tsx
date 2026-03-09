"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, X, Zap, Heart, Target, UserPlus } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

const typeIcons: Record<string, React.ReactNode> = {
  match_found: <Zap className="w-4 h-4 text-accent-500" />,
  interest_received: <Heart className="w-4 h-4 text-heart" />,
  new_challenge: <Target className="w-4 h-4 text-orange-500" />,
  profile_matched: <UserPlus className="w-4 h-4 text-success-500" />,
};

export default function NotificationBell() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = store.unreadNotificationCount();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-navy-500 hover:text-navy-700 hover:bg-navy-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-heart text-white text-xs flex items-center justify-center font-bold animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-navy-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100">
            <h3 className="font-bold text-navy-900 text-sm">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={() => store.markAllNotificationsRead()}
                className="text-xs text-accent-500 hover:text-accent-600 font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {store.notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-navy-200 mx-auto mb-2" />
                <p className="text-sm text-navy-400">No notifications yet</p>
              </div>
            ) : (
              store.notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-navy-50 transition-colors ${
                    n.read ? "bg-white" : "bg-accent-500/5"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {typeIcons[n.type] || <Bell className="w-4 h-4 text-navy-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => {
                            store.markNotificationRead(n.id);
                            setOpen(false);
                          }}
                          className="text-sm font-medium text-navy-900 hover:text-accent-500 block"
                        >
                          {n.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-navy-900">{n.title}</p>
                      )}
                      <p className="text-xs text-navy-400 mt-0.5">{n.message}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-accent-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
