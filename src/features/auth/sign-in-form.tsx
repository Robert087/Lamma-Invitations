"use client";

import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type SignInFormProps = {
  initialError?: string;
};

export function SignInForm({ initialError }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });

    setIsLoading(false);

    if (signInError) {
      setError("تعذر إرسال رابط تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      return;
    }

    setIsMagicLinkSent(true);
  }

  async function signInWithGoogle() {
    setError("");
    setIsLoading(true);

    const { error: signInError } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });

    if (signInError) {
      setIsLoading(false);
      setError("تعذر بدء تسجيل الدخول عبر Google. تحقق من تفعيل المزود ثم حاول مرة أخرى.");
    }
  }

  return (
    <section className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-stone-900">تسجيل الدخول</h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">استخدم بريدك الإلكتروني أو Google للمتابعة إلى Lamma.</p>

      {isMagicLinkSent ? (
        <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm leading-6 text-emerald-800" role="status">
          أرسلنا رابط تسجيل الدخول إلى بريدك الإلكتروني. افتحه للمتابعة.
        </p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={sendMagicLink}>
          <label className="block text-sm font-medium text-stone-700" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-stone-300 px-3 py-2 text-left outline-none focus:border-stone-600"
            dir="ltr"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <button className="w-full rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
            {isLoading ? "جارٍ الإرسال..." : "إرسال رابط تسجيل الدخول"}
          </button>
        </form>
      )}

      <div className="my-6 border-t border-stone-200" />
      <button className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} onClick={signInWithGoogle} type="button">
        المتابعة باستخدام Google
      </button>

      {error ? <p className="mt-4 text-sm text-red-700" role="alert">{error}</p> : null}
    </section>
  );
}
