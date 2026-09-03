import Link from "next/link";

import { AppFrame } from "@/components/layout/app-frame";

const moments = [
  { number: "01", title: "الفكرة", copy: "قول لنا عن المناسبة بالطريقة اللي تحبها.", tone: "moment-sun" },
  { number: "02", title: "الدهشة", copy: "Lamma يحوّل إحساسك إلى دعوة تنفتح مثل قصة.", tone: "moment-blue" },
  { number: "03", title: "اللمّة", copy: "شاركها. وخلي أول لحظة توصل قبل الموعد.", tone: "moment-coral" },
];

export default function Home() {
  return (
    <AppFrame action={<Link className="lm-nav-cta" href="/sign-in">اصنع دعوتك <span>↗</span></Link>}>
      <main className="lm-home">
        <section className="lm-hero-new">
          <div className="lm-hero-photo" role="img" aria-label="تفاصيل احتفال مشمس من Lamma" />
          <div className="lm-hero-overlay" />
          <div className="lm-hero-content lm-wrap">
            <p className="lm-eyebrow">لمّة · دعوات تُعاش</p>
            <h1>المناسبة<br /><i>تبدأ هنا.</i></h1>
            <p className="lm-hero-copy-new">دعوة رقمية فيها منكم — من أول فكرة، إلى اللحظة اللي يفتحها ضيفك ويبتسم.</p>
            <Link className="lm-circle-cta" href="/sign-in" aria-label="ابدأ تصميم دعوتك">ابدأ<br />الآن <span>↗</span></Link>
          </div>
          <div className="lm-hero-bottom lm-wrap"><span>01 — 04</span><span>صمّم بالعربي أو English</span><span>اسحب لتكتشف</span></div>
        </section>

        <section className="lm-manifesto lm-wrap">
          <p className="lm-eyebrow">ليست صورة تُرسلها</p>
          <h2>إنها <i>لحظة</i><br />تصل إلى ضيوفك.</h2>
          <p className="lm-manifesto-copy">من الزفاف إلى أول عيد ميلاد. اصنع تجربة تشبه صوتكم، وتترك أثراً أطول من أي رسالة.</p>
        </section>

        <section className="lm-journey">
          <div className="lm-wrap">
            <div className="lm-section-intro"><p className="lm-eyebrow">من إحساس إلى تجربة</p><span>لمّة في ثلاث حركات</span></div>
            <div className="lm-moments">{moments.map((moment) => <article className={`lm-moment ${moment.tone}`} key={moment.number}><span className="lm-moment-number">{moment.number}</span><div className="lm-moment-art"><span>{moment.number === "01" ? "وش نحتفل؟" : moment.number === "02" ? "صارت دعوة" : "خلّها توصل"}</span></div><h3>{moment.title}</h3><p>{moment.copy}</p></article>)}</div>
          </div>
        </section>

        <section className="lm-showcase lm-wrap"><div className="lm-showcase-copy"><p className="lm-eyebrow">تجارب لها شخصيات مختلفة</p><h2>كل لمّة<br /><i>لها نبرة.</i></h2><p>هادئة. جريئة. حنونة. أو مليانة حياة. اختر الإحساس، وخلّ Lamma يبني المشهد.</p><Link className="lm-text-link" href="/sign-in">استكشف الاستوديو <span>↗</span></Link></div><div className="lm-invite-stack"><div className="lm-invite-card invite-dark"><span>A new chapter</span><strong>Ahmed<br /><em>&amp;</em> Salma</strong><small>20 · 10 · 2026<br />Cairo, Egypt</small></div><div className="lm-invite-card invite-image"><span>ليلة من العمر</span><strong>نور<br /><i>و</i> أحمد</strong><small>اكتوبر ٢٠٢٦</small></div></div></section>

        <section className="lm-final-cta"><div className="lm-wrap"><p className="lm-eyebrow">الآن دور مناسبتك</p><h2>خلّها تبدأ<br /><i>بشكل يشبهكم.</i></h2><Link className="lm-dark-button" href="/sign-in">أنشئ دعوتك مع Lamma <span>↗</span></Link></div></section>
      </main>
    </AppFrame>
  );
}
