import type { Locale } from "@/types/locale";

export const experienceKeys = ["minimal"] as const;

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
};
