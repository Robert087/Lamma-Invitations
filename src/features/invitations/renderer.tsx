import React from "react";
import { occasionLabels } from "@/config/occasions";
import { getVariantTokens, textScaleTokens, typographyTokens, type InvitationVariant, type ThemeTokens } from "@/config/invitation-design";
import { invitationSections, type InvitationSectionId } from "@/config/invitation-sections";
import type { Locale } from "@/types/locale";
import { getInvitationDateParts, getTextDirection } from "./content";
import { Countdown } from "./countdown";
import type { InvitationModel, StoryItem } from "./types";

type Props = { invitation: InvitationModel; locale: Locale };
type SectionProps = Props & { tokens: ThemeTokens; variant: InvitationVariant };

function safeUrl(value: string | null) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? value : null; } catch { return null; }
}

function Label({ children, tokens }: { children: React.ReactNode; tokens: ThemeTokens }) {
  return <span className={`lm-invite-label ${tokens.accentText}`}>{children}</span>;
}

function Hero({ invitation, locale, tokens, variant }: SectionProps) {
  const { event, content, themeConfig } = invitation;
  const names = content.host_names || event.title;
  const date = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;
  const occasion = occasionLabels[event.occasion_type][locale];
  if (variant === "statement") return <header className="lm-template-hero lm-hero-statement"><div className="lm-hero-index">{occasion}</div><h1 dir="auto">{names}</h1><div className="lm-hero-baseline"><span>{content.headline || event.title}</span>{date && <b>{date.day} / {date.month} / {date.year}</b>}</div></header>;
  if (variant === "split") return <header className="lm-template-hero lm-hero-split"><div className="lm-split-mark"><span>{date?.year || ""}</span><span>{occasion}</span></div><div><p className="lm-hero-eyebrow">{content.headline || occasion}</p><h1 dir="auto">{names}</h1>{date && <p className="lm-hero-date">{date.full}</p>}</div></header>;
  if (variant === "framed") return <header className="lm-template-hero lm-hero-framed"><Label tokens={tokens}>{occasion}</Label><h1 dir="auto">{names}</h1>{content.headline && <p dir={getTextDirection(content.headline)}>{content.headline}</p>}{date && <div className="lm-framed-date">{date.full}</div>}</header>;
  if (variant === "soft-organic") return <header className="lm-template-hero lm-hero-organic"><div className="lm-organic-arch"><Label tokens={tokens}>{occasion}</Label><h1 dir="auto">{names}</h1>{content.headline && <p dir={getTextDirection(content.headline)}>{content.headline}</p>} {date && <div className="lm-organic-date">{date.full}</div>}</div></header>;
  if (variant === "dark-modern") return <header className="lm-template-hero lm-hero-dark"><div className="lm-dark-grid" /><p className="lm-hero-eyebrow">{occasion} <span>/{date?.year}</span></p><h1 dir="auto">{names}</h1>{content.headline && <p className="lm-dark-headline" dir={getTextDirection(content.headline)}>{content.headline}</p>}{date && <div className="lm-dark-date">{date.full}</div>}</header>;
  return <header className={`lm-template-hero lm-hero-editorial ${themeConfig.cover.style === "centered" ? "is-centered" : ""}`}><div className="lm-editorial-rule"><Label tokens={tokens}>{occasion}</Label>{date && <span>{date.full}</span>}</div><h1 dir="auto">{names}</h1>{content.headline && <p dir={getTextDirection(content.headline)}>{content.headline}</p>}</header>;
}

function InvitationText({ invitation, tokens, variant }: SectionProps) {
  const text = invitation.content.invitation_text;
  if (!text) return null;
  const classes = { statement: "lm-copy-statement", split: "lm-copy-split", framed: "lm-copy-framed", "soft-organic": "lm-copy-organic", "dark-modern": "lm-copy-dark", editorial: "lm-copy-editorial" };
  return <section className={`lm-template-copy ${classes[variant]}`}><p className={`${textScaleTokens[invitation.themeConfig.textScale]}`} dir={getTextDirection(text)}>{variant === "framed" ? `“${text}”` : text}</p>{variant === "editorial" && <span className={`lm-copy-dot ${tokens.accent}`} />}</section>;
}

function Details({ invitation, locale, tokens, variant }: SectionProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;
  const date = event.event_date ? getInvitationDateParts(event.event_date, locale) : null;
  return <section className={`lm-template-details lm-details-${variant}`}><div className="lm-detail-date">{date && <><span className="lm-detail-day">{date.day}</span><span><b>{date.monthLong}</b><small>{date.weekday}, {date.year}</small></span></>}</div>{event.venue_name && <div className="lm-detail-venue"><Label tokens={tokens}>{locale === "ar" ? "المكان" : "The place"}</Label><strong dir="auto">{event.venue_name}</strong></div>}</section>;
}

function Story({ invitation, locale, variant }: { invitation: InvitationModel; locale: Locale; variant: InvitationVariant }) {
  const items = [...invitation.storyItems].filter((item) => item.title || item.body).sort((a, b) => a.position - b.position);
  if (!items.length) return null;
  return <section className={`lm-template-story lm-story-${variant}`}><div className="lm-story-heading"><span>{locale === "ar" ? "حكايتنا" : "Our story"}</span><h2>{locale === "ar" ? "من هنا بدأت الحكاية" : "The chapters that brought us here"}</h2></div><div className="lm-story-list">{items.map((item: StoryItem, index) => <article key={item.id}><span className="lm-story-number">{String(index + 1).padStart(2, "0")}</span><div>{item.date_label && <small>{item.date_label}</small>}<h3 dir="auto">{item.title}</h3><p dir="auto">{item.body}</p></div></article>)}</div></section>;
}

function Location({ invitation, locale, tokens, variant }: SectionProps) {
  const url = safeUrl(invitation.event.location_url);
  if (!url) return null;
  return <section className={`lm-template-location lm-location-${variant}`}><div><Label tokens={tokens}>{locale === "ar" ? "الموقع" : "Find us"}</Label><strong dir="auto">{invitation.event.venue_name || (locale === "ar" ? "افتح الخريطة" : "Open the map")}</strong></div><a href={url} target="_blank" rel="noopener noreferrer">{locale === "ar" ? "الاتجاهات" : "Directions"}<span>↗</span></a></section>;
}

function Footer({ locale }: { locale: Locale }) { return <footer className="lm-template-footer">{locale === "ar" ? "صُنعت اللحظة عبر Lamma" : "A moment by Lamma"}</footer>; }

export function InvitationRenderer({ invitation, locale }: Props) {
  const variant = invitation.themeConfig.variant || "editorial";
  const tokens = getVariantTokens(variant, invitation.themeConfig.palette);
  const enabled = [...invitation.sections].filter((section) => section.enabled && invitationSections[section.section_type]?.implemented).sort((a, b) => a.position - b.position);
  const render = (type: InvitationSectionId, id: string) => {
    const props = { invitation, locale, tokens, variant };
    if (type === "hero") return <Hero {...props} key={id} />;
    if (type === "invitation-text") return <InvitationText {...props} key={id} />;
    if (type === "event-details") return <Details {...props} key={id} />;
    if (type === "story") return <Story invitation={invitation} locale={locale} variant={variant} key={id} />;
    if (type === "location") return <Location {...props} key={id} />;
    if (type === "countdown" && invitation.event.event_date) return <div className={`lm-template-countdown lm-countdown-${variant}`} key={id}><Countdown eventDate={invitation.event.event_date} timeZone={invitation.event.timezone} locale={locale} /></div>;
    if (type === "footer") return <Footer locale={locale} key={id} />;
    return null;
  };
  const content = enabled.map((section) => render(section.section_type, section.id));
  const layout = variant === "split" ? "lm-invitation lm-layout-split" : variant === "framed" ? "lm-invitation lm-layout-framed" : variant === "soft-organic" ? "lm-invitation lm-layout-organic" : variant === "dark-modern" ? "lm-invitation lm-layout-dark" : variant === "statement" ? "lm-invitation lm-layout-statement" : "lm-invitation lm-layout-editorial";
  return <article className={`${layout} ${tokens.surface} ${tokens.text} ${typographyTokens[invitation.themeConfig.typography]}`} dir={locale === "ar" ? "rtl" : "ltr"}><div className="lm-invitation-flow">{content}</div></article>;
}
