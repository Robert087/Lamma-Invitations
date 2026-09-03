"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser, getOwnedEvent } from "@/features/events/data";
import { createClient } from "@/lib/supabase/server";
import { parseInvitationThemeConfig } from "@/config/invitation-design";
import { invitationSections, type InvitationSectionId } from "@/config/invitation-sections";
import { generateInvitation } from "@/lib/ai/invitation-generator";
import { aiDescriptionMaxLength, parseAiInvitationProposal, type AiInvitationProposal } from "@/lib/ai/schemas";

import type { AiCreatorState, InvitationContent, UpdateInvitationState } from "./types";

const contentFields = ["host_names", "headline", "invitation_text"] as const;
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
    const maximumLength = field === "invitation_text" ? invitationTextMaxLength : shortTextMaxLength;
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

async function changePublicationStatus(formData: FormData, nextStatus: "published" | "draft") {
  const eventId = formData.get("event_id");
  if (typeof eventId !== "string") return;

  const user = await getCurrentUser();
  const event = user ? await getOwnedEvent(user, eventId) : null;
  if (!event || event.status === "archived") return;

  const supabase = await createClient();
  const { error } = await supabase.from("events").update({ status: nextStatus }).eq("id", event.id);
  if (error) return;

  revalidatePath(`/dashboard/events/${event.id}`);
  revalidatePath(`/dashboard/events/${event.id}/invitation`);
  revalidatePath(`/dashboard/events/${event.id}/preview`);
  revalidatePath(`/i/${event.slug}`);
}

export async function publishInvitation(formData: FormData) {
  await changePublicationStatus(formData, "published");
}

export async function unpublishInvitation(formData: FormData) {
  await changePublicationStatus(formData, "draft");
}

async function getAuthorizedEvent(eventId: FormDataEntryValue | null) {
  if (typeof eventId !== "string") return null;
  const user = await getCurrentUser();
  return user ? getOwnedEvent(user, eventId) : null;
}

export async function updateInvitationDesign(formData: FormData) {
  const event = await getAuthorizedEvent(formData.get("event_id"));
  if (!event) return;
  const themeConfig = parseInvitationThemeConfig({
    variant: formData.get("variant"),
    cover: { style: formData.get("cover") },
    palette: formData.get("palette"),
    typography: formData.get("typography"),
    textScale: formData.get("text_scale"),
  });
  const supabase = await createClient();
  await supabase.from("event_experience").update({ theme_config: themeConfig }).eq("event_id", event.id);
  revalidatePath(`/dashboard/events/${event.id}/invitation`);
  revalidatePath(`/dashboard/events/${event.id}/preview`);
  revalidatePath(`/i/${event.slug}`);
}

export async function updateEventDetails(formData: FormData) {
  const event = await getAuthorizedEvent(formData.get("event_id"));
  if (!event) return;
  const eventDate = typeof formData.get("event_date") === "string" ? String(formData.get("event_date")).trim() : "";
  const venueName = typeof formData.get("venue_name") === "string" ? String(formData.get("venue_name")).trim() : "";
  const locationUrl = typeof formData.get("location_url") === "string" ? String(formData.get("location_url")).trim() : "";
  if ((eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) || venueName.length > 160 || locationUrl.length > 2048) return;
  if (locationUrl) { try { const url = new URL(locationUrl); if (url.protocol !== "https:" && url.protocol !== "http:") return; } catch { return; } }
  const supabase = await createClient();
  await supabase.from("events").update({ event_date: eventDate || null, venue_name: venueName || null, location_url: locationUrl || null }).eq("id", event.id);
  revalidatePath(`/dashboard/events/${event.id}/invitation`); revalidatePath(`/dashboard/events/${event.id}/preview`); revalidatePath(`/i/${event.slug}`);
}

export async function updateInvitationSection(formData: FormData) {
  const event = await getAuthorizedEvent(formData.get("event_id"));
  const sectionId = formData.get("section_id");
  const intent = formData.get("intent");
  if (!event || typeof sectionId !== "string" || !(sectionId in invitationSections)) return;
  const definition = invitationSections[sectionId as InvitationSectionId];
  if (!definition.implemented) return;
  const supabase = await createClient();
  const { data: sections } = await supabase.from("event_sections").select("id, section_type, position, enabled").eq("event_id", event.id).order("position");
  const current = (sections ?? []).find((section) => section.section_type === sectionId);
  if (!current) return;
  if (intent === "toggle" && !definition.required) await supabase.from("event_sections").update({ enabled: !current.enabled }).eq("id", current.id);
  if (intent === "up" || intent === "down") {
    const implemented = (sections ?? []).filter((section) => invitationSections[section.section_type as InvitationSectionId]?.implemented);
    const index = implemented.findIndex((section) => section.id === current.id); const target = implemented[index + (intent === "up" ? -1 : 1)];
    if (target) { const temporaryPosition = Math.max(...implemented.map((section) => section.position)) + 1; await supabase.from("event_sections").update({ position: temporaryPosition }).eq("id", target.id); await supabase.from("event_sections").update({ position: target.position }).eq("id", current.id); await supabase.from("event_sections").update({ position: current.position }).eq("id", target.id); }
  }
  revalidatePath(`/dashboard/events/${event.id}/invitation`); revalidatePath(`/dashboard/events/${event.id}/preview`); revalidatePath(`/i/${event.slug}`);
}

export async function createInvitationWithLamma(_: AiCreatorState, formData: FormData): Promise<AiCreatorState> {
  const event = await getAuthorizedEvent(formData.get("event_id"));
  const description = typeof formData.get("description") === "string" ? String(formData.get("description")).trim() : "";
  if (!event || !description || description.length > aiDescriptionMaxLength || event.status === "archived") return { error: "invalid" };

  const supabase = await createClient();
  const provider = process.env.AI_PROVIDER || "openai";
  if (provider !== "mock" && provider !== "openai") return { error: "failed" };
  const configuredLimit = Number.parseInt(process.env.AI_DAILY_GENERATION_LIMIT || "10", 10);
  const dailyLimit = Number.isSafeInteger(configuredLimit) && configuredLimit > 0 ? configuredLimit : 10;
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  if (provider === "openai") {
    const { count } = await supabase.from("ai_generations").select("id", { count: "exact", head: true }).neq("model", "mock").gte("created_at", dayStart.toISOString());
    if ((count ?? 0) >= dailyLimit) return { error: "limit" };
  }
  const model = provider === "mock" ? "mock" : process.env.OPENAI_INVITATION_MODEL || "gpt-5-mini";
  const { data: generationId, error: reservationError } = await supabase.rpc("reserve_ai_invitation_generation", { p_event_id: event.id, p_model: model, p_input_characters: description.length });
  if (reservationError || !generationId) return { error: reservationError?.message.includes("limit") ? "limit" : "failed" };

  const startedAt = Date.now();
  try {
    const generation = await generateInvitation({ occasionType: event.occasion_type, title: event.title, eventDate: event.event_date, venueName: event.venue_name, primaryLocale: event.primary_locale, description });
    await supabase.rpc("complete_ai_invitation_generation", { p_generation_id: generationId, p_status: "succeeded", p_input_tokens: generation.usage.input, p_output_tokens: generation.usage.output, p_total_tokens: generation.usage.total, p_latency_ms: Date.now() - startedAt });
    return { proposal: generation.proposal };
  } catch {
    await supabase.rpc("complete_ai_invitation_generation", { p_generation_id: generationId, p_status: "failed", p_input_tokens: null, p_output_tokens: null, p_total_tokens: null, p_latency_ms: Date.now() - startedAt });
    return { error: "failed" };
  }
}

export async function applyAiInvitationProposal(formData: FormData) {
  const event = await getAuthorizedEvent(formData.get("event_id"));
  const rawProposal = formData.get("proposal");
  if (!event || typeof rawProposal !== "string" || event.status === "archived") return;
  let proposal: AiInvitationProposal | null = null;
  try { proposal = parseAiInvitationProposal(JSON.parse(rawProposal)); } catch { return; }
  if (!proposal) return;
  const supabase = await createClient();
  const [{ error: contentError }, { error: experienceError }] = await Promise.all([
    supabase.from("event_content").update({ host_names: proposal.content.hostNames || null, headline: proposal.content.headline || null, invitation_text: proposal.content.invitationText || null }).eq("event_id", event.id),
    supabase.from("event_experience").update({ theme_config: proposal.design }).eq("event_id", event.id),
  ]);
  if (contentError || experienceError) return;
  const { data: sections } = await supabase.from("event_sections").select("id, section_type").eq("event_id", event.id);
  await Promise.all((sections ?? []).map((section) => {
    const definition = invitationSections[section.section_type as InvitationSectionId];
    const enabled = Boolean(definition?.required || (definition?.implemented && proposal.sections.includes(section.section_type as InvitationSectionId)));
    return supabase.from("event_sections").update({ enabled }).eq("id", section.id);
  }));
  revalidatePath(`/dashboard/events/${event.id}/invitation`);
  revalidatePath(`/dashboard/events/${event.id}/preview`);
  revalidatePath(`/i/${event.slug}`);
}
