"use client";
/* eslint-disable @next/next/no-img-element -- owner thumbnails use short-lived signed Storage URLs. */

import { useActionState } from "react";

import { deleteInvitationMedia, moveInvitationMedia, uploadInvitationMedia } from "./actions";
import { initialMediaActionState, invitationMediaLimit } from "./media";
import type { InvitationMedia } from "./types";

type Props = { eventId: string; media: InvitationMedia[]; locale: "ar" | "en" };

export function MediaManager({ eventId, media, locale }: Props) {
  const [state, upload, isPending] = useActionState(uploadInvitationMedia, initialMediaActionState);
  const isArabic = locale === "ar";
  return <section className="mt-6 border-t border-[var(--lm-line)] pt-6">
    <p className="lm-kicker">{isArabic ? "الصور" : "Photos"}</p>
    <h2 className="mt-1 text-lg font-bold">{isArabic ? "ضيفوا صوركم" : "Add your photos"}</h2>
    <p className="mt-1 text-sm text-[var(--lm-muted)]">{isArabic ? "اختاروا الصور اللي عايزينها تظهر في الدعوة." : "Choose the photos you want guests to see in the invitation."}</p>
    <p className="mt-2 text-xs text-[var(--lm-muted)]">{isArabic ? `JPEG أو PNG أو WebP، حتى 5 ميجابايت للصورة · ${media.length}/${invitationMediaLimit}` : `JPEG, PNG, or WebP, up to 5 MB each · ${media.length}/${invitationMediaLimit}`}</p>

    <form action={upload} className="mt-4 rounded-xl border border-dashed border-[var(--lm-line)] p-3">
      <input name="event_id" type="hidden" value={eventId} />
      <label className="block text-sm font-bold" htmlFor="gallery-image">{isArabic ? "أضف صورة" : "Add an image"}</label>
      <input accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-sm" disabled={media.length >= invitationMediaLimit || isPending} id="gallery-image" name="image" required type="file" />
      <label className="mt-3 block text-sm font-bold" htmlFor="gallery-alt">{isArabic ? "وصف الصورة (اختياري)" : "Image description (optional)"}</label>
      <input className="lm-input mt-1" id="gallery-alt" maxLength={240} name="alt_text" placeholder={isArabic ? "مثال: لحظة من احتفالنا" : "For example: A moment from our celebration"} type="text" />
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm text-emerald-700">{isArabic ? "اتضافت الصورة." : "Photo added."}</p> : null}
      <button className="lm-button lm-button-accent mt-4" disabled={media.length >= invitationMediaLimit || isPending} type="submit">{isPending ? (isArabic ? "بنضيف الصورة..." : "Adding photo…") : (isArabic ? "أضف صورة" : "Add image")}</button>
    </form>

    {media.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{media.map((image, index) => <article className="overflow-hidden rounded-xl border border-[var(--lm-line)] bg-white" key={image.position}><img alt={image.altText || ""} className="aspect-[4/3] w-full bg-[var(--lm-accent-soft)] object-cover" src={image.url} /><div className="p-3"><p className="line-clamp-1 text-xs text-[var(--lm-muted)]">{image.altText || (isArabic ? "بدون وصف" : "No description")}</p><div className="mt-3 flex flex-wrap gap-2"><MoveButton disabled={index === 0} eventId={eventId} mediaPosition={image.position} intent="up" label={isArabic ? "حرّك لفوق" : "Move up"} /><MoveButton disabled={index === media.length - 1} eventId={eventId} mediaPosition={image.position} intent="down" label={isArabic ? "حرّك لتحت" : "Move down"} /><DeleteButton eventId={eventId} isArabic={isArabic} mediaPosition={image.position} /></div></div></article>)}</div> : null}
  </section>;
}

function MoveButton({ eventId, mediaPosition, intent, label, disabled }: { eventId: string; mediaPosition: number; intent: "up" | "down"; label: string; disabled: boolean }) {
  return <form action={moveInvitationMedia}><input name="event_id" type="hidden" value={eventId} /><input name="media_position" type="hidden" value={mediaPosition} /><input name="intent" type="hidden" value={intent} /><button aria-label={label} className="lm-button lm-button-quiet px-3" disabled={disabled} type="submit">{intent === "up" ? "↑" : "↓"}</button></form>;
}

function DeleteButton({ eventId, mediaPosition, isArabic }: { eventId: string; mediaPosition: number; isArabic: boolean }) {
  const [state, remove, isPending] = useActionState(deleteInvitationMedia, initialMediaActionState);
  return <form action={remove}><input name="event_id" type="hidden" value={eventId} /><input name="media_position" type="hidden" value={mediaPosition} /><button className="lm-button lm-button-quiet text-red-700" disabled={isPending} type="submit">{isPending ? (isArabic ? "جاري الحذف..." : "Deleting…") : (isArabic ? "احذف" : "Delete")}</button>{state.error ? <p className="basis-full text-xs text-red-700">{state.error}</p> : null}</form>;
}
