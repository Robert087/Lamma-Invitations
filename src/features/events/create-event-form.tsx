"use client";

import { useActionState, useState } from "react";

import { occasionLabels, occasions } from "@/config/occasions";

import { createEvent } from "./actions";
import { initialCreateEventState } from "./types";

export function CreateEventForm() {
  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [occasionError, setOccasionError] = useState("");
  const [state, formAction, isPending] = useActionState(createEvent, initialCreateEventState);

  function continueToBasics() {
    if (!selectedOccasion) {
      setOccasionError("اختر نوع المناسبة للمتابعة.");
      return;
    }

    setOccasionError("");
    setStep(2);
  }

  return (
    <form action={formAction} className="mx-auto w-full max-w-xl space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <input name="timezone" type="hidden" value="Africa/Cairo" />
      <input name="primary_locale" type="hidden" value="ar" />

      {step === 1 ? (
        <fieldset>
          <legend className="text-xl font-semibold text-stone-900">ما نوع مناسبتك؟</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {occasions.map((occasion) => (
              <label className="flex cursor-pointer items-center rounded-lg border border-stone-200 p-3 text-sm text-stone-800" key={occasion}>
                <input checked={selectedOccasion === occasion} className="ml-3" name="occasion_type" onChange={() => setSelectedOccasion(occasion)} type="radio" value={occasion} />
                {occasionLabels[occasion].ar}
              </label>
            ))}
          </div>
          {occasionError || state.fieldErrors?.occasion_type ? <p className="mt-3 text-sm text-red-700">{occasionError || state.fieldErrors?.occasion_type}</p> : null}
          <button className="mt-6 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white" onClick={continueToBasics} type="button">
            متابعة
          </button>
        </fieldset>
      ) : (
        <section>
          <input name="occasion_type" type="hidden" value={selectedOccasion} />
          <p className="text-sm text-stone-500">الخطوة 2 من 2</p>
          <h1 className="mt-1 text-xl font-semibold text-stone-900">أساسيات المناسبة</h1>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-stone-700" htmlFor="title">
              عنوان المناسبة
              <input className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-stone-600" id="title" maxLength={120} name="title" required type="text" />
              {state.fieldErrors?.title ? <span className="mt-1 block text-red-700">{state.fieldErrors.title}</span> : null}
            </label>
            <label className="block text-sm font-medium text-stone-700" htmlFor="event_date">
              التاريخ (اختياري)
              <input className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2" id="event_date" name="event_date" type="date" />
              {state.fieldErrors?.event_date ? <span className="mt-1 block text-red-700">{state.fieldErrors.event_date}</span> : null}
            </label>
            <label className="block text-sm font-medium text-stone-700" htmlFor="venue_name">
              اسم المكان (اختياري)
              <input className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2" id="venue_name" maxLength={160} name="venue_name" type="text" />
              {state.fieldErrors?.venue_name ? <span className="mt-1 block text-red-700">{state.fieldErrors.venue_name}</span> : null}
            </label>
            <label className="block text-sm font-medium text-stone-700" htmlFor="location_url">
              رابط الموقع (اختياري)
              <input className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2" dir="ltr" id="location_url" name="location_url" type="url" />
              {state.fieldErrors?.location_url ? <span className="mt-1 block text-red-700">{state.fieldErrors.location_url}</span> : null}
            </label>
          </div>
          {state.formError ? <p className="mt-4 text-sm text-red-700" role="alert">{state.formError}</p> : null}
          <div className="mt-6 flex gap-3">
            <button className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-800" disabled={isPending} onClick={() => setStep(1)} type="button">رجوع</button>
            <button className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">
              {isPending ? "جارٍ الإنشاء..." : "إنشاء المناسبة"}
            </button>
          </div>
        </section>
      )}
    </form>
  );
}
