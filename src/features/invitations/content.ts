import type { Locale, TextDirection } from "@/types/locale";

const rtlCharacterPattern = /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]/g;
const ltrCharacterPattern = /[A-Za-z\u00c0-\u024f]/g;

export function getTextDirection(text: string | null | undefined): TextDirection {
  const rtlCharacters = text?.match(rtlCharacterPattern)?.length ?? 0;
  const ltrCharacters = text?.match(ltrCharacterPattern)?.length ?? 0;

  return rtlCharacters > ltrCharacters ? "rtl" : "ltr";
}

export function formatInvitationDate(eventDate: string, locale: Locale) {
  const [year, month, day] = eventDate.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(Date.UTC(year, month - 1, day));
}

export function getInvitationDateParts(eventDate: string, locale: Locale) {
  const [year, month, day] = eventDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return {
    day: String(day),
    weekday: new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(date),
    month: new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(date),
    monthLong: new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(date),
    year: String(year),
    full: new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date),
  };
}
