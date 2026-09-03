import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppFrame } from "@/components/layout/app-frame";
import { occasionLabels } from "@/config/occasions";
import { getCurrentUser, getOwnedEvent } from "@/features/events/data";

type EventPageProps = { params: Promise<{ id: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export default async function EventPage({ params }: EventPageProps) {
  const user = await getCurrentUser(); if (!user) redirect("/sign-in"); const { id } = await params; if (!uuidPattern.test(id)) notFound(); const event = await getOwnedEvent(user, id); if (!event) notFound();
  return <AppFrame action={<Link className="lm-link" href="/dashboard">كل المناسبات</Link>}><main className="lm-wrap pb-16 pt-8"><div className="rounded-[1.5rem] bg-[var(--lm-ink)] p-6 text-white sm:p-10"><p className="text-sm text-white/60">{occasionLabels[event.occasion_type].ar}</p><h1 className="mt-3 text-4xl font-bold tracking-tight" dir="auto">{event.title}</h1><div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/70">{event.event_date ? <span>{event.event_date}</span> : null}{event.venue_name ? <span>· {event.venue_name}</span> : null}<span className="rounded-full bg-white/10 px-3 py-1">{event.status === "draft" ? "مسودة" : event.status}</span></div><Link className="lm-button lm-button-accent mt-8" href={`/dashboard/events/${event.id}/invitation`}>افتح استوديو الدعوة</Link></div><section className="mt-7 grid gap-5 lg:grid-cols-3"><div className="lm-panel p-6 lg:col-span-2"><p className="lm-kicker">الخطوة التالية</p><h2 className="mt-2 text-2xl font-bold">اكتب دعوتك وشاهدها لحظيًا.</h2><p className="lm-copy mt-3">أضف الأسماء والرسالة، ثم شاهد شكل الدعوة قبل مشاركتها.</p><Link className="lm-link mt-5 inline-block text-[var(--lm-accent-dark)]" href={`/dashboard/events/${event.id}/preview`}>فتح المعاينة الكاملة ←</Link></div><div className="lm-panel p-6"><p className="text-sm text-[var(--lm-muted)]">رابط الدعوة</p><p className="mt-2 break-all font-semibold" dir="ltr">{event.slug}</p></div></section></main></AppFrame>;
}
