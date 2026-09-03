"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/types/locale";

function zonedMidnight(date: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const guess = Date.UTC(year, month - 1, day);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(new Date(guess));
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return guess - Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"));
}

export function Countdown({ eventDate, timeZone, locale }: { eventDate: string; timeZone?: string; locale: Locale }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => { const target = zonedMidnight(eventDate, timeZone || "UTC"); const update = () => setRemaining(target - Date.now()); update(); const id = window.setInterval(update, 1000); return () => window.clearInterval(id); }, [eventDate, timeZone]);
  if (remaining === null) return null;
  if (remaining <= 0) return <p className="text-center text-lg font-semibold">{locale === "ar" ? "اليوم ده وصل" : "The day is here"}</p>;
  const seconds = Math.floor(remaining / 1000); const units = [["days", Math.floor(seconds / 86400)], ["hours", Math.floor(seconds / 3600) % 24], ["minutes", Math.floor(seconds / 60) % 60], ["seconds", seconds % 60]] as const;
  const labels = locale === "ar" ? ["يوم", "ساعة", "دقيقة", "ثانية"] : ["Days", "Hours", "Minutes", "Seconds"];
  return <section className="px-6 py-16 text-center sm:px-12"><p className="text-sm font-semibold opacity-65">{locale === "ar" ? "فاضل على اليوم الكبير" : "Until the big day"}</p><div aria-label={locale === "ar" ? "العد التنازلي" : "Countdown"} className="mx-auto mt-6 grid max-w-xl grid-cols-4 gap-2 sm:gap-4">{units.map(([key, value], index) => <div className="rounded-xl border border-current/15 px-2 py-4" key={key}><strong className="block text-2xl sm:text-4xl">{String(value).padStart(2, "0")}</strong><span className="mt-1 block text-xs opacity-65">{labels[index]}</span></div>)}</div></section>;
}
