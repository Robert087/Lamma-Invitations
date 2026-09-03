import { coverStyles, invitationVariants, palettePresets, textScales, typographyPresets } from "@/config/invitation-design";
import { invitationSections } from "@/config/invitation-sections";

import { parseAiInvitationProposal, type AiInvitationProposal } from "./schemas";

type Context = { occasionType: string; title: string; eventDate: string | null; venueName: string | null; primaryLocale: string; description: string };

function hash(value: string) {
  return [...value].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
}

/** Development-only deterministic fixtures for exercising the shared AI Creator flow. */
export function generateMockInvitation(context: Context): AiInvitationProposal {
  const description = context.description.toLowerCase();
  const seed = hash(`${context.title}:${context.description}`);
  const isArabic = /[\u0600-\u06ff]/.test(context.description);
  const isEgyptian = isArabic && /(عايز|عايزة|فرحي|بتاع|إحنا|احنا|أوي|جامد)/.test(context.description);
  const isFun = /(fun|party|energetic|مرح|مبهج|حفلة|فرحان)/.test(description);
  const isRomantic = /(romantic|love|elegant|romantic|رومانسي|شيك|حب)/.test(description);
  const design = {
    version: 1 as const,
    variant: invitationVariants[(isFun ? seed + 1 : isRomantic ? seed + 2 : seed) % invitationVariants.length],
    cover: { style: coverStyles[seed % coverStyles.length] },
    palette: palettePresets[(isFun ? seed + 2 : seed) % palettePresets.length],
    typography: typographyPresets[(isRomantic ? seed + 1 : seed) % typographyPresets.length],
    textScale: textScales[(isFun ? seed + 1 : seed) % textScales.length],
  };
  const names = context.title || (isArabic ? "أصحاب الحكاية" : "The hosts");
  const copy = isArabic
    ? isEgyptian
      ? { headline: "اللمة أحلى بوجودكم", invitationText: `يلا نحتفل بـ ${context.title} على طريقتنا. وجودكم هو اللي هيكمّل اليوم.` }
      : { headline: isRomantic ? "لحظة تليق بفرحتنا" : "موعدنا مع لحظة جميلة", invitationText: `نحب أن تشاركونا ${context.title}، ونصنع معًا ذكرى دافئة لا تُنسى.` }
    : { headline: isFun ? "This calls for a proper celebration." : "A beautiful moment, shared.", invitationText: `Join us for ${context.title} and make this occasion even more memorable.` };
  const proposal = parseAiInvitationProposal({ content: { hostNames: names, ...copy }, design, sections: Object.values(invitationSections).filter((section) => section.implemented).map((section) => section.id) });
  if (!proposal) throw new Error("AI_INVALID_OUTPUT");
  return proposal;
}
