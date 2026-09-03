import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/features/events/data";
import { loadInvitationForOwnedEvent } from "@/features/invitations/data";
import { InvitationRenderer } from "@/features/invitations/renderer";
type PreviewPageProps = { params: Promise<{ id: string }> };
export default async function PreviewPage({ params }: PreviewPageProps) {
  const user = await getCurrentUser(); if (!user) redirect("/sign-in"); const { id } = await params; const invitation = await loadInvitationForOwnedEvent(user, id); if (!invitation) notFound();
  return <main className="min-h-screen bg-[#eef0e9]"><div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5"><Link className="lm-brand" href={`/dashboard/events/${invitation.event.id}/invitation`}>Lamma</Link><Link className="lm-link" href={`/dashboard/events/${invitation.event.id}/invitation`}>العودة للاستوديو</Link></div><div className="mx-auto w-full max-w-6xl overflow-hidden bg-white shadow-[var(--lm-shadow)] sm:rounded-t-[2rem]"><InvitationRenderer invitation={invitation} locale={invitation.event.primary_locale} /></div></main>;
}
