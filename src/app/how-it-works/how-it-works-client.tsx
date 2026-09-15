"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useMarketingLocale } from "@/components/marketing/marketing-locale-context";
import { BotanicalCorner, BurgundyLineMotif } from "@/components/marketing/wedding-decorations";

export function HowItWorksClient() {
  const { isAr } = useMarketingLocale();

  const steps = [
    {
      num: "٠١",
      titleAr: "احكوا لنا حكايتكم وتفاصيل يومكم",
      titleEn: "Tell Us Your Story & Celebration Details",
      descAr: "اكتبوا أسماء العروسين، ميعاد ومكان الفرح، ورابط موقع القاعة المباشر، وشاركوا أحلى صوركم ومحطات اللقاء.",
      descEn: "Share your names, wedding date, venue GPS map link, favorite photos, and milestone journey chapters.",
      image: "/marketing/b1.png",
      tagAr: "الخطوة الأولى",
      tagEn: "Step 01",
    },
    {
      num: "٠٢",
      titleAr: "ننسق دعوتكم بلمسات سينمائية",
      titleEn: "We Craft Your Bespoke Digital Invitation",
      descAr: "تتحول تفاصيلكم إلى دعوة زفاف رقمية فاخرة تبدأ بغلاف تفاعلي بختم شمعي، وخطوط عربية عصرية تليق بضيوفكم.",
      descEn: "Your details transform into a luxury interactive invitation featuring an envelope wax seal reveal and modern typography.",
      image: "/marketing/b3.png",
      tagAr: "الخطوة الثانية",
      tagEn: "Step 02",
    },
    {
      num: "٠٣",
      titleAr: "عاينوا الدعوة ونسقوها على ذوقكم",
      titleEn: "Preview & Refine Every Detail",
      descAr: "عاينوا الدعوة مباشرة على الموبايل كأنكم معازيم. جربوا فتح الختم والعد التنازلي ونظموا الصور حتى ترضوا تمامًا.",
      descEn: "Test the interactive wax seal, countdown, and photo presentation live on mobile until completely satisfied.",
      image: "/marketing/b2.png",
      tagAr: "الخطوة الثالثة",
      tagEn: "Step 03",
    },
    {
      num: "٠٤",
      titleAr: "شاركوا الفرحة بلينك شيك على واتساب",
      titleEn: "Share The Moment in One WhatsApp Link",
      descAr: "انسخوا الرابط المباشر وأرسلوه في رسالة واتساب أنيقة لكل حبايبكم. يفتح بلمسة واحدة بدون تحميل أي تطبيقات.",
      descEn: "Send your custom link directly on WhatsApp. Guests open the full experience with a single tap, zero apps required.",
      image: "/marketing/b4.png",
      tagAr: "الخطوة الرابعة",
      tagEn: "Step 04",
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20 bg-[#FAF8F6] text-[#1A1615] lm-paper-grain">
      {/* Header */}
      <div className="lm-market-container text-center space-y-4 max-w-2xl mx-auto relative">
        <div className="absolute -top-8 -end-8 w-24 h-24 hidden sm:block opacity-60">
          <BotanicalCorner />
        </div>
        <span className="lm-editorial-kicker">{isAr ? "رحلة الصنع" : "CREATION JOURNEY"}</span>
        <h1 className="lm-editorial-headline">
          {isAr ? (
            <>
              إزاي بتشتغل <em>لمّة</em>؟
            </>
          ) : (
            <>
              How <em>LAMMA</em> Works
            </>
          )}
        </h1>
        <p className="lm-editorial-sub max-w-lg mx-auto text-sm sm:text-base">
          {isAr
            ? "من أول فكرة لحد وصول الدعوة لمعازيمكم؛ صممنا الرحلة لتكون تجربة ممتعة وخالية من أي تعقيد."
            : "From your first draft to delivery on WhatsApp; designed to be an intuitive, joyous celebration experience."}
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <BurgundyLineMotif />
        </div>
      </div>

      {/* Visual Journey Master Piece */}
      <div className="lm-market-container max-w-4xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-[var(--lm-burgundy-border)] bg-white p-4 sm:p-8">
          <div className="relative aspect-[1/1] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden">
            <Image
              src="/marketing/how-it-works-final.png"
              alt="How it works - LAMMA"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="lm-market-container space-y-16 max-w-4xl mx-auto">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isEven ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div
                className={`lg:col-span-7 space-y-4 text-start ${
                  isEven ? "lg:col-start-6" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-[var(--lm-burgundy)] bg-[var(--lm-burgundy-soft)] px-3.5 py-1 rounded-full border border-[var(--lm-burgundy-border)]">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--lm-muted)]">
                    {isAr ? step.tagAr : step.tagEn}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--lm-ink)] leading-snug">
                  {isAr ? step.titleAr : step.titleEn}
                </h2>

                <p className="text-sm sm:text-base text-[var(--lm-ink-secondary)] leading-relaxed">
                  {isAr ? step.descAr : step.descEn}
                </p>
              </div>

              <div
                className={`lg:col-span-5 relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[var(--lm-surface-warm)] border border-[var(--lm-border)] shadow-lg ${
                  isEven ? "lg:col-start-1" : ""
                }`}
              >
                <Image
                  src={step.image}
                  alt={isAr ? step.titleAr : step.titleEn}
                  fill
                  className="object-cover object-center"
                  sizes="500px"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Box */}
      <div className="lm-market-container">
        <div className="rounded-3xl bg-[#250612] text-[#FAF8F6] p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {isAr ? (
              <>
                ابدأوا الآن <em>مجانًا</em> بدون تسجيل دخول
              </>
            ) : (
              <>
                Start Now <em>Free</em> with No Sign-Up
              </>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            {isAr
              ? "صمموا وعاينوا دعوتكم كاملة على جهازكم، واحفظوها وقتما تكونوا جاهزين."
              : "Design and preview your invitation on your device. Save whenever you are ready."}
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="lm-btn-primary text-xs sm:text-sm py-3.5 px-9 inline-flex shadow-xl group"
            >
              <span>{isAr ? "ابدأ دعوتك الآن" : "Start Creating Free"}</span>
              <span className="lm-cta-arrow text-base">✦</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
