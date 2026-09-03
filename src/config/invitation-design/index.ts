export const invitationVariants = [
  "editorial",
  "statement",
  "split",
  "framed",
  "soft-organic",
  "dark-modern",
] as const;

export const coverStyles = ["editorial", "centered", "statement"] as const;
export const palettePresets = ["warm", "soft", "botanical", "midnight", "celebration"] as const;
export const typographyPresets = ["modern", "elegant", "classic", "editorial", "friendly"] as const;
export const textScales = ["compact", "balanced", "expressive"] as const;

export type InvitationVariant = (typeof invitationVariants)[number];
export type CoverStyle = (typeof coverStyles)[number];
export type PalettePreset = (typeof palettePresets)[number];
export type TypographyPreset = (typeof typographyPresets)[number];
export type TextScale = (typeof textScales)[number];

export type InvitationThemeConfig = {
  version: 1;
  variant: InvitationVariant;
  cover: { style: CoverStyle };
  palette: PalettePreset;
  typography: TypographyPreset;
  textScale: TextScale;
};

export const defaultInvitationTheme: InvitationThemeConfig = {
  version: 1,
  variant: "editorial",
  cover: { style: "editorial" },
  palette: "warm",
  typography: "modern",
  textScale: "balanced",
};

export type VariantMetadata = {
  id: InvitationVariant;
  label: { ar: string; en: string };
  description: { ar: string; en: string };
  previewHint: { ar: string; en: string };
};

export const variantRegistry: Record<InvitationVariant, VariantMetadata> = {
  editorial: {
    id: "editorial",
    label: { ar: "تحريري هادئ", en: "Editorial" },
    description: { ar: "أناقة هادئة مع مساحات واسعة وتوازن راقٍ للنصوص", en: "Refined, warm editorial rhythm and intentional whitespace" },
    previewHint: { ar: "توازن تحريري", en: "Refined layout" },
  },
  statement: {
    id: "statement",
    label: { ar: "جريء ومؤثر", en: "Statement" },
    description: { ar: "حضور بصري قوي مع أسماء بارزة وتفاصيل حاسمة", en: "Oversized bold typography and commanding presence" },
    previewHint: { ar: "خطوط عريضة وقوية", en: "Oversized type" },
  },
  split: {
    id: "split",
    label: { ar: "تقسيم عصري", en: "Split" },
    description: { ar: "تكوين معاصر يوزع المحتوى على جانبين بانسيابية", en: "Contemporary asymmetric split desktop composition" },
    previewHint: { ar: "توزيع جانبي متوازن", en: "Asymmetric split" },
  },
  framed: {
    id: "framed",
    label: { ar: "بطاقة مؤطرة", en: "Framed" },
    description: { ar: "طابع بطاقة فاخرة بإطار هندسي مزدوج وتفاصيل دقيقة", en: "Modern invitation card with layered fine borders" },
    previewHint: { ar: "إطار بطاقة محكم", en: "Framed card" },
  },
  "soft-organic": {
    id: "soft-organic",
    label: { ar: "انسيابي دافئ", en: "Soft Organic" },
    description: { ar: "منحنيات ناعمة وأقواس مريحة ولمسة احتفالية لطيفة", en: "Soft curves, gentle arches, and warm organic tone" },
    previewHint: { ar: "أقواس ومنحنيات", en: "Curved arches" },
  },
  "dark-modern": {
    id: "dark-modern",
    label: { ar: "داكن معاصر", en: "Dark Modern" },
    description: { ar: "أسطح داكنة فخمة مع تباين محسوب وإضاءة أنيقة", en: "Deep dark surfaces with luminous, refined accents" },
    previewHint: { ar: "أناقة داكنة", en: "Obsidian contrast" },
  },
};

export const designRegistry = {
  variants: variantRegistry,
  covers: { editorial: "تحريري", centered: "هادئ", statement: "جريء" },
  palettes: { warm: "دافئ", soft: "ناعم", botanical: "نباتي", midnight: "ليلي", celebration: "احتفالي" },
  typography: { modern: "عصري", elegant: "أنيق", classic: "كلاسيكي", editorial: "تحريري", friendly: "ودود" },
  textScales: { compact: "مكثف", balanced: "متوازن", expressive: "بارز" },
} as const;

export type ThemeTokens = {
  surface: string;
  surfaceMuted: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  badge: string;
};

export const paletteTokens: Record<PalettePreset, ThemeTokens> = {
  warm: {
    surface: "bg-[#fdfaf7]",
    surfaceMuted: "bg-[#f7f0e8]",
    card: "bg-white",
    border: "border-[#eddcd0]",
    text: "text-[#2b221a]",
    textMuted: "text-[#786656]",
    accent: "bg-[#c96242]",
    accentText: "text-[#c96242]",
    badge: "bg-[#faece4] text-[#a44527]",
  },
  soft: {
    surface: "bg-[#fdf7fa]",
    surfaceMuted: "bg-[#f8ebf1]",
    card: "bg-white",
    border: "border-[#eed6e0]",
    text: "text-[#32232d]",
    textMuted: "text-[#7a6070]",
    accent: "bg-[#a75f79]",
    accentText: "text-[#a75f79]",
    badge: "bg-[#f9e9f0] text-[#863e58]",
  },
  botanical: {
    surface: "bg-[#f6f9f6]",
    surfaceMuted: "bg-[#eaf1ea]",
    card: "bg-white",
    border: "border-[#d2e2d4]",
    text: "text-[#1d3023]",
    textMuted: "text-[#587060]",
    accent: "bg-[#437552]",
    accentText: "text-[#437552]",
    badge: "bg-[#e4efe6] text-[#2c5839]",
  },
  midnight: {
    surface: "bg-[#182129]",
    surfaceMuted: "bg-[#121920]",
    card: "bg-[#212c36]",
    border: "border-[#30404f]",
    text: "text-[#f4f7f8]",
    textMuted: "text-[#98aab8]",
    accent: "bg-[#df7c51]",
    accentText: "text-[#df7c51]",
    badge: "bg-[#2d3a46] text-[#f7a07a]",
  },
  celebration: {
    surface: "bg-[#fbf7fd]",
    surfaceMuted: "bg-[#f3e9f9]",
    card: "bg-white",
    border: "border-[#e5d4f3]",
    text: "text-[#292031]",
    textMuted: "text-[#715c81]",
    accent: "bg-[#804ca7]",
    accentText: "text-[#804ca7]",
    badge: "bg-[#f1e4fa] text-[#6d3795]",
  },
};

/**
 * Dark Modern variant intentionally maps all palettes onto deep obsidian surfaces
 * with high-contrast, luminous accents tailored to each palette.
 */
export const darkModernTokens: Record<PalettePreset, ThemeTokens> = {
  warm: {
    surface: "bg-[#141210]",
    surfaceMuted: "bg-[#1c1916]",
    card: "bg-[#221e1a]",
    border: "border-[#3d332a]",
    text: "text-[#fcf7f2]",
    textMuted: "text-[#b09e8e]",
    accent: "bg-[#dd7251]",
    accentText: "text-[#f38c6d]",
    badge: "bg-[#33251c] text-[#f49c81]",
  },
  soft: {
    surface: "bg-[#151214]",
    surfaceMuted: "bg-[#1d171b]",
    card: "bg-[#241c21]",
    border: "border-[#3e2e38]",
    text: "text-[#fdf5f9]",
    textMuted: "text-[#b89cae]",
    accent: "bg-[#bd6e8a]",
    accentText: "text-[#df8ea9]",
    badge: "bg-[#35202c] text-[#e89db6]",
  },
  botanical: {
    surface: "bg-[#101412]",
    surfaceMuted: "bg-[#161d19]",
    card: "bg-[#1c2620]",
    border: "border-[#2b3d32]",
    text: "text-[#f3f9f4]",
    textMuted: "text-[#9cb5a3]",
    accent: "bg-[#518b62]",
    accentText: "text-[#75b487]",
    badge: "bg-[#203326] text-[#86cca0]",
  },
  midnight: {
    surface: "bg-[#0e141a]",
    surfaceMuted: "bg-[#131b23]",
    card: "bg-[#1a2530]",
    border: "border-[#27394a]",
    text: "text-[#f4f7fa]",
    textMuted: "text-[#97abbd]",
    accent: "bg-[#e5865a]",
    accentText: "text-[#f7a17a]",
    badge: "bg-[#263748] text-[#fbb392]",
  },
  celebration: {
    surface: "bg-[#141017]",
    surfaceMuted: "bg-[#1d1622]",
    card: "bg-[#251b2d]",
    border: "border-[#3e2b4c]",
    text: "text-[#f9f4fc]",
    textMuted: "text-[#b49ec4]",
    accent: "bg-[#9960c7]",
    accentText: "text-[#ba82e7]",
    badge: "bg-[#341d45] text-[#caa2ee]",
  },
};

export function getVariantTokens(variant: InvitationVariant, palette: PalettePreset): ThemeTokens {
  if (variant === "dark-modern") {
    return darkModernTokens[palette];
  }
  return paletteTokens[palette];
}

export const typographyTokens: Record<TypographyPreset, string> = {
  modern: "font-sans",
  elegant: "font-serif",
  classic: "font-serif",
  editorial: "font-sans tracking-wide",
  friendly: "font-sans",
};

export const textScaleTokens: Record<TextScale, string> = {
  compact: "text-sm sm:text-base",
  balanced: "text-base sm:text-xl",
  expressive: "text-lg sm:text-2xl",
};

function isOneOf<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && values.includes(value);
}

export function parseInvitationThemeConfig(value: unknown): InvitationThemeConfig {
  const config = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const cover = config.cover && typeof config.cover === "object" && !Array.isArray(config.cover) ? (config.cover as Record<string, unknown>) : {};

  return {
    version: 1,
    variant: isOneOf(config.variant, invitationVariants) ? config.variant : defaultInvitationTheme.variant,
    cover: {
      style: isOneOf(cover.style, coverStyles) ? cover.style : defaultInvitationTheme.cover.style,
    },
    palette: isOneOf(config.palette, palettePresets) ? config.palette : defaultInvitationTheme.palette,
    typography: isOneOf(config.typography, typographyPresets) ? config.typography : defaultInvitationTheme.typography,
    textScale: isOneOf(config.textScale, textScales) ? config.textScale : defaultInvitationTheme.textScale,
  };
}
