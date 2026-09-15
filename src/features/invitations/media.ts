export const invitationMediaBucket = "invitation-media";
export const invitationMediaMaxBytes = 5 * 1024 * 1024;
export const invitationMediaLimit = 15;

export type MediaActionState = { error?: string; success?: boolean };

export const initialMediaActionState: MediaActionState = {};
