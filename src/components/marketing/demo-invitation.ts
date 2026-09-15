import type { InvitationModel } from "@/features/invitations/types";

export const demoWeddingInvitation: InvitationModel = {
  event: {
    id: "demo-ahmed-salma",
    occasion_type: "wedding",
    title: "حفل زفاف أحمد وسلمى",
    slug: "demo-ahmed-salma",
    event_date: "2026-10-24",
    venue_name: "فندق الفورسيزونز - نايل بلازا، القاهرة",
    location_url: "https://maps.google.com/?q=Four+Seasons+Hotel+Cairo+at+Nile+Plaza",
    primary_locale: "ar",
    timezone: "Africa/Cairo",
  },
  content: {
    host_names: "أحمد وسلمى",
    headline: "يسعدنا حضوركم ومشاركتنا أجمل ليالي العمر",
    invitation_text:
      "بكل حب وامتنان، ندعوكم لمشاركتنا فرحتنا وشهود بداية رحلتنا معًا. وجودكم بيننا يمنح اليوم معناه الحقيقي.",
  },
  experienceKey: "cinematic-wedding-story",
  themeConfig: {
    version: 1,
    variant: "editorial",
    cover: { style: "editorial" },
    palette: "warm",
    typography: "modern",
    textScale: "balanced",
  },
  sections: [
    { id: "sec-hero", section_type: "hero", position: 1, enabled: true },
    { id: "sec-invitation", section_type: "invitation-text", position: 2, enabled: true },
    { id: "sec-details", section_type: "event-details", position: 3, enabled: true },
    { id: "sec-countdown", section_type: "countdown", position: 4, enabled: true },
    { id: "sec-story", section_type: "story", position: 5, enabled: true },
    { id: "sec-gallery", section_type: "gallery", position: 6, enabled: true },
    { id: "sec-location", section_type: "location", position: 7, enabled: true },
    { id: "sec-footer", section_type: "footer", position: 8, enabled: true },
  ],
  storyItems: [
    {
      id: "story-1",
      title: "أول لقاء",
      body: "في صيف ٢٠٢٢، كانت صدفة هادية في المعادي غيرت كل حاجة بعد كده.",
      date_label: "صيف ٢٠٢٢",
      position: 1,
    },
    {
      id: "story-2",
      title: "يوم الخطوبة",
      body: "وعدنا بعض قدام كل حبايبنا إن رحلتنا سوا هتكون مليانة مودة وفرح.",
      date_label: "ربيع ٢٠٢٤",
      position: 2,
    },
    {
      id: "story-3",
      title: "اليوم الكبير",
      body: "بداية فصلنا الجديد، وسط أغلى الناس وأطيب الأمنيات.",
      date_label: "أكتوبر ٢٠٢٦",
      position: 3,
    },
  ],
  media: [
    { url: "/marketing/preview-1.png", altText: "أحمد وسلمى", position: 1 },
    { url: "/marketing/preview-2.png", altText: "تفاصيل اليوم", position: 2 },
    { url: "/marketing/preview-3.png", altText: "لحظاتنا الحلوة", position: 3 },
  ],
};

export const demoAlexandriaInvitation: InvitationModel = {
  event: {
    id: "demo-karim-nour",
    occasion_type: "wedding",
    title: "فرح كريم ونور",
    slug: "demo-karim-nour",
    event_date: "2026-11-14",
    venue_name: "سان ستيفانو - الإسكندرية",
    location_url: "https://maps.google.com/?q=Four+Seasons+San+Stefano+Alexandria",
    primary_locale: "ar",
    timezone: "Africa/Cairo",
  },
  content: {
    host_names: "كريم ونور",
    headline: "على بحر إسكندرية، بنحتفل ببداية جديدة",
    invitation_text:
      "تتشرف عائلاتنا بدعوتكم لقضاء أمسية لا تُنسى على نسيم البحر، لنحتفل سويًا بارتباط قلبينا في أجمل لحظات الحياة.",
  },
  experienceKey: "cinematic-wedding-story",
  themeConfig: {
    version: 1,
    variant: "editorial",
    cover: { style: "editorial" },
    palette: "warm",
    typography: "modern",
    textScale: "balanced",
  },
  sections: [
    { id: "sec-hero", section_type: "hero", position: 1, enabled: true },
    { id: "sec-invitation", section_type: "invitation-text", position: 2, enabled: true },
    { id: "sec-details", section_type: "event-details", position: 3, enabled: true },
    { id: "sec-countdown", section_type: "countdown", position: 4, enabled: true },
    { id: "sec-story", section_type: "story", position: 5, enabled: true },
    { id: "sec-gallery", section_type: "gallery", position: 6, enabled: true },
    { id: "sec-location", section_type: "location", position: 7, enabled: true },
    { id: "sec-footer", section_type: "footer", position: 8, enabled: true },
  ],
  storyItems: [
    {
      id: "story-1",
      title: "أول فنجان قهوة",
      body: "على كورنيش إسكندرية بدأت حكايتنا، بكلام بسيط وأحلام كبيرة.",
      date_label: "شتاء ٢٠٢٣",
      position: 1,
    },
    {
      id: "story-2",
      title: "كتب الكتاب",
      body: "أوثق عهد وأصدق ميثاق، بحضور العائلة والأصدقاء المقربين.",
      date_label: "صيف ٢٠٢٥",
      position: 2,
    },
  ],
  media: [
    { url: "/marketing/preview-4.png", altText: "كريم ونور", position: 1 },
    { url: "/marketing/vibes.png", altText: "أجواء الحفل", position: 2 },
  ],
};
