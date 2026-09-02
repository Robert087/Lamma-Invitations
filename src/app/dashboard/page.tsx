import Link from "next/link";
import { redirect } from "next/navigation";

import { occasionLabels } from "@/config/occasions";
import { getUserDisplayName } from "@/features/auth/user";
import { getCurrentUser, listEventsForUser } from "@/features/events/data";

import { signOut } from "./actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const events = await listEventsForUser(user);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">مرحبًا، {getUserDisplayName(user)}</h1>
            <p className="mt-2 text-stone-600">ابدأ بإنشاء مناسبتك الأولى.</p>
          </div>
          <Link className="shrink-0 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white" href="/dashboard/events/new">
            إنشاء مناسبة
          </Link>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900">مناسباتك</h2>
          {events.length ? (
            <ul className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
              {events.map((event) => (
                <li key={event.id}>
                  <Link className="block py-4" href={`/dashboard/events/${event.id}`}>
                    <p className="font-medium text-stone-900">{event.title}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {occasionLabels[event.occasion_type].ar} · {event.status}
                      {event.event_date ? ` · ${new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeZone: event.timezone }).format(new Date(event.event_date))}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-stone-600">لم تُنشئ أي مناسبات بعد.</p>
          )}
        </section>

        <form action={signOut} className="mt-8">
          <button className="text-sm font-medium text-stone-700 underline" type="submit">تسجيل الخروج</button>
        </form>
      </section>
    </main>
  );
}
