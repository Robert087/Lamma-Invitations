import { invitationSections, type InvitationSectionId } from "@/config/invitation-sections";
import type { Locale } from "@/types/locale";

import { formatInvitationDate, getTextDirection } from "./content";
import type { InvitationModel } from "./types";

type InvitationRendererProps = {
  invitation: InvitationModel;
  locale: Locale;
};

function HeroSection({ invitation, locale }: InvitationRendererProps) {
  const { headline, host_names: hosts } = invitation.content;

  return (
    <header className="rounded-2xl bg-stone-900 px-6 py-10 text-center text-stone-50">
      {headline ? <p className="text-sm tracking-wide text-stone-300" dir={getTextDirection(headline)}>{headline}</p> : null}
      <h1 className="mt-3 text-3xl font-semibold" dir="auto">{invitation.event.title}</h1>
      {hosts ? <p className="mt-3 text-lg text-stone-200" dir={getTextDirection(hosts)}>{hosts}</p> : null}
      {invitation.event.event_date ? <p className="mt-5 text-sm text-stone-300">{formatInvitationDate(invitation.event.event_date, locale)}</p> : null}
    </header>
  );
}

function InvitationTextSection({ invitation }: InvitationRendererProps) {
  const text = invitation.content.invitation_text;

  return text ? <p className="whitespace-pre-line px-3 text-center text-base leading-8 text-stone-700" dir={getTextDirection(text)}>{text}</p> : null;
}

function EventDetailsSection({ invitation, locale }: InvitationRendererProps) {
  const { event } = invitation;
  if (!event.event_date && !event.venue_name) return null;

  return (
    <section className="rounded-xl bg-stone-100 p-5 text-center text-sm text-stone-700">
      {event.event_date ? <p>{formatInvitationDate(event.event_date, locale)}</p> : null}
      {event.venue_name ? <p className={event.event_date ? "mt-2" : ""} dir="auto">{event.venue_name}</p> : null}
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
  const contentDirection = getTextDirection([invitation.content.headline, invitation.content.host_names, invitation.content.invitation_text].filter(Boolean).join(" "));

  return (
    <article className="mx-auto w-full max-w-sm space-y-6 rounded-[2rem] border-8 border-stone-800 bg-stone-50 p-4 shadow-lg" dir={contentDirection}>
      {enabledSections.map((section) => {
        const SectionComponent = invitationSections[section.section_type]?.implemented ? sectionComponents[section.section_type] : undefined;

        return SectionComponent ? <SectionComponent invitation={invitation} key={section.id} locale={locale} /> : null;
      })}
    </article>
  );
}
