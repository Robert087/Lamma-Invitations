import { coverStyles, invitationVariants, palettePresets, textScales, typographyPresets, type InvitationThemeConfig } from "@/config/invitation-design";
import { invitationSections, invitationSectionIds, type InvitationSectionId } from "@/config/invitation-sections";

export const aiDescriptionMaxLength = 1200;
export const aiContentLimits = { hostNames: 160, headline: 160, invitationText: 2000 } as const;

export type AiInvitationProposal = {
  content: { hostNames: string; headline: string; invitationText: string };
  design: InvitationThemeConfig;
  sections: InvitationSectionId[];
};

const isOneOf = <T extends readonly string[]>(value: unknown, options: T): value is T[number] =>
  typeof value === "string" && options.includes(value);

export function parseAiInvitationProposal(value: unknown): AiInvitationProposal | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const proposal = value as Record<string, unknown>;
  const content = proposal.content as Record<string, unknown> | undefined;
  const design = proposal.design as Record<string, unknown> | undefined;
  const cover = design?.cover as Record<string, unknown> | undefined;
  if (!content || !design || !cover) return null;
  if (![content.hostNames, content.headline, content.invitationText].every((item) => typeof item === "string")) return null;
  const hostNames = content.hostNames as string;
  const headline = content.headline as string;
  const invitationText = content.invitationText as string;
  if (hostNames.length > aiContentLimits.hostNames || headline.length > aiContentLimits.headline || invitationText.length > aiContentLimits.invitationText) return null;
  if (!isOneOf(design.variant, invitationVariants) || !isOneOf(design.palette, palettePresets) || !isOneOf(design.typography, typographyPresets) || !isOneOf(design.textScale, textScales) || !isOneOf(cover.style, coverStyles)) return null;
  if (!Array.isArray(proposal.sections) || !proposal.sections.every((item) => isOneOf(item, invitationSectionIds) && invitationSections[item].implemented)) return null;

  const sections = [...new Set(proposal.sections as InvitationSectionId[])];
  for (const section of Object.values(invitationSections)) if (section.required && !sections.includes(section.id)) sections.push(section.id);

  return {
    content: { hostNames: hostNames.trim(), headline: headline.trim(), invitationText: invitationText.trim() },
    design: { version: 1, variant: design.variant, cover: { style: cover.style }, palette: design.palette, typography: design.typography, textScale: design.textScale },
    sections,
  };
}

export const aiInvitationResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    content: { type: "object", additionalProperties: false, properties: { hostNames: { type: "string", maxLength: 160 }, headline: { type: "string", maxLength: 160 }, invitationText: { type: "string", maxLength: 2000 } }, required: ["hostNames", "headline", "invitationText"] },
    design: { type: "object", additionalProperties: false, properties: { variant: { type: "string", enum: invitationVariants }, palette: { type: "string", enum: palettePresets }, typography: { type: "string", enum: typographyPresets }, textScale: { type: "string", enum: textScales }, cover: { type: "object", additionalProperties: false, properties: { style: { type: "string", enum: coverStyles } }, required: ["style"] } }, required: ["variant", "palette", "typography", "textScale", "cover"] },
    sections: { type: "array", items: { type: "string", enum: invitationSectionIds }, maxItems: invitationSectionIds.length },
  },
  required: ["content", "design", "sections"],
} as const;
