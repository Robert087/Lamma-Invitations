"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const weddingStyles = [
  { label: "مودرن", title: "ليلى & آدم", date: "18 أكتوبر 2026", tone: "sunset", image: "/lamma-celebration.png" },
  { label: "رومانسي", title: "نور & ياسين", date: "20 ديسمبر 2026", tone: "rose", image: "/lamma-celebration.png" },
  { label: "كتب كتاب", title: "مريم & يوسف", date: "الجمعة · 6:00 م", tone: "ink", image: "/lamma-celebration.png" },
  { label: "خطوبة", title: "سلمى & عمر", date: "السبت · 8:00 م", tone: "lime", image: "/lamma-celebration.png" },
];

const otherOccasions = ["عيد ميلاد", "تخرج", "بيبي شاور", "شركة", "رمضان"];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12 });
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
    if (!node || started) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCount(value); return; }
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1500, 1);
        setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [started, value]);
  return <div ref={ref} className="lm-count"><strong>{count.toLocaleString("en-US")}{suffix}</strong><span>{label}</span></div>;
}

function WeddingInvite({ item, index }: { item: typeof weddingStyles[number]; index: number }) {
  return <div className={`lm-wedding-invite lm-tone-${item.tone}`}>
    <div className="lm-invite-image" style={{ backgroundImage: `url(${item.image})` }}><span>لمّة</span><small>{item.label}</small></div>
    <div className="lm-invite-copy"><p>يسعدنا حضوركم</p><h3>{item.title}</h3><span>{item.date}</span><i>{index % 2 === 0 ? "CAIRO · EGYPT" : "GOUNA · EGYPT"}</i></div>
  </div>;
}

export default function Home() {
  const [styleIndex, setStyleIndex] = useState(1);
  const [prompt, setPrompt] = useState("فرحنا أنا ونور يوم 20 ديسمبر، في الجونة، والفرح بالليل. عايزين حاجة شيك ومش تقليدية.");
  const [made, setMade] = useState(false);
  const activeStyle = weddingStyles[styleIndex];

  return <div className="lm-shell" dir="rtl">
    <header className="lm-nav lm-wrap"><Link className="lm-logo" href="/">لمّة<span>•</span></Link><nav><a href="#experience">تجربة ضيوفك</a><a href="#styles">شوف الدعوات</a><a href="#how">إزاي بتشتغل</a></nav><Link className="lm-nav-cta" href="/sign-in">ابدأ دعوتك <span>↗</span></Link></header>
    <main>
      <section className="lm-hero lm-wrap">
        <div className="lm-hero-copy"><p className="lm-eyebrow">دعوة فرحكم، بس على طريقة لمّة</p><h1>فرحكم<br /><em>بيبدأ قبل يومه.</em></h1><p className="lm-hero-sub">مش مجرد لينك يتبعت على واتساب. دي أول لحظة من فرحكم — تجربة تفتح بضيوفكم على أسماءكم، حكايتكم، وتفاصيل اليوم اللي مستنيينه.</p><div className="lm-hero-actions"><Link className="lm-primary" href="#try">اعملي دعوة فرحك <span>↗</span></Link><a className="lm-text-link" href="#experience">شوف ضيوفك هيشوفوا إيه <span>↓</span></a></div><div className="lm-proof"><div className="lm-avatars"><i>ن</i><i>ي</i><i>م</i><i>+</i></div><span>دعوات معمولة بحب لأهم يوم</span></div></div>
        <div className="lm-hero-stage" aria-label="تجربة فتح دعوة زفاف"><div className="lm-share-card"><span className="lm-share-dot" /> نور & ياسين <small>بعتولك دعوة فرحهم</small><b>افتح الدعوة ↗</b></div><div className="lm-phone"><div className="lm-phone-notch" /><div className="lm-phone-photo" /><div className="lm-phone-copy"><small>the beginning of forever</small><strong>نور<br />& ياسين</strong><span>20 · 12 · 2026</span><i>اسحب لفوق لتبدأ الحكاية</i></div></div><div className="lm-stage-label"><b>من أول ما يفتحوا اللينك</b><span>الفرح بدأ.</span></div></div>
      </section>

      <section className="lm-marquee" aria-label="دعوات الزفاف"><div>زفاف <b>·</b> خطوبة <b>·</b> كتب كتاب <b>·</b> destination wedding <b>·</b> intimate celebration <b>·</b> زفاف <b>·</b></div></section>

      <section className="lm-experience lm-wrap" id="experience"><Reveal className="lm-section-intro"><p className="lm-eyebrow">مش كارت وخلاص</p><h2>اللينك اللي بتبعتوه<br /><span>هو أول تجربة لضيوفكم.</span></h2><p>من لحظة ما توصّلهم الدعوة لحد ما يقولوا «وصلت؟» — كل تفصيلة معمولة عشان تحسسهم إنهم جزء من اليوم.</p></Reveal><div className="lm-journey"><Reveal className="lm-journey-share"><span>01</span><div className="lm-whatsapp"><small>من نور & ياسين</small><strong>إنتوا أول ناس نحب تشاركونا يومنا</strong><b>lamma.events/nour-yassin ↗</b></div><i>لينك يتبعت على واتساب</i></Reveal><Reveal className="lm-journey-phone" delay={120}><span>02</span><div className="lm-mini-phone"><div className="lm-mini-top">نور & ياسين</div><div className="lm-mini-hero"><small>the beginning of forever</small><strong>نور<br />& ياسين</strong><b>20 DEC 2026</b></div><div className="lm-mini-details"><span>العد التنازلي</span><strong>104 يوم</strong><span>الجونة · مصر</span></div></div><i>الدعوة تفتح قدامهم</i></Reveal><Reveal className="lm-journey-details" delay={240}><span>03</span><div className="lm-detail-list"><b>20.12.2026</b><b>الساعة 8:00 مساءً</b><b>فندق موڤنبيك · الجونة</b><b>Dress code: all black</b></div><i>كل التفاصيل في مكانها</i></Reveal></div></section>

      <section className="lm-value lm-wrap"><Reveal><div className="lm-value-header"><p className="lm-eyebrow">ليه لمّة مختلفة؟</p><h2>الصورة بتقول معلومة.<br /><em>لمّة بتقول إحساس.</em></h2></div><div className="lm-value-grid"><div className="lm-normal-card"><span>دعوة عادية</span><div className="lm-normal-image" /><strong>نور & ياسين</strong><small>20 ديسمبر · الجونة</small><i>صورة + تاريخ + مكان</i></div><div className="lm-plus">+</div><div className="lm-lamma-card"><span>دعوة لمّة</span><div className="lm-lamma-screen"><small>the beginning of forever</small><strong>نور & ياسين</strong><b>20 · 12 · 2026</b><i>اسحب لفوق</i></div><div className="lm-lamma-tags"><b>قصة</b><b>عد تنازلي</b><b>مكان</b><b>صور وفيديو <small>قريبًا</small></b><b>RSVP <small>قريبًا</small></b></div></div></div><p className="lm-value-note">كل حاجة ضيوفكم محتاجين يعرفوها — في تجربة واحدة تتبعت بلينك.</p></Reveal></section>

      <section className="lm-ai lm-wrap" id="try"><Reveal className="lm-ai-copy"><p className="lm-eyebrow">احكولنا عن فرحكم</p><h2>إنتوا عارفين<br /><span>الإحساس.</span><br />ولمّة تعرف تعمله.</h2><p>اكتبوا عن يومكم بالمصري عادي. لمّة تحول كلامكم لبداية تليق بيه.</p></Reveal><Reveal className="lm-builder" delay={100}><div className="lm-chat-top"><span className="lm-live-dot" /> لمّة AI <small>بتفهمكم</small></div><div className="lm-message lm-user">{prompt}</div><div className={`lm-message lm-ai ${made ? "is-made" : ""}`}>{made ? "تمام. فهمنا الإحساس — دي بداية دعوتكم." : "حلو أوي. خلّينا نبدأ من هنا."}</div><div className="lm-prompt"><input value={prompt} onChange={(e) => setPrompt(e.target.value)} aria-label="احكوا عن فرحكم" /><button onClick={() => { setMade(false); window.setTimeout(() => setMade(true), 700); }} aria-label="خلي لمّة تعملها">↗</button></div><p className="lm-prompt-hint">اكتبوا زي ما بتتكلموا — مفيش إجابة غلط</p></Reveal><Reveal className={`lm-ai-result ${made ? "is-ready" : ""}`} delay={180}><div className="lm-result-top"><span>{made ? "دي دعوتكم" : "بتتكوّن دلوقتي"}</span><b>{made ? "✓" : "✦"}</b></div><div className="lm-result-invite"><small>نور & ياسين</small><strong>the<br />beginning</strong><span>20 DECEMBER · GOUNA</span></div><div className="lm-result-footer">دعوة معمولة ليكم إنتوا</div></Reveal></section>

      <section className="lm-stats lm-wrap"><Reveal><Count value={12} suffix="K+" label="دعوة زفاف اتعملت" /></Reveal><Reveal delay={100}><Count value={350} suffix="K+" label="ضيف فتح دعوة" /></Reveal><Reveal delay={200}><Count value={25} suffix="+" label="فرح ومناسبة بدأت مع لمّة" /></Reveal><p className="lm-placeholder-note">أرقام تجريبية — نستبدلها بأرقام حقيقية قبل الإطلاق</p></section>

      <section className="lm-styles lm-wrap" id="styles"><Reveal className="lm-section-row"><div><p className="lm-eyebrow">كل فرح ليه إحساسه</p><h2>ودعوتكم كمان.</h2></div><p>اختاروا الشخصية. إحنا نكمّل التجربة.</p></Reveal><div className="lm-style-picker">{weddingStyles.map((item, index) => <button className={styleIndex === index ? "is-active" : ""} key={item.label} onClick={() => setStyleIndex(index)}><span>0{index + 1}</span>{item.label}<b>↗</b></button>)}</div><div className="lm-featured-style"><WeddingInvite item={activeStyle} index={styleIndex} /><div className="lm-featured-copy"><span>التجربة المختارة</span><h3>{activeStyle.title}</h3><p>دعوة فيها نفس روح يومكم — من أول شاشة لآخر تفصيلة.</p><Link className="lm-text-link" href="/sign-in">اعملي واحدة شبهكم <span>↗</span></Link></div></div></section>

      <section className="lm-how lm-wrap" id="how"><Reveal className="lm-how-copy"><p className="lm-eyebrow">ببساطة كده</p><h2>من أول «هاي»<br />لحد <span>«وصلت؟»</span></h2></Reveal><div className="lm-steps"><Reveal delay={80}><b>01</b><h3>احكولنا عنكم</h3><p>إيه الإحساس؟ مين الناس؟ وإيه اللي يخلي اليوم ده شبهكم؟</p></Reveal><Reveal delay={160}><b>02</b><h3>ظبطوها على مزاجكم</h3><p>الألوان، الصور، الحركة — كل حاجة لحد ما تقولوا: دي إحنا.</p></Reveal><Reveal delay={240}><b>03</b><h3>ابعتوا أول لحظة</h3><p>لينك واحد على واتساب. وضيوفكم يعيشوا التجربة قبل اليوم الكبير.</p></Reveal></div></section>

      <section className="lm-reviews lm-wrap"><Reveal className="lm-review-main"><span className="lm-quote">“</span><blockquote>أكتر حاجة حبيتها إنها حسيت إنها شبه فرحنا فعلًا.</blockquote><strong>نور & ياسين</strong><small>دعوة زفاف · الجونة</small></Reveal><Reveal className="lm-review-side" delay={120}><blockquote>بدل ما نبعت صورة وخلاص، الناس دخلت وشافت المكان والتاريخ وكل حاجة.</blockquote><strong>سلمى & عمر</strong><small>دعوة خطوبة · القاهرة</small></Reveal><p className="lm-placeholder-note">تجارب حقيقية من أزواجنا بعد الإطلاق</p></section>

      <section className="lm-other lm-wrap"><Reveal><p className="lm-eyebrow">ولمّة مش للفرح بس</p><h2>نفس التجربة.<br /><span>لكل مناسبة تستاهلها.</span></h2><div className="lm-other-list">{otherOccasions.map((occasion, index) => <span key={occasion}><b>0{index + 1}</b>{occasion}<i>↗</i></span>)}</div></Reveal></section>

      <section className="lm-final lm-wrap"><Reveal><p className="lm-eyebrow">أول حاجة ضيوفكم هيشوفوها من فرحكم</p><h2>خلّوا البداية<br /><em>تليق بيكم.</em></h2><Link className="lm-primary lm-primary-light" href="/sign-in">ابدأوا دعوة فرحكم <span>↗</span></Link></Reveal><div className="lm-final-mark">لمّة<span>•</span></div></section>
    </main><footer className="lm-footer lm-wrap"><span>© 2026 لمّة — دعوات بتتحس</span><span>صُنع بحب في مصر</span></footer>
  </div>;
}

// The landing page intentionally uses placeholder social proof until production data is connected.
// Future invitation capabilities are marked inline as "قريبًا" rather than presented as live.

void WeddingInvite;
