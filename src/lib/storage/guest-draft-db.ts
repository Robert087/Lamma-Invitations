/**
 * IndexedDB Local Draft Store for LAMMA Guest-First Creation (Slice 1)
 *
 * Stores structured invitation data and binary photo Blobs locally in the user's browser.
 * Zero database writes, zero Storage bucket uploads.
 */

import type { OccasionId } from "@/config/occasions";

export interface LocalDraftPhoto {
  id: string; // client-generated UUID
  blob: Blob; // local image Blob stored in IndexedDB
  previewUrl?: string; // ephemeral URL.createObjectURL(blob), never stored in DB
  altText: string | null;
  position: number;
  uploaded?: boolean; // Slice 2: tracks cloud upload success
}

export interface LocalStoryItem {
  id: string;
  title: string;
  body: string;
  date_label?: string;
  position: number;
}

export interface LocalGuestDraft {
  client_draft_id: string; // UUID v4
  schema_version: 1;
  created_at: number;
  updated_at: number;
  onboarding_completed: boolean;
  claimed_event_id?: string; // Slice 2: tracks claimed event id for idempotent resume
  occasion: OccasionId;
  template_id: string; // e.g. "cinematic-wedding-story"
  personalization?: Record<string, unknown>;
  event: {
    title: string;
    event_date: string; // YYYY-MM-DD
    venue_name?: string;
    location_url?: string;
  };
  content: {
    headline?: string;
    invitation_text?: string;
    host_names?: string;
  };
  countdown_enabled: boolean;
  story_items: LocalStoryItem[];
  photos: LocalDraftPhoto[];
}

// Storage representation: strip ephemeral previewUrl before saving
export type PersistedDraftPhoto = Omit<LocalDraftPhoto, "previewUrl">;
export type PersistedGuestDraft = Omit<LocalGuestDraft, "photos"> & {
  photos: PersistedDraftPhoto[];
};

const DB_NAME = "lamma_draft_store";
const DB_VERSION = 1;
const STORE_NAME = "guest_drafts";
const DRAFT_KEY = "lamma_guest_draft_v1";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not supported or available in this environment."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

/**
 * Load draft from IndexedDB and regenerate ephemeral preview URLs from Blobs.
 */
export async function loadGuestDraft(): Promise<LocalGuestDraft | null> {
  try {
    const db = await openDatabase();
    const persisted = await new Promise<PersistedGuestDraft | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(DRAFT_KEY);

      request.onsuccess = () => {
        resolve((request.result as PersistedGuestDraft) || null);
      };
      request.onerror = () => reject(request.error || new Error("Failed to read draft from IndexedDB"));
    });

    if (!persisted) {
      return null;
    }

    // Check schema version compatibility
    if (persisted.schema_version !== 1) {
      console.warn("Unsupported draft schema version:", persisted.schema_version);
      return null;
    }

    // Reconstruct ephemeral object URLs from saved Blobs
    const restoredPhotos: LocalDraftPhoto[] = (persisted.photos || []).map((p) => {
      let previewUrl = "";
      if (p.blob && typeof window !== "undefined" && typeof URL.createObjectURL === "function") {
        try {
          previewUrl = URL.createObjectURL(p.blob);
        } catch (err) {
          console.error("Failed to create object URL for photo:", p.id, err);
        }
      }
      return {
        id: p.id,
        blob: p.blob,
        altText: p.altText || null,
        position: p.position,
        previewUrl,
        uploaded: Boolean(p.uploaded),
      };
    });

    return {
      ...persisted,
      photos: restoredPhotos,
    };
  } catch (err) {
    console.warn("Unable to load guest draft from IndexedDB:", err);
    return null;
  }
}

/**
 * Save draft to IndexedDB (stripping ephemeral preview URLs).
 */
export async function saveGuestDraft(draft: LocalGuestDraft): Promise<void> {
  try {
    const db = await openDatabase();
    const persistedPhotos: PersistedDraftPhoto[] = (draft.photos || []).map((p) => ({
      id: p.id,
      blob: p.blob,
      altText: p.altText || null,
      position: p.position,
      uploaded: Boolean(p.uploaded),
    }));

    const toPersist: PersistedGuestDraft = {
      ...draft,
      updated_at: Date.now(),
      photos: persistedPhotos,
    };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(toPersist, DRAFT_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error("Failed to write draft to IndexedDB"));
    });
  } catch (err) {
    console.error("Unable to save guest draft to IndexedDB:", err);
    throw err;
  }
}

/**
 * Clear local draft from IndexedDB and revoke any active object URLs.
 */
export async function clearGuestDraft(currentPhotos?: LocalDraftPhoto[]): Promise<void> {
  if (currentPhotos) {
    for (const p of currentPhotos) {
      if (p.previewUrl) {
        try {
          URL.revokeObjectURL(p.previewUrl);
        } catch {
          // Ignore revocation errors
        }
      }
    }
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(DRAFT_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error || new Error("Failed to delete draft from IndexedDB"));
    });
  } catch (err) {
    console.warn("Unable to clear guest draft from IndexedDB:", err);
  }
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a brand new initial draft with safe defaults.
 */
export function createNewInitialDraft(occasion: OccasionId = "wedding"): LocalGuestDraft {
  const clientDraftId = generateUUID();

  return {
    client_draft_id: clientDraftId,
    schema_version: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
    onboarding_completed: false,
    occasion,
    template_id: "cinematic-wedding-story",
    event: {
      title: "",
      event_date: "",
      venue_name: "",
      location_url: "",
    },
    content: {
      host_names: "",
      headline: "",
      invitation_text: "",
    },
    countdown_enabled: true,
    story_items: [
      {
        id: "story-1",
        title: "أول لقاء",
        body: "اللحظة اللي بدأت فيها حكايتنا ومن أول نظرة عرفنا إن اللي جاي أجمل.",
        date_label: "بداية الحكاية",
        position: 1,
      },
    ],
    photos: [],
  };
}
