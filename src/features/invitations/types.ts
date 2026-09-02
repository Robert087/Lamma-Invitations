import type { ExperienceKey } from "@/config/experiences";
import type { InvitationSectionId } from "@/config/invitation-sections";
import type { EventSummary } from "@/features/events/types";

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
