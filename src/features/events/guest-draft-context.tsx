"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { OccasionId } from "@/config/occasions";
import type { Locale } from "@/types/locale";
import type { InvitationModel } from "@/features/invitations/types";
import {
  clearGuestDraft,
  createNewInitialDraft,
  loadGuestDraft,
  saveGuestDraft,
  type LocalDraftPhoto,
  type LocalGuestDraft,
  type LocalStoryItem,
} from "@/lib/storage/guest-draft-db";

const MAX_PHOTOS_LIMIT = 15;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

interface GuestDraftContextValue {
  draft: LocalGuestDraft;
  isHydrated: boolean;
  storageError: string | null;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  // Updates
  setOccasion: (occasion: OccasionId) => void;
  setTemplateId: (templateId: string) => void;
  updateEventDetails: (details: Partial<LocalGuestDraft["event"]>) => void;
  updateContent: (content: Partial<LocalGuestDraft["content"]>) => void;
  setCountdownEnabled: (enabled: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  // Story methods
  addStoryItem: (item: Omit<LocalStoryItem, "id" | "position">) => void;
  updateStoryItem: (id: string, updates: Partial<Omit<LocalStoryItem, "id">>) => void;
  deleteStoryItem: (id: string) => void;
  moveStoryItem: (id: string, direction: "up" | "down") => void;
  // Photo methods
  addPhoto: (file: File, altText?: string) => Promise<{ success: boolean; error?: string }>;
  removePhoto: (id: string) => void;
  movePhoto: (id: string, direction: "up" | "down") => void;
  updatePhotoAlt: (id: string, altText: string) => void;
  markPhotoUploaded: (id: string) => void;
  // Slice 2 Claiming & Sync
  setClaimedEventId: (eventId: string) => void;
  flushDraft: () => Promise<void>;
  clearDraft: () => Promise<void>;
  // Reset
  resetDraft: () => Promise<void>;
  // Prepared presentation model
  invitationModel: InvitationModel;
}

const GuestDraftContext = createContext<GuestDraftContextValue | null>(null);

export function GuestDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<LocalGuestDraft>(() => createNewInitialDraft());
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("ar");

  // Keep track of active object URLs for cleanup
  const activePhotosRef = useRef<LocalDraftPhoto[]>([]);
  useEffect(() => {
    activePhotosRef.current = draft.photos;
  }, [draft.photos]);

  // Initial Load from IndexedDB
  useEffect(() => {
    let mounted = true;
    loadGuestDraft()
      .then((persisted) => {
        if (!mounted) return;
        if (persisted) {
          setDraft(persisted);
        }
        setIsHydrated(true);
      })
      .catch((err) => {
        console.warn("IndexedDB load failure:", err);
        if (mounted) {
          setStorageError("تعذّر قراءة التخزين المحلي. يمكنك المتابعة وسيتم حفظ التعديلات مؤقتاً.");
          setIsHydrated(true);
        }
      });

    return () => {
      mounted = false;
      // Revoke any active object URLs on complete unmount
      for (const p of activePhotosRef.current) {
        if (p.previewUrl) {
          try {
            URL.revokeObjectURL(p.previewUrl);
          } catch {
            // ignore
          }
        }
      }
    };
  }, []);

  // Debounced auto-save to IndexedDB whenever draft changes (after hydration)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isHydrated) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveGuestDraft(draft).catch((err) => {
        console.error("Auto-save failed:", err);
        setStorageError("مساحة التخزين المحلية ممتلئة. قد لا تُحفظ الصور محلياً.");
      });
    }, 400);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [draft, isHydrated]);

  // Context updates
  const setOccasion = useCallback((occasion: OccasionId) => {
    setDraft((prev) => ({ ...prev, occasion }));
  }, []);

  const setTemplateId = useCallback((template_id: string) => {
    setDraft((prev) => ({ ...prev, template_id }));
  }, []);

  const updateEventDetails = useCallback((details: Partial<LocalGuestDraft["event"]>) => {
    setDraft((prev) => ({
      ...prev,
      event: { ...prev.event, ...details },
    }));
  }, []);

  const updateContent = useCallback((content: Partial<LocalGuestDraft["content"]>) => {
    setDraft((prev) => ({
      ...prev,
      content: { ...prev.content, ...content },
    }));
  }, []);

  const setCountdownEnabled = useCallback((countdown_enabled: boolean) => {
    setDraft((prev) => ({ ...prev, countdown_enabled }));
  }, []);

  const setOnboardingCompleted = useCallback((onboarding_completed: boolean) => {
    setDraft((prev) => ({ ...prev, onboarding_completed }));
  }, []);

  // Story mutations
  const addStoryItem = useCallback((item: Omit<LocalStoryItem, "id" | "position">) => {
    setDraft((prev) => {
      const newPosition = prev.story_items.length + 1;
      const newItem: LocalStoryItem = {
        ...item,
        id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        position: newPosition,
      };
      return {
        ...prev,
        story_items: [...prev.story_items, newItem],
      };
    });
  }, []);

  const updateStoryItem = useCallback((id: string, updates: Partial<Omit<LocalStoryItem, "id">>) => {
    setDraft((prev) => ({
      ...prev,
      story_items: prev.story_items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }, []);

  const deleteStoryItem = useCallback((id: string) => {
    setDraft((prev) => {
      const filtered = prev.story_items.filter((item) => item.id !== id);
      const reindexed = filtered.map((item, idx) => ({ ...item, position: idx + 1 }));
      return { ...prev, story_items: reindexed };
    });
  }, []);

  const moveStoryItem = useCallback((id: string, direction: "up" | "down") => {
    setDraft((prev) => {
      const items = [...prev.story_items].sort((a, b) => a.position - b.position);
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;

      const current = items[idx];
      const target = items[targetIdx];

      // Swap positions
      const tempPos = current.position;
      current.position = target.position;
      target.position = tempPos;

      items.sort((a, b) => a.position - b.position);
      return { ...prev, story_items: items };
    });
  }, []);

  // Photo mutations
  const addPhoto = useCallback(
    async (file: File, altText: string = ""): Promise<{ success: boolean; error?: string }> => {
      if (draft.photos.length >= MAX_PHOTOS_LIMIT) {
        return { success: false, error: `الحد الأقصى للصور في المعاينة هو ${MAX_PHOTOS_LIMIT} صورة.` };
      }

      if (file.size > MAX_PHOTO_BYTES) {
        return { success: false, error: "حجم الصورة أكبر من 5 ميجابايت." };
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return { success: false, error: "مسموح بصور JPEG أو PNG أو WebP فقط." };
      }

      try {
        const previewUrl = URL.createObjectURL(file);
        const newPhoto: LocalDraftPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          blob: file,
          previewUrl,
          altText: altText || null,
          position: draft.photos.length + 1,
        };

        setDraft((prev) => ({
          ...prev,
          photos: [...prev.photos, newPhoto],
        }));

        return { success: true };
      } catch (err) {
        console.error("Failed to add photo to local store:", err);
        return { success: false, error: "تعذّر إضافة الصورة محلياً." };
      }
    },
    [draft.photos.length]
  );

  const removePhoto = useCallback((id: string) => {
    setDraft((prev) => {
      const toRemove = prev.photos.find((p) => p.id === id);
      if (toRemove?.previewUrl) {
        try {
          URL.revokeObjectURL(toRemove.previewUrl);
        } catch {
          // ignore
        }
      }
      const filtered = prev.photos.filter((p) => p.id !== id);
      const reindexed = filtered.map((p, idx) => ({ ...p, position: idx + 1 }));
      return { ...prev, photos: reindexed };
    });
  }, []);

  const movePhoto = useCallback((id: string, direction: "up" | "down") => {
    setDraft((prev) => {
      const items = [...prev.photos].sort((a, b) => a.position - b.position);
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;

      const current = items[idx];
      const target = items[targetIdx];

      const tempPos = current.position;
      current.position = target.position;
      target.position = tempPos;

      items.sort((a, b) => a.position - b.position);
      return { ...prev, photos: items };
    });
  }, []);

  const updatePhotoAlt = useCallback((id: string, altText: string) => {
    setDraft((prev) => ({
      ...prev,
      photos: prev.photos.map((p) =>
        p.id === id ? { ...p, altText: altText || null } : p
      ),
    }));
  }, []);

  const markPhotoUploaded = useCallback((photoId: string) => {
    setDraft((prev) => {
      const updatedPhotos = prev.photos.map((p) =>
        p.id === photoId ? { ...p, uploaded: true } : p
      );
      const updated = { ...prev, photos: updatedPhotos };
      saveGuestDraft(updated).catch(() => {});
      return updated;
    });
  }, []);

  const setClaimedEventId = useCallback((eventId: string) => {
    setDraft((prev) => {
      const updated = { ...prev, claimed_event_id: eventId };
      saveGuestDraft(updated).catch(() => {});
      return updated;
    });
  }, []);

  const flushDraft = useCallback(async () => {
    await saveGuestDraft(draft);
  }, [draft]);

  const clearDraft = useCallback(async () => {
    await clearGuestDraft(draft.photos);
  }, [draft.photos]);

  // Reset
  const resetDraft = useCallback(async () => {
    await clearGuestDraft(draft.photos);
    const fresh = createNewInitialDraft(draft.occasion);
    setDraft(fresh);
    setStorageError(null);
  }, [draft.photos, draft.occasion]);

  // Prepared InvitationModel for real InvitationRenderer
  const invitationModel: InvitationModel = useMemo(() => {
    const names = draft.content.host_names || draft.event.title || (locale === "ar" ? "أحمد وسلمى" : "Ahmed & Salma");
    const headline = draft.content.headline || (locale === "ar" ? "يسعدنا حضوركم ومشاركتنا الفرحة" : "Together with our families, we invite you");
    const invitationText = draft.content.invitation_text || (locale === "ar"
      ? "نتشرف بدعوتكم لمشاركتنا أجمل اللحظات وأغلى الذكريات في هذا اليوم الاستثنائي."
      : "We honor your presence in celebrating our love and union on this joyous day.");

    return {
      event: {
        id: draft.client_draft_id,
        occasion_type: draft.occasion,
        title: draft.event.title || names,
        slug: "preview",
        event_date: draft.event.event_date || null,
        venue_name: draft.event.venue_name || null,
        location_url: draft.event.location_url || null,
        primary_locale: locale,
        timezone: "Africa/Cairo",
      },
      content: {
        headline,
        invitation_text: invitationText,
        host_names: names,
      },
      experienceKey: "cinematic-wedding-story",
      themeConfig: {
        version: 1,
        variant: "editorial",
        cover: { style: "editorial" },
        palette: "warm",
        typography: "modern",
        textScale: "balanced",
      },
      sections: [
        { id: "sec-hero", section_type: "hero", position: 1, enabled: true },
        { id: "sec-invitation-text", section_type: "invitation-text", position: 2, enabled: true },
        { id: "sec-event-details", section_type: "event-details", position: 3, enabled: Boolean(draft.event.event_date || draft.event.venue_name) },
        { id: "sec-countdown", section_type: "countdown", position: 4, enabled: Boolean(draft.countdown_enabled && draft.event.event_date) },
        { id: "sec-story", section_type: "story", position: 5, enabled: draft.story_items.length > 0 },
        { id: "sec-gallery", section_type: "gallery", position: 6, enabled: draft.photos.length > 0 },
        { id: "sec-location", section_type: "location", position: 7, enabled: Boolean(draft.event.location_url || draft.event.venue_name) },
        { id: "sec-footer", section_type: "footer", position: 8, enabled: true },
      ],
      storyItems: draft.story_items.map((s) => ({
        id: s.id,
        title: s.title,
        body: s.body,
        date_label: s.date_label || null,
        position: s.position,
      })),
      media: draft.photos.map((p) => ({
        url: p.previewUrl || "",
        altText: p.altText,
        position: p.position,
      })),
    };
  }, [draft, locale]);

  return (
    <GuestDraftContext.Provider
      value={{
        draft,
        isHydrated,
        storageError,
        locale,
        setLocale,
        setOccasion,
        setTemplateId,
        updateEventDetails,
        updateContent,
        setCountdownEnabled,
        setOnboardingCompleted,
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
      }}
    >
      {children}
    </GuestDraftContext.Provider>
  );
}

export function useGuestDraft() {
  const context = useContext(GuestDraftContext);
  if (!context) {
    throw new Error("useGuestDraft must be used within a GuestDraftProvider");
  }
  return context;
}
