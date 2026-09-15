"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { useMarketingLocale } from "./marketing-locale-context";
import { BotanicalCorner, BurgundyLineMotif } from "./wedding-decorations";

export function DigitalVsPaperSection() {
  const { isAr } = useMarketingLocale();
  const inviteCountId = useId();
  const printCostId = useId();

  // Interactive Comparison Calculator State (Sample Assumptions)
  const [inviteCount, setInviteCount] = useState<number>(150);
  const [printCostPerInvite, setPrintCostPerInvite] = useState<number>(55);
  const [deliveryCost, setDeliveryCost] = useState<number>(1200);

  // Computed Estimates
  const estimatedPaperTotal = inviteCount * printCostPerInvite + deliveryCost;

  return (
    <section id="digital-vs-paper" className="relative py-24 lg:py-32 bg-white border-y border-[var(--lm-border)] overflow-hidden">
      {/* Decorative Botanical Corner */}
      <div className="absolute top-4 start-4 w-32 h-32 opacity-35 pointer-events-none hidden sm:block">
        <BotanicalCorner />
      </div>

      <div className="lm-market-container-wide relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="lm-editorial-kicker">
            {isAr ? "الورق مقابل التجربة الرقمية" : "DIGITAL VS PAPER"}
          </span>
          <h2 className="lm-section-headline text-balance">
            {isAr ? (
              <>
                الورق يوصل خبراً.. <em>ولمّة</em> تصنع تجربة لا تُنسى
              </>
            ) : (
              <>
                Paper sends a notice. <em>LAMMA</em> creates an unforgettable experience.
              </>
            )}
          </h2>
          <p className="lm-editorial-sub text-sm sm:text-base max-w-2xl mx-auto">
            {isAr
              ? "مقارنة عملية ومالية بين طباعة الكروت الورقية التقليدية وتجربة الدعوة الرقمية التفاعلية التي تليق بيومكم الكبير."
              : "A practical and value-driven comparison between traditional printed cards and an interactive digital invitation that honors your celebration."}
          </p>
          <div className="max-w-xs mx-auto pt-2">
            <BurgundyLineMotif />
          </div>
        </div>

        {/* Visual Split Experience: The Two Worlds */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto mb-16">
          {/* Left Column: Traditional Paper Invitation Card */}
          <div className="lg:col-span-6 rounded-3xl bg-[#FAF8F6] border border-[var(--lm-border)] p-7 sm:p-10 flex flex-col justify-between relative shadow-sm text-start">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--lm-border)] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--lm-muted)]">
                    {isAr ? "الأسلوب التقليدي" : "Traditional Way"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--lm-ink)] mt-1">
                    {isAr ? "الكروت الورقية والصور الثابتة" : "Printed Paper Invitations"}
                  </h3>
                </div>
                <span className="h-10 w-10 rounded-full bg-stone-200/70 grid place-items-center text-lg">
                  ✉️
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[var(--lm-ink-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong>{isAr ? "تكلفة طباعة متزايدة:" : "Escalating print costs:"}</strong>{" "}
                    {isAr
                      ? "كلما زاد عدد المعازيم، تضاعفت تكلفة الورق الفاخر والتغليف والأظرف."
                      : "Higher costs for every additional guest, custom stock, and envelope wax seals."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong>{isAr ? "تكلفة إعادة الطباعة:" : "Costly reprints on change:"}</strong>{" "}
                    {isAr
                      ? "أي تعديل في الميعاد أو مكان الحفل يتطلب إعادة طباعة وتكلفة جديدة."
                      : "Any last-minute change in date or venue requires reprinting with added delay and expense."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong>{isAr ? "صعوبة التوصيل اليدوي:" : "Manual delivery friction:"}</strong>{" "}
                    {isAr
                      ? "مشاوير طويلة وشركات شحن ومجهود مرهق في خضم انشغالكم بتجهيزات الفرح."
                      : "Time-consuming hand delivery, couriers, and coordination during busy wedding prep."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong>{isAr ? "عنوان ثابت بدون توجيه GPS:" : "Static text location:"}</strong>{" "}
                    {isAr
                      ? "كتابة اسم القاعة فقط، مما يسبب تشتت وتوهان بعض الضيوف يوم الفرح."
                      : "Plain address text without direct interactive GPS navigation to the venue entrance."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-700 font-bold shrink-0 mt-0.5">✕</span>
                  <span>
                    <strong>{isAr ? "تجربة جامدة بدون تفاعل:" : "Static experience:"}</strong>{" "}
                    {isAr
                      ? "لا يوجد عد تنازلي حي، ولا مشاركة لصور العروسين ومحطات حكايتهما."
                      : "No live countdown timer, no couple milestone chapters, and no photo gallery."}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[var(--lm-border)] mt-6 text-xs text-[var(--lm-muted)]">
              {isAr ? "ينتهي بها المطاف كنسخ مهدرة بعد ليلة الفرح." : "Often discarded after the single event day."}
            </div>
          </div>

          {/* Right Column: LAMMA Digital Experience */}
          <div className="lg:col-span-6 rounded-3xl bg-white border-2 border-[var(--lm-burgundy)] p-7 sm:p-10 flex flex-col justify-between relative shadow-2xl text-start">
            <span className="absolute -top-3.5 start-8 rounded-full bg-[var(--lm-burgundy)] px-4 py-1 text-xs font-bold text-white shadow-md">
              {isAr ? "تجربة لمّة المتكاملة" : "LAMMA Experience"}
            </span>

            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between border-b border-[var(--lm-burgundy-border)] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--lm-burgundy)]">
                    {isAr ? "الجيل الجديد للدعوات" : "The Modern Standard"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--lm-ink)] mt-1">
                    {isAr ? "دعوة رقمية تفاعلية بلمسات سينمائية" : "Bespoke Interactive Digital Invitation"}
                  </h3>
                </div>
                <span className="h-10 w-10 rounded-full bg-[var(--lm-burgundy-soft)] border border-[var(--lm-burgundy-border)] grid place-items-center text-lg">
                  ✨
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[var(--lm-ink-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lm-burgundy)] font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    <strong>{isAr ? "رابط واحد أنيق يشارك بلا حدود:" : "Unlimited WhatsApp sharing:"}</strong>{" "}
                    {isAr
                      ? "إرسال سلس على واتساب لكل أحبابكم بنقرة واحدة وبنفس الجودة العالية."
                      : "Send seamlessly to 50 or 500 guests with one refined WhatsApp preview link."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lm-burgundy)] font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    <strong>{isAr ? "تعديل فوري غير محدود مجانًا:" : "Instant live updates:"}</strong>{" "}
                    {isAr
                      ? "تعديل المواعيد والصور والكلمات في أي ثانية وتحديث فوري على نفس الرابط."
                      : "Update timing, location, or wording anytime with instant sync on the exact same link."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lm-burgundy)] font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    <strong>{isAr ? "توجيه دقيق بنقرة واحدة لخرائط جوجل:" : "One-tap GPS directions:"}</strong>{" "}
                    {isAr
                      ? "المعزوم يفتح الخريطة مباشرة من الدعوة ويصل لباب القاعة دون أي ارتباك."
                      : "Guests tap straight into Google Maps to reach your venue effortlessly."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lm-burgundy)] font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    <strong>{isAr ? "طقس فتح الغلاف بالختم الشمعي:" : "Wax-seal envelope ceremony:"}</strong>{" "}
                    {isAr
                      ? "تفاعل ناعم يبهر كل ضيف على شاشة موبايله ويجعله جزءًا من بهجة اليوم."
                      : "A delicate interactive wax-seal unfold honoring your guests upon arrival."}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lm-burgundy)] font-bold shrink-0 mt-0.5">✓</span>
                  <span>
                    <strong>{isAr ? "العد التنازلي الحي ومعرض الصور:" : "Live countdown & story:"}</strong>{" "}
                    {isAr
                      ? "يحسب الأيام والساعات حتى اللقاء، مع فصول قصة حبكم وألبوم صوركم."
                      : "Dynamic countdown building anticipation, milestone relationship chapters, and photos."}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[var(--lm-burgundy-border)] mt-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--lm-burgundy)]">
                {isAr ? "تظل ذكرى رقمية جميلة للأبد" : "A lasting keepsake forever"}
              </span>
              <Link
                href="/create"
                className="lm-btn-primary text-xs py-2 px-5 group"
              >
                <span>{isAr ? "ابدأ دعوتك" : "Start Free"}</span>
                <span className="lm-cta-arrow text-base">✦</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Cost & Value Comparison Calculator */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#FAF8F6] border border-[var(--lm-border)] p-6 sm:p-10 shadow-lg relative">
          <div className="text-start space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[var(--lm-burgundy)] bg-[var(--lm-burgundy-soft)] px-3 py-1 rounded-full border border-[var(--lm-burgundy-border)]">
                {isAr ? "حاسبة تقديرية" : "Cost Estimator"}
              </span>
              <span className="text-xs text-[var(--lm-muted)] font-medium">
                {isAr ? "مثال توضيحي بالأرقام التقديرية" : "Illustrative example based on sample assumptions"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--lm-ink)]">
              {isAr ? "احسبوا التكلفة والوفر لمناسبتكم" : "Estimate Your Invitation Value"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--lm-ink-secondary)]">
              {isAr
                ? "يمكنكم تعديل عدد المعازيم ومتوسط التكلفة لتريكم الحاسبة حجم الفرق مقارنة بالطباعة."
                : "Adjust the quantity and sample costs below to see the estimated comparison."}
            </p>
          </div>

          {/* Calculator Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 text-start">
            <div className="p-4 rounded-2xl bg-white border border-[var(--lm-border)] space-y-2">
              <label htmlFor={inviteCountId} className="text-xs font-bold text-[var(--lm-ink)] block">
                {isAr ? "عدد الدعوات الورقية" : "Number of Printed Invites"}
              </label>
              <input
                id={inviteCountId}
                type="number"
                min={20}
                max={1000}
                step={10}
                value={inviteCount}
                onChange={(e) => setInviteCount(Math.max(10, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-[var(--lm-border)] px-3.5 py-2 text-sm font-bold text-[var(--lm-ink)] focus:border-[var(--lm-burgundy)] focus:outline-none"
              />
              <span className="text-[11px] text-[var(--lm-muted)] block">
                {isAr ? "دعوة للمعازيم" : "printed copies"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[var(--lm-border)] space-y-2">
              <label htmlFor={printCostId} className="text-xs font-bold text-[var(--lm-ink)] block">
                {isAr ? "متوسط تكلفة الكارت الواحد (ج.م)" : "Cost Per Card (EGP)"}
              </label>
              <input
                id={printCostId}
                type="number"
                min={10}
                max={500}
                step={5}
                value={printCostPerInvite}
                onChange={(e) => setPrintCostPerInvite(Math.max(5, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-[var(--lm-border)] px-3.5 py-2 text-sm font-bold text-[var(--lm-ink)] focus:border-[var(--lm-burgundy)] focus:outline-none"
              />
              <span className="text-[11px] text-[var(--lm-muted)] block">
                {isAr ? "ورق + تغليف + شمع" : "paper, foil & envelope"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[var(--lm-border)] space-y-2">
              <label className="text-xs font-bold text-[var(--lm-ink)] block">
                {isAr ? "تكلفة التوصيل ومصروفات الشحن (ج.م)" : "Delivery & Transit (EGP)"}
              </label>
              <input
                type="number"
                min={0}
                max={5000}
                step={100}
                value={deliveryCost}
                onChange={(e) => setDeliveryCost(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-[var(--lm-border)] px-3.5 py-2 text-sm font-bold text-[var(--lm-ink)] focus:border-[var(--lm-burgundy)] focus:outline-none"
              />
              <span className="text-[11px] text-[var(--lm-muted)] block">
                {isAr ? "مشاوير أو شحن يدوي" : "courier / fuel expenses"}
              </span>
            </div>
          </div>

          {/* Calculator Output Comparison Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-2xl bg-white border border-[var(--lm-burgundy-border)] shadow-sm text-start">
            <div className="space-y-1.5 border-b md:border-b-0 md:border-e border-[var(--lm-border)] pb-4 md:pb-0 md:pe-6">
              <span className="text-xs font-semibold text-[var(--lm-muted)]">
                {isAr ? "التكلفة التقديرية للطباعة الورقية والتوصيل:" : "Estimated Traditional Paper Total:"}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-800">
                ~ {estimatedPaperTotal.toLocaleString()}{" "}
                <span className="text-sm font-bold text-[var(--lm-muted)]">{isAr ? "ج.م" : "EGP"}</span>
              </p>
              <span className="text-[11px] text-[var(--lm-muted)] block">
                {isAr
                  ? `(حساب ${inviteCount} كارت × ${printCostPerInvite} ج.م + ${deliveryCost} ج.م مصاريف شحن وتوصيل)`
                  : `(${inviteCount} cards × ${printCostPerInvite} EGP + ${deliveryCost} EGP delivery)`}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[var(--lm-burgundy)] uppercase tracking-wider">
                {isAr ? "مع منصة لمّة:" : "WITH LAMMA:"}
              </span>
              <p className="text-base sm:text-lg font-bold text-[var(--lm-ink)] leading-snug">
                {isAr
                  ? "باقة رقمية متكاملة لجميع معازيمكم بدون حد أقصى وتعديلات فورية مجانًا"
                  : "One complete digital experience for all guests with zero reprint fees"}
              </p>
              <p className="text-xs text-[var(--lm-muted)]">
                {isAr
                  ? "* تصميم ومعاينة مجانية بالكامل. تدفعون مرة واحدة فقط عند النشر النهائي."
                  : "* 100% free to design and preview. Single payment upon publishing."}
              </p>
            </div>
          </div>

          {/* Safe Legal Disclaimer Badge */}
          <p className="text-[10px] text-[var(--lm-muted)] text-center mt-4">
            {isAr
              ? "ملاحظة: الأرقام بالأعلى هي مثال توضيحي مبني على متوسطات تقريبية لتكاليف الطباعة والتوصيل بالسوق، وتختلف حسب اختياراتكم."
              : "Note: The figures above are for illustrative purposes based on sample print & transit assumptions."}
          </p>
        </div>
      </div>
    </section>
  );
}
