"use client";

import React, { useState } from "react";
import { useMarketingLocale } from "./marketing-locale-context";

export interface FaqItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
  category?: string;
}

export const defaultFaqItems: FaqItem[] = [
  {
    qAr: "هل لازم أعمل حساب عشان أبدأ أعمل دعوتي؟",
    qEn: "Do I need an account to start creating my invitation?",
    aAr: "لا خالص! تقدر تدخل على طول، تختار القالب وتضيف أساميكم وصوركم وتشوف المعاينة الحية على تليفونك. مش هتحتاج تعمل حساب غير لما تقرر تحفظ الدعوة أو تنشرها.",
    aEn: "Not at all! You can start immediately, choose your design, add your names and photos, and see the live preview on your phone. You only create an account when you decide to save or publish.",
    category: "general",
  },
  {
    qAr: "أقدر أجرب وأشوف الدعوة كاملة قبل ما أدفع أي فلوس؟",
    qEn: "Can I build and preview the entire invitation before paying?",
    aAr: "أكيد، تجربة التصميم والمعاينة الحية مجانية ١٠٠٪. بتدفع بس لما تخلص كل حاجة وتكون جاهز تنشر اللينك وتبعته للضيوف.",
    aEn: "Absolutely! Building and previewing your invitation is 100% free. You only pay when you are completely satisfied and ready to publish your live link.",
    category: "general",
  },
  {
    qAr: "أقدر أعدل تفاصيل الدعوة أو ميعادها بعد ما أنشرها؟",
    qEn: "Can I update event details or dates after publishing?",
    aAr: "نعم، تقدر تعدل أي نص أو ميعاد أو مكان أو صورة في أي لحظة من لوحة التحكم، والتعديل بيظهر فوراً في نفس اللينك بدون ما تحتاج تبعت لينك جديد للضيوف.",
    aEn: "Yes! You can update any text, date, location, or photo at any time from your dashboard, and changes appear instantly on the same link.",
    category: "customization",
  },
  {
    qAr: "إزاي الضيوف بيفتحوا الدعوة؟ هل محتاجين ينزلوا أبليكيشن؟",
    qEn: "How do guests open the invitation? Do they need an app?",
    aAr: "الضيوف مش محتاجين أي تطبيق ولا حساب. بتوصلهم رسالة واتساب أنيقة فيها اللينك، وبمجرد ما يضغطوا عليه الدعوة بتفتح كصفحة تفاعلية سينمائية سلسة على أي متصفح موبايل.",
    aEn: "Guests do not need any app or account. They receive an elegant WhatsApp message with your link, and clicking it opens a cinematic, smooth interactive page directly on their phone.",
    category: "guests",
  },
  {
    qAr: "إيه الفرق بين الباقة الأساسية وخدمة سيبوها علينا؟",
    qEn: "What is the difference between Self-Service and Concierge?",
    aAr: "الباقة الأساسية تمنحك إمكانية إنشاء الدعوة بنفسك وتضم كل المميزات من فتح الغلاف ومعرض الصور ومحطات الحكاية وخريطة المكان. أما خدمة 'سيبوها علينا' فتوفر لك مصممًا مخصصًا يتولى التنسيق والصياغة نيابة عنك.",
    aEn: "Self-Service allows you to design your invitation with all features including envelope opening, photo gallery, story, and maps. Concierge provides a dedicated designer to curate everything on your behalf.",
    category: "pricing",
  },
  {
    qAr: "مش فاضيين نعملها بنفسنا، تقدروا تجهزوهالنا من الألف للياء؟",
    qEn: "We are too busy to build it ourselves. Can you do it for us?",
    aAr: "طبعاً! عندنا خدمة 'سيبوها علينا' (Concierge). بتبعتولنا الصور والتفاصيل على واتساب، وفريق التصميم عندنا بيجهّز الدعوة كاملة بكل تفاصيلها ويعرضها عليكم للمراجعة والتعديل قبل النشر.",
    aEn: "Of course! Our 'Made For You' concierge service handles everything. You send us your details and photos, and our design team crafts the entire invitation for you to review and publish.",
    category: "concierge",
  },
  {
    qAr: "الدعوة بتفضل شغالة ومنشورة قد إيه؟",
    qEn: "How long does the invitation stay live?",
    aAr: "الدعوة بتفضل شغالة ومتاحة لضيوفكم طوال فترة التجهيز وحتى بعد الفرح بفترة كافية، عشان تفضل ذكرى جميلة ترجعوا تفتحوها في أي وقت.",
    aEn: "Your invitation remains active and accessible to your guests throughout your planning and well after the wedding day, preserving your special memories.",
    category: "general",
  },
  {
    qAr: "هل الموقع بيدعم اللغتين العربي والإنجليزي؟",
    qEn: "Does LAMMA support both Arabic and English?",
    aAr: "نعم، المنصة والدعوات مصممة لتدعم العربية بخطوط وتنسيقات عربية أصيلة راقية، بالإضافة لدعم كامل للغة الإنجليزية.",
    aEn: "Yes, both the platform and the invitations are fully bilingual with premium Arabic typography and polished English support.",
    category: "customization",
  },
];

interface FaqAccordionProps {
  items?: FaqItem[];
  limit?: number;
}

export function FaqAccordion({ items = defaultFaqItems, limit }: FaqAccordionProps) {
  const { isAr } = useMarketingLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const displayedItems = limit ? items.slice(0, limit) : items;

  return (
    <div className="space-y-3 w-full">
      {displayedItems.map((item, idx) => {
        const isOpen = openIndex === idx;
        const q = isAr ? item.qAr : item.qEn;
        const a = isAr ? item.aAr : item.aEn;

        return (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-[var(--lm-border)] bg-white transition-shadow hover:shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-start font-bold text-[var(--lm-ink)] transition-colors hover:bg-[var(--lm-surface-soft)]"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base leading-snug">{q}</span>
              <span
                className={`grid h-7 w-7 place-items-center rounded-full bg-[var(--lm-surface-warm)] text-xs font-bold transition-transform ${
                  isOpen ? "rotate-180 bg-[var(--lm-burgundy-soft)] text-[var(--lm-burgundy)]" : "text-[var(--lm-muted)]"
                }`}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-[var(--lm-border)] px-4 sm:px-5 py-3.5 text-xs sm:text-sm leading-relaxed text-[var(--lm-ink-secondary)] bg-[var(--lm-surface-soft)]/40 animate-fade-in">
                {a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
