import Link from "next/link";
import { redirect } from "next/navigation";
import { AppFrame } from "@/components/layout/app-frame";
import { getCurrentUser } from "@/features/events/data";
import { CreateEventForm } from "@/features/events/create-event-form";

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/dashboard/events/new");
  }

  return (
    <AppFrame action={<Link className="lm-link" href="/dashboard">العودة للمناسبات</Link>}>
      <main className="lm-wrap pb-16 pt-8">
        <p className="lm-kicker">مناسبة جديدة</p>
        <h1 className="mt-2 text-3xl font-bold">خلّينا نبدأ بالأساسيات.</h1>
        <div className="mt-8">
          <CreateEventForm />
        </div>
      </main>
    </AppFrame>
  );
}
