"use client";

import React from "react";

interface DecorationProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Delicate Botanical Corner Flourish
 * Restrained fine-line botanical branch with soft leaves and buds.
 * Colors: Deep Burgundy (#6B1736) or currentColor with subtle opacity.
 */
export function BotanicalCorner({ className = "", style }: DecorationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Main graceful curved stem */}
      <path
        d="M6 114C12 75 35 35 114 6"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="lm-draw-stem"
      />
      {/* Delicate lateral branch 1 */}
      <path
        d="M34 82C46 72 58 74 68 84"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="0.9"
        strokeLinecap="round"
        className="lm-draw-stem-delay-1"
      />
      {/* Leaf 1 */}
      <path
        d="M68 84C62 76 66 68 76 72C82 78 78 86 68 84Z"
        fill="var(--lm-burgundy-soft, #FAF0F3)"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="0.8"
      />
      {/* Delicate lateral branch 2 */}
      <path
        d="M58 58C68 46 80 48 90 56"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="0.9"
        strokeLinecap="round"
        className="lm-draw-stem-delay-2"
      />
      {/* Leaf 2 */}
      <path
        d="M90 56C84 48 88 40 98 44C104 50 100 58 90 56Z"
        fill="var(--lm-burgundy-soft, #FAF0F3)"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="0.8"
      />
      {/* Tender leaf bud near tip */}
      <path
        d="M94 26C88 20 90 14 98 16C104 22 100 28 94 26Z"
        fill="var(--lm-burgundy-soft, #FAF0F3)"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="0.8"
      />
      {/* Subtle dew/blossom dots */}
      <circle cx="24" cy="96" r="1.5" fill="var(--lm-burgundy, #6B1736)" opacity="0.6" />
      <circle cx="78" cy="40" r="1.2" fill="var(--lm-burgundy, #6B1736)" opacity="0.5" />
    </svg>
  );
}

/**
 * Signature Burgundy Line Drawing Motif
 * Elegant horizontal divider with center leaf flourish and fine drawn lines.
 */
export function BurgundyLineMotif({ className = "" }: DecorationProps) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-[var(--lm-burgundy-border)] to-[var(--lm-burgundy)] opacity-60 lm-line-expand-left" />
      <svg
        width="28"
        height="18"
        viewBox="0 0 28 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-[var(--lm-burgundy)]"
      >
        <path
          d="M14 2C11 6 7 9 1 9C7 9 11 12 14 16C17 12 21 9 27 9C21 9 17 6 14 2Z"
          fill="var(--lm-burgundy-soft, #FAF0F3)"
          stroke="var(--lm-burgundy, #6B1736)"
          strokeWidth="1"
        />
        <circle cx="14" cy="9" r="1.8" fill="var(--lm-burgundy, #6B1736)" />
      </svg>
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-[var(--lm-burgundy-border)] to-[var(--lm-burgundy)] opacity-60 lm-line-expand-right" />
    </div>
  );
}

/**
 * Delicate Botanical Vine Border Motif
 * Placed at the top or bottom of special scenes to tie sections together.
 */
export function VineDivider({ className = "" }: DecorationProps) {
  return (
    <div className={`w-full overflow-hidden flex justify-center py-2 opacity-50 ${className}`} aria-hidden="true">
      <svg
        width="360"
        height="16"
        viewBox="0 0 360 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--lm-burgundy)] max-w-full"
      >
        <path
          d="M0 8C45 8 75 14 120 14C165 14 195 2 240 2C285 2 315 8 360 8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />
        <circle cx="180" cy="8" r="2.5" fill="currentColor" />
        <path
          d="M174 5C178 7 182 7 186 5"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Artisanal Wax Seal Watermark
 * For subtle background stamps or detail accents.
 */
export function WaxSealStamp({ className = "", size = 64 }: DecorationProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none opacity-40 ${className}`}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" stroke="var(--lm-burgundy, #6B1736)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="40" cy="40" r="30" stroke="var(--lm-burgundy, #6B1736)" strokeWidth="0.8" />
      {/* Stylized infinity / couple knot */}
      <path
        d="M28 40C28 34 35 34 40 40C45 46 52 46 52 40C52 34 45 34 40 40C35 46 28 46 28 40Z"
        stroke="var(--lm-burgundy, #6B1736)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="33" cy="30" r="2" fill="var(--lm-burgundy, #6B1736)" />
      <circle cx="47" cy="30" r="2" fill="var(--lm-burgundy, #6B1736)" />
    </svg>
  );
}
