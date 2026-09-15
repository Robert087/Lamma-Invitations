"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMarketingLocale } from "@/components/marketing/marketing-locale-context";
import { BotanicalCorner, BurgundyLineMotif } from "@/components/marketing/wedding-decorations";

export function MadeForYouClient() {
  const { isAr } = useMarketingLocale();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [coupleNames, setCoupleNames] = useState("");
  const [phone, setPhone] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const steps = [
    {
      num: "١",
      titleAr: "ابعتولنا الصور وتفاصيل الفرح",
      titleEn: "Share Your Photos & Details",
      descAr: "شاركوا صور جلسة التصوير (Photo Session)، أسامي العروسين، وميعاد ومكان الفرح ورابط اللوكيشن.",
      descEn: "Share your photoshoot images, couple names, venue GPS link, event dates, and special requests.",
    },
    {
      num: "٢",
      titleAr: "مصممنا ينسق كل تفصيلة",
      titleEn: "Designer Curates Everything",
      descAr: "مصمم مخصص من فريقنا يختار أفضل اللقطات، وينسق الألوان ويصيغ عبارات الترحيب لتظهر دعوتكم بأعلى ذوق.",
      descEn: "A dedicated designer curates typography, arranges photo crops, and crafts the presentation.",
    },
    {
      num: "٣",
      titleAr: "معاينة خاصة ومراجعات مرنة",
      titleEn: "Private Preview & Revisions",
      descAr: "نرسل لكم رابطًا سريًا لمعاينة الدعوة على هواتفكم، ونقوم بأي تعديلات تفضلونها حتى ترضوا تمامًا ١٠٠٪.",
      descEn: "We share a private review link for you to test on mobile, making any adjustments until completely satisfied.",
    },
    {
      num: "٤",
      titleAr: "تسليم الرابط النهائي جاهز للإرسال",
      titleEn: "Ready-To-Send WhatsApp Link",
      descAr: "نسلمكم الرابط المباشر مع نص رسالة ترحيبية أنيقة جاهزة لإرسالها على واتساب لكل المعازيم فورا.",
      descEn: "We hand over your custom live link along with a tailored WhatsApp invitation message.",
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20 bg-[#FAF8F6] text-[#1A1615] lm-paper-grain">
      {/* Header */}
      <div className="lm-market-container text-center space-y-4 max-w-2xl mx-auto relative">
        <div className="absolute -top-8 -end-8 w-24 h-24 hidden sm:block opacity-60">
          <BotanicalCorner />
        </div>
        <span className="lm-editorial-kicker">{isAr ? "خدمة التصميم الخاص" : "CONCIERGE SERVICE"}</span>
        <h1 className="lm-editorial-headline">
          {isAr ? (
            <>
              تحبّوا نعملهالكم؟ <em>سيبوها علينا</em>.
            </>
          ) : (
            <>
              Too Busy? <em>Let Us Create It</em>.
            </>
          )}
        </h1>
        <p className="lm-editorial-sub max-w-lg mx-auto text-sm sm:text-base">
          {isAr
            ? "مش فاضيين لتنسيق الصور والكتابة؟ فريق التصميم في لمّة يتولى صياغة وتجهيز دعوتكم بالكامل من الألف للياء."
            : "No time to arrange photos or format text? Our team will curate and craft your luxury digital invitation."}
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <BurgundyLineMotif />
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="lm-market-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
        <div className="lg:col-span-7 space-y-6 text-start">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--lm-burgundy)]">
            {isAr ? "لمن هذه الخدمة؟" : "WHO IS THIS FOR?"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--lm-ink)] leading-snug">
            {isAr ? "لكل عريس وعروسة مشغولين بتفاصيل الفرح" : "For Busy Couples Who Value Time"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--lm-ink-secondary)] leading-relaxed">
            {isAr
              ? "تجهيزات الفرح مليانة تفاصيل ومشاوير. خدمة 'سيبوها علينا' صُممت عشان تشيل من عليكم عبء التنسيق وتضمن إن النتيجة تطلع فخمة وتشرّفكم قدام المعازيم بدون أي مجهود منكم."
              : "Wedding preparations are demanding. Our concierge service removes the burden of formatting and design, ensuring an impeccable result that wows your guests."}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--lm-ink)]">
              {isAr ? "ماذا تشمل الخدمة؟" : "What Is Included?"}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--lm-ink-secondary)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--lm-burgundy)] font-bold">✦</span>
                <span>{isAr ? "اختيار أفضل كادرات لصوركم وتنسيق ألوانها" : "Expert photo curation & color calibration"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--lm-burgundy)] font-bold">✦</span>
                <span>{isAr ? "كتابة وتدقيق كلمات الدعوة وفصول القصة" : "Bespoke copywriting for your love story chapters"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--lm-burgundy)] font-bold">✦</span>
                <span>{isAr ? "تجهيز خريطة القاعة والعد التنازلي التفاعلي" : "Full GPS map & live countdown setup"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--lm-burgundy)] font-bold">✦</span>
                <span>{isAr ? "مراجعات مرنة حتى الرضا التام ١٠٠٪" : "Unlimited revisions until 100% satisfied"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[var(--lm-surface-warm)] border border-[var(--lm-border)] shadow-xl">
          <Image
            src="/marketing/b1.png"
            alt="خدمة التصميم الخاص من لمّة"
            fill
            className="object-cover object-center"
            sizes="500px"
          />
        </div>
      </div>

      {/* 4 Steps Journey */}
      <div className="lm-market-container max-w-4xl mx-auto space-y-8">
        <h3 className="text-2xl font-bold text-center text-[var(--lm-ink)]">
          {isAr ? "خطوات بسيطة ومريحة" : "The Seamless Concierge Process"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-[var(--lm-border)] p-6 sm:p-8 space-y-3 shadow-lg hover:border-[var(--lm-burgundy-border)] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-[var(--lm-burgundy-soft)] border border-[var(--lm-burgundy-border)] text-[var(--lm-burgundy)] text-xs font-bold grid place-items-center">
                  {s.num}
                </span>
                <h4 className="text-lg font-bold text-[var(--lm-ink)]">
                  {isAr ? s.titleAr : s.titleEn}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[var(--lm-ink-secondary)] leading-relaxed">
                {isAr ? s.descAr : s.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Request Form Box */}
      <div className="lm-market-container max-w-2xl mx-auto">
        <div className="rounded-3xl bg-white border border-[var(--lm-burgundy-border)] p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="lm-editorial-kicker">{isAr ? "ابدأوا التواصل" : "GET IN TOUCH"}</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--lm-ink)]">
              {isAr ? "اطلبوا خدمة التصميم الخاص" : "Request Concierge Design"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--lm-muted)]">
              {isAr
                ? "املأوا البيانات وسيتواصل معكم مصممنا مباشرة على واتساب لبدء التجهيز."
                : "Fill out the details and our design concierge will reach out on WhatsApp."}
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <span className="text-3xl">💌</span>
              <h4 className="text-base font-bold text-emerald-900">
                {isAr ? "تم استلام طلبكم بكل حب!" : "Request Received With Love!"}
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                {isAr
                  ? "سيتواصل معكم مصممنا المخصص على واتساب خلال ساعات قليلة لاستلام الصور والبدء في تجهيز دعوتكم."
                  : "Our designer will contact you via WhatsApp shortly to collect your media and start crafting your invitation."}
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="lm-btn-secondary text-xs py-2 px-6 inline-flex"
                >
                  {isAr ? "العودة للرئيسية" : "Back to Home"}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-start">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--lm-ink)]">
                  {isAr ? "أسماء العروسين *" : "Couple Names *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: أحمد وسلمى" : "e.g., Ahmed & Salma"}
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  className="w-full rounded-xl border border-[var(--lm-border)] px-4 py-2.5 text-xs sm:text-sm focus:border-[var(--lm-burgundy)] focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "رقم الواتساب *" : "WhatsApp Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={isAr ? "+20 1X XXXX XXXX" : "+20 1X XXXX XXXX"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--lm-border)] px-4 py-2.5 text-xs sm:text-sm focus:border-[var(--lm-burgundy)] focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "تاريخ الفرح التقريبي" : "Approx. Wedding Date"}
                  </label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full rounded-xl border border-[var(--lm-border)] px-4 py-2.5 text-xs sm:text-sm focus:border-[var(--lm-burgundy)] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--lm-ink)]">
                  {isAr ? "ملاحظات أو رغبات خاصة (اختياري)" : "Special Requests (Optional)"}
                </label>
                <textarea
                  rows={3}
                  placeholder={isAr ? "مثال: بنحب الألوان الهادية ونفضل الستايل المينيمال..." : "e.g. We love soft blush tones and minimal typography..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-[var(--lm-border)] px-4 py-2.5 text-xs sm:text-sm focus:border-[var(--lm-burgundy)] focus:outline-none transition resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="lm-btn-primary w-full text-center text-xs sm:text-sm py-3.5 font-bold group shadow-md"
                >
                  <span>{isAr ? "إرسال الطلب لفريق التصميم" : "Submit Concierge Request"}</span>
                  <span className="lm-cta-arrow text-base">✦</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
