import { Countdown } from "../../countdown";
import { CinematicScene } from "./scene";
import { cinematicCopy, type CinematicSceneProps } from "./types";

export function CountdownScene({ invitation, locale }: CinematicSceneProps) {
  if (!invitation.event.event_date) return null;
  return <CinematicScene className="lm-cinematic-countdown"><p className="lm-cinematic-eyebrow">{cinematicCopy(locale).countdown}</p><Countdown eventDate={invitation.event.event_date} timeZone={invitation.event.timezone} locale={locale} /></CinematicScene>;
}
