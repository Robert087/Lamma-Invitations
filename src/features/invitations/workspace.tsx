"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import {
  designRegistry,
  invitationVariants,
  palettePresets,
  textScales,
  typographyPresets,
  type InvitationThemeConfig,
  type InvitationVariant,
  type PalettePreset,
} from "@/config/invitation-design";
import { invitationSections } from "@/config/invitation-sections";
import { StoryManager } from "./story-manager";
import { AiCreator } from "./ai-creator";
import {
  publishInvitation,
  unpublishInvitation,
  updateEventDetails,
  updateInvitationContent,
  updateInvitationDesign,
  updateInvitationSection,
} from "./actions";
import { InvitationRenderer } from "./renderer";
import { ShareControls } from "./share-controls";
import { initialUpdateInvitationState, type InvitationContent, type InvitationModel } from "./types";

type Props = {
  invitation: InvitationModel;
  isPublished: boolean;
  publicUrl: string;
};

type Tab = "content" | "design" | "sections";

const contentFields: Array<{
  key: keyof InvitationContent;
  title: string;
  hint: string;
  multiline?: boolean;
}> = [
  { key: "host_names", title: "الأسماء", hint: "الأسماء كما تحب أن تظهر" },
  { key: "headline", title: "أول انطباع", hint: "جملة قصيرة من قلبك" },
  { key: "invitation_text", title: "رسالتك", hint: "اكتب رسالتك بطريقتك", multiline: true },
];

export function InvitationWorkspace({ invitation, isPublished, publicUrl }: Props) {
  const [tab, setTab] = useState<Tab>("content");
  const [draft, setDraft] = useState<InvitationContent>(invitation.content);
  const [designDraft, setDesignDraft] = useState<InvitationThemeConfig>(invitation.themeConfig);
  const [state, saveContent, isPending] = useActionState(updateInvitationContent, initialUpdateInvitationState);
  const [mode, setMode] = useState<"mobile" | "desktop">("mobile");

  const preview = useMemo(
    () => ({
      ...invitation,
      content: draft,
      themeConfig: designDraft,
    }),
    [draft, designDraft, invitation]
  );

  const nav: Array<{ id: Tab; label: string }> = [
    { id: "content", label: "المحتوى" },
    { id: "design", label: "التصميم" },
    { id: "sections", label: "الأقسام" },
  ];

  return (
    <div className="lm-shell min-h-screen">
      <header className="lm-wrap lm-topbar">
        <Link className="lm-brand" href={`/dashboard/events/${invitation.event.id}`}>
          Lamma
        </Link>
        <div className="flex items-center gap-3">
          <Link className="lm-link" href={`/dashboard/events/${invitation.event.id}/preview`}>
            معاينة كاملة
          </Link>
          <span className="hidden text-sm text-[var(--lm-muted)] sm:inline">{invitation.event.title}</span>
        </div>
      </header>

      <main className="lm-wrap pb-10">
        <div className="mb-6">
          <p className="lm-kicker">Invitation Studio</p>
          <h1 className="mt-2 text-3xl font-bold">صمّم الإحساس، مش بس الدعوة.</h1>
        </div>

        <AiCreator invitation={invitation} />

        <section className="lm-panel mb-6 p-5">
          <p className="font-bold">{isPublished ? "الدعوة منشورة وجاهزة للمشاركة" : "الدعوة لسه خاصة بيك"}</p>
          {isPublished ? (
            <>
              <p className="mt-1 break-all text-sm text-[var(--lm-muted)]" dir="ltr">
                {publicUrl}
              </p>
              <ShareControls url={publicUrl} />
              <form action={unpublishInvitation} className="mt-3">
                <input name="event_id" type="hidden" value={invitation.event.id} />
                <button className="lm-link text-red-700" type="submit">
                  إيقاف النشر
                </button>
              </form>
            </>
          ) : (
            <form action={publishInvitation} className="mt-4">
              <input name="event_id" type="hidden" value={invitation.event.id} />
              <button className="lm-button lm-button-accent" type="submit">
                نشر الدعوة
              </button>
            </form>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-[200px_460px_minmax(0,1fr)]">
          {/* Navigation tabs */}
          <nav className="lm-panel flex h-fit gap-1 p-2 xl:flex-col">
            {nav.map((item) => (
              <button
                className={`rounded-lg px-4 py-3 text-start text-sm font-bold transition-colors ${
                  tab === item.id ? "bg-[var(--lm-ink)] text-white" : "text-[var(--lm-muted)] hover:text-[var(--lm-ink)]"
                }`}
                key={item.id}
                onClick={() => setTab(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Editor Panel */}
          <section className="lm-panel h-fit p-5 sm:p-6">
            {tab === "content" ? (
              <>
                <p className="lm-kicker">الغلاف والرسالة</p>
                <form action={saveContent} className="mt-5">
                  <input name="event_id" type="hidden" value={invitation.event.id} />
                  <div className="space-y-5">
                    {contentFields.map(({ key, title, hint, multiline }) => (
                      <label className="block" key={key}>
                        <span className="text-sm font-bold">{title}</span>
                        {multiline ? (
                          <textarea
                            className="lm-input mt-2 min-h-28"
                            dir="auto"
                            name={key}
                            onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                            placeholder={hint}
                            value={draft[key] ?? ""}
                          />
                        ) : (
                          <input
                            className="lm-input mt-2"
                            dir="auto"
                            name={key}
                            onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))}
                            placeholder={hint}
                            value={draft[key] ?? ""}
                          />
                        )}
                        {state.fieldErrors?.[key] ? (
                          <span className="mt-1 block text-sm text-red-700">{state.fieldErrors[key]}</span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                  <button className="lm-button lm-button-accent mt-6 w-full" disabled={isPending} type="submit">
                    {isPending ? "جارٍ الحفظ..." : "احفظ المحتوى"}
                  </button>
                  {state.success ? <p className="mt-3 text-sm text-[var(--lm-green)]">تم الحفظ.</p> : null}
                </form>

                <form action={updateEventDetails} className="mt-8 border-t border-[var(--lm-line)] pt-6">
                  <p className="font-bold">تفاصيل المناسبة</p>
                  <input name="event_id" type="hidden" value={invitation.event.id} />
                  <label className="mt-4 block text-sm">
                    التاريخ
                    <input
                      className="lm-input mt-2"
                      defaultValue={invitation.event.event_date ?? ""}
                      name="event_date"
                      type="date"
                    />
                  </label>
                  <label className="mt-4 block text-sm">
                    المكان
                    <input
                      className="lm-input mt-2"
                      defaultValue={invitation.event.venue_name ?? ""}
                      name="venue_name"
                    />
                  </label>
                  <label className="mt-4 block text-sm">
                    رابط الموقع
                    <input
                      className="lm-input mt-2 text-left"
                      defaultValue={invitation.event.location_url ?? ""}
                      dir="ltr"
                      name="location_url"
                      type="url"
                    />
                  </label>
                  <button className="lm-button lm-button-quiet mt-5 w-full" type="submit">
                    حفظ التفاصيل
                  </button>
                </form>
              </>
            ) : null}

            {tab === "design" ? (
              <form action={updateInvitationDesign} className="space-y-6">
                <input name="event_id" type="hidden" value={invitation.event.id} />
                <input name="cover" type="hidden" value={designDraft.cover.style} />

                <div>
                  <p className="lm-kicker">نمط التصميم</p>
                  <p className="mt-1 text-sm text-[var(--lm-muted)]">
                    اختر التكوين البصري الأنسب لطابع مناسبتك.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {invitationVariants.map((variant) => {
                      const meta = designRegistry.variants[variant];
                      const isSelected = designDraft.variant === variant;

                      return (
                        <label
                          key={variant}
                          className={`relative flex cursor-pointer flex-col rounded-xl border p-3 transition-all ${
                            isSelected
                              ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)]/20 shadow-xs ring-2 ring-[var(--lm-accent)]"
                              : "border-[var(--lm-line)] bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="variant"
                            value={variant}
                            checked={isSelected}
                            onChange={() => setDesignDraft((prev) => ({ ...prev, variant }))}
                            className="sr-only"
                          />

                          {/* CSS Mini-Preview Thumbnail */}
                          <VariantThumbnail variant={variant} />

                          <div className="mt-2.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-bold text-[var(--lm-ink)]">{meta.label.ar}</span>
                              {isSelected ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--lm-accent)] text-[10px] text-white">
                                  ✓
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[11px] font-medium text-[var(--lm-muted)]">{meta.label.en}</span>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--lm-muted)]">
                              {meta.description.ar}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Customization Controls */}
                <div className="border-t border-[var(--lm-line)] pt-5">
                  <p className="lm-kicker">الألوان</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {palettePresets.map((palette) => {
                      const isSelected = designDraft.palette === palette;
                      return (
                        <label
                          key={palette}
                          className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-sm transition-all ${
                            isSelected
                              ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)] font-bold text-[var(--lm-ink)]"
                              : "border-[var(--lm-line)] text-[var(--lm-muted)] hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="palette"
                            value={palette}
                            checked={isSelected}
                            onChange={() => setDesignDraft((prev) => ({ ...prev, palette }))}
                            className="sr-only"
                          />
                          <PaletteSwatch palette={palette} />
                          <span>{designRegistry.palettes[palette]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[var(--lm-line)] pt-5">
                  <p className="lm-kicker">الخطوط</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {typographyPresets.map((typo) => {
                      const isSelected = designDraft.typography === typo;
                      return (
                        <label
                          key={typo}
                          className={`cursor-pointer rounded-lg border p-2.5 text-sm transition-all ${
                            isSelected
                              ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)] font-bold text-[var(--lm-ink)]"
                              : "border-[var(--lm-line)] text-[var(--lm-muted)] hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="typography"
                            value={typo}
                            checked={isSelected}
                            onChange={() => setDesignDraft((prev) => ({ ...prev, typography: typo }))}
                            className="sr-only"
                          />
                          <span>{designRegistry.typography[typo]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[var(--lm-line)] pt-5">
                  <p className="lm-kicker">حجم النص</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {textScales.map((scale) => {
                      const isSelected = designDraft.textScale === scale;
                      return (
                        <label
                          key={scale}
                          className={`cursor-pointer text-center rounded-lg border p-2.5 text-xs transition-all ${
                            isSelected
                              ? "border-[var(--lm-accent)] bg-[var(--lm-accent-soft)] font-bold text-[var(--lm-ink)]"
                              : "border-[var(--lm-line)] text-[var(--lm-muted)] hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="text_scale"
                            value={scale}
                            checked={isSelected}
                            onChange={() => setDesignDraft((prev) => ({ ...prev, textScale: scale }))}
                            className="sr-only"
                          />
                          <span>{designRegistry.textScales[scale]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button className="lm-button lm-button-accent mt-6 w-full" type="submit">
                  حفظ وتطبيق التصميم
                </button>
              </form>
            ) : null}

            {tab === "sections" ? (
              <>
                <p className="lm-kicker">أقسام الدعوة</p>
                <p className="mt-2 text-sm text-[var(--lm-muted)]">رتّب الأقسام وشغّل ما تحتاجه.</p>
                <div className="mt-5 space-y-3">
                  {Object.values(invitationSections).map((definition) => {
                    const section = invitation.sections.find((item) => item.section_type === definition.id);
                    return (
                      <div className="rounded-xl border border-[var(--lm-line)] p-3" key={definition.id}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold">{definition.label.ar}</p>
                            <p className="text-xs text-[var(--lm-muted)]">
                              {definition.implemented
                                ? definition.required
                                  ? "أساسي"
                                  : section?.enabled
                                  ? "ظاهر"
                                  : "مخفي"
                                : "قريبًا"}
                            </p>
                          </div>
                          {definition.implemented && section && !definition.required ? (
                            <form action={updateInvitationSection}>
                              <input name="event_id" type="hidden" value={invitation.event.id} />
                              <input name="section_id" type="hidden" value={definition.id} />
                              <input name="intent" type="hidden" value="toggle" />
                              <button className="lm-button lm-button-quiet" type="submit">
                                {section.enabled ? "إخفاء" : "إظهار"}
                              </button>
                            </form>
                          ) : null}
                        </div>
                        {definition.implemented && section ? (
                          <div className="mt-3 flex gap-2">
                            <MoveButton
                              eventId={invitation.event.id}
                              sectionId={definition.id}
                              intent="up"
                              label="تحريك للأعلى"
                            />
                            <MoveButton
                              eventId={invitation.event.id}
                              sectionId={definition.id}
                              intent="down"
                              label="تحريك للأسفل"
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <StoryManager eventId={invitation.event.id} items={invitation.storyItems} />
              </>
            ) : null}
          </section>

          {/* Live Preview Panel */}
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-bold">معاينة حية</p>
                <p className="text-sm text-[var(--lm-muted)]">تحديث فوري لكل التغييرات.</p>
              </div>
              <div className="flex rounded-lg bg-white p-1 shadow-xs border border-[var(--lm-line)]">
                <button
                  className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                    mode === "mobile" ? "bg-[var(--lm-ink)] text-white" : "text-[var(--lm-muted)] hover:text-black"
                  }`}
                  onClick={() => setMode("mobile")}
                  type="button"
                >
                  موبايل
                </button>
                <button
                  className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${
                    mode === "desktop" ? "bg-[var(--lm-ink)] text-white" : "text-[var(--lm-muted)] hover:text-black"
                  }`}
                  onClick={() => setMode("desktop")}
                  type="button"
                >
                  ديسكتوب
                </button>
              </div>
            </div>

            <div
              className={`overflow-hidden rounded-[1.5rem] border border-[var(--lm-line)] bg-white shadow-[var(--lm-shadow)] transition-all duration-200 ${
                mode === "mobile" ? "mx-auto max-w-[390px]" : "w-full"
              }`}
            >
              <InvitationRenderer invitation={preview} locale={invitation.event.primary_locale} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function VariantThumbnail({ variant }: { variant: InvitationVariant }) {
  if (variant === "editorial") {
    return (
      <div className="flex h-16 w-full flex-col items-center justify-center rounded-lg border border-[#eddcd0] bg-[#fdfaf7] p-2 text-[#2b221a]">
        <div className="h-1 w-6 rounded-full bg-[#c96242]" />
        <div className="mt-1.5 h-1.5 w-14 rounded-full bg-current/60" />
        <div className="mt-1 h-1 w-20 rounded-full bg-current/25" />
        <div className="mt-2 h-px w-10 bg-current/20" />
      </div>
    );
  }

  if (variant === "statement") {
    return (
      <div className="flex h-16 w-full flex-col justify-between rounded-lg border-2 border-black/30 bg-white p-2 text-black">
        <div className="flex justify-between items-center">
          <div className="h-1.5 w-4 bg-black" />
          <div className="h-1 w-6 bg-black/40" />
        </div>
        <div className="h-4 w-full bg-black/80 rounded-xs" />
        <div className="h-1.5 w-12 bg-[#c96242]" />
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className="grid h-16 w-full grid-cols-12 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="col-span-5 bg-gray-50 p-1.5 flex flex-col justify-center border-r border-gray-200">
          <div className="h-1.5 w-5 bg-blue-600 rounded-full" />
          <div className="mt-1.5 h-2 w-7 bg-gray-800 rounded-xs" />
        </div>
        <div className="col-span-7 p-1.5 flex flex-col justify-around">
          <div className="h-1 w-full bg-gray-300 rounded-full" />
          <div className="h-1 w-3/4 bg-gray-200 rounded-full" />
          <div className="h-1.5 w-8 bg-gray-800 rounded-xs" />
        </div>
      </div>
    );
  }

  if (variant === "framed") {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg border border-amber-200 bg-[#fffdfa] p-1.5">
        <div className="flex h-full w-full flex-col items-center justify-center rounded border border-amber-300/80 p-1">
          <div className="text-[7px] text-amber-700 leading-none">❖</div>
          <div className="mt-1 h-1.5 w-10 bg-amber-900/70 rounded-xs" />
          <div className="mt-1 h-1 w-6 border-y border-amber-400" />
        </div>
      </div>
    );
  }

  if (variant === "soft-organic") {
    return (
      <div className="relative flex h-16 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-pink-200 bg-[#fff5f8] p-2">
        <div className="absolute -top-4 h-12 w-12 rounded-full bg-pink-300/30 blur-xs" />
        <div className="relative h-1.5 w-8 rounded-full bg-[#a75f79]" />
        <div className="relative mt-1.5 h-2 w-12 rounded-full bg-pink-900/60" />
        <div className="relative mt-1.5 h-1.5 w-6 rounded-full bg-pink-200" />
      </div>
    );
  }

  // dark-modern
  return (
    <div className="flex h-16 w-full flex-col justify-between rounded-lg border border-[#27394a] bg-[#0e141a] p-2 text-white">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#df7c51]" />
        <span className="h-1 w-6 bg-white/40 rounded-full" />
      </div>
      <div className="h-2 w-14 bg-white rounded-xs" />
      <div className="h-1.5 w-full rounded-xs bg-white/10 border border-white/20" />
    </div>
  );
}

function PaletteSwatch({ palette }: { palette: PalettePreset }) {
  const colors: Record<PalettePreset, { surface: string; accent: string }> = {
    warm: { surface: "#fdfaf7", accent: "#c96242" },
    soft: { surface: "#fdf7fa", accent: "#a75f79" },
    botanical: { surface: "#f6f9f6", accent: "#437552" },
    midnight: { surface: "#182129", accent: "#df7c51" },
    celebration: { surface: "#fbf7fd", accent: "#804ca7" },
  };

  const item = colors[palette];

  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/10 shadow-2xs"
      style={{ backgroundColor: item.surface }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
    </span>
  );
}

function MoveButton({
  eventId,
  sectionId,
  intent,
  label,
}: {
  eventId: string;
  sectionId: string;
  intent: "up" | "down";
  label: string;
}) {
  return (
    <form action={updateInvitationSection}>
      <input name="event_id" type="hidden" value={eventId} />
      <input name="section_id" type="hidden" value={sectionId} />
      <input name="intent" type="hidden" value={intent} />
      <button aria-label={label} className="lm-button lm-button-quiet px-3 py-1 text-xs" type="submit">
        {intent === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}
