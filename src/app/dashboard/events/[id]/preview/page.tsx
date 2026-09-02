import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/features/events/data";
import { loadInvitationForOwnedEvent } from "@/features/invitations/data";
import { InvitationRenderer } from "@/features/invitations/renderer";

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const invitation = await loadInvitationForOwnedEvent(user, id);
  if (!invitation) notFound();

  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-6 py-10">
      <InvitationRenderer invitation={invitation} locale={invitation.event.primary_locale} />
    </main>
  );
}
