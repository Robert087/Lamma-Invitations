"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { InvitationRenderer } from "@/features/invitations/renderer";
import { useMarketingLocale } from "./marketing-locale-context";
import { demoWeddingInvitation, demoAlexandriaInvitation } from "./demo-invitation";
import { PhonePreviewModal } from "./phone-preview-modal";
import { BotanicalCorner, BurgundyLineMotif, VineDivider, WaxSealStamp } from "./wedding-decorations";
import { ScrollReveal } from "./scroll-reveal";
import { DigitalVsPaperSection } from "./digital-vs-paper";

export function HomeSections() {
  const { isAr } = useMarketingLocale();
  const [isFullDemoOpen, setIsFullDemoOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(demoWeddingInvitation);
  const [activeVibeIndex, setActiveVibeIndex] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(0);

  // Desktop-only subtle tilt interaction (max 2-3 degrees)
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    // Check if desktop pointer with fine resolution
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Strict 2.5 degree max rotation
    const rotX = -y * 5;
    const rotY = x * 5;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`,
      transition: "transform 0.15s ease-out",
    });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  }, []);

  // Four authentic wedding vibes
  const weddingVibes = [
    {
      id: "romantic",
      titleAr: "رومانسي دافئ",
      titleEn: "Romantic & Floral",
      taglineAr: "لمسات زهور ناعمة وألوان دافئة تفيض بالمشاعر",
      taglineEn: "Soft floral touches and warm tender palettes",
      coupleAr: "عمر وسلمى",
      coupleEn: "Omar & Salma",
      dateAr: "٢٤ أكتوبر ٢٠٢٦",
      dateEn: "October 24, 2026",
      venueAr: "فورسيزونز نايل بلازا، القاهرة",
      venueEn: "Four Seasons Nile Plaza, Cairo",
      image: "/marketing/b1.png",
      badgeAr: "الأكثر طلبًا",
      badgeEn: "Most Loved",
    },
    {
      id: "minimal",
      titleAr: "بسيط وراقي",
      titleEn: "Clean & Minimal",
      taglineAr: "خطوط نقية وأناقة هادئة بدون بهرجة زائدة",
      taglineEn: "Pure lines, understated luxury, and timeless type",
      coupleAr: "كريم ونور",
      coupleEn: "Karim & Nour",
      dateAr: "١٤ نوفمبر ٢٠٢٦",
      dateEn: "November 14, 2026",
      venueAr: "سان ستيفانو، الإسكندرية",
      venueEn: "San Stefano, Alexandria",
      image: "/marketing/b3.png",
      badgeAr: "كلاسيك عصري",
      badgeEn: "Modern Classic",
    },
    {
      id: "editorial",
      titleAr: "مودرن سينمائي",
      titleEn: "Editorial Cinema",
      taglineAr: "أجواء مجلات الموضة بتباين راقي وإضاءة ساحرة",
      taglineEn: "High-fashion magazine atmosphere and cinematic elegance",
      coupleAr: "مايا وعمر",
      coupleEn: "Maya & Omar",
      dateAr: "٣ أكتوبر ٢٠٢٦",
      dateEn: "October 3, 2026",
      venueAr: "الجونة، البحر الأحمر",
      venueEn: "El Gouna, Red Sea",
      image: "/marketing/b2.png",
      badgeAr: "ستايل سينمائي",
      badgeEn: "Cinematic",
    },
    {
      id: "bold",
      titleAr: "دافئ وجريء",
      titleEn: "Vibrant & Bold",
      taglineAr: "ألوان طينية ودفء البحر المتوسط وأزهار الجهنمية",
      taglineEn: "Terracotta warmth, Mediterranean bougainvillea, and character",
      coupleAr: "فرح وأحمد",
      coupleEn: "Farah & Ahmed",
      dateAr: "٢١ نوفمبر ٢٠٢٦",
      dateEn: "November 21, 2026",
      venueAr: "القاهرة القديمة",
      venueEn: "Old Cairo",
      image: "/marketing/b4.png",
      badgeAr: "مفعم بالحياة",
      badgeEn: "Vibrant",
    },
  ];

  // Story milestones
  const storyMilestones = [
    {
      id: "meet",
      titleAr: "أول صدفة جمعتنا",
      titleEn: "First Encounter",
      dateAr: "صيف ٢٠٢٢",
      dateEn: "Summer 2022",
      descAr: "مكان هادي على النيل وضحكة غيرت كل خطط السنين الجاية.",
      descEn: "A calm evening by the Nile and a smile that shifted everything.",
    },
    {
      id: "proposal",
      titleAr: "يوم ما قلنا لبعض أيوه",
      titleEn: "The Proposal",
      dateAr: "ربيع ٢٠٢٤",
      dateEn: "Spring 2024",
      descAr: "وعدنا بعض قدام البحر إننا نبني بيت مليان أمان وحب.",
      descEn: "A sunset promise by the sea to build a lifetime of warmth.",
    },
    {
      id: "big-day",
      titleAr: "ليلة العمر وفرحتنا بيكم",
      titleEn: "The Big Day",
      dateAr: "خريف ٢٠٢٦",
      dateEn: "Autumn 2026",
      descAr: "اليوم اللي بنحتفل فيه سوا وسط أغلى الناس على قلوبنا.",
      descEn: "The night we unite our lives with all the people we cherish.",
    },
  ];

  // Keyboard navigation for vibe lookbook
  const handleVibeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        setActiveVibeIndex((prev) => (isAr ? Math.max(0, prev - 1) : Math.min(weddingVibes.length - 1, prev + 1)));
      } else if (e.key === "ArrowLeft") {
        setActiveVibeIndex((prev) => (isAr ? Math.min(weddingVibes.length - 1, prev + 1) : Math.max(0, prev - 1)));
      }
    },
    [isAr, weddingVibes.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleVibeKey);
    return () => window.removeEventListener("keydown", handleVibeKey);
  }, [handleVibeKey]);

  const activeVibe = weddingVibes[activeVibeIndex];

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF8F5] text-[#1A1615] lm-paper-grain">
      {/* ====================================================================
          SCENE 1: THE INTIMATE HERO SCENE
          Editorial layer: Wedding World + Digital Invitation + One Clear Action
          Coordinated Entrance: Image -> Invitation -> Flourish -> Headline/CTA
          ==================================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden">
        {/* Ambient Warm Gradient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5EBE6]/60 pointer-events-none" />

        <div className="lm-market-container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left/Start Column: Editorial Narrative & Decisive Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-start lm-anim-hero-copy">
              <span className="lm-editorial-kicker mb-4">
                {isAr ? "دعوات زفاف رقمية فاخرة • لمّة" : "DIGITAL WEDDING INVITATIONS • LAMMA"}
              </span>

              <h1 className="lm-editorial-headline mb-6 text-balance">
                {isAr ? (
                  <>
                    فرحكم يستاهل <em>أكتر</em> من مجرد رسالة.
                  </>
                ) : (
                  <>
                    Your wedding deserves <em>more</em> than a text message.
                  </>
                )}
              </h1>

              <p className="lm-editorial-sub max-w-xl mb-9">
                {isAr
                  ? "دعوة فرح تفاعلية راقية تجمع صوركم، حكايتكم، ومكان الاحتفال في رابط واحد شيك على واتساب. يعيش معازيمكم بهجة اليوم الكبير من أول لمسة لفتح الغلاف."
                  : "An interactive, bespoke wedding invitation bringing your photos, story milestones, and celebration details into a single refined link on WhatsApp."}
              </p>

              {/* The Two Direct Actions */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/create"
                  className="lm-btn-primary w-full sm:w-auto text-center group"
                >
                  <span>{isAr ? "ابدأ دعوتك" : "Start Your Invitation"}</span>
                  <span className="lm-cta-arrow text-lg">✦</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDemo(demoWeddingInvitation);
                    setIsFullDemoOpen(true);
                  }}
                  className="lm-btn-secondary w-full sm:w-auto text-center"
                >
                  {isAr ? "شوف دعوة كاملة" : "View Full Live Invitation"}
                </button>
              </div>

              {/* Couple & Occasion Trust Marker */}
              <div className="mt-10 pt-6 border-t border-[var(--lm-border)] flex items-center gap-6 text-xs text-[var(--lm-muted)] font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--lm-burgundy)]" />
                  <span>{isAr ? "بدون تسجيل دخول مبدئيًا" : "No sign-up required to begin"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--lm-gold)]" />
                  <span>{isAr ? "تصل مباشرة على واتساب" : "Opens seamlessly on WhatsApp"}</span>
                </div>
              </div>
            </div>

            {/* Right/End Column: Layered Wedding World + Live Invitation Instance with Desktop Tilt */}
            <div
              className="lg:col-span-5 relative lm-desktop-tilt-stage lm-anim-hero-stage"
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
              <div
                className="relative mx-auto max-w-[420px] lg:max-w-none lm-desktop-tilt-inner"
                style={tiltStyle}
              >
                {/* Delicate Botanical Corner Flourish */}
                <div className="absolute -top-7 -end-7 w-28 h-28 z-20 lm-anim-hero-flourish hidden sm:block">
                  <BotanicalCorner className="w-full h-full text-[var(--lm-burgundy)] opacity-85" />
                </div>

                {/* Atmospheric Wedding Editorial Backdrop Photo */}
                <div className="relative w-full h-[540px] sm:h-[620px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/60 lm-anim-hero-image">
                  <Image
                    src="/marketing/b1.png"
                    alt="دعوة زفاف لمّة الفاخرة"
                    fill
                    priority
                    className="object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
                  />
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Editorial Overlay Caption */}
                  <div className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[var(--lm-burgundy)]">
                          {isAr ? "دعوة فرح حقيقية" : "Live Wedding Invitation"}
                        </p>
                        <p className="text-sm font-bold text-[var(--lm-ink)]">
                          {isAr ? "أحمد وسلمى • القاهرة" : "Ahmed & Salma • Cairo"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDemo(demoWeddingInvitation);
                          setIsFullDemoOpen(true);
                        }}
                        className="rounded-full bg-[var(--lm-burgundy)] text-white px-3.5 py-1.5 text-xs font-bold shadow hover:bg-[var(--lm-burgundy-dark)] transition"
                      >
                        {isAr ? "جرب بنفسك" : "Experience"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating Invitation Seal Node */}
                <div className="absolute -top-6 -start-6 hidden sm:flex items-center gap-3 bg-white rounded-full py-2 px-4 shadow-xl border border-[var(--lm-border)]">
                  <div className="h-7 w-7 rounded-full bg-[var(--lm-burgundy)] text-white grid place-items-center text-xs font-bold">
                    💌
                  </div>
                  <span className="text-xs font-bold text-[var(--lm-ink)]">
                    {isAr ? "تفتح بختم شمعي تفاعلي" : "Wax-Seal Reveal Opening"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Burgundy Drawing Line Motif Transition */}
      <div className="lm-market-container max-w-xs mx-auto">
        <BurgundyLineMotif />
      </div>

      {/* ====================================================================
          SCENE 2: THE INVITATION MOMENT (The Interactive Envelope Opening)
          Product inside website: Guests experience the envelope opening
          ==================================================================== */}
      <ScrollReveal variant="fade-up">
      <section className="relative py-20 lg:py-32 bg-white border-y border-[var(--lm-border)]">
        <div className="lm-market-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="lm-editorial-kicker mb-3">
              {isAr ? "أول لمسة للضيف" : "THE GUEST EXPERIENCE"}
            </span>
            <h2 className="lm-section-headline mb-4">
              {isAr ? (
                <>
                  افتحوا الدعوة <em>وجربوها</em> بنفسكم
                </>
              ) : (
                <>
                  Open the invitation and <em>experience it</em> yourself
                </>
              )}
            </h2>
            <p className="lm-editorial-sub text-sm sm:text-base">
              {isAr
                ? "أول ما المعزوم يفتح اللينك على موبايله، مش بيشوف مجرد صورة ثابتة؛ بيعيش طقس فتح الغلاف بالختم الشمعي مع أنغام هادئة تلمس القلب."
                : "The moment guests open the link on mobile, they experience a deliberate wax-seal envelope unfold with ambient celebration."}
            </p>
          </div>

          {/* Interactive Live Opening Showcase Stage */}
          <div className="max-w-5xl mx-auto bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[var(--lm-border)] shadow-xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left/Start: Live Invitation Preview with InvitationRenderer */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-[340px] h-[520px] rounded-[2rem] overflow-hidden border border-[var(--lm-border)] bg-white shadow-2xl relative">
                  <div className="h-full overflow-y-auto overflow-x-hidden">
                    <InvitationRenderer
                      invitation={demoWeddingInvitation}
                      locale={isAr ? "ar" : "en"}
                      presentation="full"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[var(--lm-muted)] font-bold mt-3">
                  {isAr ? "👆 تفاعل مع الدعوة مباشرة على الشاشة" : "👆 Interact with the invitation directly"}
                </p>
              </div>

              {/* Right/End: Real Details & Ceremony */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-[var(--lm-border)] shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">💌</span>
                    <h3 className="text-base font-bold text-[var(--lm-ink)]">
                      {isAr ? "الختم الشمعي وطقس الفتح" : "Artisanal Wax-Seal Opening"}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--lm-muted)] leading-relaxed">
                    {isAr
                      ? "مش مجرد رسالة؛ انطباع أول يبهر ضيوفكم ويليق بقدر حضورهم ومشاركتهم الفرحة."
                      : "A deliberate first impression honoring your guests and setting the celebration mood."}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[var(--lm-border)] shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--lm-ink)]">
                        {isAr ? "عد تنازلي لحظة بلحظة" : "Live Countdown Timer"}
                      </h4>
                      <p className="text-xs text-[var(--lm-muted)]">
                        {isAr ? "يحسب الأيام والساعات بدقة حتى موعد اللقاء" : "Builds anticipation as the big day approaches"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[var(--lm-border)] shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--lm-ink)]">
                        {isAr ? "موقع القاعة بضغطة واحدة" : "Instant Map Directions"}
                      </h4>
                      <p className="text-xs text-[var(--lm-muted)]">
                        {isAr ? "خرائط جوجل مباشرة ترشد الضيوف بدون توهان" : "Direct GPS directions straight to the venue"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[var(--lm-border)] shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💍</span>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--lm-ink)]">
                        {isAr ? "حكاية العروسين وصورهم" : "Couple Story & Gallery"}
                      </h4>
                      <p className="text-xs text-[var(--lm-muted)]">
                        {isAr ? "معرض صور ومحطات تحكي قصة حبكم للكل" : "Cherished memories shared with your closest circle"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ====================================================================
          PERSUASIVE DIGITAL VS PAPER SECTION & COST CALCULATOR
          Clear cost and practical value framing for couples
          ==================================================================== */}
      <ScrollReveal variant="fade-up">
        <DigitalVsPaperSection />
      </ScrollReveal>

      {/* ====================================================================
          SCENE 3: FOUR WEDDING VIBES (Visual Lookbook & Aesthetics)
          Expressive: Minimal, Romantic, Editorial, Bold
          ==================================================================== */}
      <ScrollReveal variant="slide-clip">
      <section className="relative py-24 bg-[#FAF8F5]">
        <div className="lm-market-container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="lm-editorial-kicker mb-3">
                {isAr ? "ألبوم الأنماط والتصاميم" : "AESTHETICS LOOKBOOK"}
              </span>
              <h2 className="lm-section-headline">
                {isAr ? (
                  <>
                    أنماط مختلفة، <em>ونفس</em> الإحساس الراقي
                  </>
                ) : (
                  <>
                    Different styles, <em>same</em> timeless feeling
                  </>
                )}
              </h2>
            </div>

            {/* Vibe Selection Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {weddingVibes.map((vibe, idx) => (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => setActiveVibeIndex(idx)}
                  className={`lm-vibe-pill shrink-0 ${
                    activeVibeIndex === idx ? "is-active" : ""
                  }`}
                >
                  {isAr ? vibe.titleAr : vibe.titleEn}
                </button>
              ))}
            </div>
          </div>

          {/* Lookbook Active Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-12 border border-[var(--lm-border)] shadow-xl">
            {/* Visual Image Presentation */}
            <div className="lg:col-span-7 relative h-[440px] sm:h-[520px] rounded-2xl overflow-hidden shadow-lg border border-[var(--lm-border)]">
              <Image
                src={activeVibe.image}
                alt={isAr ? activeVibe.titleAr : activeVibe.titleEn}
                fill
                className="object-cover object-center transition-all duration-700"
              />
              <div className="absolute top-4 start-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[var(--lm-accent)] shadow-sm">
                {isAr ? activeVibe.badgeAr : activeVibe.badgeEn}
              </div>
            </div>

            {/* Aesthetic Narrative Details */}
            <div className="lg:col-span-5 flex flex-col items-start justify-center space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--lm-muted)]">
                  {isAr ? "طابع الدعوة" : "Style Direction"}
                </span>
                <h3 className="text-3xl font-extrabold text-[var(--lm-ink)] mt-1 mb-2">
                  {isAr ? activeVibe.titleAr : activeVibe.titleEn}
                </h3>
                <p className="text-sm text-[var(--lm-ink-secondary)] leading-relaxed">
                  {isAr ? activeVibe.taglineAr : activeVibe.taglineEn}
                </p>
              </div>

              <div className="w-full space-y-3 py-4 border-y border-[var(--lm-border)] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--lm-muted)]">{isAr ? "العروسين" : "Couple"}</span>
                  <span className="font-bold text-[var(--lm-ink)]">{isAr ? activeVibe.coupleAr : activeVibe.coupleEn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--lm-muted)]">{isAr ? "التاريخ" : "Date"}</span>
                  <span className="font-bold text-[var(--lm-ink)]">{isAr ? activeVibe.dateAr : activeVibe.dateEn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--lm-muted)]">{isAr ? "المكان" : "Venue"}</span>
                  <span className="font-bold text-[var(--lm-ink)]">{isAr ? activeVibe.venueAr : activeVibe.venueEn}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <Link
                  href="/create"
                  className="lm-btn-primary text-xs py-2.5 px-6 flex-1 text-center"
                >
                  {isAr ? "اختر هذا الستايل" : "Choose This Style"}
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDemo(activeVibeIndex % 2 === 0 ? demoWeddingInvitation : demoAlexandriaInvitation);
                    setIsFullDemoOpen(true);
                  }}
                  className="lm-btn-secondary text-xs py-2.5 px-5"
                >
                  {isAr ? "معاينة حية" : "Live Demo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Delicate Vine Section Divider */}
      <VineDivider className="my-2" />

      {/* ====================================================================
          SCENE 4: OUR STORY CHAPTERS (Emotional Narrative Flow)
          Emotional: Milestone timeline connecting the couple to guests
          ==================================================================== */}
      <ScrollReveal variant="stagger-cards">
      <section className="relative py-24 bg-white border-b border-[var(--lm-border)]">
        <div className="lm-market-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="lm-editorial-kicker mb-3">
              {isAr ? "فصول الحكاية" : "OUR STORY CHAPTERS"}
            </span>
            <h2 className="lm-section-headline mb-4">
              {isAr ? (
                <>
                  حكايتكم في <em>فصول</em>، مش تواريخ وخلاص
                </>
              ) : (
                <>
                  Your journey in <em>chapters</em>, not just dates
                </>
              )}
            </h2>
            <p className="lm-editorial-sub text-sm sm:text-base">
              {isAr
                ? "احكوا لأغلى الناس محطات مشواركم؛ من أول مرة شفتوا بعض لحد اليوم اللي اجتمعتوا فيه. كلمات وصور تخلّي كل معزوم يحس بقيمة الرابطة."
                : "Share the milestones of your relationship from the first encounter to the wedding night."}
            </p>
          </div>

          {/* Interactive Milestone Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyMilestones.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setActiveMilestone(idx)}
                className={`p-8 rounded-3xl border transition-all cursor-pointer ${
                  activeMilestone === idx
                    ? "bg-[#FAF8F5] border-[var(--lm-accent)] shadow-xl scale-[1.02]"
                    : "bg-white border-[var(--lm-border)] hover:border-[var(--lm-accent-border)] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[var(--lm-accent)] bg-[var(--lm-accent-soft)] px-3 py-1 rounded-full">
                    {isAr ? `المحطة ٠${idx + 1}` : `Chapter 0${idx + 1}`}
                  </span>
                  <span className="text-xs font-semibold text-[var(--lm-muted)]">
                    {isAr ? m.dateAr : m.dateEn}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--lm-ink)] mb-3">
                  {isAr ? m.titleAr : m.titleEn}
                </h3>

                <p className="text-sm text-[var(--lm-ink-secondary)] leading-relaxed">
                  {isAr ? m.descAr : m.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ====================================================================
          SCENE 5: THE CELEBRATION DETAILS & WHATSAPP SHARING
          Practical & Social: How guests experience arrival and sending love
          ==================================================================== */}
      <ScrollReveal variant="fade-up">
      <section className="relative py-24 bg-[#FAF8F5]">
        <div className="lm-market-container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Start: Social Sharing on WhatsApp */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="lm-editorial-kicker mb-3">
                  {isAr ? "المشاركة السلسة" : "EFFORTLESS SHARING"}
                </span>
                <h2 className="lm-section-headline mb-4">
                  {isAr ? (
                    <>
                      تشاركوا الفرحة بلينك <em>أنيق</em> على واتساب
                    </>
                  ) : (
                    <>
                      Share with an <em>elegant</em> link on WhatsApp
                    </>
                  )}
                </h2>
                <p className="lm-editorial-sub text-sm sm:text-base">
                  {isAr
                    ? "بدون ملفات PDF ثقيلة أو صور غير واضحة. يوصل الرابط كرسالة فاخرة مع صورة العروسين وعنوان الحفل، وبلمسة واحدة يدخل المعزوم على التجربة الكاملة."
                    : "No bulky PDFs or blurry attachments. Send a high-fashion digital invitation link that looks stunning when previewed on WhatsApp."}
                </p>
              </div>

              {/* Realistic WhatsApp Chat Preview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--lm-border)] shadow-xl relative max-w-lg">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[var(--lm-border-subtle)]">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">
                    💬
                  </div>
                  <div>
                    <p className="text-xs text-[var(--lm-muted)]">{isAr ? "رسالة المعازيم" : "Guest Love"}</p>
                    <p className="text-sm font-bold text-[var(--lm-ink)]">{isAr ? "سارة • قريبة العروسة" : "Sara • Guest"}</p>
                  </div>
                </div>

                <div className="bg-[#E7F7EE] text-emerald-950 p-4 rounded-2xl rounded-tr-none text-xs sm:text-sm leading-relaxed mb-3">
                  {isAr
                    ? "ألف مبروك يا أجمل عروسين في الدنيا! الدعوة فخمة أوي والعد التنازلي محسسنا إن الفرح بكرة! مستنيين اليوم بكل حب وفرحة ❤️👰🤵"
                    : "Huge congratulations! The invitation looks incredible and the countdown has us so excited! Can't wait to celebrate with you! ❤️"}
                </div>

                <div className="text-[10px] text-end text-[var(--lm-muted)]">
                  {isAr ? "اليوم • ٠٤:٣٠ م" : "Today • 4:30 PM"}
                </div>
              </div>
            </div>

            {/* Right/End: Real Event Features Artwork */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--lm-border)]">
                <Image
                  src="/marketing/b4.png"
                  alt="تفاصيل فرح متكاملة"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ====================================================================
          SCENE 6: CLOSING HORIZON (Dark Burgundy Editorial Moment)
          Closing: Emotional conclusion in deep wine #250612 with champagne accents
          ==================================================================== */}
      <ScrollReveal variant="fade-up">
      <section className="relative py-24 lg:py-32 bg-[#250612] text-[#FAF8F6] overflow-hidden">
        {/* Ambient Dark Romance Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
          <WaxSealStamp size={280} className="text-white" />
        </div>

        <div className="lm-market-container relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs font-extrabold tracking-widest text-[var(--lm-gold)] uppercase mb-4">
            {isAr ? "ابدأوا الآن" : "BEGIN TODAY"}
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            {isAr ? (
              <>
                فرحتكم تبدأ من أول <span className="text-[var(--lm-gold)] font-serif italic">دعوة</span>.
              </>
            ) : (
              <>
                Your celebration starts with the first <span className="text-[var(--lm-gold)] font-serif italic">invitation</span>.
              </>
            )}
          </h2>

          <p className="text-sm sm:text-lg text-white/80 leading-relaxed mb-10 max-w-xl mx-auto">
            {isAr
              ? "اصنعوا دعوة زفافكم الآن مجانًا في خطوات بسيطة بدون تسجيل دخول. شاركوا من تحبون لحظة تليق بأجمل ليالي العمر."
              : "Design your interactive digital wedding invitation in minutes. Free to start, with no sign-in required."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/create"
              className="lm-btn-primary py-3.5 px-9 text-base shadow-2xl group"
            >
              <span>{isAr ? "ابدأ دعوتك مجانًا" : "Start Free Now"}</span>
              <span className="lm-cta-arrow text-xl">✦</span>
            </Link>

            <Link
              href="/made-for-you"
              className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 text-base font-bold transition backdrop-blur-sm"
            >
              {isAr ? "خدمة التصميم الخاص (سيبوها علينا)" : "Concierge Service"}
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Full Live Preview Modal */}
      <PhonePreviewModal
        isOpen={isFullDemoOpen}
        onClose={() => setIsFullDemoOpen(false)}
        invitation={selectedDemo}
        title={isAr ? "تجربة دعوة زفاف كاملة" : "Full Wedding Invitation Experience"}
      />
    </div>
  );
}
