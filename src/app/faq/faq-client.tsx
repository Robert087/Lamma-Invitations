"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMarketingLocale } from "@/components/marketing/marketing-locale-context";
import { FaqAccordion, defaultFaqItems } from "@/components/marketing/faq-accordion";
import { BotanicalCorner, BurgundyLineMotif } from "@/components/marketing/wedding-decorations";

export function FaqClient() {
  const { isAr } = useMarketingLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", labelAr: "جميع الأسئلة", labelEn: "All Questions" },
    { id: "general", labelAr: "عام والبداية", labelEn: "General" },
    { id: "customization", labelAr: "التصميم والتعديل", labelEn: "Design & Edits" },
    { id: "guests", labelAr: "الضيوف وموقع القاعة", labelEn: "Guests & Venue" },
    { id: "pricing", labelAr: "الأسعار والدفع", labelEn: "Plans & Pricing" },
    { id: "concierge", labelAr: "خدمة سيبوها علينا", labelEn: "Concierge" },
  ];

  const filteredItems = defaultFaqItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const textToSearch = isAr
      ? `${item.qAr} ${item.aAr}`.toLowerCase()
      : `${item.qEn} ${item.aEn}`.toLowerCase();
    const matchesSearch = !searchQuery.trim() || textToSearch.includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 space-y-16 bg-[#FAF8F6] text-[#1A1615] lm-paper-grain">
      {/* Header */}
      <div className="lm-market-container text-center space-y-4 max-w-2xl mx-auto relative">
        <div className="absolute -top-8 -end-8 w-24 h-24 hidden sm:block opacity-60">
          <BotanicalCorner />
        </div>
        <span className="lm-editorial-kicker">{isAr ? "مركز الاستفسارات" : "HELP & FAQ"}</span>
        <h1 className="lm-editorial-headline">
          {isAr ? (
            <>
              الأسئلة <em>الشائعة</em>
            </>
          ) : (
            <>
              Frequently Asked <em>Questions</em>
            </>
          )}
        </h1>
        <p className="lm-editorial-sub max-w-lg mx-auto text-sm sm:text-base">
          {isAr
            ? "كل ما يخص إنشاء دعوتكم الرقمية، خيارات التعديل، مشاركة الرابط على واتساب، وتجربة المعازيم."
            : "Everything about building your digital invitation, customizations, WhatsApp sharing, and guest experience."}
        </p>
        <div className="max-w-xs mx-auto pt-2">
          <BurgundyLineMotif />
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="lm-market-container max-w-3xl mx-auto space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder={isAr ? "ابحث عن سؤالك هنا..." : "Search questions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-[var(--lm-border)] bg-white px-5 py-3.5 text-xs sm:text-sm shadow-sm focus:border-[var(--lm-burgundy)] focus:outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border ${
                selectedCategory === cat.id
                  ? "bg-[var(--lm-burgundy)] text-white border-[var(--lm-burgundy)] shadow-sm"
                  : "bg-white text-[var(--lm-ink-secondary)] border-[var(--lm-border)] hover:border-[var(--lm-burgundy)]"
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="lm-market-container max-w-3xl mx-auto">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[var(--lm-border)] space-y-2 shadow-sm">
            <p className="text-sm font-bold text-[var(--lm-ink)]">
              {isAr ? "لم نجد إجابة مطابقة لبحثكم" : "No matching questions found"}
            </p>
            <p className="text-xs text-[var(--lm-muted)]">
              {isAr ? "جربوا البحث بكلمات أخرى أو تواصلوا معنا مباشرة." : "Try different keywords or contact us."}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-[var(--lm-border)] p-6 sm:p-8 shadow-xl">
            <FaqAccordion items={filteredItems} />
          </div>
        )}
      </div>

      {/* Quiet, Clean Closing Horizon */}
      <div className="lm-market-container max-w-3xl mx-auto">
        <div className="rounded-3xl bg-[#250612] text-[#FAF8F6] p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {isAr ? "عندكم استفسار تاني؟" : "Still Have Questions?"}
          </h3>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            {isAr
              ? "فريق لمّة في خدمتكم دائمًا للمساعدة في كل تفاصيل دعوتكم ويومكم الكبير."
              : "Our team is here to assist with any questions about your celebration."}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/made-for-you"
              className="lm-btn-primary text-xs py-3 px-7 shadow-md group"
            >
              <span>{isAr ? "تواصلوا مع خدمة التصميم الخاص" : "Contact Concierge"}</span>
              <span className="lm-cta-arrow text-base">✦</span>
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 text-xs font-bold transition"
            >
              {isAr ? "ابدأوا دعوتكم مجانًا" : "Start Free Now"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
