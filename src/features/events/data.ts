import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

import type { EventSummary } from "./types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function listEventsForUser(user: User) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, occasion_type, title, slug, status, event_date, timezone, venue_name, location_url, primary_locale, visibility")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load events.");
  }

  return (data ?? []) as EventSummary[];
}

export async function getOwnedEvent(user: User, eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, occasion_type, title, slug, status, event_date, timezone, venue_name, location_url, primary_locale, visibility")
    .eq("id", eventId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load event.");
  }

  return data as EventSummary | null;
}
