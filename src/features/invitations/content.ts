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
