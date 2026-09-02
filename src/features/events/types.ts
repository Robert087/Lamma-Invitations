import type { Locale } from "@/types/locale";

import type { OccasionId } from "@/config/occasions";

export type EventStatus = "draft" | "published" | "archived";

export type EventVisibility = "unlisted" | "public";

export type EventSummary = {
  id: string;
  occasion_type: OccasionId;
  title: string;
  slug: string;
  status: EventStatus;
  event_date: string | null;
  timezone: string;
  venue_name: string | null;
  location_url: string | null;
  primary_locale: Locale;
  visibility: EventVisibility;
};

export type CreateEventState = {
  fieldErrors?: Partial<Record<"occasion_type" | "title" | "event_date" | "timezone" | "venue_name" | "location_url" | "primary_locale", string>>;
  formError?: string;
};

export const initialCreateEventState: CreateEventState = {};
