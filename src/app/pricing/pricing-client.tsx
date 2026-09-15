"use client";

import React from "react";
import Link from "next/link";
import { useMarketingLocale } from "@/components/marketing/marketing-locale-context";
import { FaqAccordion, defaultFaqItems } from "@/components/marketing/faq-accordion";
import { BotanicalCorner, BurgundyLineMotif } from "@/components/marketing/wedding-decorations";

export function PricingClient() {
  const { isAr } = useMarketingLocale();

  const pricingFaq = defaultFaqItems.filter((item) =>
    ["pricing", "general", "concierge"].includes(item.category || "")
  );

  const comparisonFeatures = [
    {
      nameAr: "دعوة رقمية كاملة متجاوبة مع الموبايل",
      nameEn: "Full mobile-responsive digital invitation",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "فتح الغلاف بختم شمعي تفاعلي",
      nameEn: "Interactive wax-seal envelope reveal",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "معرض الصور (حتى ١٥ صورة عالية الجودة)",
      nameEn: "Photo gallery (up to 15 high-res photos)",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "محطات قصة حبكم (Our Story)",
      nameEn: "Milestones story chapters",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "العد التنازلي التفاعلي المباشر",
      nameEn: "Dynamic live countdown timer",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "موقع القاعة وخريطة جوجل بنقرة واحدة",
      nameEn: "One-tap Google Maps venue location",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "تعديل فوري غير محدود للبيانات في أي وقت",
      nameEn: "Unlimited instant updates to your invitation",
      essential: true,
      concierge: true,
    },
    {
      nameAr: "مصمم مخصص ينسق الصور ويكتب الترحيب بالكامل",
      nameEn: "Dedicated designer formats and styles everything",
      essential: false,
      concierge: true,
    },
    {
      nameAr: "تدقيق لغوي وصياغة عبارات ترحيب راقية",
      nameEn: "Copywriting and refined welcome message curation",
      essential: false,
      concierge: true,
    },
    {
      nameAr: "رابط مراجعة خاص وتعديلات مرنة حتى الرضا التام",
      nameEn: "Private preview link and flexible revisions",
      essential: false,
      concierge: true,
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20 bg-[#FAF8F6] text-[#1A1615] lm-paper-grain">
      {/* Header */}
      <div className="lm-market-container text-center space-y-4 max-w-2xl mx-auto relative">
        <div className="absolute -top-8 -end-8 w-24 h-24 hidden sm:block opacity-60">
          <BotanicalCorner />
        </div>
        <span className="lm-editorial-kicker">{isAr ? "خيارات التجربة" : "INVITATION EXPERIENCES"}</span>
        <h1 className="lm-editorial-headline">
          {isAr ? (
            <>
              باقات تليق <em>بمناسبتكم</em>
            </>
          ) : (
            <>
              Experiences for <em>Your Celebration</em>
            </>
          )}
        </h1>
        <p className="lm-editorial-sub max-w-xl mx-auto text-sm sm:text-base">
          {isAr
            ? "التصميم والمعاينة مجانية بالكامل. الدفع لمرة واحدة لمناسبتكم بدون أي اشتراكات شهرية أو رسوم خفية."
            : "Design and preview 100% free. Pay once for your celebration with no recurring subscriptions or hidden fees."}
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <BurgundyLineMotif />
        </div>
      </div>

      {/* Two Clear Service Level Cards (Occasion-Based, Not SaaS) */}
      <div className="lm-market-container grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Level 1: Self-Service Invitation Experience */}
        <div className="rounded-3xl bg-white border border-[var(--lm-border)] p-8 sm:p-10 flex flex-col justify-between shadow-xl hover:border-[var(--lm-burgundy-border)] transition-all">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--lm-muted)]">
                {isAr ? "الخدمة الذاتية" : "Self-Service"}
              </span>
              <h2 className="text-2xl font-bold text-[var(--lm-ink)]">
                {isAr ? "صمموها بنفسكم" : "Craft It Yourself"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--lm-ink-secondary)] leading-relaxed">
                {isAr
                  ? "للعرسان اللي حابين يختاروا صورهم ويكتبوا تفاصيلهم بنفسهم بخطوات سهلة وممتعة."
                  : "For couples who enjoy assembling their story, choosing photos, and reviewing live."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--lm-surface-warm)] border border-[var(--lm-border)] text-start">
              <p className="text-xs font-bold text-[var(--lm-burgundy)]">
                {isAr ? "البداية والمعاينة مجانًا" : "Free to Design & Preview"}
              </p>
              <p className="text-xs text-[var(--lm-muted)] mt-1">
                {isAr ? "الدفع مرة واحدة عند النشر للمدعوين" : "One-time payment upon final publishing"}
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[var(--lm-ink-secondary)]">
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "دعوة رقمية كاملة برابط مباشر" : "Full digital invitation with custom link"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "فتح الغلاف بختم شمعي تفاعلي" : "Interactive wax-seal envelope unfold"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "العد التنازلي المباشر وموقع القاعة" : "Live countdown timer & map GPS link"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "معرض صور حتى ١٥ صورة وفصول الحكاية" : "Gallery up to 15 photos & story milestones"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "تعديل فوري في أي وقت لنفس الرابط" : "Instant updates anytime on the same link"}</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/create"
              className="lm-btn-secondary w-full text-center text-xs sm:text-sm py-3 font-bold"
            >
              {isAr ? "ابدأوا مجانًا الآن" : "Start Free Now"}
            </Link>
          </div>
        </div>

        {/* Level 2: Made For You Concierge Service */}
        <div className="rounded-3xl bg-white border-2 border-[var(--lm-burgundy)] p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative">
          <span className="absolute -top-3.5 start-8 rounded-full bg-[var(--lm-burgundy)] px-4 py-1 text-xs font-bold text-white shadow-md">
            {isAr ? "خدمة خاصة متكاملة" : "Full Concierge"}
          </span>

          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--lm-burgundy)]">
                {isAr ? "سيبوها علينا" : "Made For You"}
              </span>
              <h2 className="text-2xl font-bold text-[var(--lm-ink)]">
                {isAr ? "فريق التصميم يتولى كل شيء" : "Designer Hand-Crafted"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--lm-ink-secondary)] leading-relaxed">
                {isAr
                  ? "للعرسان المشغولين؛ ابعتولنا الصور والتفاصيل، ومصممنا ينسق الدعوة ويكتب الترحيب باحترافية."
                  : "For busy couples; send us your photos, and our designers craft, curate, and format everything."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--lm-burgundy-soft)] border border-[var(--lm-burgundy-border)] text-start">
              <p className="text-xs font-bold text-[var(--lm-burgundy)]">
                {isAr ? "راحة تامة واهتمام بأدق تفصيلة" : "Complete Peace of Mind"}
              </p>
              <p className="text-xs text-[var(--lm-muted)] mt-1">
                {isAr ? "رابط معاينة خاص وتعديلات حتى ترضوا تمامًا" : "Private review link with dedicated revisions"}
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[var(--lm-ink-secondary)]">
              <li className="flex items-center gap-2.5 font-semibold text-[var(--lm-burgundy)]">
                <span>✦</span>
                <span>{isAr ? "كل مزايا الدعوة الكاملة متضمنة" : "All full invitation features included"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "مصمم مخصص ينسق ألوان وصور الدعوة" : "Dedicated designer arranges crops & palette"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "صياغة وتدقيق عبارات الترحيب والأشعار" : "Bespoke copywriting and invitation wording"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "مراجعات مرنة حتى الرضا التام ١٠٠٪" : "Unlimited revisions until 100% satisfied"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[var(--lm-burgundy)] font-bold">✓</span>
                <span>{isAr ? "تسليم رسالة واتساب جاهزة للإرسال فورًا" : "Ready-to-send WhatsApp invitation copy"}</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/made-for-you"
              className="lm-btn-primary w-full text-center text-xs sm:text-sm py-3 font-bold group"
            >
              <span>{isAr ? "تواصلوا مع خدمة التصميم الخاص" : "Request Concierge Service"}</span>
              <span className="lm-cta-arrow text-base">✦</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="lm-market-container max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold text-center text-[var(--lm-ink)]">
          {isAr ? "مقارنة المزايا بالتفصيل" : "Detailed Feature Comparison"}
        </h3>
        <div className="rounded-3xl border border-[var(--lm-border)] bg-white overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-[var(--lm-surface-warm)] border-b border-[var(--lm-border)]">
                <tr>
                  <th className="p-4 sm:p-5 font-bold text-[var(--lm-ink)]">{isAr ? "الميزة" : "Feature"}</th>
                  <th className="p-4 sm:p-5 font-bold text-center text-[var(--lm-ink)]">{isAr ? "صمموها بنفسكم" : "Self-Service"}</th>
                  <th className="p-4 sm:p-5 font-bold text-center text-[var(--lm-burgundy)]">{isAr ? "سيبوها علينا" : "Made For You"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border-subtle)]">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[var(--lm-surface-warm)]/50 transition">
                    <td className="p-4 sm:p-5 font-medium text-[var(--lm-ink-secondary)]">
                      {isAr ? row.nameAr : row.nameEn}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold">
                      {row.essential ? (
                        <span className="text-emerald-700">✓</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-[var(--lm-burgundy)]">
                      {row.concierge ? <span>✓</span> : <span>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Digital vs Paper Value Callout */}
      <div className="lm-market-container max-w-4xl mx-auto">
        <div className="rounded-3xl bg-white border border-[var(--lm-burgundy-border)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-start">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--lm-burgundy)]">
              {isAr ? "مقارنة القيمة" : "VALUE COMPARISON"}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-[var(--lm-ink)]">
              {isAr ? "بالمقارنة مع طباعة وتوصيل الكروت الورقية" : "Compared to Traditional Printed Cards"}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--lm-muted)] max-w-xl">
              {isAr
                ? "توفرون تكاليف طباعة مئات النسخ والشحن اليدوي، وتتجنبون أي رسوم إعادة طباعة عند تعديل المواعيد أو العناوين، مع إرسال مباشر غير محدود لجميع المعازيم على واتساب."
                : "Save significant printing and delivery costs while avoiding reprint expenses when details change. Share effortlessly with all guests on WhatsApp."}
            </p>
          </div>
          <Link
            href="/#digital-vs-paper"
            className="lm-btn-secondary text-xs sm:text-sm py-2.5 px-6 shrink-0 font-bold"
          >
            {isAr ? "احسبوا التكلفة والوفر" : "View Cost Estimator"} →
          </Link>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div className="lm-market-container max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="lm-editorial-kicker">{isAr ? "استفسارات الأسعار" : "COMMON QUESTIONS"}</span>
          <h3 className="text-2xl font-bold text-[var(--lm-ink)]">
            {isAr ? "كل ما تودون معرفته عن الأسعار" : "Pricing Questions Answered"}
          </h3>
        </div>
        <FaqAccordion items={pricingFaq} />
      </div>
    </div>
  );
}
