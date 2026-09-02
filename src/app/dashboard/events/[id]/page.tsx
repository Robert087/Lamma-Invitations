import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { occasionLabels } from "@/config/occasions";
import { getCurrentUser, getOwnedEvent } from "@/features/events/data";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function EventPage({ params }: EventPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();

  const event = await getOwnedEvent(user, id);
  if (!event) notFound();

  const date = event.event_date
    ? new Intl.DateTimeFormat("ar", { dateStyle: "long", timeZone: event.timezone }).format(new Date(event.event_date))
    : null;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <section className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <Link className="text-sm text-stone-600 underline" href="/dashboard">العودة إلى لوحة التحكم</Link>
        <h1 className="mt-5 text-2xl font-semibold text-stone-900">{event.title}</h1>
        <dl className="mt-6 space-y-3 text-sm text-stone-700">
          <div><dt className="font-medium">المناسبة</dt><dd>{occasionLabels[event.occasion_type].ar}</dd></div>
          {date ? <div><dt className="font-medium">التاريخ</dt><dd>{date}</dd></div> : null}
          {event.venue_name ? <div><dt className="font-medium">المكان</dt><dd>{event.venue_name}</dd></div> : null}
          <div><dt className="font-medium">الحالة</dt><dd>{event.status}</dd></div>
          <div><dt className="font-medium">الرابط المختصر</dt><dd dir="ltr">{event.slug}</dd></div>
        </dl>
        <Link className="mt-6 inline-flex rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white" href={`/dashboard/events/${event.id}/invitation`}>
          فتح الدعوة
        </Link>
        <p className="mt-8 text-sm text-stone-600">سيُضاف منشئ الدعوات لاحقًا.</p>
      </section>
    </main>
  );
}
