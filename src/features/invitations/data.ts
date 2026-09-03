import type { User } from "@supabase/supabase-js";

import { experienceKeys, type ExperienceKey } from "@/config/experiences";
import { defaultInvitationSections, invitationSectionIds, type InvitationSectionId } from "@/config/invitation-sections";
import { occasions, type OccasionId } from "@/config/occasions";
import { defaultInvitationTheme, parseInvitationThemeConfig } from "@/config/invitation-design";
import { getOwnedEvent } from "@/features/events/data";
import { createClient } from "@/lib/supabase/server";

import type { InvitationContent, InvitationModel, InvitationSection } from "./types";
import type { Locale } from "@/types/locale";

const defaultContent: InvitationContent = {
  headline: "وجودكم يكمّل فرحتنا ✨",
  invitation_text: null,
  host_names: null,
};

async function initializeInvitation(eventId: string) {
  const supabase = await createClient();

  const [{ error: contentError }, { error: experienceError }, { error: sectionsError }] = await Promise.all([
    supabase.from("event_content").upsert({ event_id: eventId, ...defaultContent }, { onConflict: "event_id", ignoreDuplicates: true }),
    supabase.from("event_experience").upsert({ event_id: eventId, experience_key: "minimal", theme_config: defaultInvitationTheme }, { onConflict: "event_id", ignoreDuplicates: true }),
    supabase.from("event_sections").upsert(defaultInvitationSections.map((section) => ({ event_id: eventId, ...section })), { onConflict: "event_id,position", ignoreDuplicates: true }),
  ]);

  if (contentError || experienceError || sectionsError) {
    if (process.env.NODE_ENV !== "production") {
      const failures = [
        contentError ? `content: ${contentError.code} - ${contentError.message}` : null,
        experienceError ? `experience: ${experienceError.code} - ${experienceError.message}` : null,
        sectionsError ? `sections: ${sectionsError.code} - ${sectionsError.message}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      throw new Error(`Unable to initialize invitation. ${failures}`);
    }

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
    supabase.from("event_content").select("headline, invitation_text, host_names").eq("event_id", event.id).single(),
    supabase.from("event_experience").select("experience_key, theme_config").eq("event_id", event.id).single(),
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
    themeConfig: parseInvitationThemeConfig(experience.theme_config),
    sections: (sections ?? []) as InvitationSection[],
  };
}

type PublicInvitationRow = {
  occasion_type: string;
  title: string;
  slug: string;
  event_date: string | null;
  venue_name: string | null;
  location_url: string | null;
  primary_locale: string;
  headline: string | null;
  invitation_text: string | null;
  host_names: string | null;
  experience_key: string;
  theme_config: unknown;
  sections: Array<{ section_type: string; position: number; enabled: boolean }>;
};

const publicSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function loadPublishedInvitation(slug: string): Promise<InvitationModel | null> {
  if (slug.length > 128 || !publicSlugPattern.test(slug)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_published_invitation", { p_slug: slug }).maybeSingle();
  if (error || !data) return null;

  const row = data as PublicInvitationRow;
  if (!experienceKeys.includes(row.experience_key as ExperienceKey)) return null;
  if (row.primary_locale !== "ar" && row.primary_locale !== "en") return null;
  if (!occasions.includes(row.occasion_type as OccasionId)) return null;

  const sections = Array.isArray(row.sections)
    ? row.sections
        .filter((section) => invitationSectionIds.includes(section.section_type as InvitationSectionId) && Number.isInteger(section.position) && section.position > 0)
        .map((section) => ({ id: `${section.section_type}-${section.position}`, section_type: section.section_type as InvitationSectionId, position: section.position, enabled: section.enabled === true }))
    : [];

  return {
    event: {
      id: row.slug,
      occasion_type: row.occasion_type as OccasionId,
      title: row.title,
      slug: row.slug,
      event_date: row.event_date,
      venue_name: row.venue_name,
      location_url: row.location_url,
      primary_locale: row.primary_locale as Locale,
    },
    content: { headline: row.headline, invitation_text: row.invitation_text, host_names: row.host_names },
    experienceKey: row.experience_key as ExperienceKey,
    themeConfig: parseInvitationThemeConfig(row.theme_config),
    sections,
  };
}
