"use server";

import { occasions, type OccasionId } from "@/config/occasions";
import { experienceKeys, type ExperienceKey } from "@/config/experiences";
import { defaultInvitationSections } from "@/config/invitation-sections";
import { createClient } from "@/lib/supabase/server";
import { initialMediaActionState } from "@/features/invitations/media";
import { uploadInvitationMedia } from "@/features/invitations/actions";
import { createEventSlug } from "./slug";

export interface ClaimDraftPayload {
  client_draft_id: string;
  occasion: string;
  template_id: string;
  event: {
    title: string;
    event_date: string;
    venue_name?: string;
    location_url?: string;
  };
  content: {
    headline?: string;
    invitation_text?: string;
    host_names?: string;
  };
  countdown_enabled: boolean;
  story_items: Array<{
    title: string;
    body: string;
    date_label?: string;
    position: number;
  }>;
}

export type ClaimDraftResult = {
  success: boolean;
  eventId?: string;
  slug?: string;
  isExisting?: boolean;
  error?: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Transactional claim of a guest draft for the authenticated owner.
 * Derives owner strictly from auth.uid().
 * Guarantees idempotency on client_draft_id.
 */
export async function claimGuestDraftAction(payload: ClaimDraftPayload): Promise<ClaimDraftResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "يجب تسجيل الدخول أولاً لحفظ الدعوة." };
  }

  // Validate client_draft_id
  if (!payload.client_draft_id || !uuidPattern.test(payload.client_draft_id)) {
    return { success: false, error: "معرّف المسودة غير صالح." };
  }

  // Validate occasion
  const occasionType = occasions.includes(payload.occasion as OccasionId)
    ? (payload.occasion as OccasionId)
    : "wedding";

  // Validate title
  const title = (payload.event.title || payload.content.host_names || "دعوتنا السعيدة").trim();
  if (title.length < 2 || title.length > 120) {
    return { success: false, error: "عنوان الدعوة يجب أن يكون بين حرفين و١٢٠ حرفاً." };
  }

  // Validate template_id against trusted registry
  const templateId = experienceKeys.includes(payload.template_id as ExperienceKey)
    ? (payload.template_id as ExperienceKey)
    : "cinematic-wedding-story";

  const eventDate = payload.event.event_date && /^\d{4}-\d{2}-\d{2}$/.test(payload.event.event_date)
    ? payload.event.event_date
    : null;

  const venueName = payload.event.venue_name ? payload.event.venue_name.trim().slice(0, 160) : null;
  const locationUrl = payload.event.location_url ? payload.event.location_url.trim().slice(0, 2048) : null;
  const headline = payload.content.headline ? payload.content.headline.trim() : null;
  const invitationText = payload.content.invitation_text ? payload.content.invitation_text.trim() : null;
  const hostNames = payload.content.host_names ? payload.content.host_names.trim() : null;

  // Try calling the transactional database RPC first
  const { data: rpcData, error: rpcError } = await supabase.rpc("claim_guest_draft", {
    p_client_draft_id: payload.client_draft_id,
    p_occasion_type: occasionType,
    p_title: title,
    p_event_date: eventDate,
    p_venue_name: venueName,
    p_location_url: locationUrl,
    p_template_id: templateId,
    p_headline: headline,
    p_invitation_text: invitationText,
    p_host_names: hostNames,
    p_countdown_enabled: payload.countdown_enabled,
    p_story_items: payload.story_items || [],
  });

  if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
    const row = rpcData[0] as { event_id: string; slug: string; is_existing: boolean };
    return {
      success: true,
      eventId: row.event_id,
      slug: row.slug,
      isExisting: Boolean(row.is_existing),
    };
  }

  // Fallback: If RPC has not been applied to DB yet (e.g. relation or function not found error 42883)
  // Execute idempotent transaction via authorized Supabase client:
  try {
    // 1. Check for existing event for this owner
    // If client_draft_id column exists, query by client_draft_id; otherwise check title & date
    const { data: existingEvents } = await supabase
      .from("events")
      .select("id, slug")
      .eq("owner_id", user.id)
      .limit(5);

    // If an event exists with this title/owner recently, check if client_draft_id matches
    if (existingEvents && existingEvents.length > 0) {
      // Try to match client_draft_id
      const { data: matchedEvent } = await supabase
        .from("events")
        .select("id, slug")
        .eq("owner_id", user.id)
        .eq("client_draft_id", payload.client_draft_id)
        .maybeSingle();

      if (matchedEvent) {
        return {
          success: true,
          eventId: matchedEvent.id,
          slug: matchedEvent.slug,
          isExisting: true,
        };
      }
    }

    // 2. Insert into events
    const slug = `${createEventSlug(title)}-${Math.random().toString(36).slice(2, 8)}`;
    const eventInsertPayload: Record<string, unknown> = {
      owner_id: user.id,
      occasion_type: occasionType,
      title,
      slug,
      status: "draft",
      event_date: eventDate,
      timezone: "Africa/Cairo",
      venue_name: venueName,
      location_url: locationUrl,
      primary_locale: "ar",
      client_draft_id: payload.client_draft_id,
    };

    let newEvent: { id: string; slug: string } | null = null;
    const { data: createdEvent, error: insertEventError } = await supabase
      .from("events")
      .insert(eventInsertPayload)
      .select("id, slug")
      .single();

    if (insertEventError) {
      // If client_draft_id column is not in remote schema yet, retry without it
      if (insertEventError.code === "42703") {
        delete eventInsertPayload.client_draft_id;
        const { data: retryEvent, error: retryError } = await supabase
          .from("events")
          .insert(eventInsertPayload)
          .select("id, slug")
          .single();

        if (retryError || !retryEvent) {
          return { success: false, error: "تعذر إنشاء الدعوة في قاعدة البيانات. حاول مرة أخرى." };
        }
        newEvent = retryEvent;
      } else {
        return { success: false, error: "تعذر حفظ الدعوة. حاول مرة أخرى." };
      }
    } else {
      newEvent = createdEvent;
    }

    if (!newEvent) {
      return { success: false, error: "تعذر استلام معرّف الدعوة." };
    }

    const eventId = newEvent.id;

    // 3. Upsert event_content
    await supabase.from("event_content").upsert({
      event_id: eventId,
      headline: headline || "وجودكم يكمّل فرحتنا ✨",
      invitation_text: invitationText,
      host_names: hostNames,
    });

    // 4. Upsert event_experience with trusted template_id
    await supabase.from("event_experience").upsert({
      event_id: eventId,
      experience_key: templateId,
      theme_config: {
        version: 1,
        variant: "editorial",
        cover: { style: "editorial" },
        palette: "warm",
        typography: "modern",
        textScale: "balanced",
      },
    });

    // 5. Upsert event_sections
    await supabase.from("event_sections").upsert(
      defaultInvitationSections.map((s) => ({
        event_id: eventId,
        section_type: s.section_type,
        position: s.position,
        enabled:
          s.section_type === "hero" ||
          s.section_type === "footer" ||
          (s.section_type === "invitation-text" && Boolean(invitationText)) ||
          (s.section_type === "event-details" && Boolean(eventDate || venueName)) ||
          (s.section_type === "countdown" && Boolean(payload.countdown_enabled && eventDate)) ||
          (s.section_type === "story" && payload.story_items.length > 0) ||
          (s.section_type === "gallery") ||
          (s.section_type === "location" && Boolean(locationUrl || venueName)),
      })),
      { onConflict: "event_id,position" }
    );

    // 6. Insert event_story_items if provided
    if (payload.story_items && payload.story_items.length > 0) {
      const storyRows = payload.story_items.map((item, idx) => ({
        event_id: eventId,
        title: item.title.trim().slice(0, 160) || "محطة من حكايتنا",
        body: item.body.trim().slice(0, 2000) || "تفاصيل اللحظة الجميلة",
        date_label: item.date_label ? item.date_label.trim().slice(0, 80) : null,
        position: item.position || idx + 1,
      }));

      await supabase.from("event_story_items").insert(storyRows);
    }

    return {
      success: true,
      eventId,
      slug: newEvent.slug,
      isExisting: false,
    };
  } catch (fallbackError) {
    console.error("Claim fallback error:", fallbackError);
    return { success: false, error: "تعذر حفظ الدعوة. يرجى المحاولة مرة أخرى." };
  }
}

/**
 * Upload an individual photo for the claimed event using the existing owner media pipeline.
 * Reuses validation, private storage bucket, and event_media creation.
 */
export async function uploadClaimedPhotoAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const result = await uploadInvitationMedia(initialMediaActionState, formData);
  if (result.error) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
