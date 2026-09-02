import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/features/events/data";
import { loadInvitationForOwnedEvent } from "@/features/invitations/data";
import { InvitationWorkspace } from "@/features/invitations/workspace";

type InvitationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const invitation = await loadInvitationForOwnedEvent(user, id);
  if (!invitation) notFound();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link className="text-sm text-stone-600 underline" href={`/dashboard/events/${invitation.event.id}`}>العودة إلى المناسبة</Link>
          <Link className="text-sm text-stone-600 underline" href={`/dashboard/events/${invitation.event.id}/preview`}>عرض المعاينة فقط</Link>
        </div>
        <InvitationWorkspace invitation={invitation} />
      </div>
    </main>
  );
}
