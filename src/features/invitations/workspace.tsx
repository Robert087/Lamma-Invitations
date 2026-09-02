"use client";

import { useActionState, useMemo, useState } from "react";

import { updateInvitationContent } from "./actions";
import { InvitationRenderer } from "./renderer";
import { initialUpdateInvitationState, type InvitationContent, type InvitationModel } from "./types";

type InvitationWorkspaceProps = {
  invitation: InvitationModel;
};

const contentFields: Array<{ key: keyof InvitationContent; label: string; placeholder: string; multiline?: boolean }> = [
  { key: "host_names", label: "الأسماء", placeholder: "اكتب الأسماء كما تريد أن تظهر" },
  { key: "headline", label: "العنوان", placeholder: "اكتب الجملة التي يراها ضيوفك أولًا" },
  { key: "invitation_text", label: "رسالتك", placeholder: "اكتب رسالتك بطريقتك", multiline: true },
];

export function InvitationWorkspace({ invitation }: InvitationWorkspaceProps) {
  const [draft, setDraft] = useState<InvitationContent>(invitation.content);
  const [state, formAction, isPending] = useActionState(updateInvitationContent, initialUpdateInvitationState);
  const previewInvitation = useMemo(() => ({ ...invitation, content: draft }), [draft, invitation]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <form action={formAction} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <input name="event_id" type="hidden" value={invitation.event.id} />
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">محتوى الدعوة</h1>
          <p className="mt-2 text-sm text-stone-600">اكتب بطريقتك، بالعربية أو الإنجليزية أو باللغتين معًا.</p>
        </div>
        {contentFields.map(({ key, label, placeholder, multiline }) => (
          <label className="block text-sm font-medium text-stone-700" key={key}>
            {label}
            {multiline ? (
              <textarea className="mt-2 min-h-28 w-full rounded-lg border border-stone-300 px-3 py-2" dir="auto" name={key} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} value={draft[key] ?? ""} />
            ) : (
              <input className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2" dir="auto" name={key} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} type="text" value={draft[key] ?? ""} />
            )}
            {state.fieldErrors?.[key] ? <span className="mt-1 block text-red-700">{state.fieldErrors[key]}</span> : null}
          </label>
        ))}
        {state.formError ? <p className="text-sm text-red-700" role="alert">تعذر حفظ الدعوة. يرجى المحاولة مرة أخرى.</p> : null}
        {state.success ? <p className="text-sm text-emerald-700" role="status">تم حفظ التغييرات.</p> : null}
        <button className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
          {isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </form>

      <section>
        <h2 className="mb-4 font-semibold text-stone-900">المعاينة</h2>
        <InvitationRenderer invitation={previewInvitation} locale={invitation.event.primary_locale} />
      </section>
    </div>
  );
}
