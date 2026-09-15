import { getInvitationDateParts } from "../../content";
import type { CinematicSceneProps } from "./types";
import { cinematicCopy } from "./types";

export function CinematicOpening({ invitation, locale, preview, opened, onOpen }: CinematicSceneProps & { preview: boolean; opened: boolean; onOpen: () => void }) {
  const names = invitation.content.host_names || invitation.event.title;
  const date = invitation.event.event_date ? getInvitationDateParts(invitation.event.event_date, locale) : null;
  const copy = cinematicCopy(locale);

  return (
    <header className={`lm-cinematic-opening ${opened ? "is-open" : ""}`}>
      <div className="lm-cinematic-opening-card">
        <span className="lm-cinematic-orbit" aria-hidden="true" />
        <p className="lm-cinematic-eyebrow">{copy.invitation}</p>
        <h1 dir="auto">{names}</h1>
        {date ? <p className="lm-cinematic-opening-date">{date.full}</p> : null}
        {!opened ? <button className="lm-cinematic-enter" onClick={onOpen} type="button">{copy.enter}<span aria-hidden="true">↓</span></button> : null}
      </div>
      {preview ? <span className="lm-cinematic-preview-note">{locale === "ar" ? "معاينة الاستوديو" : "Studio preview"}</span> : null}
    </header>
  );
}
