import type { ExperienceKey } from "@/config/experiences";
import type { InvitationSectionId } from "@/config/invitation-sections";
import type { EventSummary } from "@/features/events/types";

export type InvitationContent = {
  headline_ar: string | null;
  headline_en: string | null;
  invitation_text_ar: string | null;
  invitation_text_en: string | null;
  host_names_ar: string | null;
  host_names_en: string | null;
};

export type InvitationSection = {
  id: string;
  section_type: InvitationSectionId;
  position: number;
  enabled: boolean;
};

export type InvitationModel = {
  event: EventSummary;
  content: InvitationContent;
  experienceKey: ExperienceKey;
  sections: InvitationSection[];
};

export type UpdateInvitationState = {
  fieldErrors?: Partial<Record<keyof InvitationContent, string>>;
  formError?: string;
  success?: boolean;
};

export const initialUpdateInvitationState: UpdateInvitationState = {};
