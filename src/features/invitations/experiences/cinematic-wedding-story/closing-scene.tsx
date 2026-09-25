import { getInvitationDateParts } from "../../content";
import { CinematicScene } from "./scene";
import { cinematicCopy, type CinematicSceneProps } from "./types";

export function ClosingScene({ invitation, locale }: CinematicSceneProps) {
  const date = invitation.event.event_date ? getInvitationDateParts(invitation.event.event_date, locale) : null;
  return <CinematicScene className="lm-cinematic-closing"><span className="lm-cinematic-closing-mark" aria-hidden="true">✦</span><p>{cinematicCopy(locale).closing}</p><h2 dir="auto">{invitation.content.host_names || invitation.event.title}</h2>{date ? <small>{date.full}</small> : null}</CinematicScene>;
}
