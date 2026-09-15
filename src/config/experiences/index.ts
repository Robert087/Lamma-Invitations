import type { Locale } from "@/types/locale";

export const experienceKeys = ["minimal", "cinematic-wedding-story"] as const;

export type ExperienceKey = (typeof experienceKeys)[number];

type ExperienceDefinition = {
  id: ExperienceKey;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const experiences: Record<ExperienceKey, ExperienceDefinition> = {
  minimal: {
    id: "minimal",
    label: { ar: "بسيط", en: "Minimal" },
    description: { ar: "تجربة دعوة هادئة وواضحة.", en: "A calm, clear invitation experience." },
  },
  "cinematic-wedding-story": {
    id: "cinematic-wedding-story",
    label: { ar: "حكاية سينمائية", en: "Cinematic Story" },
    description: {
      ar: "رحلة دعوة متكاملة، تبدأ بلحظة دخول وتنتهي بذكرى دافئة.",
      en: "A complete invitation journey with a deliberate opening and closing.",
    },
  },
};

export function isExperienceKey(value: unknown): value is ExperienceKey {
  return typeof value === "string" && experienceKeys.includes(value as ExperienceKey);
}
