import React from "react";
import { occasionLabels } from "@/config/occasions";
import {
  getVariantTokens,
  textScaleTokens,
  typographyTokens,
  type InvitationVariant,
  type ThemeTokens,
} from "@/config/invitation-design";
import { invitationSections, type InvitationSectionId } from "@/config/invitation-sections";
import type { Locale } from "@/types/locale";
import { formatInvitationDate, getInvitationDateParts, getTextDirection } from "./content";
import { Countdown } from "./countdown";
import type { InvitationModel } from "./types";

type Props = {
  invitation: InvitationModel;
  locale: Locale;
};

type SectionProps = Props & {
  tokens: ThemeTokens;
  variant: InvitationVariant;
};

function isSafeLocationUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

// =============================================================================
// HERO SECTIONS BY VARIANT
// =============================================================================

function EditorialHero({ invitation, locale, tokens }: SectionProps) {
  const { event, content, themeConfig } = invitation;
  const isCentered = themeConfig.cover.style === "centered";

  return (
    <header className={`relative px-6 pt-16 pb-14 sm:px-12 sm:pt-24 sm:pb-20 ${isCentered ? "text-center" : "text-start"}`}>
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-current/15 px-3 py-1 text-xs font-semibold tracking-widest uppercase opacity-75">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${tokens.accent}`} />
          {occasionLabels[event.occasion_type][locale]}
        </div>

        {content.headline ? (
          <p
            className={`mt-8 font-light opacity-80 ${textScaleTokens[themeConfig.textScale]}`}
            dir={getTextDirection(content.headline)}
          >
            {content.headline}
          </p>
        ) : null}

        <h1
          className="mt-4 text-4xl font-light tracking-tight sm:text-6xl md:text-7xl"
          dir="auto"
        >
          {content.host_names || event.title}
        </h1>

        {content.host_names ? (
          <p className="mt-3 text-lg opacity-70" dir="auto">
            {event.title}
          </p>
        ) : null}

        {event.event_date ? (
          <div className="mt-10 inline-flex items-center gap-4 border-y border-current/20 py-3 text-sm font-medium tracking-wide">
            <span>{formatInvitationDate(event.event_date, locale)}</span>
            {event.venue_name ? (
              <>
                <span className="opacity-30">•</span>
                <span dir="auto">{event.venue_name}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function StatementHero({ invitation, locale, tokens }: SectionProps) {
  const { event, content, themeConfig } = invitation;

  return (
    <header className="relative border-b-2 border-current/15 px-6 pt-16 pb-12 sm:px-12 sm:pt-24 sm:pb-16 text-start">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className={`inline-block px-3 py-1 text-xs font-black tracking-widest uppercase text-white ${tokens.accent}`}>
            {occasionLabels[event.occasion_type][locale]}
          </span>
          {event.event_date ? (
            <span className="text-xs font-black tracking-widest uppercase opacity-75">
              {formatInvitationDate(event.event_date, locale)}
            </span>
          ) : null}
        </div>

        <h1
          className="mt-8 text-5xl font-black leading-[0.92] tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
          dir="auto"
        >
          {content.host_names || event.title}
        </h1>

        <div className="mt-8 flex flex-col gap-4 border-t-2 border-current/15 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          {content.headline ? (
            <p
              className={`max-w-xl font-bold ${textScaleTokens[themeConfig.textScale]}`}
              dir={getTextDirection(content.headline)}
            >
              {content.headline}
            </p>
          ) : <div />}
          {content.host_names ? (
            <span className="text-sm font-bold uppercase tracking-wider opacity-60" dir="auto">
              {event.title}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function SplitHero({ invitation, locale, tokens }: SectionProps) {
  const { event, content, themeConfig } = invitation;

  return (
    <header className="px-6 pt-14 pb-10 sm:px-10 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-5xl">
        <div className="inline-block rounded-md border border-current/20 px-3 py-1 text-xs font-bold tracking-widest uppercase opacity-70">
          {occasionLabels[event.occasion_type][locale]}
        </div>

        <div className="mt-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-current/40 pl-5 rtl:pl-0 rtl:pr-5">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
            dir="auto"
          >
            {content.host_names || event.title}
          </h1>

          {content.host_names ? (
            <p className="mt-2 text-base font-medium opacity-70" dir="auto">
              {event.title}
            </p>
          ) : null}
        </div>

        {content.headline ? (
          <p
            className={`mt-6 max-w-xl leading-relaxed opacity-85 ${textScaleTokens[themeConfig.textScale]}`}
            dir={getTextDirection(content.headline)}
          >
            {content.headline}
          </p>
        ) : null}

        {event.event_date ? (
          <div className="mt-8 flex items-center gap-3">
            <span className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold ${tokens.badge}`}>
              {formatInvitationDate(event.event_date, locale)}
            </span>
            {event.venue_name ? (
              <span className="text-sm font-medium opacity-80" dir="auto">
                📍 {event.venue_name}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function FramedHero({ invitation, locale, tokens }: SectionProps) {
  const { event, content, themeConfig } = invitation;

  return (
    <header className="px-6 pt-12 pb-8 sm:px-12 sm:pt-16 sm:pb-10 text-center">
      <div className="mx-auto max-w-xl">
        {/* Geometric diamond accent */}
        <div className="flex items-center justify-center gap-3 opacity-60">
          <span className="h-px w-12 bg-current" />
          <span className={`text-xs ${tokens.accentText}`}>❖</span>
          <span className="text-xs font-bold tracking-[0.25em] uppercase">
            {occasionLabels[event.occasion_type][locale]}
          </span>
          <span className={`text-xs ${tokens.accentText}`}>❖</span>
          <span className="h-px w-12 bg-current" />
        </div>

        {content.headline ? (
          <p
            className={`mt-6 font-serif italic opacity-85 ${textScaleTokens[themeConfig.textScale]}`}
            dir={getTextDirection(content.headline)}
          >
            &ldquo;{content.headline}&rdquo;
          </p>
        ) : null}

        <h1
          className="mt-6 text-3xl font-serif font-bold tracking-tight sm:text-5xl md:text-6xl"
          dir="auto"
        >
          {content.host_names || event.title}
        </h1>

        {content.host_names ? (
          <p className="mt-3 text-sm font-medium uppercase tracking-widest opacity-60" dir="auto">
            {event.title}
          </p>
        ) : null}

        {event.event_date ? (
          <div className="mt-8 inline-block border-y border-current/25 px-8 py-2 text-xs font-bold tracking-widest uppercase">
            {formatInvitationDate(event.event_date, locale)}
          </div>
        ) : null}
      </div>
    </header>
  );
}

function SoftOrganicHero({ invitation, locale, tokens }: SectionProps) {
  const { event, content, themeConfig } = invitation;

  return (
    <header className="relative overflow-hidden px-6 pt-16 pb-12 sm:px-12 sm:pt-24 sm:pb-16 text-center">
      {/* Soft ambient radial aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className={`h-80 w-80 rounded-full blur-3xl ${tokens.accent}`} />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide ${tokens.badge}`}>
          {occasionLabels[event.occasion_type][locale]}
        </span>

        {content.headline ? (
          <p
            className={`mt-6 font-medium opacity-80 ${textScaleTokens[themeConfig.textScale]}`}
            dir={getTextDirection(content.headline)}
          >
            {content.headline}
          </p>
        ) : null}

        <h1
          className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          dir="auto"
        >
          {content.host_names || event.title}
        </h1>

        {content.host_names ? (
          <p className="mt-3 text-base opacity-70" dir="auto">
            {event.title}
          </p>
        ) : null}

        {event.event_date ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-current/15 bg-white/40 px-5 py-2 text-xs font-bold backdrop-blur-xs">
            <span>🗓️</span>
            <span>{formatInvitationDate(event.event_date, locale)}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function DarkModernHero({ invitation, locale, tokens }: SectionProps) {
  const { event, content, themeConfig } = invitation;

  return (
    <header className="relative border-b border-white/10 px-6 pt-16 pb-14 sm:px-12 sm:pt-24 sm:pb-20 text-start">
      {/* Subtle top spotlight glow */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/5 to-transparent" />

      <div className="relative mx-auto max-w-4xl">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${tokens.accent}`} />
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/60">
            {occasionLabels[event.occasion_type][locale]}
          </span>
        </div>

        {content.headline ? (
          <p
            className={`mt-8 font-light text-white/80 ${textScaleTokens[themeConfig.textScale]}`}
            dir={getTextDirection(content.headline)}
          >
            {content.headline}
          </p>
        ) : null}

        <h1
          className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl"
          dir="auto"
        >
          {content.host_names || event.title}
        </h1>

        {content.host_names ? (
          <p className="mt-3 text-sm font-mono uppercase tracking-wider text-white/50" dir="auto">
            {event.title}
          </p>
        ) : null}

        {event.event_date ? (
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono text-white/90">
            <span className={tokens.accentText}>{"//"}</span>
            <span>{formatInvitationDate(event.event_date, locale)}</span>
            {event.venue_name ? (
              <>
                <span className="text-white/30">•</span>
                <span dir="auto">{event.venue_name}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

// =============================================================================
// INVITATION TEXT SECTIONS BY VARIANT
// =============================================================================

function EditorialText({ invitation, tokens }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;

  return (
    <section className="px-6 py-14 sm:px-12 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-8 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-current/20" />
          <span className={`h-1.5 w-1.5 rounded-full ${tokens.accent}`} />
          <span className="h-px w-10 bg-current/20" />
        </div>
        <p
          className={`leading-relaxed whitespace-pre-line opacity-90 ${textScaleTokens[invitation.themeConfig.textScale]}`}
          dir={getTextDirection(text)}
        >
          {text}
        </p>
        <div className="mx-auto mt-8 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-current/20" />
          <span className={`h-1.5 w-1.5 rounded-full ${tokens.accent}`} />
          <span className="h-px w-10 bg-current/20" />
        </div>
      </div>
    </section>
  );
}

function StatementText({ invitation }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;

  return (
    <section className="border-b-2 border-current/15 px-6 py-12 sm:px-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p
          className={`font-bold leading-snug whitespace-pre-line opacity-95 ${textScaleTokens[invitation.themeConfig.textScale]}`}
          dir={getTextDirection(text)}
        >
          {text}
        </p>
      </div>
    </section>
  );
}

function SplitText({ invitation, tokens }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-12">
      <div className={`rounded-xl border ${tokens.border} bg-white/40 p-6 sm:p-8 backdrop-blur-xs`}>
        <p
          className={`leading-relaxed whitespace-pre-line opacity-90 ${textScaleTokens[invitation.themeConfig.textScale]}`}
          dir={getTextDirection(text)}
        >
          {text}
        </p>
      </div>
    </section>
  );
}

function FramedText({ invitation }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;

  return (
    <section className="px-6 py-10 sm:px-12 sm:py-14 text-center">
      <div className="mx-auto max-w-xl rounded-lg border border-dashed border-current/25 p-6 sm:p-8">
        <p
          className={`font-serif leading-loose whitespace-pre-line opacity-90 ${textScaleTokens[invitation.themeConfig.textScale]}`}
          dir={getTextDirection(text)}
        >
          {text}
        </p>
      </div>
    </section>
  );
}

function SoftOrganicText({ invitation }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;

  return (
    <section className="px-6 py-12 sm:px-12 sm:py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-current/10 bg-white/55 p-8 text-center shadow-xs backdrop-blur-xs">
        <p
          className={`leading-relaxed whitespace-pre-line opacity-90 ${textScaleTokens[invitation.themeConfig.textScale]}`}
          dir={getTextDirection(text)}
        >
          {text}
        </p>
      </div>
    </section>
  );
}

function DarkModernText({ invitation }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;

  return (
    <section className="border-b border-white/10 px-6 py-14 sm:px-12 sm:py-20">
      <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 backdrop-blur-xs">
        <p
          className={`leading-relaxed whitespace-pre-line text-white/90 ${textScaleTokens[invitation.themeConfig.textScale]}`}
          dir={getTextDirection(text)}
        >
          {text}
        </p>
      </div>
    </section>
  );
}

// =============================================================================
// EVENT DETAILS SECTIONS BY VARIANT
// =============================================================================

function EditorialDetails({ invitation, locale }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  const dateParts = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;

  return (
    <section className="px-6 py-12 sm:px-12 sm:py-16">
      <div className="mx-auto grid max-w-3xl gap-8 border-y border-current/20 py-10 sm:grid-cols-2 text-center sm:text-start">
        {dateParts ? (
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase opacity-60">
              {locale === "ar" ? "التاريخ" : "Date"}
            </span>
            <div className="mt-3 flex items-baseline gap-3 justify-center sm:justify-start">
              <span className="text-5xl font-light">{dateParts.day}</span>
              <div>
                <span className="block font-bold">{dateParts.monthLong}</span>
                <span className="block text-xs opacity-70">{dateParts.weekday}, {dateParts.year}</span>
              </div>
            </div>
          </div>
        ) : null}

        {event.venue_name ? (
          <div className="flex flex-col justify-center border-t border-current/15 pt-6 sm:border-t-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r sm:border-current/15 sm:pt-0 sm:pl-8 rtl:sm:pl-0 rtl:sm:pr-8">
            <span className="text-xs font-semibold tracking-widest uppercase opacity-60">
              {locale === "ar" ? "المكان والموقع" : "Venue"}
            </span>
            <strong className="mt-3 block text-2xl font-normal leading-snug" dir="auto">
              {event.venue_name}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StatementDetails({ invitation, locale, tokens }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  const dateParts = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;

  return (
    <section className="border-b-2 border-current/15 px-6 py-12 sm:px-12 sm:py-16">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {dateParts ? (
          <div className={`border-2 p-6 sm:p-8 ${tokens.border}`}>
            <span className="block text-xs font-black tracking-widest uppercase opacity-60">
              {locale === "ar" ? "التاريخ" : "When"}
            </span>
            <div className="mt-4 flex items-baseline gap-4">
              <span className={`text-6xl font-black sm:text-7xl ${tokens.accentText}`}>{dateParts.day}</span>
              <div>
                <span className="block text-xl font-black">{dateParts.monthLong}</span>
                <span className="block text-sm font-bold opacity-75">{dateParts.weekday} {dateParts.year}</span>
              </div>
            </div>
          </div>
        ) : null}

        {event.venue_name ? (
          <div className={`border-2 p-6 sm:p-8 ${tokens.border}`}>
            <span className="block text-xs font-black tracking-widest uppercase opacity-60">
              {locale === "ar" ? "الموقع" : "Where"}
            </span>
            <strong className="mt-4 block text-2xl font-black leading-tight sm:text-3xl" dir="auto">
              {event.venue_name}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SplitDetails({ invitation, locale, tokens }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  const dateParts = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {dateParts ? (
          <div className="rounded-xl border border-current/15 bg-white/50 p-5 backdrop-blur-xs">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              {locale === "ar" ? "التاريخ" : "Date"}
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className={`text-3xl font-extrabold ${tokens.accentText}`}>{dateParts.day}</span>
              <div>
                <span className="block font-bold">{dateParts.monthLong}</span>
                <span className="text-xs opacity-70">{dateParts.weekday}</span>
              </div>
            </div>
          </div>
        ) : null}

        {event.venue_name ? (
          <div className="rounded-xl border border-current/15 bg-white/50 p-5 backdrop-blur-xs">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              {locale === "ar" ? "الموقع" : "Location"}
            </span>
            <strong className="mt-2 block text-lg font-bold leading-snug" dir="auto">
              {event.venue_name}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FramedDetails({ invitation, locale }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  return (
    <section className="px-6 py-8 sm:px-12 sm:py-12 text-center">
      <div className="mx-auto max-w-xl border-t border-b border-current/25 py-8">
        {event.event_date ? (
          <div className="mb-6">
            <span className="text-xs font-serif italic tracking-widest uppercase opacity-60">
              {locale === "ar" ? "يوم المناسبة" : "The Date"}
            </span>
            <strong className="mt-2 block font-serif text-2xl font-bold">
              {formatInvitationDate(event.event_date, locale)}
            </strong>
          </div>
        ) : null}

        {event.venue_name ? (
          <div>
            <span className="text-xs font-serif italic tracking-widest uppercase opacity-60">
              {locale === "ar" ? "المكان" : "The Venue"}
            </span>
            <strong className="mt-2 block font-serif text-2xl font-bold" dir="auto">
              {event.venue_name}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SoftOrganicDetails({ invitation, locale, tokens }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  const dateParts = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;

  return (
    <section className="px-6 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2 text-center">
        {dateParts ? (
          <div className="rounded-3xl border border-current/10 bg-white/60 p-6 shadow-xs backdrop-blur-xs">
            <span className="text-xs font-bold tracking-wide opacity-60">
              {locale === "ar" ? "التاريخ" : "Date"}
            </span>
            <span className={`mt-2 block text-4xl font-bold ${tokens.accentText}`}>{dateParts.day}</span>
            <span className="block font-semibold">{dateParts.monthLong}</span>
            <span className="text-xs opacity-70">{dateParts.weekday}, {dateParts.year}</span>
          </div>
        ) : null}

        {event.venue_name ? (
          <div className="flex flex-col justify-center rounded-3xl border border-current/10 bg-white/60 p-6 shadow-xs backdrop-blur-xs">
            <span className="text-xs font-bold tracking-wide opacity-60">
              {locale === "ar" ? "المكان" : "Venue"}
            </span>
            <strong className="mt-3 block text-xl font-bold" dir="auto">
              {event.venue_name}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DarkModernDetails({ invitation, locale, tokens }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  const dateParts = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;

  return (
    <section className="border-b border-white/10 px-6 py-12 sm:px-12 sm:py-16">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {dateParts ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xs">
            <span className="text-xs font-mono tracking-widest uppercase text-white/50">
              {locale === "ar" ? "التاريخ" : "Date"}
            </span>
            <div className="mt-4 flex items-baseline gap-4">
              <span className={`text-5xl font-mono font-bold ${tokens.accentText}`}>{dateParts.day}</span>
              <div>
                <span className="block font-bold text-white">{dateParts.monthLong}</span>
                <span className="block text-xs font-mono text-white/60">{dateParts.weekday} {dateParts.year}</span>
              </div>
            </div>
          </div>
        ) : null}

        {event.venue_name ? (
          <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xs">
            <span className="text-xs font-mono tracking-widest uppercase text-white/50">
              {locale === "ar" ? "الموقع" : "Location"}
            </span>
            <strong className="mt-3 block text-xl font-bold text-white leading-snug" dir="auto">
              {event.venue_name}
            </strong>
          </div>
        ) : null}
      </div>
    </section>
  );
}

// =============================================================================
// LOCATION SECTIONS BY VARIANT
// =============================================================================

function EditorialLocation({ invitation, locale, tokens }: SectionProps) {
  const url = invitation.event.location_url;
  if (!url || !isSafeLocationUrl(url)) return null;

  return (
    <section className="px-6 py-10 sm:py-14 text-center">
      <a
        className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 ${tokens.accent}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>📍</span>
        <span>{locale === "ar" ? "عرض الموقع على الخريطة" : "Open in Maps"}</span>
      </a>
    </section>
  );
}

function StatementLocation({ invitation, locale, tokens }: SectionProps) {
  const url = invitation.event.location_url;
  if (!url || !isSafeLocationUrl(url)) return null;

  return (
    <section className="border-b-2 border-current/15 px-6 py-10 sm:px-12 sm:py-14 text-center">
      <a
        className={`inline-block w-full max-w-md px-8 py-4 text-center text-sm font-black uppercase tracking-wider text-white transition-opacity hover:opacity-90 ${tokens.accent}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {locale === "ar" ? "احصل على الاتجاهات ↗" : "Get Directions ↗"}
      </a>
    </section>
  );
}

function SplitLocation({ invitation, locale, tokens }: SectionProps) {
  const url = invitation.event.location_url;
  if (!url || !isSafeLocationUrl(url)) return null;

  return (
    <section className="px-6 py-8 sm:px-10 sm:py-10">
      <a
        className={`flex items-center justify-between rounded-xl px-6 py-4 text-sm font-bold text-white transition-opacity hover:opacity-95 ${tokens.accent}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{locale === "ar" ? "خريطة الوصول للمناسبة" : "Event Directions"}</span>
        <span className="text-lg">→</span>
      </a>
    </section>
  );
}

function FramedLocation({ invitation, locale, tokens }: SectionProps) {
  const url = invitation.event.location_url;
  if (!url || !isSafeLocationUrl(url)) return null;

  return (
    <section className="px-6 py-10 text-center">
      <a
        className={`inline-flex items-center gap-2 border px-6 py-3 font-serif text-xs font-bold tracking-widest uppercase transition-colors hover:bg-current/5 ${tokens.border}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className={tokens.accentText}>❖</span>
        <span>{locale === "ar" ? "موقع المناسبة" : "Directions"}</span>
        <span className={tokens.accentText}>❖</span>
      </a>
    </section>
  );
}

function SoftOrganicLocation({ invitation, locale, tokens }: SectionProps) {
  const url = invitation.event.location_url;
  if (!url || !isSafeLocationUrl(url)) return null;

  return (
    <section className="px-6 py-10 text-center">
      <a
        className={`inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-transform hover:scale-[1.02] ${tokens.accent}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>🗺️</span>
        <span>{locale === "ar" ? "طريق الوصول" : "Directions"}</span>
      </a>
    </section>
  );
}

function DarkModernLocation({ invitation, locale, tokens }: SectionProps) {
  const url = invitation.event.location_url;
  if (!url || !isSafeLocationUrl(url)) return null;

  return (
    <section className="px-6 py-12 text-center">
      <a
        className={`inline-flex items-center gap-3 rounded-lg border border-white/20 px-8 py-3.5 text-sm font-mono font-bold text-white transition-all hover:border-white/40 ${tokens.accent}`}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>[MAP]</span>
        <span>{locale === "ar" ? "الاتجاهات والخريطة" : "Access Location"}</span>
        <span>→</span>
      </a>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function UniversalFooter({ locale }: { locale: Locale; variant?: InvitationVariant }) {
  return (
    <footer className="px-6 py-12 text-center text-xs tracking-wider uppercase opacity-40">
      {locale === "ar" ? "صُنعت اللحظة عبر Lamma" : "Crafted with Lamma"}
    </footer>
  );
}

// =============================================================================
// SECTION MAPPINGS
// =============================================================================

type VariantSectionHandlers = {
  hero: (props: SectionProps) => React.ReactNode;
  "invitation-text": (props: SectionProps) => React.ReactNode;
  "event-details": (props: SectionProps) => React.ReactNode;
  location: (props: SectionProps) => React.ReactNode;
};

const variantSections: Record<InvitationVariant, VariantSectionHandlers> = {
  editorial: {
    hero: EditorialHero,
    "invitation-text": EditorialText,
    "event-details": EditorialDetails,
    location: EditorialLocation,
  },
  statement: {
    hero: StatementHero,
    "invitation-text": StatementText,
    "event-details": StatementDetails,
    location: StatementLocation,
  },
  split: {
    hero: SplitHero,
    "invitation-text": SplitText,
    "event-details": SplitDetails,
    location: SplitLocation,
  },
  framed: {
    hero: FramedHero,
    "invitation-text": FramedText,
    "event-details": FramedDetails,
    location: FramedLocation,
  },
  "soft-organic": {
    hero: SoftOrganicHero,
    "invitation-text": SoftOrganicText,
    "event-details": SoftOrganicDetails,
    location: SoftOrganicLocation,
  },
  "dark-modern": {
    hero: DarkModernHero,
    "invitation-text": DarkModernText,
    "event-details": DarkModernDetails,
    location: DarkModernLocation,
  },
};

// =============================================================================
// MAIN INVITATION RENDERER
// =============================================================================

export function InvitationRenderer({ invitation, locale }: Props) {
  const { themeConfig } = invitation;
  const variant = themeConfig.variant || "editorial";
  const tokens = getVariantTokens(variant, themeConfig.palette);
  const handlers = variantSections[variant] || variantSections.editorial;

  const sortedSections = [...invitation.sections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.position - b.position);

  // Render standard sections
  const renderSection = (sectionType: InvitationSectionId, key: string) => {
    if (sectionType === "hero") {
      return <handlers.hero invitation={invitation} key={key} locale={locale} tokens={tokens} variant={variant} />;
    }
    if (sectionType === "invitation-text") {
      const TextComp = handlers["invitation-text"];
      return <TextComp invitation={invitation} key={key} locale={locale} tokens={tokens} variant={variant} />;
    }
    if (sectionType === "event-details") {
      const DetailsComp = handlers["event-details"];
      return <DetailsComp invitation={invitation} key={key} locale={locale} tokens={tokens} variant={variant} />;
    }
    if (sectionType === "location") {
      return <handlers.location invitation={invitation} key={key} locale={locale} tokens={tokens} variant={variant} />;
    }
    if (sectionType === "countdown") {
      return invitation.event.event_date ? <Countdown eventDate={invitation.event.event_date} key={key} locale={locale} timeZone={invitation.event.timezone} /> : null;
    }
    if (sectionType === "story") {
      return invitation.storyItems.length ? <section className="px-6 py-16 sm:px-12" key={key}><div className="mx-auto max-w-3xl"><p className="text-center text-sm font-semibold opacity-65">{locale === "ar" ? "حكايتنا" : "Our story"}</p><div className="mt-8 space-y-7">{[...invitation.storyItems].sort((a, b) => a.position - b.position).map((item) => <article className="border-s-2 border-current/20 ps-5" key={item.id}><p className="text-xs font-semibold opacity-60">{item.date_label}</p><h2 className="mt-1 text-xl font-bold" dir="auto">{item.title}</h2><p className="mt-2 whitespace-pre-line leading-7 opacity-80" dir="auto">{item.body}</p></article>)}</div></div></section> : null;
    }
    if (sectionType === "footer") {
      return <UniversalFooter key={key} locale={locale} variant={variant} />;
    }
    return null;
  };

  // 1. SPLIT VARIANT: Desktop Asymmetric Split Presentation
  if (variant === "split") {
    const heroSection = sortedSections.find((s) => s.section_type === "hero");
    const otherSections = sortedSections.filter((s) => s.section_type !== "hero");

    return (
      <article
        className={`min-h-full overflow-hidden ${tokens.surface} ${tokens.text} ${typographyTokens[themeConfig.typography]}`}
      >
        {/* Desktop Split Layout */}
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-12 lg:min-h-[700px]">
          {/* Side A: Anchor Identity Column */}
          <div className="lg:col-span-5 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-current/15 lg:sticky lg:top-0 lg:h-fit">
            {heroSection ? (
              <handlers.hero
                invitation={invitation}
                locale={locale}
                tokens={tokens}
                variant={variant}
              />
            ) : null}
          </div>

          {/* Side B: Flowing Details & Action Column */}
          <div className="lg:col-span-7 flex flex-col justify-between py-6">
            <div className="space-y-2">
              {otherSections.map((section) => {
                const def = invitationSections[section.section_type];
                return def?.implemented ? renderSection(section.section_type, section.id) : null;
              })}
            </div>
            <UniversalFooter locale={locale} variant={variant} />
          </div>
        </div>
      </article>
    );
  }

  // 2. FRAMED VARIANT: Modern Framed Card Layout
  if (variant === "framed") {
    return (
      <article
        className={`min-h-full overflow-hidden px-4 py-8 sm:px-8 sm:py-16 ${tokens.surface} ${tokens.text} ${typographyTokens[themeConfig.typography]}`}
      >
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-current/20 p-2 sm:p-3 shadow-md bg-white/40 backdrop-blur-xs">
          <div className="relative rounded-xl border border-current/25 p-4 sm:p-8">
            {/* Elegant corner accents */}
            <span className="absolute top-2 left-2 text-[10px] opacity-40">┌</span>
            <span className="absolute top-2 right-2 text-[10px] opacity-40">┐</span>
            <span className="absolute bottom-2 left-2 text-[10px] opacity-40">└</span>
            <span className="absolute bottom-2 right-2 text-[10px] opacity-40">┘</span>

            {sortedSections.map((section) => {
              const def = invitationSections[section.section_type];
              return def?.implemented ? renderSection(section.section_type, section.id) : null;
            })}
          </div>
        </div>
      </article>
    );
  }

  // 3. SOFT ORGANIC VARIANT: Curved Arch & Fluid Containers
  if (variant === "soft-organic") {
    return (
      <article
        className={`min-h-full overflow-hidden ${tokens.surface} ${tokens.text} ${typographyTokens[themeConfig.typography]}`}
      >
        <div className="mx-auto max-w-3xl pb-12">
          {sortedSections.map((section) => {
            const def = invitationSections[section.section_type];
            return def?.implemented ? renderSection(section.section_type, section.id) : null;
          })}
        </div>
      </article>
    );
  }

  // 4. DARK MODERN, EDITORIAL, STATEMENT: Standard Fluid Flows
  return (
    <article
      className={`min-h-full overflow-hidden ${tokens.surface} ${tokens.text} ${typographyTokens[themeConfig.typography]}`}
    >
      <div className="mx-auto max-w-4xl">
        {sortedSections.map((section) => {
          const def = invitationSections[section.section_type];
          return def?.implemented ? renderSection(section.section_type, section.id) : null;
        })}
      </div>
    </article>
  );
}
