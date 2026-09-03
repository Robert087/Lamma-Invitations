"use client";

import { useState } from "react";

export function ShareControls({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`يسعدنا دعوتكم للاحتفال معنا ${url}`)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return <div className="mt-4 flex flex-wrap gap-2"><button className="lm-button lm-button-quiet" onClick={copyLink} type="button">{copied ? "تم نسخ الرابط" : "نسخ الرابط"}</button><a className="lm-button lm-button-quiet" href={url} rel="noreferrer" target="_blank">فتح الدعوة</a><a className="lm-button lm-button-quiet" href={whatsappUrl} rel="noreferrer" target="_blank">مشاركة على واتساب</a></div>;
}
