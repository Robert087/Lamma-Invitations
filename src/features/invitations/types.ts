import type { ExperienceKey } from "@/config/experiences";
import type { InvitationSectionId } from "@/config/invitation-sections";
import type { OccasionId } from "@/config/occasions";
import type { Locale } from "@/types/locale";
import type { InvitationThemeConfig } from "@/config/invitation-design";
import type { AiInvitationProposal } from "@/lib/ai/schemas";

export type InvitationContent = {
  headline: string | null;
  invitation_text: string | null;
  host_names: string | null;
};

export type InvitationSection = {
  id: string;
  section_type: InvitationSectionId;
  position: number;
  enabled: boolean;
};

export type InvitationEvent = {
  id: string;
  occasion_type: OccasionId;
  title: string;
  slug: string;
  event_date: string | null;
  venue_name: string | null;
  location_url: string | null;
  primary_locale: Locale;
  timezone?: string;
};

export type InvitationModel = {
  event: InvitationEvent;
  content: InvitationContent;
  experienceKey: ExperienceKey;
  themeConfig: InvitationThemeConfig;
  sections: InvitationSection[];
};

export type UpdateInvitationState = {
  fieldErrors?: Partial<Record<keyof InvitationContent, string>>;
  formError?: string;
  success?: boolean;
};

export const initialUpdateInvitationState: UpdateInvitationState = {};

export type AiCreatorState = {
  error?: "invalid" | "limit" | "failed";
  proposal?: AiInvitationProposal;
};

export const initialAiCreatorState: AiCreatorState = {};
