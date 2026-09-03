import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/features/events/data";
import { loadInvitationForOwnedEvent } from "@/features/invitations/data";
import { InvitationWorkspace } from "@/features/invitations/workspace";
import { getOwnedEvent } from "@/features/events/data";
import { getAppUrl } from "@/lib/app-url";

type InvitationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const invitation = await loadInvitationForOwnedEvent(user, id);
  if (!invitation) notFound();
  const event = await getOwnedEvent(user, id);
  if (!event) notFound();

  return <InvitationWorkspace invitation={invitation} isPublished={event.status === "published"} publicUrl={`${getAppUrl()}/i/${event.slug}`} />;
}
