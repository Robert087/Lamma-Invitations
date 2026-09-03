"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SignInFormProps = { initialError?: string };

export function SignInForm({ initialError }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setIsLoading(true);
    const { error: signInError } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } });
    setIsLoading(false);
    if (signInError) { setError("لم نتمكن من إرسال الرابط. حاول مرة أخرى."); return; }
    setIsMagicLinkSent(true);
  }
  return <section className="lm-panel w-full max-w-md p-6 sm:p-8">
    <p className="lm-kicker">أهلًا بك في Lamma</p><h1 className="mt-3 text-3xl font-bold tracking-tight">خلّي مناسبتك تبدأ بشكل يليق بها.</h1><p className="lm-copy mt-3 text-sm">ادخل بسرعة، واحفظ مناسباتك ودعواتك في مكان واحد.</p>
    {isMagicLinkSent ? <div className="mt-7 rounded-xl bg-[var(--lm-surface-soft)] p-4 text-sm leading-7 text-[var(--lm-green)]" role="status">أرسلنا لك رابط الدخول. افتح بريدك الإلكتروني واضغط عليه للمتابعة.</div> : <form className="mt-7 space-y-4" onSubmit={sendMagicLink}><label className="block text-sm font-bold" htmlFor="email">بريدك الإلكتروني</label><input autoComplete="email" className="lm-input mt-2 text-left" dir="ltr" id="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /><button className="lm-button w-full" disabled={isLoading} type="submit">{isLoading ? "جارٍ الإرسال..." : "أرسل لي رابط الدخول"}</button></form>}
    {error ? <p className="mt-4 text-sm font-medium text-red-700" role="alert">{error}</p> : null}
  </section>;
}
