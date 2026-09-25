import { getInvitationDateParts, getTextDirection } from "../../content";
import { textScaleTokens } from "@/config/invitation-design";
import { CinematicScene } from "./scene";
import { cinematicCopy, type CinematicSceneProps } from "./types";

export function InvitationScene({ invitation, locale, showMessage, showDetails }: CinematicSceneProps & { showMessage: boolean; showDetails: boolean }) {
  const date = invitation.event.event_date ? getInvitationDateParts(invitation.event.event_date, locale) : null;
  const names = invitation.content.host_names || invitation.event.title;
  const copy = cinematicCopy(locale);
  return <CinematicScene className="lm-cinematic-invitation"><p className="lm-cinematic-eyebrow">{copy.invitation}</p><h2 dir="auto">{names}</h2>{invitation.content.headline ? <p className="lm-cinematic-headline" dir={getTextDirection(invitation.content.headline)}>{invitation.content.headline}</p> : null}{showMessage && invitation.content.invitation_text ? <p className={`lm-cinematic-message ${textScaleTokens[invitation.themeConfig.textScale]}`} dir={getTextDirection(invitation.content.invitation_text)}>{invitation.content.invitation_text}</p> : null}{showDetails && date ? <div className="lm-cinematic-date-mark"><span>{date.day}</span><p>{date.monthLong}<small>{date.weekday} · {date.year}</small></p></div> : null}</CinematicScene>;
}
