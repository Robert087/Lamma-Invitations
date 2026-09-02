import { invitationSections, type InvitationSectionId } from "@/config/invitation-sections";
import type { Locale } from "@/types/locale";

import { formatInvitationDate, getLocaleDirection, getLocalizedContent } from "./content";
import type { InvitationModel } from "./types";

type InvitationRendererProps = {
  invitation: InvitationModel;
  locale: Locale;
};

function HeroSection({ invitation, locale }: InvitationRendererProps) {
  const hosts = getLocalizedContent(locale, invitation.content.host_names_ar, invitation.content.host_names_en);
  const headline = getLocalizedContent(locale, invitation.content.headline_ar, invitation.content.headline_en);

  return (
    <header className="rounded-2xl bg-stone-900 px-6 py-10 text-center text-stone-50">
      {headline ? <p className="text-sm tracking-wide text-stone-300">{headline}</p> : null}
      <h1 className="mt-3 text-3xl font-semibold">{invitation.event.title}</h1>
      {hosts ? <p className="mt-3 text-lg text-stone-200">{hosts}</p> : null}
      {invitation.event.event_date ? <p className="mt-5 text-sm text-stone-300">{formatInvitationDate(invitation.event.event_date, locale)}</p> : null}
    </header>
  );
}

function InvitationTextSection({ invitation, locale }: InvitationRendererProps) {
  const text = getLocalizedContent(locale, invitation.content.invitation_text_ar, invitation.content.invitation_text_en);

  return text ? <p className="whitespace-pre-line px-3 text-center text-base leading-8 text-stone-700">{text}</p> : null;
}

function EventDetailsSection({ invitation, locale }: InvitationRendererProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  return (
    <section className="rounded-xl bg-stone-100 p-5 text-center text-sm text-stone-700">
      {event.event_date ? <p>{formatInvitationDate(event.event_date, locale)}</p> : null}
      {event.venue_name ? <p className={event.event_date ? "mt-2" : ""}>{event.venue_name}</p> : null}
    </section>
  );
}

function LocationSection({ invitation, locale }: InvitationRendererProps) {
  if (!invitation.event.location_url) return null;

  return (
    <div className="text-center">
      <a className="inline-flex rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800" href={invitation.event.location_url} rel="noreferrer" target="_blank">
        {locale === "ar" ? "فتح الموقع" : "Open Location"}
      </a>
    </div>
  );
}

function FooterSection({ locale }: InvitationRendererProps) {
  return <footer className="pt-4 text-center text-xs text-stone-400">{locale === "ar" ? "دعوة من Lamma" : "An invitation by Lamma"}</footer>;
}

const sectionComponents: Partial<Record<InvitationSectionId, (props: InvitationRendererProps) => React.ReactNode>> = {
  hero: HeroSection,
  "invitation-text": InvitationTextSection,
  "event-details": EventDetailsSection,
  location: LocationSection,
  footer: FooterSection,
};

export function InvitationRenderer({ invitation, locale }: InvitationRendererProps) {
  const enabledSections = [...invitation.sections].filter((section) => section.enabled).sort((a, b) => a.position - b.position);

  return (
    <article className="mx-auto w-full max-w-sm space-y-6 rounded-[2rem] border-8 border-stone-800 bg-stone-50 p-4 shadow-lg" dir={getLocaleDirection(locale)}>
      {enabledSections.map((section) => {
        const SectionComponent = invitationSections[section.section_type]?.implemented ? sectionComponents[section.section_type] : undefined;

        return SectionComponent ? <SectionComponent invitation={invitation} key={section.id} locale={locale} /> : null;
      })}
    </article>
  );
}
