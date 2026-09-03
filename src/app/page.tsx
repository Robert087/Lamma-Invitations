import Link from "next/link";

import { AppFrame } from "@/components/layout/app-frame";

const occasions = [
  ["فرح", "Weddings", "لمّة كبيرة، وإحساس أكبر"],
  ["خطوبة", "Engagements", "بداية تستاهل تتقال صح"],
  ["عيد ميلاد", "Birthdays", "سنة جديدة تتفتح وسط الناس اللي بتحبهم"],
  ["تخرّج", "Graduations", "لحظة فخر ما تتنسيش"],
  ["كتب كتاب", "Katb Ketab", "يوم هادي، جميل، وشبهكم"],
  ["مناسبة شغل", "Corporate", "دعوة على قد اللحظة"],
];

const specimens = [
  { type: "Wedding", title: "Nour & Ahmed", meta: "Cairo · October 2026", image: "/lamma-wedding.png", tone: "specimen-wedding" },
  { type: "Birthday", title: "A night worth gathering for", meta: "A living invitation", image: "/lamma-hero.png", tone: "specimen-night" },
];

export default function Home() {
  return (
    <AppFrame action={<Link className="lm-nav-cta" href="/sign-in">ابدأ دعوتك <span>↗</span></Link>}>
      <main className="lm-home">
        <section className="lm-hero">
          <div className="lm-hero-photo" role="img" aria-label="أصدقاء مجتمعين حول مائدة في مناسبة سعيدة" />
          <div className="lm-hero-overlay" />
          <div className="lm-wrap lm-hero-inner">
            <p className="lm-kicker">لمّة · digital invitations for real occasions</p>
            <div className="lm-hero-grid">
              <div>
                <h1>مناسبتك<br /><em>تستاهل أكتر.</em></h1>
                <p className="lm-hero-copy" lang="ar">مش مجرد صورة على واتساب. احكيلنا عن المناسبة، ولمّة تعمل دعوة شبهكم — من أول ما ضيوفك يفتحوا اللينك.</p>
                <div className="lm-hero-actions"><Link className="lm-primary-button" href="/sign-in">اعملها مع لمّة <span>↗</span></Link><Link className="lm-quiet-link" href="#experiences">شوف التجارب <span>↓</span></Link></div>
              </div>
              <div className="lm-hero-invite" aria-label="مثال دعوة زفاف تفاعلية">
                <div className="lm-invite-label">A Lamma experience <span>01</span></div>
                <div className="lm-hero-invite-card"><span className="lm-script">Nour &amp; Ahmed</span><strong>We&apos;re<br />getting<br /><i>married</i></strong><small>Saturday · 24 October 2026<br />Cairo, Egypt</small><span className="lm-open">open invitation ↗</span></div>
              </div>
            </div>
            <div className="lm-hero-foot"><span>صمّم بالعربي أو English</span><span>Scroll to explore</span><span>01 / 06</span></div>
          </div>
        </section>

        <section className="lm-proof lm-wrap" aria-label="أرقام تجريبية أثناء التطوير" data-demo-content="true">
          <p className="lm-kicker">لمّة لسه بتبدأ · demo signals</p>
          <div className="lm-proof-grid"><div><strong>12K<span>+</span></strong><small>دعوة اتعملت</small></div><div><strong>350K<span>+</span></strong><small>مرة اتفتح فيها لينك</small></div><div><strong>98</strong><small>بلد وصلتلها الدعوات</small></div><div className="lm-proof-note">أرقام تجريبية — هنبدّلها ببيانات حقيقية قريب.</div></div>
        </section>

        <section className="lm-statement lm-wrap"><div><p className="lm-kicker">دعوة تعيش أكتر من لحظة</p><h2>من أول ما يفتحوا اللينك،<br /><em>المناسبة بدأت.</em></h2></div><p lang="ar">كل مناسبة ليها شكلها. لمّة بتخلي التفاصيل، الصورة، والكلام يتحركوا مع بعض في تجربة تليق باليوم.</p></section>

        <section className="lm-experiences" id="experiences"><div className="lm-wrap"><div className="lm-section-head"><div><p className="lm-kicker">تجارب مش templates</p><h2>كل دعوة<br /><em>لها نبرة.</em></h2></div><Link className="lm-text-link" href="/sign-in">شوف كل التجارب <span>↗</span></Link></div><div className="lm-specimens">{specimens.map((item) => <article className={`lm-specimen ${item.tone}`} key={item.title}><div className="lm-specimen-image" style={{ backgroundImage: `url(${item.image})` }} /><div className="lm-specimen-info"><span>{item.type}</span><h3>{item.title}</h3><p>{item.meta}</p><Link href="/sign-in">افتح التجربة ↗</Link></div></article>)}</div></div></section>

        <section className="lm-ai lm-wrap"><div className="lm-ai-copy"><p className="lm-kicker">مش عارف تبدأ منين؟</p><h2>احكيلنا عن المناسبة،<br /><em>ولمّة تفهم الباقي.</em></h2><p lang="ar">اكتبها بطريقتك: «عشا صغير للناس اللي وقفوا جنبنا» أو «حفلة تخرج على البحر». هنقترح لك اتجاه يشبه الإحساس.</p><Link className="lm-primary-button lm-button-dark" href="/sign-in">خلي لمّة تعملها <span>↗</span></Link></div><div className="lm-ai-demo" aria-label="عرض توضيحي لتحويل فكرة إلى دعوة"><div className="lm-prompt"><span>your starting point</span><p>“Dinner for the people who got us here.”</p></div><div className="lm-transform"><span>لمّة تقترح</span><strong>Quietly<br /><i>intimate</i></strong><small>mood · warm · evening · personal</small></div><div className="lm-ai-card"><span>دعوة عشا</span><strong>See you<br /><i>around the table</i></strong><small>Saturday, 12 September<br />Zamalek · 8:00 pm</small></div></div></section>

        <section className="lm-occasions lm-wrap"><div className="lm-occasion-intro"><p className="lm-kicker">إيه المناسبة؟</p><h2>قول لنا<br /><em>ونبدأ.</em></h2><p lang="ar">فرح، خطوبة، كتب كتاب، أو حاجة تانية خالص. كل يوم مهم له دعوة تليق بيه.</p></div><div className="lm-occasion-list">{occasions.map(([ar, en, copy], index) => <Link href="/sign-in" className="lm-occasion" key={en}><span>0{index + 1}</span><strong>{ar}</strong><small>{en}</small><em>{copy}</em><b>↗</b></Link>)}</div></section>

        <section className="lm-how"><div className="lm-wrap"><p className="lm-kicker">سهّلناها عليك</p><h2>من الفكرة<br /><em>للدعوة الجاهزة.</em></h2><div className="lm-how-grid"><article><span>01</span><h3>احكيلنا</h3><p>قول لنا إيه المناسبة، إمتى، وفين — براحتك.</p></article><article><span>02</span><h3>ظبطها على مزاجك</h3><p>اختار الإحساس، وعدّل الكلام والتفاصيل لحد ما تبقى شبهكم.</p></article><article><span>03</span><h3>ابعتها على واتساب</h3><p>الدعوة جاهزة؟ انسخ اللينك وخلي اللمّة تبدأ.</p></article></div></div></section>

        <section className="lm-testimonial lm-wrap" data-demo-content="true"><div className="lm-quote-mark">“</div><blockquote>دعوة شكلها حلو، بس الأهم إنها حسّت الناس إنهم جزء من اليوم.</blockquote><p>مساحة شهادة عميل حقيقية — قريبًا.</p><span>Demo testimonial · not a production claim</span></section>

        <section className="lm-final-cta"><div className="lm-wrap"><p className="lm-kicker">جاهز تبدأ؟</p><h2>دعوة شبهكم،<br /><em>مش شبه أي حد.</em></h2><p lang="ar">اعمل أول دعوة مع لمّة وخلي المناسبة تبدأ بدري.</p><Link className="lm-dark-button" href="/sign-in">ابدأ دعوتك <span>↗</span></Link></div></section>
        <footer className="lm-footer lm-wrap"><Link className="lm-brand" href="/">Lamma</Link><span>لمّة · invitations for every reason to gather</span><div><Link href="/sign-in">Create</Link><Link href="/sign-in">Sign in</Link><Link href="/sign-in">العربي</Link></div></footer>
      </main>
    </AppFrame>
  );
}
