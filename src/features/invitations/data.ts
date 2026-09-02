import type { User } from "@supabase/supabase-js";

import { experienceKeys, type ExperienceKey } from "@/config/experiences";
import { defaultInvitationSections } from "@/config/invitation-sections";
import { getOwnedEvent } from "@/features/events/data";
import { createClient } from "@/lib/supabase/server";

import type { InvitationContent, InvitationModel, InvitationSection } from "./types";

const defaultContent: InvitationContent = {
  headline_ar: "يسعدنا دعوتكم",
  headline_en: "You're Invited",
  invitation_text_ar: null,
  invitation_text_en: null,
  host_names_ar: null,
  host_names_en: null,
};

async function initializeInvitation(eventId: string) {
  const supabase = await createClient();

  const [{ error: contentError }, { error: experienceError }, { error: sectionsError }] = await Promise.all([
    supabase.from("event_content").upsert({ event_id: eventId, ...defaultContent }, { onConflict: "event_id", ignoreDuplicates: true }),
    supabase.from("event_experience").upsert({ event_id: eventId, experience_key: "minimal", theme_config: {} }, { onConflict: "event_id", ignoreDuplicates: true }),
    supabase.from("event_sections").upsert(defaultInvitationSections.map((section) => ({ event_id: eventId, ...section })), { onConflict: "event_id,position", ignoreDuplicates: true }),
  ]);

  if (contentError || experienceError || sectionsError) {
    console.error("Invitation initialization failed", {
      content: contentError
        ? {
            code: contentError.code,
            message: contentError.message,
            details: contentError.details,
            hint: contentError.hint,
          }
        : null,
      experience: experienceError
        ? {
            code: experienceError.code,
            message: experienceError.message,
            details: experienceError.details,
            hint: experienceError.hint,
          }
        : null,
      sections: sectionsError
        ? {
            code: sectionsError.code,
            message: sectionsError.message,
            details: sectionsError.details,
            hint: sectionsError.hint,
          }
        : null,
    });

    throw new Error("Unable to initialize invitation.");
  }
}

export async function loadInvitationForOwnedEvent(user: User, eventId: string): Promise<InvitationModel | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) return null;

  const event = await getOwnedEvent(user, eventId);
  if (!event) return null;

  await initializeInvitation(event.id);

  const supabase = await createClient();
  const [{ data: content, error: contentError }, { data: experience, error: experienceError }, { data: sections, error: sectionsError }] = await Promise.all([
    supabase.from("event_content").select("headline_ar, headline_en, invitation_text_ar, invitation_text_en, host_names_ar, host_names_en").eq("event_id", event.id).single(),
    supabase.from("event_experience").select("experience_key").eq("event_id", event.id).single(),
    supabase.from("event_sections").select("id, section_type, position, enabled").eq("event_id", event.id).order("position"),
  ]);

  if (contentError || experienceError || sectionsError || !content || !experience) {
    throw new Error("Unable to load invitation.");
  }

  const experienceKey = experienceKeys.includes(experience.experience_key as ExperienceKey)
    ? (experience.experience_key as ExperienceKey)
    : "minimal";

  return {
    event,
    content: content as InvitationContent,
    experienceKey,
    sections: (sections ?? []) as InvitationSection[],
  };
}
