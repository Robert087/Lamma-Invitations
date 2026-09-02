import { randomBytes } from "node:crypto";

export function createEventSlug(title: string) {
  const baseSlug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
  const suffix = randomBytes(3).toString("base64url").toLowerCase();

  return `${baseSlug || "event"}-${suffix}`;
}
