import Link from "next/link";
import { AppFrame } from "@/components/layout/app-frame";
import { occasionLabels } from "@/config/occasions";
import { getUserDisplayName } from "@/features/auth/user";
import { getCurrentUser, listEventsForUser } from "@/features/events/data";
import { signOut } from "./actions";

export default async function DashboardPage() {
  const user = await getCurrentUser(); if (!user) return null;
  const events = await listEventsForUser(user);
  return <AppFrame action={<form action={signOut}><button className="lm-link" type="submit">تسجيل الخروج</button></form>}><main className="lm-wrap pb-16 pt-8"><div className="lm-section-head"><div><p className="lm-kicker">مساحتك الخاصة</p><h1 className="mt-2 text-3xl font-bold tracking-tight">أهلًا، {getUserDisplayName(user)}</h1></div><Link className="lm-button lm-button-accent" href="/dashboard/events/new">+ أنشئ مناسبة</Link></div><section className="mt-10"><div className="lm-section-head"><div><h2 className="text-xl font-bold">مناسباتك</h2><p className="lm-copy mt-1 text-sm">كل لحظة بدأت تخطط لها.</p></div></div>{events.length ? <div className="lm-panel mt-5 px-5 sm:px-7">{events.map((event) => <Link className="lm-event-row" href={`/dashboard/events/${event.id}`} key={event.id}><div><p className="font-bold" dir="auto">{event.title}</p><p className="mt-1 text-sm text-[var(--lm-muted)]">{occasionLabels[event.occasion_type].ar}{event.event_date ? ` · ${event.event_date}` : ""}</p></div><span className={`lm-status ${event.status === "draft" ? "lm-status-draft" : ""}`}>{event.status === "draft" ? "مسودة" : event.status}</span></Link>)}</div> : <div className="lm-panel mt-5 p-8 sm:p-12"><p className="text-2xl font-bold">لسه مفيش مناسبات هنا.</p><p className="lm-copy mt-2 max-w-md">ابدأ بأول مناسبة، وبعدها هتقدر تصنع دعوتك بالشكل اللي تحبه.</p><Link className="lm-button lm-button-accent mt-6" href="/dashboard/events/new">أنشئ مناسبتك الأولى</Link></div>}</section></main></AppFrame>;
}
