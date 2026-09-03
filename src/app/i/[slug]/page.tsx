import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadPublishedInvitation } from "@/features/invitations/data";
import { InvitationRenderer } from "@/features/invitations/renderer";
import { getAppUrl } from "@/lib/app-url";

type PublicInvitationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PublicInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await loadPublishedInvitation(slug);
  if (!invitation) return { robots: { index: false, follow: false } };

  const title = invitation.content.headline || invitation.event.title;
  const description = invitation.content.invitation_text || `دعوة لحضور ${invitation.event.title}`;
  const canonicalUrl = `${getAppUrl()}/i/${invitation.event.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: "website" },
    robots: { index: false, follow: false },
  };
}

export default async function PublicInvitationPage({ params }: PublicInvitationPageProps) {
  const { slug } = await params;
  const invitation = await loadPublishedInvitation(slug);
  if (!invitation) notFound();

  return <main className="min-h-screen bg-[#eef0e9]"><InvitationRenderer invitation={invitation} locale={invitation.event.primary_locale} /></main>;
}
