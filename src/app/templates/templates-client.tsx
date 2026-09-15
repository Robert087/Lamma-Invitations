"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMarketingLocale } from "@/components/marketing/marketing-locale-context";
import { PhonePreviewModal } from "@/components/marketing/phone-preview-modal";
import { demoWeddingInvitation, demoAlexandriaInvitation } from "@/components/marketing/demo-invitation";
import { BotanicalCorner, BurgundyLineMotif } from "@/components/marketing/wedding-decorations";

export function TemplatesClient() {
  const { isAr } = useMarketingLocale();
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(demoWeddingInvitation);

  const templateCollections = [
    {
      id: "romantic",
      titleAr: "طابع الورود واللمسة الرومانسية",
      titleEn: "Romantic & Floral Elegance",
      subtitleAr: "ألوان بودرية ناعمة، خامات دافئة، وزهور رقيقة",
      subtitleEn: "Blush palettes, gentle florals, and romantic intimacy",
      image: "/marketing/b1.png",
      tagAr: "الأكثر رومانسية",
      tagEn: "Romantic",
      coupleAr: "عمر وسلمى",
      coupleEn: "Omar & Salma",
      invitation: demoWeddingInvitation,
    },
    {
      id: "minimal",
      titleAr: "المينيمال العصري والخطوط الهادئة",
      titleEn: "Contemporary Minimalist",
      subtitleAr: "مساحات تنفس واسعة وأناقة هادئة بدون بهرجة",
      subtitleEn: "Generous whitespace, quiet elegance, and modern type",
      image: "/marketing/b3.png",
      tagAr: "بسيط وأنيق",
      tagEn: "Minimal",
      coupleAr: "كريم ونور",
      coupleEn: "Karim & Nour",
      invitation: demoAlexandriaInvitation,
    },
    {
      id: "editorial",
      titleAr: "الستايل السينمائي (مجلات الموضة)",
      titleEn: "High-Fashion Editorial",
      subtitleAr: "تباين ضوئي ساحر وروح سينمائية للأفراح الكبيرة",
      subtitleEn: "Cinematic grandeur, bold contrast, and editorial luxury",
      image: "/marketing/b2.png",
      tagAr: "سينمائي فاخر",
      tagEn: "Editorial",
      coupleAr: "مايا وعمر",
      coupleEn: "Maya & Omar",
      invitation: demoWeddingInvitation,
    },
    {
      id: "bold",
      titleAr: "الدفء المتوسطي وأزهار البوغانفيليا",
      titleEn: "Mediterranean & Bougainvillea",
      subtitleAr: "درجات التيراكوتا والدفء الترحيبي لأفراح مميزة",
      subtitleEn: "Terracotta warmth, vibrant florals, and festive joy",
      image: "/marketing/b4.png",
      tagAr: "ألوان حية",
      tagEn: "Vibrant",
      coupleAr: "فرح وأحمد",
      coupleEn: "Farah & Ahmed",
      invitation: demoAlexandriaInvitation,
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20 bg-[#FAF8F6] text-[#1A1615] lm-paper-grain">
      {/* Editorial Lookbook Header */}
      <div className="lm-market-container text-center space-y-4 max-w-2xl mx-auto relative">
        <div className="absolute -top-8 -end-8 w-24 h-24 hidden sm:block opacity-60">
          <BotanicalCorner />
        </div>
        <span className="lm-editorial-kicker">
          {isAr ? "كتالوج التصاميم الفاخرة" : "TEMPLATES LOOKBOOK"}
        </span>
        <h1 className="lm-editorial-headline">
          {isAr ? (
            <>
              تصاميم تليق <em>بليلة العمر</em>
            </>
          ) : (
            <>
              Bespoke Designs for <em>Your Big Night</em>
            </>
          )}
        </h1>
        <p className="lm-editorial-sub max-w-lg mx-auto text-sm sm:text-base">
          {isAr
            ? "كل تصميم يمثل هوية زفاف متكاملة؛ تبدأ من لحظة فتح الختم الشمعي وحتى وصول الضيف لباب القاعة، في رابط رقمي شيك."
            : "Every design embodies a cohesive wedding identity, from wax-seal envelope reveals to instant GPS venue navigation."}
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <BurgundyLineMotif />
        </div>
      </div>

      {/* Featured Production Design: Signature Wedding Experience */}
      <div className="lm-market-container">
        <div className="rounded-3xl border border-[var(--lm-burgundy-border)] bg-white p-6 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-[var(--lm-burgundy)] px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                {isAr ? "التصميم المميز" : "Signature Experience"}
              </span>
              <span className="text-xs font-bold text-[var(--lm-muted)] uppercase tracking-wider">
                {isAr ? "حفلات الزفاف والخطوبة" : "Weddings & Engagements"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--lm-ink)] leading-snug">
              {isAr ? "القصة السينمائية المتكاملة" : "The Cinematic Wedding Story"}
            </h2>

            <p className="text-sm sm:text-base text-[var(--lm-ink-secondary)] leading-relaxed">
              {isAr
                ? "التجربة الأكثر اكتمالاً وطلبًا لحفلات الزفاف. تجمع بين طقس فتح الغلاف بالختم الشمعي، ومحطات قصة حبكم، والعد التنازلي التفاعلي، ومعرض الصور عالي الجودة وخريطة القاعة."
                : "Our signature luxury experience. Features an interactive wax-seal envelope reveal, milestone relationship chapters, live countdown timer, photo gallery, and one-tap venue directions."}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--lm-burgundy)]">
                {isAr ? "عناصر التجربة المتضمنة:" : "Included Guest Experience:"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-semibold text-[var(--lm-ink-secondary)]">
                <span className="flex items-center gap-2">
                  <span className="text-[var(--lm-burgundy)]">✦</span> {isAr ? "فتح الغلاف بختم تفاعلي" : "Wax-Seal Envelope Reveal"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--lm-burgundy)]">✦</span> {isAr ? "صياغة الترحيب والأسماء" : "Arabic Typography & Names"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--lm-burgundy)]">✦</span> {isAr ? "العد التنازلي المباشر" : "Dynamic Countdown Timer"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--lm-burgundy)]">✦</span> {isAr ? "محطات قصة حبكم" : "Milestone Story Chapters"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--lm-burgundy)]">✦</span> {isAr ? "معرض الصور (حتى ١٥ صورة)" : "Photo Gallery (Up to 15)"}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[var(--lm-burgundy)]">✦</span> {isAr ? "خريطة القاعة بنقرة واحدة" : "One-Tap Google Maps Link"}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/create"
                className="lm-btn-primary text-xs sm:text-sm py-3 px-8 shadow-md group"
              >
                <span>{isAr ? "ابدأوا بهذا التصميم" : "Choose This Design"}</span>
                <span className="lm-cta-arrow text-base">✦</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSelectedDemo(demoWeddingInvitation);
                  setDemoOpen(true);
                }}
                className="lm-btn-secondary text-xs sm:text-sm py-3 px-7"
              >
                {isAr ? "شوفوا الدعوة كاملة" : "View Full Live Demo"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[var(--lm-surface-warm)] border border-[var(--lm-border)] shadow-lg">
            <Image
              src="/marketing/b1.png"
              alt="Cinematic Wedding Story"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 500px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Aesthetic Lookbook Grid */}
      <div className="lm-market-container space-y-10">
        <div className="text-start space-y-2 max-w-xl">
          <span className="lm-editorial-kicker">{isAr ? "ألبوم الأنماط" : "STYLE LOOKBOOK"}</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--lm-ink)]">
            {isAr ? "اختر النمط الأقرب لشخصيتكم" : "Find The Style That Fits You"}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--lm-muted)]">
            {isAr
              ? "مزيج متناغم من الخطوط الراقية والألوان التي تعبر عن بهجة ليلتكم."
              : "Harmonious typography and palettes tailored to reflect your celebration."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
          {templateCollections.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl bg-white border border-[var(--lm-border)] p-6 sm:p-8 space-y-5 shadow-lg hover:border-[var(--lm-burgundy-border)] transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[var(--lm-surface-warm)] border border-[var(--lm-border)] shadow-inner">
                <Image
                  src={t.image}
                  alt={isAr ? t.titleAr : t.titleEn}
                  fill
                  className="object-cover"
                  sizes="600px"
                />
                <span className="absolute top-3.5 start-3.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-[var(--lm-burgundy)] shadow-sm">
                  {isAr ? t.tagAr : t.tagEn}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[var(--lm-ink)]">
                    {isAr ? t.titleAr : t.titleEn}
                  </h3>
                  <span className="text-xs font-semibold text-[var(--lm-muted)]">
                    {isAr ? t.coupleAr : t.coupleEn}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--lm-ink-secondary)] leading-relaxed">
                  {isAr ? t.subtitleAr : t.subtitleEn}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/create"
                  className="lm-btn-primary text-xs py-2 px-5 flex-1 text-center"
                >
                  {isAr ? "صمم دعوتك بهذا الستايل" : "Use This Style"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDemo(t.invitation);
                    setDemoOpen(true);
                  }}
                  className="lm-btn-secondary text-xs py-2 px-4"
                >
                  {isAr ? "معاينة حية" : "Live Demo"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Burgundy Editorial Closing Box */}
      <div className="lm-market-container">
        <div className="rounded-3xl bg-[#250612] text-[#FAF8F6] p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
            {isAr ? (
              <>
                جاهزون لبدء تصميم <span className="text-[var(--lm-gold)] font-serif italic">دعوتكم</span>؟
              </>
            ) : (
              <>
                Ready to craft your <span className="text-[var(--lm-gold)] font-serif italic">invitation</span>?
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            {isAr
              ? "ابدأوا الآن مجانًا بدون أي تسجيل إجباري وعاينوا دعوتكم كاملة على الموبايل."
              : "Start free today with no commitment and no forced sign-up."}
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="lm-btn-primary text-xs sm:text-sm py-3.5 px-9 inline-flex shadow-xl group"
            >
              <span>{isAr ? "ابدأوا دعوتكم مجانًا الآن" : "Start Your Free Invitation"}</span>
              <span className="lm-cta-arrow text-base">✦</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Full Demo Modal */}
      <PhonePreviewModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        invitation={selectedDemo}
        title={isAr ? "معاينة حية للدعوة" : "Live Invitation Demo"}
      />
    </div>
  );
}
