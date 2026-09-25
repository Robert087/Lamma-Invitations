import { CinematicScene } from "./scene";
import { cinematicCopy, type CinematicSceneProps } from "./types";

export function StoryScene({ invitation, locale }: CinematicSceneProps) {
  const items = [...invitation.storyItems].filter((item) => item.title || item.body).sort((a, b) => a.position - b.position);
  if (!items.length) return null;
  const copy = cinematicCopy(locale);
  return <CinematicScene className="lm-cinematic-story"><div className="lm-cinematic-story-intro"><p className="lm-cinematic-eyebrow">{copy.story}</p><h2>{copy.storyHeading}</h2></div><ol>{items.map((item, index) => <li key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><article>{item.date_label ? <small>{item.date_label}</small> : null}<h3 dir="auto">{item.title}</h3><p dir="auto">{item.body}</p></article></li>)}</ol></CinematicScene>;
}
