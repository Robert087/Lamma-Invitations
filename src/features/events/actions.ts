"use server";

import { redirect } from "next/navigation";

import { occasions, type OccasionId } from "@/config/occasions";
import { createClient } from "@/lib/supabase/server";
import { locales, type Locale } from "@/types/locale";

import { createEventSlug } from "./slug";
import type { CreateEventState } from "./types";

const titleMaxLength = 120;
const venueNameMaxLength = 160;
const locationUrlMaxLength = 2048;
const maximumSlugAttempts = 4;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function getFieldValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidTimezone(timezone: string) {
  try {
    Intl.DateTimeFormat("en", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

function isValidEventDate(eventDate: string) {
  if (!datePattern.test(eventDate)) return false;

  const [year, month, day] = eventDate.split("-").map(Number);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

function validateCreateEvent(formData: FormData) {
  const occasionType = getFieldValue(formData, "occasion_type");
  const title = getFieldValue(formData, "title");
  const eventDate = getFieldValue(formData, "event_date");
  const timezone = getFieldValue(formData, "timezone");
  const venueName = getFieldValue(formData, "venue_name");
  const locationUrl = getFieldValue(formData, "location_url");
  const primaryLocale = getFieldValue(formData, "primary_locale");
  const fieldErrors: NonNullable<CreateEventState["fieldErrors"]> = {};

  if (!occasions.includes(occasionType as OccasionId)) fieldErrors.occasion_type = "اختر نوع المناسبة.";
  if (title.length < 2 || title.length > titleMaxLength) fieldErrors.title = "أدخل عنوانًا بين حرفين و120 حرفًا.";
  if (eventDate && !isValidEventDate(eventDate)) fieldErrors.event_date = "أدخل تاريخًا صالحًا.";
  if (!timezone || !isValidTimezone(timezone)) fieldErrors.timezone = "المنطقة الزمنية غير صالحة.";
  if (venueName.length > venueNameMaxLength) fieldErrors.venue_name = "اسم المكان طويل جدًا.";

  if (locationUrl.length > locationUrlMaxLength) {
    fieldErrors.location_url = "رابط الموقع طويل جدًا.";
  } else if (locationUrl) {
    try {
      const url = new URL(locationUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") fieldErrors.location_url = "أدخل رابطًا صالحًا.";
    } catch {
      fieldErrors.location_url = "أدخل رابطًا صالحًا.";
    }
  }

  if (!locales.includes(primaryLocale as Locale)) fieldErrors.primary_locale = "اللغة غير صالحة.";

  return {
    fieldErrors,
    values: { occasionType, title, eventDate, timezone, venueName, locationUrl, primaryLocale },
  };
}

export async function createEvent(_: CreateEventState, formData: FormData): Promise<CreateEventState> {
  const { fieldErrors, values } = validateCreateEvent(formData);

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { formError: "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى." };

  for (let attempt = 0; attempt < maximumSlugAttempts; attempt += 1) {
    const { data, error } = await supabase
      .from("events")
      .insert({
        owner_id: user.id,
        occasion_type: values.occasionType,
        title: values.title,
        slug: createEventSlug(values.title),
        event_date: values.eventDate || null,
        timezone: values.timezone,
        venue_name: values.venueName || null,
        location_url: values.locationUrl || null,
        primary_locale: values.primaryLocale,
      })
      .select("id")
      .single();

    if (!error && data) redirect(`/dashboard/events/${data.id}`);
    if (error?.code !== "23505") return { formError: "تعذر إنشاء المناسبة. يرجى المحاولة مرة أخرى." };
  }

  return { formError: "تعذر إنشاء رابط فريد للمناسبة. يرجى المحاولة مرة أخرى." };
}
