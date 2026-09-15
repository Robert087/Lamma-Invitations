import type { Locale } from "@/types/locale";

import type { InvitationModel } from "../../types";

export type CinematicSceneProps = {
  invitation: InvitationModel;
  locale: Locale;
};

export function cinematicCopy(locale: Locale) {
  return locale === "ar"
    ? {
        invitation: "دعوة للاحتفال",
        moment: "موعدنا",
        countdown: "نقترب من لحظتنا",
        story: "فصول الحكاية",
        storyHeading: "كيف وصلنا إلى هنا",
        location: "وجهتنا",
        map: "افتح المكان على الخريطة",
        closing: "ننتظركم بكل حب",
        enter: "ابدأ الحكاية",
      }
    : {
        invitation: "An invitation to celebrate",
        moment: "Save the moment",
        countdown: "The moment is getting closer",
        story: "Our chapters",
        storyHeading: "The moments that brought us here",
        location: "Our destination",
        map: "Open in Maps",
        closing: "We look forward to celebrating with you",
        enter: "Enter the invitation",
      };
}

export function safeLocationUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}
