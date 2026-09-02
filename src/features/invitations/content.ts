import type { Locale, TextDirection } from "@/types/locale";

export function getLocalizedContent(locale: Locale, arabic: string | null, english: string | null) {
  const preferred = locale === "ar" ? arabic : english;
  const fallback = locale === "ar" ? english : arabic;

  return preferred?.trim() || fallback?.trim() || null;
}

export function getLocaleDirection(locale: Locale): TextDirection {
  return locale === "ar" ? "rtl" : "ltr";
}

export function formatInvitationDate(eventDate: string, locale: Locale) {
  const [year, month, day] = eventDate.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(Date.UTC(year, month - 1, day));
}
