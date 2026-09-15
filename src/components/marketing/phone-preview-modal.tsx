"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { InvitationRenderer } from "@/features/invitations/renderer";
import type { InvitationModel } from "@/features/invitations/types";
import { useMarketingLocale } from "./marketing-locale-context";

interface PhonePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: InvitationModel;
  title?: string;
}

export function PhonePreviewModal({
  isOpen,
  onClose,
  invitation,
  title,
}: PhonePreviewModalProps) {
  const { locale, isAr } = useMarketingLocale();
  const [replayKey, setReplayKey] = useState(0);
  const [viewportMode, setViewportMode] = useState<"full" | "mobile">("full");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || (isAr ? "شوفوا الدعوة كاملة" : "Full Invitation Experience")}
      className="fixed inset-0 z-50 flex flex-col bg-[#19161D]/85 backdrop-blur-xl animate-fade-in"
    >
      {/* Top Floating Control Bar */}
      <header className="shrink-0 flex items-center justify-between border-b border-white/10 bg-[#19161D]/90 px-4 sm:px-6 py-3 text-white backdrop-blur-md">
        {/* Left / Start: Title & Demo Label */}
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--lm-plum)]/40 border border-[var(--lm-plum)] px-3 py-1 text-xs font-bold text-white">
            {isAr ? "معاينة حية" : "Live Demo"}
          </span>
          <span className="text-sm font-bold text-white/95 hidden sm:inline-block">
            {title || invitation.content.host_names || (isAr ? "دعوة الزفاف" : "Wedding Invitation")}
          </span>
        </div>

        {/* Center: Viewport Toggle (موبايل / شاشة كاملة) */}
        <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/15">
          <button
            type="button"
            onClick={() => setViewportMode("full")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              viewportMode === "full"
                ? "bg-white text-[var(--lm-ink)] shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            {isAr ? "شاشة كاملة" : "Full Screen"}
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
              viewportMode === "mobile"
                ? "bg-white text-[var(--lm-ink)] shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            {isAr ? "موبايل" : "Mobile View"}
          </button>
        </div>

        {/* Right / End: Replay, Create & Close */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5"
            title={isAr ? "افتح الدعوة تاني" : "Replay Opening"}
          >
            <span>↻</span>
            <span className="hidden sm:inline">{isAr ? "افتح الدعوة تاني" : "Replay"}</span>
          </button>

          <Link
            href="/create"
            className="rounded-full bg-[var(--lm-plum)] hover:bg-[var(--lm-plum-dark)] text-white px-4 py-1.5 text-xs font-bold transition shadow-sm"
          >
            {isAr ? "اصنعوا دعوتكم مجانًا" : "Start Free"}
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-sm font-bold hover:bg-white/30 text-white transition"
            aria-label={isAr ? "إغلاق المعاينة" : "Close preview"}
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main Experience Viewport */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden flex items-start justify-center p-0 sm:p-6">
        {viewportMode === "mobile" ? (
          /* Sleek Minimal Mobile Viewport (no heavy fake bezel) */
          <div className="w-full max-w-[400px] my-auto overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl ring-1 ring-black/10">
            <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden">
              <InvitationRenderer
                key={replayKey}
                invitation={invitation}
                locale={locale}
                presentation="full"
              />
            </div>
          </div>
        ) : (
          /* Responsive Full Invitation Container */
          <div className="w-full max-w-4xl min-h-full bg-white shadow-2xl rounded-none sm:rounded-2xl overflow-hidden my-0 sm:my-auto">
            <InvitationRenderer
              key={replayKey}
              invitation={invitation}
              locale={locale}
              presentation="full"
            />
          </div>
        )}
      </main>
    </div>
  );
}
