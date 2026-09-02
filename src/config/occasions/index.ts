export const occasions = [
  "wedding",
  "engagement",
  "katb-ketab",
  "birthday",
  "baby-shower",
  "graduation",
  "party",
  "anniversary",
  "corporate-event",
  "iftar-sohour",
  "custom",
] as const;

export type OccasionId = (typeof occasions)[number];

export const occasionLabels: Record<OccasionId, { ar: string; en: string }> = {
  wedding: { ar: "زفاف", en: "Wedding" },
  engagement: { ar: "خطوبة", en: "Engagement" },
  "katb-ketab": { ar: "كتب كتاب", en: "Katb Ketab" },
  birthday: { ar: "عيد ميلاد", en: "Birthday" },
  "baby-shower": { ar: "استقبال مولود", en: "Baby Shower" },
  graduation: { ar: "تخرج", en: "Graduation" },
  party: { ar: "حفلة", en: "Party" },
  anniversary: { ar: "ذكرى سنوية", en: "Anniversary" },
  "corporate-event": { ar: "فعالية شركات", en: "Corporate Event" },
  "iftar-sohour": { ar: "إفطار / سحور", en: "Iftar / Sohour" },
  custom: { ar: "مناسبة خاصة", en: "Custom Event" },
};
