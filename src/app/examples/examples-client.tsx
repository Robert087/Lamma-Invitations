"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMarketingLocale } from "@/components/marketing/marketing-locale-context";
import { PhonePreviewModal } from "@/components/marketing/phone-preview-modal";
import { demoWeddingInvitation, demoAlexandriaInvitation } from "@/components/marketing/demo-invitation";
import type { InvitationModel } from "@/features/invitations/types";
import { BotanicalCorner, BurgundyLineMotif } from "@/components/marketing/wedding-decorations";

export function ExamplesClient() {
  const { isAr } = useMarketingLocale();
  const [selectedDemo, setSelectedDemo] = useState<InvitationModel | null>(null);

  const examples = [
    {
      titleAr: "حفل زفاف أحمد وسلمى",
      titleEn: "Wedding of Ahmed & Salma",
      subtitleAr: "فندق الفورسيزونز - نايل بلازا، القاهرة",
      subtitleEn: "Four Seasons Hotel at Nile Plaza, Cairo",
      descAr: "حفل زفاف كلاسيكي فاخر يجمع بين الأصالة والعصرية. يعرض فتح الغلاف بالختم الشمعي، وفصول القصة، وقائمة الصور، وخريطة القاعة المباشرة.",
      descEn: "A grand luxury celebration combining heritage and contemporary styling with wax-seal opening, milestone chapters, and live countdown.",
      invitation: demoWeddingInvitation,
      image: "/marketing/b1.png",
      tagAr: "زفاف كلاسيكي بالقاهرة",
      tagEn: "Classic Cairo Celebration",
    },
    {
      titleAr: "فرح كريم ونور",
      titleEn: "Karim & Nour's Coastal Celebration",
      subtitleAr: "سان ستيفانو - الإسكندرية",
      subtitleEn: "San Stefano, Alexandria",
      descAr: "حفل زفاف ساحلي بنسيم البحر الأبيض المتوسط. تصميم دافئ يتميز بالخطوط العربية المعاصرة والهدوء البصري ومحطات اللقاء الرومانسية.",
      descEn: "A breezy coastal Mediterranean wedding with warm tones, refined Arabic typography, and seaside milestone chapters.",
      invitation: demoAlexandriaInvitation,
      image: "/marketing/b2.png",
      tagAr: "زفاف ساحلي بالإسكندرية",
      tagEn: "Coastal Alexandria Wedding",
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20 bg-[#FAF8F6] text-[#1A1615] lm-paper-grain">
      {/* Header */}
      <div className="lm-market-container text-center space-y-4 max-w-2xl mx-auto relative">
        <div className="absolute -top-8 -end-8 w-24 h-24 hidden sm:block opacity-60">
          <BotanicalCorner />
        </div>
        <span className="lm-editorial-kicker">{isAr ? "معاينة حية" : "LIVE EXPERIENCES"}</span>
        <h1 className="lm-editorial-headline">
          {isAr ? (
            <>
              شوفوا دعوات حية من <em>لمّة</em>
            </>
          ) : (
            <>
              Experience Live <em>Invitations</em>
            </>
          )}
        </h1>
        <p className="lm-editorial-sub max-w-lg mx-auto text-sm sm:text-base">
          {isAr
            ? "استكشفوا نماذج حقيقية شغالة بنفس التجربة اللي هيعيشها معازيمكم، واختبروا كل تفصيلة بنفسكم على شاشة الموبايل."
            : "Explore real working invitations running the exact live guest experience. Test opening, countdown, and navigation on mobile."}
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <BurgundyLineMotif />
        </div>
      </div>

      {/* Examples Grid */}
      <div className="lm-market-container grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white border border-[var(--lm-border)] overflow-hidden shadow-xl hover:border-[var(--lm-burgundy-border)] transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--lm-surface-warm)] border-b border-[var(--lm-border)]">
                <Image
                  src={ex.image}
                  alt={isAr ? ex.titleAr : ex.titleEn}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <span className="absolute top-4 start-4 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[var(--lm-burgundy)] shadow-sm">
                  {isAr ? ex.tagAr : ex.tagEn}
                </span>
              </div>

              <div className="p-7 space-y-3 text-start">
                <h3 className="text-2xl font-bold text-[var(--lm-ink)]">
                  {isAr ? ex.titleAr : ex.titleEn}
                </h3>
                <p className="text-xs font-semibold text-[var(--lm-burgundy)] flex items-center gap-1.5">
                  <span>📍</span> {isAr ? ex.subtitleAr : ex.subtitleEn}
                </p>
                <p className="text-xs sm:text-sm text-[var(--lm-ink-secondary)] leading-relaxed pt-1">
                  {isAr ? ex.descAr : ex.descEn}
                </p>
              </div>
            </div>

            <div className="p-7 pt-0 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSelectedDemo(ex.invitation)}
                className="lm-btn-primary text-xs py-3 px-6 flex-1 text-center font-bold group"
              >
                <span>{isAr ? "شوفوا الدعوة كاملة" : "View Full Demo"}</span>
                <span className="lm-cta-arrow text-base">✦</span>
              </button>
              <Link
                href="/create"
                className="lm-btn-secondary text-xs py-3 px-5 text-center font-bold"
              >
                {isAr ? "ابدأوا مثلها" : "Create Similar"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Full Demo Modal */}
      {selectedDemo && (
        <PhonePreviewModal
          isOpen={Boolean(selectedDemo)}
          onClose={() => setSelectedDemo(null)}
          invitation={selectedDemo}
          title={isAr ? "معاينة حية لدعوة الزفاف" : "Live Wedding Invitation Demo"}
        />
      )}
    </div>
  );
}
