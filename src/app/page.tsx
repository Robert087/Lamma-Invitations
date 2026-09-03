import Link from "next/link";

import { AppFrame } from "@/components/layout/app-frame";

const occasions = ["زفاف", "خطوبة", "كتب كتاب", "عيد ميلاد", "استقبال مولود", "تخرج", "حفلة", "مناسبة خاصة"];
const specimens = [
  { label: "زفاف", title: "Ahmed & Salma", meta: "20 أكتوبر 2026 · القاهرة", tone: "specimen-ink" },
  { label: "كتب كتاب", title: "ليلة من العمر", meta: "الجمعة، 14 نوفمبر · عمّان", tone: "specimen-sand" },
  { label: "ميلاد", title: "Lina turns 5", meta: "Saturday, 7 March · Riyadh", tone: "specimen-coral" },
];

export default function Home() {
  return (
    <AppFrame action={<Link className="lm-link" href="/sign-in">ابدأ الآن <span aria-hidden="true">↗</span></Link>}>
      <main>
        <section className="lm-wrap lm-hero">
          <div className="lm-hero-copy">
            <p className="lm-kicker">دعوات رقمية، بروح مناسبتك</p>
            <h1 className="lm-title">خلي دعوتك<br /><em>تحكي الحكاية.</em></h1>
            <p className="lm-copy lm-hero-lede">Lamma مساحة هادئة لصناعة دعوة تشبهك. ابدأ من شعور، اختار التفاصيل، وخلي أول لحظة من مناسبتك تبدأ من الشاشة.</p>
            <div className="lm-actions"><Link className="lm-button lm-button-accent" href="/sign-in">أنشئ دعوتك <span aria-hidden="true">↗</span></Link><a className="lm-button lm-button-quiet" href="#inspiration">شوف الإلهام</a></div>
            <p className="lm-note"><span className="lm-dot" /> صمّم بالعربي أو English — بدون قوالب مكررة</p>
          </div>
          <div className="lm-hero-art" aria-label="نماذج من دعوات Lamma">
            <div className="hero-stamp">LAMMA<br /><span>دعوة من القلب</span></div>
            <div className="hero-card"><p className="hero-card-kicker">A new chapter</p><p className="hero-names">Ahmed<br /><span>&amp;</span> Salma</p><div className="hero-rule" /><p className="hero-meta">20.10.26<br />Cairo, Egypt</p></div>
            <p className="hero-caption">made for the moments<br /><strong>you want to remember</strong></p>
          </div>
        </section>

        <section className="lm-wrap lm-section" id="inspiration"><div className="lm-section-head"><div><p className="lm-kicker">بدايات جميلة</p><h2 className="lm-subtitle">دعوتك، على طريقتك.</h2></div><span className="lm-index">01 / 03</span></div><div className="lm-specimens">{specimens.map((item) => <article className={`lm-specimen ${item.tone}`} key={item.title}><span className="specimen-label">{item.label}</span><div><h3>{item.title}</h3><p>{item.meta}</p></div><span className="specimen-arrow">↗</span></article>)}</div></section>

        <section className="lm-wrap lm-occasion-section"><div><p className="lm-kicker">كل لحظة تستحق دعوة</p><h2 className="lm-subtitle">من أول فكرة<br />إلى أول <em>«واو».</em></h2></div><div className="lm-occasion-list">{occasions.map((occasion, index) => <Link href="/sign-in" key={occasion}><span>0{index + 1}</span>{occasion}<b>↗</b></Link>)}</div></section>

        <section className="lm-wrap lm-bottom-cta"><p className="lm-kicker">جاهز تبدأ؟</p><h2 className="lm-subtitle">في مناسبات ما تتكرر.<br /><em>خلّي دعوتها ما تتنسى.</em></h2><Link className="lm-button lm-button-accent" href="/sign-in">ابدأ مع Lamma <span aria-hidden="true">↗</span></Link></section>
      </main>
    </AppFrame>
  );
}
