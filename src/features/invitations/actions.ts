"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser, getOwnedEvent } from "@/features/events/data";
import { createClient } from "@/lib/supabase/server";

import type { InvitationContent, UpdateInvitationState } from "./types";

const contentFields = ["host_names_ar", "host_names_en", "headline_ar", "headline_en", "invitation_text_ar", "invitation_text_en"] as const;
const shortTextMaxLength = 160;
const invitationTextMaxLength = 2000;

function getContentValue(formData: FormData, field: keyof InvitationContent) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateInvitationContent(_: UpdateInvitationState, formData: FormData): Promise<UpdateInvitationState> {
  const eventId = formData.get("event_id");
  if (typeof eventId !== "string") return { formError: "تعذر حفظ الدعوة. يرجى المحاولة مرة أخرى." };

  const content = Object.fromEntries(contentFields.map((field) => [field, getContentValue(formData, field)])) as Record<keyof InvitationContent, string>;
  const fieldErrors: NonNullable<UpdateInvitationState["fieldErrors"]> = {};

  for (const field of contentFields) {
    const maximumLength = field.startsWith("invitation_text") ? invitationTextMaxLength : shortTextMaxLength;
    if (content[field].length > maximumLength) fieldErrors[field] = "النص طويل جدًا.";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const user = await getCurrentUser();
  if (!user || !(await getOwnedEvent(user, eventId))) return { formError: "تعذر حفظ الدعوة. يرجى المحاولة مرة أخرى." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("event_content")
    .update(Object.fromEntries(contentFields.map((field) => [field, content[field] || null])))
    .eq("event_id", eventId);

  if (error) return { formError: "تعذر حفظ الدعوة. يرجى المحاولة مرة أخرى." };

  revalidatePath(`/dashboard/events/${eventId}/invitation`);
  revalidatePath(`/dashboard/events/${eventId}/preview`);

  return { success: true };
}
