import type { Locale } from "@/types/locale";

export const invitationSectionIds = [
  "hero",
  "invitation-text",
  "event-details",
  "location",
  "countdown",
  "story",
  "gallery",
  "dress-code",
  "poll",
  "guestbook",
  "voice-message",
  "rsvp",
  "footer",
] as const;

export type InvitationSectionId = (typeof invitationSectionIds)[number];

type InvitationSectionDefinition = {
  id: InvitationSectionId;
  label: Record<Locale, string>;
  implemented: boolean;
  initialPosition?: number;
};

export const invitationSections: Record<InvitationSectionId, InvitationSectionDefinition> = {
  hero: { id: "hero", label: { ar: "الغلاف", en: "Hero" }, implemented: true, initialPosition: 1 },
  "invitation-text": { id: "invitation-text", label: { ar: "نص الدعوة", en: "Invitation text" }, implemented: true, initialPosition: 2 },
  "event-details": { id: "event-details", label: { ar: "تفاصيل المناسبة", en: "Event details" }, implemented: true, initialPosition: 3 },
  location: { id: "location", label: { ar: "الموقع", en: "Location" }, implemented: true, initialPosition: 4 },
  countdown: { id: "countdown", label: { ar: "العد التنازلي", en: "Countdown" }, implemented: false },
  story: { id: "story", label: { ar: "القصة", en: "Story" }, implemented: false },
  gallery: { id: "gallery", label: { ar: "المعرض", en: "Gallery" }, implemented: false },
  "dress-code": { id: "dress-code", label: { ar: "الزي", en: "Dress code" }, implemented: false },
  poll: { id: "poll", label: { ar: "استطلاع", en: "Poll" }, implemented: false },
  guestbook: { id: "guestbook", label: { ar: "سجل الضيوف", en: "Guestbook" }, implemented: false },
  "voice-message": { id: "voice-message", label: { ar: "رسالة صوتية", en: "Voice message" }, implemented: false },
  rsvp: { id: "rsvp", label: { ar: "تأكيد الحضور", en: "RSVP" }, implemented: false },
  footer: { id: "footer", label: { ar: "التذييل", en: "Footer" }, implemented: true, initialPosition: 5 },
};

export const defaultInvitationSections = Object.values(invitationSections)
  .filter((section) => section.initialPosition)
  .map((section) => ({ section_type: section.id, position: section.initialPosition as number }));
