"use client";

import { useState } from "react";
import { occasions, occasionLabels, type OccasionId } from "@/config/occasions";
import { launchTemplates } from "@/config/templates";
import { useGuestDraft } from "./guest-draft-context";

export function GuestOnboarding() {
  const {
    draft,
    locale,
    setOccasion,
    setTemplateId,
    updateEventDetails,
    updateContent,
    setOnboardingCompleted,
  } = useGuestDraft();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [namesError, setNamesError] = useState("");

  const isAr = locale === "ar";

  // Occasions ordering: Prioritize wedding-first launch
  const prioritizedOccasions: OccasionId[] = ["wedding", "engagement", "katb-ketab"];
  const otherOccasions: OccasionId[] = occasions.filter((o) => !prioritizedOccasions.includes(o));

  const handleNextFromOccasion = () => {
    setStep(2);
  };

  const handleNextFromTemplate = () => {
    setStep(3);
  };

  const handleFinishOnboarding = () => {
    const names = (draft.content.host_names || "").trim();
    if (!names) {
      setNamesError(isAr ? "يرجى كتابة الأسماء كما تحب أن تظهر بالدعوة." : "Please enter the couple or host names.");
      return;
    }
    setNamesError("");

    // Auto-generate title if empty
    if (!draft.event.title.trim()) {
      const occasionText = occasionLabels[draft.occasion]?.[locale] || "";
      const generatedTitle = isAr ? `حفل ${occasionText} ${names}` : `${names}'s ${occasionText}`;
      updateEventDetails({ title: generatedTitle });
    }

    setOnboardingCompleted(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between border-b border-[var(--lm-line)] pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--lm-accent)] font-bold text-white text-sm shadow-sm">
            {step}
          </span>
          <span className="text-sm font-semibold text-[var(--lm-muted)]">
            {step === 1 && (isAr ? "الخطوة ١: اختيار المناسبة" : "Step 1: Choose Occasion")}
            {step === 2 && (isAr ? "الخطوة ٢: اختيار التصميم" : "Step 2: Choose Template")}
            {step === 3 && (isAr ? "الخطوة ٣: الأسماء والتاريخ" : "Step 3: Names & Date")}
          </span>
        </div>
        <div className="text-xs text-[var(--lm-muted)]">
          {isAr ? "مسودة فورية بدون تسجيل" : "Instant draft without login"}
        </div>
      </div>

      {/* Step 1: Occasion */}
      {step === 1 && (
        <section className="lm-panel p-6 sm:p-10 animate-fade-in">
          <p className="lm-kicker">{isAr ? "البداية" : "Getting Started"}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--lm-ink)]">
            {isAr ? "إيه المناسبة اللي بنجهّز لها؟" : "What celebration are we preparing for?"}
          </h1>
          <p className="lm-copy mt-2 text-sm">
            {isAr
              ? "اختيارك يجهّز لك أسلوب الدعوة والأجواء المناسبة للاحتفال."
              : "Your selection tunes the invitation tone and atmosphere for your celebration."}
          </p>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--lm-muted)]">
              {isAr ? "المناسبات الأكثر تميزاً" : "Featured Celebrations"}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {prioritizedOccasions.map((id) => {
                const isSelected = draft.occasion === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOccasion(id)}
                    className={`group relative flex flex-col items-start justify-between rounded-2xl border p-5 text-start transition ${
                      isSelected
                        ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)] shadow-md ring-2 ring-[var(--lm-accent)]"
                        : "border-[var(--lm-line)] bg-white hover:border-[var(--lm-accent)] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-xl">
                        {id === "wedding" ? "💍" : id === "engagement" ? "✨" : "📜"}
                      </span>
                      {isSelected ? (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--lm-accent)] text-white text-[10px] font-bold">
                          ✓
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4">
                      <span className="block text-lg font-bold text-[var(--lm-ink)]">
                        {occasionLabels[id][locale]}
                      </span>
                      <span className="mt-1 block text-xs text-[var(--lm-muted)]">
                        {id === "wedding"
                          ? isAr ? "دعوة سينمائية تليق بليلة العمر" : "Cinematic wedding invitation"
                          : id === "engagement"
                          ? isAr ? "بداية الحكاية وأول فرحة" : "The start of the journey"
                          : isAr ? "بركة ولمّة الأهل والأحباب" : "Family blessing and union"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[var(--lm-muted)]">
              {isAr ? "مناسبات أخرى" : "Other Occasions"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherOccasions.map((id) => {
                const isSelected = draft.occasion === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOccasion(id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      isSelected
                        ? "bg-[var(--lm-ink)] text-white shadow-sm"
                        : "border border-[var(--lm-line)] bg-white text-[var(--lm-muted)] hover:border-[var(--lm-ink)] hover:text-[var(--lm-ink)]"
                    }`}
                  >
                    {occasionLabels[id][locale]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleNextFromOccasion}
              className="lm-button lm-button-accent px-8 py-3 text-base shadow-lg"
            >
              {isAr ? "متابعة لاختيار التصميم ←" : "Continue to Template ←"}
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Template Selection */}
      {step === 2 && (
        <section className="lm-panel p-6 sm:p-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="lm-kicker">{isAr ? "التصميم والروح" : "Design & Atmosphere"}</p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="lm-link text-xs"
            >
              {isAr ? "تغيير المناسبة" : "Change Occasion"}
            </button>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--lm-ink)]">
            {isAr ? "اختار التصميم اللي يناسب ذوقكم" : "Choose the design that matches your style"}
          </h1>
          <p className="lm-copy mt-2 text-sm">
            {isAr
              ? "كل قالب يمتلك إيقاعاً سينمائياً وتوزيعاً خاصاً للقصة والمشاهد."
              : "Each template blueprint has its own cinematic rhythm and scene storytelling."}
          </p>

          <div className="mt-8">
            {launchTemplates.map((template) => {
              const isSelected = draft.template_id === template.id;
              return (
                <div
                  key={template.id}
                  className={`overflow-hidden rounded-2xl border-2 transition ${
                    isSelected
                      ? "border-[var(--lm-accent)] bg-white shadow-xl ring-2 ring-[var(--lm-accent)]/20"
                      : "border-[var(--lm-line)] bg-white hover:border-[var(--lm-muted)]"
                  }`}
                >
                  {/* Top banner visual */}
                  <div className="relative bg-gradient-to-br from-[#172728] to-[#253d3e] p-6 text-white sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#b99559]/20 px-3 py-1 text-xs font-bold text-[#b99559] backdrop-blur-sm border border-[#b99559]/30">
                        {template.badge?.[locale] || (isAr ? "التصميم الأساسي" : "Primary Template")}
                      </span>
                      <span className="text-xs text-white/70">
                        {isAr ? "نمط متكامل" : "Full Experience"}
                      </span>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-xs uppercase tracking-widest text-[#b99559]">
                        {isAr ? "غلاف ملكي وسيناريو متتابع" : "Royal Cover & Scene Flow"}
                      </p>
                      <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#f4f2ed]">
                        {template.name[locale]}
                      </h2>
                      <p className="mt-2 text-sm text-white/80 max-w-md mx-auto">
                        {template.subtitle[locale]}
                      </p>
                    </div>

                    {/* Miniature Scene Rhythm Tags */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-white/75">
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        {isAr ? "١. شاشة الغلاف والتأكيد" : "1. Cover Reveal"}
                      </span>
                      <span>·</span>
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        {isAr ? "٢. نص الدعوة والموعد" : "2. Formal Words"}
                      </span>
                      <span>·</span>
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        {isAr ? "٣. محطات قصتنا" : "3. Our Story"}
                      </span>
                      <span>·</span>
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        {isAr ? "٤. ألبوم الصور" : "4. Photo Moments"}
                      </span>
                      <span>·</span>
                      <span className="rounded-md bg-white/10 px-2 py-1">
                        {isAr ? "٥. الخريطة والختام" : "5. Venue & Closing"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 bg-[var(--lm-surface)]">
                    <p className="text-sm text-[var(--lm-muted)] leading-relaxed">
                      {template.description[locale]}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--lm-green)]">
                        {isAr ? "✓ متاح مجاناً في المعاينة" : "✓ Included in free preview"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTemplateId(template.id)}
                        className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                          isSelected
                            ? "bg-[var(--lm-accent)] text-white"
                            : "bg-[var(--lm-surface-soft)] text-[var(--lm-ink)] hover:bg-[var(--lm-line)]"
                        }`}
                      >
                        {isSelected ? (isAr ? "تم اختياره" : "Selected") : (isAr ? "اختيار هذا القالب" : "Choose this template")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="lm-button lm-button-quiet"
            >
              {isAr ? "→ رجوع" : "← Back"}
            </button>
            <button
              type="button"
              onClick={handleNextFromTemplate}
              className="lm-button lm-button-accent px-8 py-3 text-base shadow-lg"
            >
              {isAr ? "متابعة لكتابة الأسماء والتاريخ ←" : "Continue to Details ←"}
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Essential Details */}
      {step === 3 && (
        <section className="lm-panel p-6 sm:p-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="lm-kicker">{isAr ? "البيانات الأساسية" : "Essential Details"}</p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="lm-link text-xs"
            >
              {isAr ? "تغيير التصميم" : "Change Template"}
            </button>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--lm-ink)]">
            {isAr ? "مين أصحاب المناسبة وتاريخها؟" : "Who are we celebrating, and when?"}
          </h1>
          <p className="lm-copy mt-2 text-sm">
            {isAr
              ? "هنستخدم هذه البيانات لملء الغلاف وبداية الدعوة. وتقدر تضيف وتعدل كل التفاصيل في الاستوديو بعدين."
              : "We will use these details to populate the cover and invitation scene. You can refine everything in the studio."}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {/* Host / Couple Names */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[var(--lm-ink)]">
                {isAr ? "الأسماء (كما تحب أن تظهر بالدعوة)" : "Names (as you want them on the invitation)"}
                <span className="text-[var(--lm-accent)] font-bold ms-1">*</span>
              </label>
              <input
                type="text"
                dir="auto"
                maxLength={120}
                required
                value={draft.content.host_names || ""}
                onChange={(e) => {
                  updateContent({ host_names: e.target.value });
                  if (namesError) setNamesError("");
                }}
                placeholder={isAr ? "مثال: أحمد وسلمى" : "e.g. Ahmed & Salma"}
                className="lm-input mt-2 text-base font-semibold"
              />
              {namesError ? (
                <p className="mt-1 text-xs font-bold text-red-600">{namesError}</p>
              ) : (
                <p className="mt-1 text-xs text-[var(--lm-muted)]">
                  {isAr ? "الأسماء هتظهر في الغلاف الرئيسي ونص الدعوة الرسمي." : "These names will appear on the cover and invitation header."}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-bold text-[var(--lm-ink)]">
                {isAr ? "تاريخ المناسبة" : "Celebration Date"}
              </label>
              <input
                type="date"
                value={draft.event.event_date || ""}
                onChange={(e) => updateEventDetails({ event_date: e.target.value })}
                className="lm-input mt-2"
              />
              <p className="mt-1 text-xs text-[var(--lm-muted)]">
                {isAr ? "العد التنازلي وتاريخ الغلاف هيعتمدوا على هذا التاريخ." : "Powers the countdown and cover date."}
              </p>
            </div>

            {/* Venue Name */}
            <div>
              <label className="block text-sm font-bold text-[var(--lm-ink)]">
                {isAr ? "المكان أو القاعة (اختياري)" : "Venue Name (Optional)"}
              </label>
              <input
                type="text"
                dir="auto"
                maxLength={160}
                value={draft.event.venue_name || ""}
                onChange={(e) => updateEventDetails({ venue_name: e.target.value })}
                placeholder={isAr ? "مثال: فندق الفورسيزونز - قاعة النيل" : "e.g. Four Seasons Ballroom"}
                className="lm-input mt-2"
              />
            </div>

            {/* Location / Maps URL */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[var(--lm-ink)]">
                {isAr ? "رابط الخريطة للمكان (اختياري)" : "Map Link (Optional)"}
              </label>
              <input
                type="url"
                dir="ltr"
                value={draft.event.location_url || ""}
                onChange={(e) => updateEventDetails({ location_url: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="lm-input mt-2 text-start font-mono text-sm"
              />
              <p className="mt-1 text-xs text-[var(--lm-muted)]">
                {isAr ? "يمكن إضافة رابط خرائط جوجل أو آبل أو مشاركة الموقع." : "Accepts Google Maps, Apple Maps, or directions URLs."}
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="lm-button lm-button-quiet"
            >
              {isAr ? "→ رجوع" : "← Back"}
            </button>
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="lm-button lm-button-accent px-8 py-3 text-base shadow-lg"
            >
              {isAr ? "ادخل استوديو دعوتكم وعاين النتيجة ←" : "Enter Studio & Preview ←"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
