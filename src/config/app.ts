import { locales, type TextDirection } from "@/types/locale";

export const supportedLocales = locales;

export const appConfig = {
  name: "Lamma",
  defaultLocale: "ar",
  supportedLocales,
  defaultDirection: "rtl" as TextDirection,
} as const;
