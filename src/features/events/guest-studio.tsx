"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { occasions, occasionLabels } from "@/config/occasions";
import { launchTemplates } from "@/config/templates";
import { InvitationRenderer } from "@/features/invitations/renderer";
import { useGuestDraft } from "./guest-draft-context";
import {
  claimGuestDraftAction,
  uploadClaimedPhotoAction,
  type ClaimDraftPayload,
} from "./claim-actions";

type ActiveDrawerSection =
  | "template"
  | "basics"
  | "invitation"
  | "location"
  | "countdown"
  | "story"
  | "photos";

type ClaimPhase = "idle" | "saving_db" | "syncing_media" | "partial_error" | "db_error" | "success";

interface GuestStudioProps {
  isAuthenticated?: boolean;
  shouldAutoClaim?: boolean;
}

export function GuestStudio({ isAuthenticated = false, shouldAutoClaim = false }: GuestStudioProps) {
  const {
    draft,
    locale,
    setLocale,
    storageError,
    setOccasion,
    setTemplateId,
    updateEventDetails,
    updateContent,
    setCountdownEnabled,
    addStoryItem,
    updateStoryItem,
    deleteStoryItem,
    moveStoryItem,
    addPhoto,
    removePhoto,
    movePhoto,
    updatePhotoAlt,
    markPhotoUploaded,
    setClaimedEventId,
    flushDraft,
    clearDraft,
    resetDraft,
    invitationModel,
  } = useGuestDraft();

  const router = useRouter();
  const isAr = locale === "ar";

  // Mobile viewport toggle: 'edit' vs 'preview'
  const [mobileViewMode, setMobileViewMode] = useState<"edit" | "preview">("edit");
  // Active accordion section in drawer
  const [activeSection, setActiveSection] = useState<ActiveDrawerSection>("basics");
  // Key to force reset the opening reveal animation in renderer
  const [previewKey, setPreviewKey] = useState(0);

  // Story editing state
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryBody, setNewStoryBody] = useState("");
  const [newStoryDateLabel, setNewStoryDateLabel] = useState("");
  const [isAddingStory, setIsAddingStory] = useState(false);

  // Photo upload state
  const [photoError, setPhotoError] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Slice 2 Claiming and Media Sync State
  const [claimPhase, setClaimPhase] = useState<ClaimPhase>("idle");
  const [claimError, setClaimError] = useState("");
  const [mediaSyncProgress, setMediaSyncProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const isClaimingRef = useRef(false);

  const runClaimFlow = useCallback(async () => {
    if (isClaimingRef.current) return;
    isClaimingRef.current = true;
    setClaimError("");

    let targetEventId = draft.claimed_event_id;

    // Phase 1: Database claim (if not already claimed)
    if (!targetEventId) {
      setClaimPhase("saving_db");
      const payload: ClaimDraftPayload = {
        client_draft_id: draft.client_draft_id,
        occasion: draft.occasion,
        template_id: draft.template_id,
        event: {
          title: draft.event.title || draft.content.host_names || (isAr ? "دعوتنا السعيدة" : "Our Wedding"),
          event_date: draft.event.event_date,
          venue_name: draft.event.venue_name,
          location_url: draft.event.location_url,
        },
        content: {
          headline: draft.content.headline,
          invitation_text: draft.content.invitation_text,
          host_names: draft.content.host_names,
        },
        countdown_enabled: draft.countdown_enabled,
        story_items: draft.story_items.map((s) => ({
          title: s.title,
          body: s.body,
          date_label: s.date_label,
          position: s.position,
        })),
      };

      const claimResult = await claimGuestDraftAction(payload);
      if (!claimResult.success || !claimResult.eventId) {
        setClaimPhase("db_error");
        setClaimError(
          claimResult.error ||
            (isAr ? "تعذر حفظ الدعوة. حاول مرة أخرى." : "Failed to save invitation. Please try again.")
        );
        isClaimingRef.current = false;
        return;
      }

      targetEventId = claimResult.eventId;
      setClaimedEventId(targetEventId);
    }

    // Phase 2: Resumable Media Sync
    const pendingPhotos = draft.photos.filter((p) => !p.uploaded);
    const totalPhotos = draft.photos.length;
    const initialUploadedCount = totalPhotos - pendingPhotos.length;

    if (pendingPhotos.length === 0) {
      setClaimPhase("success");
      await clearDraft();
      setTimeout(() => {
        router.push(`/dashboard/events/${targetEventId}/invitation`);
      }, 500);
      return;
    }

    setClaimPhase("syncing_media");
    setMediaSyncProgress({ current: initialUploadedCount, total: totalPhotos });

    const sortedPending = [...pendingPhotos].sort((a, b) => a.position - b.position);
    let currentUploaded = initialUploadedCount;

    for (const photo of sortedPending) {
      currentUploaded++;
      setMediaSyncProgress({ current: currentUploaded, total: totalPhotos });

      const formData = new FormData();
      formData.append("event_id", targetEventId);
      formData.append("image", photo.blob, `photo-${photo.id}.jpg`);
      if (photo.altText) {
        formData.append("alt_text", photo.altText);
      }

      const uploadResult = await uploadClaimedPhotoAction(formData);
      if (!uploadResult.success) {
        setClaimPhase("partial_error");
        setClaimError(
          isAr
            ? "الدعوة اتحفظت، بس فيه صور لسه محتاجة نكمّل رفعها."
            : "Invitation was saved, but some photos still need to be uploaded."
        );
        isClaimingRef.current = false;
        return;
      }

      markPhotoUploaded(photo.id);
    }

    // Phase 3: All photos uploaded successfully
    setClaimPhase("success");
    await clearDraft();
    setTimeout(() => {
      router.push(`/dashboard/events/${targetEventId}/invitation`);
    }, 600);
  }, [draft, isAr, setClaimedEventId, markPhotoUploaded, clearDraft, router]);

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      await flushDraft();
      router.push("/sign-in?continuation=claim-draft");
      return;
    }

    runClaimFlow();
  };

  useEffect(() => {
    if (shouldAutoClaim && isAuthenticated && !isClaimingRef.current) {
      runClaimFlow();
    }
  }, [shouldAutoClaim, isAuthenticated, runClaimFlow]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setPhotoError("");
    setIsUploadingPhoto(true);

    const file = files[0];
    const res = await addPhoto(file);
    if (!res.success && res.error) {
      setPhotoError(res.error);
    }
    setIsUploadingPhoto(false);
    // Reset input
    e.target.value = "";
  };

  const handleAddStory = () => {
    if (!newStoryTitle.trim() || !newStoryBody.trim()) return;
    addStoryItem({
      title: newStoryTitle.trim(),
      body: newStoryBody.trim(),
      date_label: newStoryDateLabel.trim() || undefined,
    });
    setNewStoryTitle("");
    setNewStoryBody("");
    setNewStoryDateLabel("");
    setIsAddingStory(false);
  };

  const handleReplayOpening = () => {
    setPreviewKey((k) => k + 1);
  };

  const hostNames = draft.content.host_names || draft.event.title || (isAr ? "أحمد وسلمى" : "Ahmed & Salma");

  return (
    <div className="mx-auto max-w-7xl">
      {/* Top Banner: Local-only indicator & Controls */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--lm-line)] bg-white p-4 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-bold text-[var(--lm-ink)]">
              {isAr ? `دعوتكم: ${hostNames}` : `Your Invitation: ${hostNames}`}
            </h1>
          </div>
          <span className="rounded-full bg-[var(--lm-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--lm-accent-dark)]">
            {isAr ? "مسودة محفوظة محلياً على هذا المتصفح" : "Draft saved locally in this browser"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="rounded-lg border border-[var(--lm-line)] px-3 py-1.5 text-xs font-bold text-[var(--lm-muted)] hover:border-[var(--lm-ink)] hover:text-[var(--lm-ink)]"
          >
            {locale === "ar" ? "English" : "العربية"}
          </button>

          {/* Reset / Start Over */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(isAr ? "هل تريد بدء دعوة جديدة ومسح المسودة الحالية؟" : "Start a new invitation and clear this draft?")) {
                resetDraft();
              }
            }}
            className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-[var(--lm-muted)] hover:text-red-700"
          >
            {isAr ? "بدء جديد" : "Start fresh"}
          </button>

          {/* Save Account / Publish CTA */}
          <button
            type="button"
            disabled={claimPhase !== "idle"}
            onClick={handleSaveClick}
            className="lm-button lm-button-accent px-4 py-2 text-xs font-bold shadow disabled:opacity-60"
          >
            {claimPhase === "saving_db" || claimPhase === "syncing_media"
              ? isAr ? "جارٍ الحفظ..." : "Saving..."
              : isAr ? "احفظ دعوتك" : "Save Invitation"}
          </button>
        </div>
      </header>

      {/* Storage Warning if any */}
      {storageError && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
          ⚠️ {storageError}
        </div>
      )}

      {/* Mobile Segments (390px Viewport Support) */}
      <div className="mb-4 flex sm:hidden rounded-xl border border-[var(--lm-line)] bg-[var(--lm-surface-soft)] p-1">
        <button
          type="button"
          onClick={() => setMobileViewMode("edit")}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
            mobileViewMode === "edit"
              ? "bg-white text-[var(--lm-ink)] shadow-sm"
              : "text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
          }`}
        >
          {isAr ? "تعديل الدعوة" : "Edit Invitation"}
        </button>
        <button
          type="button"
          onClick={() => setMobileViewMode("preview")}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
            mobileViewMode === "preview"
              ? "bg-[var(--lm-accent)] text-white shadow-sm"
              : "text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
          }`}
        >
          {isAr ? "شوف الدعوة (معاينة)" : "View Invitation (Preview)"}
        </button>
      </div>

      {/* Main Studio Grid: Contextual Drawer (Left) + Live Phone Preview (Right) */}
      <div className="grid gap-8 lg:grid-cols-[440px_1fr] items-start">
        {/* LEFT COLUMN: Contextual "دعوتكم" Accordion Drawer */}
        <aside
          className={`space-y-4 ${
            mobileViewMode === "preview" ? "hidden sm:block" : "block"
          }`}
        >
          {/* Section 1: اختار التصميم */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "template" ? "basics" : "template")}
              className="flex w-full items-center justify-between p-4 text-start hover:bg-[var(--lm-canvas)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  🎨
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "اختار التصميم" : "Choose Design"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {isAr ? "القصة السينمائية (القالب الأساسي)" : "Cinematic Wedding Story"}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--lm-muted)]">
                {activeSection === "template" ? "▲" : "▼"}
              </span>
            </button>

            {activeSection === "template" && (
              <div className="border-t border-[var(--lm-line)] p-4 bg-[var(--lm-surface)] animate-fade-in">
                <div className="space-y-3">
                  {launchTemplates.map((t) => {
                    const isSelected = draft.template_id === t.id;
                    return (
                      <div
                        key={t.id}
                        className={`rounded-xl border-2 p-4 transition ${
                          isSelected
                            ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]"
                            : "border-[var(--lm-line)] bg-white hover:border-[var(--lm-ink)] cursor-pointer"
                        }`}
                        onClick={() => setTemplateId(t.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[var(--lm-ink)]">{t.name[locale]}</span>
                          <span
                            className={`rounded-full text-[10px] font-bold px-2 py-0.5 ${
                              isSelected
                                ? "bg-[var(--lm-accent)] text-white"
                                : "bg-[var(--lm-line)] text-[var(--lm-muted)]"
                            }`}
                          >
                            {isSelected
                              ? isAr ? "مختار حالياً" : "Selected"
                              : isAr ? "اختيار القالب" : "Select"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--lm-muted)] leading-relaxed">
                          {t.subtitle[locale]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: البيانات الأساسية */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "basics" ? "invitation" : "basics")}
              className="flex w-full items-center justify-between p-4 text-start hover:bg-[var(--lm-canvas)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  💍
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "البيانات الأساسية" : "Essential Details"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {hostNames} {draft.event.event_date ? `· ${draft.event.event_date}` : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--lm-muted)]">
                {activeSection === "basics" ? "▲" : "▼"}
              </span>
            </button>

            {activeSection === "basics" && (
              <div className="border-t border-[var(--lm-line)] p-4 space-y-4 bg-[var(--lm-surface)] animate-fade-in">
                {/* Occasion Switcher */}
                <div>
                  <label className="block text-xs font-bold text-[var(--lm-muted)] uppercase mb-2">
                    {isAr ? "نوع المناسبة" : "Occasion"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {occasions.slice(0, 5).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setOccasion(id)}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                          draft.occasion === id
                            ? "bg-[var(--lm-ink)] text-white"
                            : "border border-[var(--lm-line)] bg-white text-[var(--lm-muted)] hover:border-[var(--lm-ink)]"
                        }`}
                      >
                        {occasionLabels[id][locale]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Host Names */}
                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "الأسماء (كما تظهر في الغلاف)" : "Names (on cover and intro)"}
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    value={draft.content.host_names || ""}
                    onChange={(e) => updateContent({ host_names: e.target.value })}
                    placeholder={isAr ? "أحمد وسلمى" : "Ahmed & Salma"}
                    className="lm-input mt-1.5 text-sm font-semibold"
                  />
                </div>

                {/* Event Title */}
                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "عنوان المناسبة" : "Event Title"}
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    value={draft.event.title}
                    onChange={(e) => updateEventDetails({ title: e.target.value })}
                    placeholder={isAr ? "حفل زفاف أحمد وسلمى" : "Wedding of Ahmed & Salma"}
                    className="lm-input mt-1.5 text-sm"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "تاريخ المناسبة" : "Event Date"}
                  </label>
                  <input
                    type="date"
                    value={draft.event.event_date || ""}
                    onChange={(e) => updateEventDetails({ event_date: e.target.value })}
                    className="lm-input mt-1.5 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: الدعوة */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "invitation" ? "basics" : "invitation")}
              className="flex w-full items-center justify-between p-4 text-start hover:bg-[var(--lm-canvas)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  ✉️
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "نص الدعوة والترحيب" : "Invitation Message"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {draft.content.headline || (isAr ? "أول انطباع ورسالتكم للضيوف" : "Header & message")}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--lm-muted)]">
                {activeSection === "invitation" ? "▲" : "▼"}
              </span>
            </button>

            {activeSection === "invitation" && (
              <div className="border-t border-[var(--lm-line)] p-4 space-y-4 bg-[var(--lm-surface)] animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "الجملة الافتتاحية (أول انطباع)" : "Headline"}
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    value={draft.content.headline || ""}
                    onChange={(e) => updateContent({ headline: e.target.value })}
                    placeholder={isAr ? "يسعدنا حضوركم ومشاركتنا الفرحة" : "We are thrilled to celebrate with you"}
                    className="lm-input mt-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "نص الدعوة الرسمي" : "Formal Invitation Words"}
                  </label>
                  <textarea
                    dir="auto"
                    rows={4}
                    value={draft.content.invitation_text || ""}
                    onChange={(e) => updateContent({ invitation_text: e.target.value })}
                    placeholder={isAr
                      ? "نتشرف بدعوتكم لمشاركتنا أجمل اللحظات وأغلى الذكريات في هذا اليوم الاستثنائي."
                      : "We warmly invite you to join us on this memorable day."}
                    className="lm-input mt-1.5 text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: المكان */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "location" ? "basics" : "location")}
              className="flex w-full items-center justify-between p-4 text-start hover:bg-[var(--lm-canvas)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  📍
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "المكان والخريطة" : "Venue & Location"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {draft.event.venue_name || (isAr ? "إضافة تفاصيل الموقع" : "Add location")}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--lm-muted)]">
                {activeSection === "location" ? "▲" : "▼"}
              </span>
            </button>

            {activeSection === "location" && (
              <div className="border-t border-[var(--lm-line)] p-4 space-y-4 bg-[var(--lm-surface)] animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "اسم المكان أو القاعة" : "Venue Name"}
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    value={draft.event.venue_name || ""}
                    onChange={(e) => updateEventDetails({ venue_name: e.target.value })}
                    placeholder={isAr ? "مثال: فندق الفورسيزونز - قاعة النيل" : "Four Seasons Ballroom"}
                    className="lm-input mt-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "رابط الخريطة" : "Map Link (URL)"}
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={draft.event.location_url || ""}
                    onChange={(e) => updateEventDetails({ location_url: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="lm-input mt-1.5 text-start font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: العد التنازلي */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  ⏳
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "العد التنازلي" : "Countdown"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {isAr ? "يحسب الأيام والساعات حتى يوم المناسبة" : "Shows days and hours until celebration"}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={draft.countdown_enabled}
                  onChange={(e) => setCountdownEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--lm-accent)]" />
              </label>
            </div>
          </div>

          {/* Section 6: قصتنا */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "story" ? "basics" : "story")}
              className="flex w-full items-center justify-between p-4 text-start hover:bg-[var(--lm-canvas)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  📖
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "قصتنا (المحطات)" : "Our Story (Chapters)"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {draft.story_items.length
                      ? isAr ? `${draft.story_items.length} محطات مضافة` : `${draft.story_items.length} chapters`
                      : (isAr ? "أضف محطات من رحلتكم" : "Add story chapters")}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--lm-muted)]">
                {activeSection === "story" ? "▲" : "▼"}
              </span>
            </button>

            {activeSection === "story" && (
              <div className="border-t border-[var(--lm-line)] p-4 space-y-4 bg-[var(--lm-surface)] animate-fade-in">
                {/* Story Items List */}
                <div className="space-y-3">
                  {draft.story_items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[var(--lm-line)] p-3 bg-[var(--lm-canvas)] text-start"
                    >
                      {editingStoryId === item.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateStoryItem(item.id, { title: e.target.value })}
                            className="lm-input text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={item.date_label || ""}
                            onChange={(e) => updateStoryItem(item.id, { date_label: e.target.value })}
                            placeholder={isAr ? "تاريخ أو مناسبة اللحظة" : "Date or occasion"}
                            className="lm-input text-xs"
                          />
                          <textarea
                            rows={2}
                            value={item.body}
                            onChange={(e) => updateStoryItem(item.id, { body: e.target.value })}
                            className="lm-input text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingStoryId(null)}
                            className="rounded bg-[var(--lm-ink)] px-3 py-1 text-xs text-white"
                          >
                            {isAr ? "تم" : "Done"}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-xs font-semibold text-[var(--lm-accent)]">
                                {item.date_label || `#${index + 1}`}
                              </span>
                              <h3 className="text-sm font-bold text-[var(--lm-ink)]">{item.title}</h3>
                              <p className="mt-1 text-xs text-[var(--lm-muted)] line-clamp-2">{item.body}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveStoryItem(item.id, "up")}
                                className="rounded p-1 text-xs hover:bg-[var(--lm-line)] disabled:opacity-30"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={index === draft.story_items.length - 1}
                                onClick={() => moveStoryItem(item.id, "down")}
                                className="rounded p-1 text-xs hover:bg-[var(--lm-line)] disabled:opacity-30"
                                title="Move Down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingStoryId(item.id)}
                                className="rounded p-1 text-xs text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteStoryItem(item.id)}
                                className="rounded p-1 text-xs text-red-600 hover:bg-red-50"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Story Item Form */}
                {isAddingStory ? (
                  <div className="rounded-xl border-2 border-dashed border-[var(--lm-accent)] p-3 bg-white space-y-2">
                    <input
                      type="text"
                      placeholder={isAr ? "عنوان اللحظة (مثال: أول لقاء)" : "Title (e.g. First Meeting)"}
                      value={newStoryTitle}
                      onChange={(e) => setNewStoryTitle(e.target.value)}
                      className="lm-input text-xs"
                    />
                    <input
                      type="text"
                      placeholder={isAr ? "التاريخ أو الوقت (مثال: صيف ٢٠٢٤)" : "Date label (e.g. Summer 2024)"}
                      value={newStoryDateLabel}
                      onChange={(e) => setNewStoryDateLabel(e.target.value)}
                      className="lm-input text-xs"
                    />
                    <textarea
                      rows={3}
                      placeholder={isAr ? "احكوا تفاصيل اللحظة باختصار..." : "Write what happened..."}
                      value={newStoryBody}
                      onChange={(e) => setNewStoryBody(e.target.value)}
                      className="lm-input text-xs"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsAddingStory(false)}
                        className="px-3 py-1 text-xs font-semibold text-[var(--lm-muted)]"
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        onClick={handleAddStory}
                        className="rounded-lg bg-[var(--lm-accent)] px-4 py-1.5 text-xs font-bold text-white shadow"
                      >
                        {isAr ? "إضافة اللحظة" : "Add Chapter"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingStory(true)}
                    className="w-full rounded-xl border border-dashed border-[var(--lm-line)] py-2.5 text-xs font-bold text-[var(--lm-accent)] hover:border-[var(--lm-accent)] hover:bg-[var(--lm-accent-soft)] transition"
                  >
                    + {isAr ? "أضف محطة في الحكاية" : "Add Story Chapter"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section 7: الصور (Gallery) */}
          <div className="overflow-hidden rounded-2xl border border-[var(--lm-line)] bg-white shadow-sm transition">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === "photos" ? "basics" : "photos")}
              className="flex w-full items-center justify-between p-4 text-start hover:bg-[var(--lm-canvas)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--lm-accent-soft)] text-xs text-[var(--lm-accent)]">
                  📷
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--lm-ink)]">
                    {isAr ? "الصور ولحظاتنا" : "Photos & Moments"}
                  </h2>
                  <p className="text-xs text-[var(--lm-muted)]">
                    {draft.photos.length}/15 {isAr ? "صورة مضافة" : "photos added"}
                  </p>
                </div>
              </div>
              <span className="text-sm text-[var(--lm-muted)]">
                {activeSection === "photos" ? "▲" : "▼"}
              </span>
            </button>

            {activeSection === "photos" && (
              <div className="border-t border-[var(--lm-line)] p-4 space-y-4 bg-[var(--lm-surface)] animate-fade-in">
                <p className="text-xs text-[var(--lm-muted)]">
                  {isAr
                    ? "اختاروا صوركم لتظهر فوراً في المعاينة الحية. الصور مخزنة محلياً على جهازكم فقط بدون رفع لأي خادم."
                    : "Select photos to preview live immediately. Photos are stored locally on your device without server upload."}
                </p>

                {/* Upload Trigger */}
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--lm-line)] p-4 text-center cursor-pointer hover:border-[var(--lm-accent)] hover:bg-[var(--lm-accent-soft)] transition">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={isUploadingPhoto || draft.photos.length >= 15}
                    onChange={handlePhotoSelect}
                  />
                  <span className="text-2xl mb-1">📸</span>
                  <span className="text-xs font-bold text-[var(--lm-ink)]">
                    {isUploadingPhoto
                      ? isAr ? "جاري معالجة الصورة..." : "Processing photo..."
                      : isAr ? "اختر صورة من جهازك" : "Select photo from device"}
                  </span>
                  <span className="text-[10px] text-[var(--lm-muted)] mt-1">
                    JPEG, PNG, WebP · {isAr ? "حتى ٥ ميجابايت" : "Up to 5MB"}
                  </span>
                </label>

                {photoError && (
                  <p className="text-xs font-bold text-red-600">{photoError}</p>
                )}

                {/* Photo Grid */}
                {draft.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {draft.photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="group relative overflow-hidden rounded-xl border border-[var(--lm-line)] bg-white shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.previewUrl}
                          alt={photo.altText || `Photo ${index + 1}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <div className="p-2 space-y-1.5">
                          <input
                            type="text"
                            placeholder={isAr ? "وصف الصورة (اختياري)" : "Alt text (optional)"}
                            value={photo.altText || ""}
                            onChange={(e) => updatePhotoAlt(photo.id, e.target.value)}
                            className="lm-input text-[10px] py-1 px-1.5"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => movePhoto(photo.id, "up")}
                                className="rounded bg-[var(--lm-surface-soft)] px-2 py-0.5 text-xs font-bold disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                disabled={index === draft.photos.length - 1}
                                onClick={() => movePhoto(photo.id, "down")}
                                className="rounded bg-[var(--lm-surface-soft)] px-2 py-0.5 text-xs font-bold disabled:opacity-30"
                              >
                                ↓
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.id)}
                              className="rounded px-2 py-0.5 text-xs font-bold text-red-600 hover:bg-red-50"
                            >
                              {isAr ? "حذف" : "Remove"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Sections (Notice only) */}
          <div className="rounded-2xl border border-dashed border-[var(--lm-line)] p-4 text-center bg-white/50">
            <p className="text-xs font-bold text-[var(--lm-muted)]">
              {isAr ? "ميزات إضافية عند نشر الدعوة" : "Additional features upon publishing"}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-[11px] text-[var(--lm-muted)]">
              <span className="rounded-full bg-[var(--lm-surface-soft)] px-2.5 py-1">
                🎵 {isAr ? "الموسيقى الخلفية" : "Background Music"}
              </span>
              <span className="rounded-full bg-[var(--lm-surface-soft)] px-2.5 py-1">
                💬 {isAr ? "سجل التهاني" : "Guest Wishes"}
              </span>
              <span className="rounded-full bg-[var(--lm-surface-soft)] px-2.5 py-1">
                📋 {isAr ? "تأكيد الحضور (RSVP)" : "RSVP Tracker"}
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Real Production Invitation Preview */}
        <section
          className={`space-y-3 ${
            mobileViewMode === "edit" ? "hidden sm:block" : "block"
          }`}
        >
          {/* Preview Controls Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--lm-muted)]">
                {isAr ? "المعاينة الحية للضيوف" : "Live Guest Preview"}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-[var(--lm-muted)]">
                ({isAr ? "نفس تجربة شاشة الموبايل الحقيقية" : "Actual 390px mobile runtime"})
              </span>
            </div>

            <button
              type="button"
              onClick={handleReplayOpening}
              className="rounded-lg border border-[var(--lm-line)] bg-white px-3 py-1 text-xs font-bold text-[var(--lm-ink)] hover:border-[var(--lm-accent)] hover:text-[var(--lm-accent)] shadow-sm transition"
            >
              ↻ {isAr ? "إعادة فتح الغلاف" : "Replay Cover"}
            </button>
          </div>

          {/* Phone Frame Container */}
          <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[2.5rem] border-[8px] border-[var(--lm-ink)] bg-white shadow-2xl ring-1 ring-black/5">
            {/* Phone Notch/Speaker simulation */}
            <div className="h-5 w-full bg-[var(--lm-ink)] flex items-center justify-center">
              <div className="h-1.5 w-16 rounded-full bg-white/20" />
            </div>

            {/* Renderer Viewport: Min height 760px */}
            <div className="max-h-[820px] overflow-y-auto overflow-x-hidden">
              <InvitationRenderer
                key={previewKey}
                invitation={invitationModel}
                locale={locale}
                presentation="studio"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Slice 2 Real Claiming and Media Sync Modal */}
      {claimPhase !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[var(--lm-line)] text-center">
            {claimPhase === "saving_db" && (
              <div className="py-6 space-y-4">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[var(--lm-accent)] border-r-transparent" />
                <h3 className="text-lg font-bold text-[var(--lm-ink)]">
                  {isAr ? "بنحفظ دعوتك..." : "Saving your invitation..."}
                </h3>
                <p className="text-xs text-[var(--lm-muted)]">
                  {isAr ? "جاري نقل بيانات المناسبة إلى حسابك بأمان." : "Transferring your invitation to your account safely."}
                </p>
              </div>
            )}

            {claimPhase === "syncing_media" && (
              <div className="py-6 space-y-4">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[var(--lm-accent)] border-r-transparent" />
                <h3 className="text-lg font-bold text-[var(--lm-ink)]">
                  {isAr ? "بنجهّز الصور..." : "Preparing photos..."}
                </h3>
                <p className="text-xs font-semibold text-[var(--lm-accent)]">
                  {isAr
                    ? `${mediaSyncProgress.current} من ${mediaSyncProgress.total}`
                    : `${mediaSyncProgress.current} of ${mediaSyncProgress.total}`}
                </p>
                <p className="text-xs text-[var(--lm-muted)]">
                  {isAr ? "نرفع صورك بجودة عالية لحسابك." : "Uploading your photos in high quality to your account."}
                </p>
              </div>
            )}

            {claimPhase === "success" && (
              <div className="py-6 space-y-4">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-[var(--lm-ink)]">
                  {isAr ? "تمام، دعوتك اتحفظت" : "All set! Your invitation is saved"}
                </h3>
                <p className="text-xs text-[var(--lm-muted)]">
                  {isAr ? "جاري تحويلك لمساحة الدعوة الخاصة بك..." : "Redirecting to your invitation workspace..."}
                </p>
              </div>
            )}

            {claimPhase === "partial_error" && (
              <div className="py-4 space-y-4 text-start">
                <div className="flex items-center gap-2 text-amber-600">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-base font-bold">
                    {isAr ? "اكتمل الحفظ جزئياً" : "Partially Saved"}
                  </h3>
                </div>
                <p className="text-sm text-[var(--lm-ink)] leading-relaxed">
                  {claimError ||
                    (isAr
                      ? "الدعوة اتحفظت، بس فيه صور لسه محتاجة نكمّل رفعها."
                      : "Invitation was saved, but some photos still need to be uploaded.")}
                </p>
                <p className="text-xs text-[var(--lm-muted)]">
                  {isAr ? "صورك محفوظة بأمان على جهازك ولن تفقد أي صورة." : "Your photos are safe on your device and none have been lost."}
                </p>
                <div className="flex flex-wrap gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (draft.claimed_event_id) {
                        router.push(`/dashboard/events/${draft.claimed_event_id}/invitation`);
                      } else {
                        setClaimPhase("idle");
                      }
                    }}
                    className="rounded-lg border border-[var(--lm-line)] px-4 py-2 text-xs font-semibold text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
                  >
                    {isAr ? "المتابعة لاحقاً" : "Continue later"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      isClaimingRef.current = false;
                      runClaimFlow();
                    }}
                    className="lm-button lm-button-accent px-5 py-2 text-xs font-bold"
                  >
                    {isAr ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              </div>
            )}

            {claimPhase === "db_error" && (
              <div className="py-4 space-y-4 text-start">
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-base font-bold">
                    {isAr ? "تعذر حفظ الدعوة" : "Failed to Save"}
                  </h3>
                </div>
                <p className="text-sm text-[var(--lm-ink)] leading-relaxed">
                  {claimError ||
                    (isAr
                      ? "حدث خطأ غير متوقع أثناء حفظ الدعوة. حاول مرة أخرى."
                      : "An unexpected error occurred while saving. Please try again.")}
                </p>
                <p className="text-xs text-[var(--lm-muted)]">
                  {isAr ? "مسودتك محفوظة محلياً بالكامل ولن يضيع أي محتوى." : "Your draft is intact locally on your device."}
                </p>
                <div className="flex flex-wrap gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimPhase("idle")}
                    className="rounded-lg border border-[var(--lm-line)] px-4 py-2 text-xs font-semibold text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
                  >
                    {isAr ? "العودة للتعديل" : "Back to editing"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      isClaimingRef.current = false;
                      runClaimFlow();
                    }}
                    className="lm-button lm-button-accent px-5 py-2 text-xs font-bold"
                  >
                    {isAr ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
