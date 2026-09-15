import type { Locale } from "@/types/locale";

export interface TemplateCardDefinition {
  id: string; // matches experienceKey
  name: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  description: Record<Locale, string>;
  badge?: Record<Locale, string>;
  accentColor: string;
  paletteDefault: string;
  previewImage?: string;
  recommendedFor: readonly string[];
}

export const launchTemplates: readonly TemplateCardDefinition[] = [
  {
    id: "cinematic-wedding-story",
    name: {
      ar: "القصة السينمائية",
      en: "Cinematic Story",
    },
    subtitle: {
      ar: "تصميم فندقي هادئ مع فتحة غلاف أنيقة ومحطات مرتبة",
      en: "A grand, paced narrative with cover reveal and milestone scenes",
    },
    description: {
      ar: "يبدأ بغلاف يحمل أسماءكم وتاريخكم، ثم ينفتح على نص الدعوة وموقع الحفل ومحطات قصتكم وصوركم في لوحة سينمائية ساحرة.",
      en: "Opens with an elegant cover reveal, cascading into formal invitation words, venue details, story chapters, and a photo ribbon.",
    },
    badge: {
      ar: "الأكثر تميزاً للأفراح",
      en: "Featured for Weddings",
    },
    accentColor: "#b99559",
    paletteDefault: "warm",
    recommendedFor: ["wedding", "engagement", "katb-ketab"],
  },
] as const;

export function getTemplateDefinition(id: string): TemplateCardDefinition {
  const found = launchTemplates.find((t) => t.id === id);
  return found || launchTemplates[0];
}
