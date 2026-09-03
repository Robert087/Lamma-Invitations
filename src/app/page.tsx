import Link from "next/link";

import { AppFrame } from "@/components/layout/app-frame";

export default function Home() {
  return (
    <AppFrame action={<Link className="lm-link" href="/sign-in">ابدأ الآن</Link>}>
      <main className="lm-wrap grid gap-12 pb-14 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">
        <section>
          <p className="lm-kicker">دعوات رقمية، لكن بشكل مختلف</p>
          <h1 className="lm-title mt-5 max-w-3xl">مش مجرد دعوة.<br /><span className="text-[var(--lm-accent)]">دي بداية المناسبة.</span></h1>
          <p className="lm-copy mt-6 max-w-xl">Lamma تمنحك مساحة بسيطة لصناعة دعوة تشبه مناسبتك — من أول فكرة حتى اللحظة التي يفتحها ضيوفك.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="lm-button lm-button-accent" href="/sign-in">أنشئ دعوتك</Link>
            <a className="lm-button lm-button-quiet" href="#occasions">اكتشف المناسبات</a>
          </div>
          <p className="mt-5 text-sm text-[var(--lm-muted)]">قريبًا: مساعدة ذكية لتبدأ من فكرة بسيطة.</p>
        </section>
        <aside className="relative overflow-hidden rounded-[2rem] bg-[var(--lm-ink)] p-7 text-white shadow-[var(--lm-shadow)] sm:p-10">
          <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[var(--lm-accent)] opacity-90" />
          <div className="relative">
            <p className="text-sm text-white/60">ليلة لا تُنسى</p>
            <p className="mt-16 text-4xl font-semibold leading-tight sm:text-5xl">Ahmed<br />&amp; Salma</p>
            <div className="mt-12 border-t border-white/15 pt-5 text-sm text-white/70">20 أكتوبر 2026&nbsp; · &nbsp;القاهرة</div>
          </div>
        </aside>
      </main>
      <section className="lm-wrap pb-20" id="occasions">
        <p className="lm-kicker">لكل لحظة تستحق أن تُذكر</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["زفاف", "خطوبة", "كتب كتاب", "عيد ميلاد", "استقبال مولود", "تخرج", "حفلة", "مناسبة خاصة"].map((occasion) => <span className="rounded-full border border-[var(--lm-line)] bg-white px-4 py-2 text-sm text-[var(--lm-muted)]" key={occasion}>{occasion}</span>)}
        </div>
      </section>
    </AppFrame>
  );
}
