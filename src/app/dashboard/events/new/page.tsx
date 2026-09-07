import Link from "next/link";
import { AppFrame } from "@/components/layout/app-frame";
import { CreateEventForm } from "@/features/events/create-event-form";
type NewEventPageProps = { searchParams: Promise<{ draft?: string }> };

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const { draft } = await searchParams;

  return <AppFrame action={<Link className="lm-link" href="/dashboard">العودة للمناسبات</Link>}><main className="lm-wrap pb-16 pt-8"><p className="lm-kicker">مناسبة جديدة</p><h1 className="mt-2 text-3xl font-bold">خلّينا نبدأ بالأساسيات.</h1>{draft === "created" ? <section className="lm-panel mt-6 border-[var(--lm-accent)] bg-[var(--lm-accent-soft)] p-5" role="status"><p className="font-bold">اتحفظت كمسودة على جهازك.</p><p className="lm-copy mt-2 text-sm">تقدر تكمل تجهيزها الآن. سجّل الدخول لاحقًا عشان نحفظ المناسبة ونفتح لك الاستوديو من أي جهاز.</p><Link className="lm-button lm-button-accent mt-4 inline-flex" href="/sign-in?next=/dashboard/events/new">سجّل الدخول لحفظها</Link></section> : null}<div className="mt-8"><CreateEventForm /></div></main></AppFrame>;
}
