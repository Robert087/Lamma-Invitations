"use client";

import { useActionState, useMemo, useState } from "react";

import type { Locale } from "@/types/locale";

import { updateInvitationContent } from "./actions";
import { InvitationRenderer } from "./renderer";
import { initialUpdateInvitationState, type InvitationContent, type InvitationModel } from "./types";

type InvitationWorkspaceProps = {
  invitation: InvitationModel;
};

const contentFields: Array<{ key: keyof InvitationContent; label: string; multiline?: boolean }> = [
  { key: "host_names_ar", label: "أسماء المضيفين بالعربية" },
  { key: "host_names_en", label: "Host names in English" },
  { key: "headline_ar", label: "العنوان بالعربية" },
  { key: "headline_en", label: "Headline in English" },
  { key: "invitation_text_ar", label: "نص الدعوة بالعربية", multiline: true },
  { key: "invitation_text_en", label: "Invitation text in English", multiline: true },
];

export function InvitationWorkspace({ invitation }: InvitationWorkspaceProps) {
  const [locale, setLocale] = useState<Locale>(invitation.event.primary_locale);
  const [draft, setDraft] = useState<InvitationContent>(invitation.content);
  const [state, formAction, isPending] = useActionState(updateInvitationContent, initialUpdateInvitationState);
  const previewInvitation = useMemo(() => ({ ...invitation, content: draft }), [draft, invitation]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <form action={formAction} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <input name="event_id" type="hidden" value={invitation.event.id} />
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">محتوى الدعوة</h1>
          <p className="mt-2 text-sm text-stone-600">عدّل النصوص الأساسية ثم شاهد المعاينة بجانبها.</p>
        </div>
        {contentFields.map(({ key, label, multiline }) => (
          <label className="block text-sm font-medium text-stone-700" key={key}>
            {label}
            {multiline ? (
              <textarea className="mt-2 min-h-28 w-full rounded-lg border border-stone-300 px-3 py-2" name={key} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} value={draft[key] ?? ""} />
            ) : (
              <input className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2" name={key} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} type="text" value={draft[key] ?? ""} />
            )}
            {state.fieldErrors?.[key] ? <span className="mt-1 block text-red-700">{state.fieldErrors[key]}</span> : null}
          </label>
        ))}
        {state.formError ? <p className="text-sm text-red-700" role="alert">{state.formError}</p> : null}
        {state.success ? <p className="text-sm text-emerald-700" role="status">تم حفظ التغييرات.</p> : null}
        <button className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
          {isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </form>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">المعاينة</h2>
          <div className="flex rounded-lg border border-stone-300 p-1 text-sm">
            <button className={locale === "ar" ? "rounded bg-stone-900 px-3 py-1 text-white" : "px-3 py-1"} onClick={() => setLocale("ar")} type="button">العربية</button>
            <button className={locale === "en" ? "rounded bg-stone-900 px-3 py-1 text-white" : "px-3 py-1"} onClick={() => setLocale("en")} type="button">English</button>
          </div>
        </div>
        <InvitationRenderer invitation={previewInvitation} locale={locale} />
      </section>
    </div>
  );
}
