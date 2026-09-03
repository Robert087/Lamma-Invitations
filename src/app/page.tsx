"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const occasions = [
  { label: "عيد ميلاد", tone: "coral", title: "ليلة لينا", meta: "الجمعة · 8:00 م", icon: "✦" },
  { label: "تخرج", tone: "blue", title: "دفعة 2026", meta: "قاعة النيل · 7:30 م", icon: "↗" },
  { label: "كتب كتاب", tone: "lime", title: "مريم و يوسف", meta: "السبت · 6:00 م", icon: "♡" },
];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.14 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`lm-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--delay": `${delay}ms` } as React.CSSProperties}>{children}</div>;
}

function Count({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) { setCount(value); return; }
        const start = performance.now();
        let frame = 0;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1600, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [started, value]);
  return <div ref={ref} className="lm-count"><strong>{count.toLocaleString("en-US")}{suffix}</strong><span>{label}</span></div>;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [prompt, setPrompt] = useState("فرحي أنا ونور يوم 20 ديسمبر، عايزين حاجة بسيطة ومختلفة");
  const [made, setMade] = useState(false);
  const occasion = occasions[active];
  const makeInvitation = () => { setMade(false); window.setTimeout(() => setMade(true), 900); };

  return <div className="lm-shell" dir="rtl">
    <header className="lm-nav lm-wrap"><Link className="lm-logo" href="/">لمّة<span>•</span></Link><nav><a href="#how">إزاي بتشتغل</a><a href="#explore">شوف الدعوات</a></nav><Link className="lm-nav-cta" href="/sign-in">ابدأ دعوتك <span>↗</span></Link></header>
    <main>
      <section className="lm-hero lm-wrap">
        <div className="lm-hero-copy"><p className="lm-eyebrow">دعواتك، على مزاجك</p><h1>احكيها.<br /><em>لمّة تعملها.</em></h1><p className="lm-hero-sub">دعوة رقمية تحس إنها معمولة ليك. اكتب اللي في دماغك، واختار شكل يليق بالمناسبة.</p><div className="lm-hero-actions"><Link className="lm-primary" href="#try">جرّب تعمل دعوة <span>↗</span></Link><a className="lm-text-link" href="#explore">شوفها من جوّه <span>↓</span></a></div><div className="lm-proof"><div className="lm-avatars"><i>م</i><i>س</i><i>ن</i><i>+</i></div><span>ناس كتير بدأت دعوتها من هنا</span></div></div>
        <div className="lm-hero-stage" aria-label="دعوة تتكوّن قدامك"><div className="lm-stage-kicker">فكرة صغيرة <span>→</span> تجربة كاملة</div><div className="lm-invite-card lm-card-back"><span>✦</span><small>{occasion.label}</small><strong>{occasion.title}</strong><b>{occasion.meta}</b></div><div className={`lm-invite-card lm-card-front lm-${occasion.tone}`}><div className="lm-card-image" /><div className="lm-card-body"><span>{occasion.icon}</span><small>{occasion.label}</small><strong>{occasion.title}</strong><b>{occasion.meta}</b><button onClick={() => setActive((active + 1) % occasions.length)} aria-label="بدّل المناسبة">بدّل التجربة ↻</button></div></div><div className="lm-stage-caption">الدعوة بتتحس قبل ما تتبعت</div></div>
      </section>
      <section className="lm-marquee" aria-label="مناسبات"><div>زفاف <b>·</b> عيد ميلاد <b>·</b> تخرج <b>·</b> خطوبة <b>·</b> كتب كتاب <b>·</b> استقبال مولود <b>·</b> حفلة <b>·</b></div></section>
      <section className="lm-demo lm-wrap" id="try"><Reveal className="lm-section-intro"><p className="lm-eyebrow">من فكرة لدعوة</p><h2>قول اللي في دماغك.<br /><span>وشوفها بتتكوّن قدامك.</span></h2></Reveal><div className="lm-builder"><Reveal className="lm-builder-chat" delay={80}><div className="lm-chat-top"><span className="lm-live-dot" />لمّة AI <small>فاهمة دماغك</small></div><div className="lm-message lm-user">{prompt}</div><div className={`lm-message lm-ai ${made ? "is-made" : ""}`}>{made ? "تمام. الأسماء والتاريخ والصورة ركبوا مكانهم — بص عليها كده." : "حلو أوي. تحبيها عاملة إزاي؟"}</div><div className="lm-prompt"><input value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="احكي عن مناسبتك" /><button onClick={makeInvitation} aria-label="خلي لمّة تعملها">↗</button></div><p className="lm-prompt-hint">اكتبي بالمصري عادي — مفيش إجابة غلط</p></Reveal><Reveal className={`lm-builder-result ${made ? "is-ready" : ""}`} delay={180}><div className="lm-result-top"><span>{made ? "اتعملت خلاص" : "بتتعمل دلوقتي"}</span><b>{made ? "✓" : "✦"}</b></div><div className="lm-result-invite"><small className="lm-build-name">{made ? "نور & ياسين" : "ليلة لينا"}</small><strong>{made ? <>save<br />the date</> : <>it&apos;s<br />a vibe</>}</strong><span>{made ? "20 DECEMBER · 08:00 PM" : "FRIDAY · 08:00 PM"}</span></div><div className="lm-result-footer"><span>هتشوفيها زي ضيوفك</span><button>افتح الدعوة ↗</button></div></Reveal></div></section>
      <section className="lm-stats lm-wrap"><Reveal><Count value={12} suffix="K+" label="دعوة اتعملت" /></Reveal><Reveal delay={100}><Count value={350} suffix="K+" label="مرة الدعوات اتفتحت" /></Reveal><Reveal delay={200}><Count value={25} suffix="+" label="تجربة وتصميم" /></Reveal></section>
      <section className="lm-explore lm-wrap" id="explore"><Reveal className="lm-section-row"><div><p className="lm-eyebrow">كل مناسبة ليها إحساس</p><h2>اختاري اللي شبهك.</h2></div><Link className="lm-text-link" href="/sign-in">شوفي كل التجارب ↗</Link></Reveal><div className="lm-occasion-grid">{occasions.map((item, index) => <button className={`lm-occasion lm-${item.tone} ${active === index ? "is-active" : ""}`} key={item.label} onClick={() => setActive(index)}><div className="lm-mini-art"><span>{item.icon}</span></div><div><small>{item.label}</small><strong>{item.title}</strong></div><span className="lm-arrow">↗</span></button>)}</div></section>
      <section className="lm-how lm-wrap" id="how"><Reveal className="lm-how-copy"><p className="lm-eyebrow">ببساطة كده</p><h2>من أول &quot;هاي&quot;<br />لحد <span>&quot;وصلت؟&quot;</span></h2></Reveal><div className="lm-steps"><Reveal delay={80}><b>01</b><h3>احكيلنا عنها</h3><p>إيه المناسبة؟ مين الناس؟ وإيه الإحساس اللي عايزاه؟</p></Reveal><Reveal delay={160}><b>02</b><h3>ظبطها على مزاجك</h3><p>بدّل الألوان والحركة والصور لحد ما تقول: دي أنا.</p></Reveal><Reveal delay={240}><b>03</b><h3>ابعتها على واتساب</h3><p>لينك واحد. تجربة كاملة. وضيوفك يشوفوا الدعوة زي ما قصدتها.</p></Reveal></div></section>
      <section className="lm-review lm-wrap"><div className="lm-review-photo" /><Reveal className="lm-review-copy"><span className="lm-quote">“</span><blockquote>بعتها على واتساب والناس فضلت تسألني عملتها فين.</blockquote><div><strong>سلمى</strong><span>حفلة خطوبة</span></div></Reveal></section>
      <section className="lm-final lm-wrap"><Reveal><p className="lm-eyebrow">المناسبة الجاية مستنياك</p><h2>اعمل حاجة<br /><em>تتفتح بحب.</em></h2><Link className="lm-primary lm-primary-light" href="/sign-in">ابدأ دعوتك دلوقتي <span>↗</span></Link></Reveal><div className="lm-final-mark">لمّة<span>•</span></div></section>
    </main><footer className="lm-footer lm-wrap"><span>© 2026 لمّة — دعوات بتتحس</span><span>صُنع بحب في مصر</span></footer>
  </div>;
}
