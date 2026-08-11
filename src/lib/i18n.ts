// src/lib/i18n.ts — minimal i18n registry.
//
// Why this exists:
//   Phase 12 G3 (Multi-language support). Caribbean is multilingual;
//   the UI cannot be English-only forever. We ship a minimal registry
//   that:
//     1. Looks up keys by locale (`t(key, locale)`).
//     2. Falls back through requested locale → English → raw key
//        (so a missing translation never crashes the UI).
//     3. Supports Intl.NumberFormat / Intl.DateTimeFormat for
//        locale-aware numbers + dates.
//     4. Ships 5 locales today (en canonical + ht + es + fr-patois + fy).
//
// How it's used:
//   import { t, formatNumber, formatDate } from "@/lib/i18n";
//   const headline = t("myRights.headline", "ht"); // → "Dwa ou, kontra ou, nan langaj klè."
//
// Cross-references:
//   - src/locales/*.json — locale bundles.
//   - project/strategy/i18n-roadmap.md — roadmap (now "in progress").
//   - src/lib/copy.ts — canonical English microcopy registry.

import en from "../locales/en.json";
import ht from "../locales/ht.json";
import es from "../locales/es.json";
import frPatois from "../locales/fr-patois.json";
import fy from "../locales/fy.json";

/** All supported locales. Extend as new JSON files are added. */
export const SUPPORTED_LOCALES = ["en", "ht", "es", "fr-patois", "fy"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Display name for each locale (used in the locale picker). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ht: "Kreyòl Ayisyen",
  es: "Español",
  "fr-patois": "Kréyòl Antiyè",
  fy: "Papiamentu-stijl",
};

/** Locale → JSON bundle. The English bundle is the canonical truth. */
const BUNDLES: Record<Locale, Record<string, string>> = {
  en: en as Record<string, string>,
  ht: ht as Record<string, string>,
  es: es as Record<string, string>,
  "fr-patois": frPatois as Record<string, string>,
  fy: fy as Record<string, string>,
};

/** Returns the requested bundle, or English if the locale is unknown. */
export function bundleFor(locale: string): Record<string, string> {
  if ((SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    return BUNDLES[locale as Locale];
  }
  return BUNDLES.en;
}

/** True if the locale is supported. */
export function isSupportedLocale(s: string): s is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

/**
 * Translate a key. Fallback chain: requested locale → English → raw key.
 *
 * Keys are dot-separated paths into the bundle, e.g. `myRights.headline`.
 * If a key is missing, returns the key itself so the UI shows
 * "myRights.headline" instead of crashing — visible to the operator,
 * not the leaseholder.
 */
export function t(key: string, locale: string = "en"): string {
  const bundle = bundleFor(locale);
  if (key in bundle) return bundle[key];
  // Fallback to English.
  if (key in BUNDLES.en) return BUNDLES.en[key];
  // Final fallback: the raw key (visible to operator; never crashes).
  return key;
}

/** Locale-aware number formatting. Uses Intl.NumberFormat. */
export function formatNumber(
  value: number,
  locale: string = "en",
  options: Intl.NumberFormatOptions = {},
): string {
  try {
    // Map our locale tags to BCP-47 where they diverge.
    const intlLocale = toIntlLocale(locale);
    return new Intl.NumberFormat(intlLocale, options).format(value);
  } catch {
    return String(value);
  }
}

/** Locale-aware currency formatting. Defaults to USD. */
export function formatCurrency(
  value: number,
  locale: string = "en",
  currency: string = "USD",
): string {
  return formatNumber(value, locale, { style: "currency", currency });
}

/** Locale-aware date formatting. */
export function formatDate(
  date: Date | string | number,
  locale: string = "en",
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  try {
    const intlLocale = toIntlLocale(locale);
    return new Intl.DateTimeFormat(intlLocale, options).format(d);
  } catch {
    return d.toISOString();
  }
}

/** Locale-aware relative time ("3 days ago", "il y a 3 jours"). */
export function formatRelative(
  date: Date | string | number,
  locale: string = "en",
  base: Date = new Date(),
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const diffMs = base.getTime() - d.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(toIntlLocale(locale), { numeric: "auto" });
  if (Math.abs(diffDays) >= 1) return rtf.format(-diffDays, "day");
  const diffHours = Math.round(diffMs / 3_600_000);
  if (Math.abs(diffHours) >= 1) return rtf.format(-diffHours, "hour");
  const diffMinutes = Math.round(diffMs / 60_000);
  return rtf.format(-diffMinutes, "minute");
}

/** Map our locale tag to BCP-47 for Intl APIs. */
export function toIntlLocale(locale: string): string {
  switch (locale) {
    case "ht":
      return "ht"; // Haitian Creole — Intl supports `ht` since 2020
    case "es":
      return "es";
    case "fr-patois":
      return "fr-HT"; // Antillean Creole; closest Intl tag is fr-HT (Haiti French)
    case "fy":
      return "pap"; // Papiamentu (closest standard tag; not perfect)
    default:
      return "en-GB"; // UK English by default (leasehold is UK-first)
  }
}

/** Returns a list of all keys in the English bundle (the canonical set). */
export function canonicalKeys(): string[] {
  return Object.keys(BUNDLES.en).sort();
}

/** Returns a coverage report: which English keys are missing in a given locale. */
export function coverageReport(locale: Locale): {
  total: number;
  translated: number;
  missing: string[];
  percentTranslated: number;
} {
  const bundle = BUNDLES[locale];
  const englishKeys = canonicalKeys();
  const missing: string[] = [];
  for (const key of englishKeys) {
    if (!(key in bundle)) missing.push(key);
  }
  return {
    total: englishKeys.length,
    translated: englishKeys.length - missing.length,
    missing,
    percentTranslated: Math.round(((englishKeys.length - missing.length) / englishKeys.length) * 100),
  };
}

/** Per-locale version tag (bumped on every translation update). */
export const I18N_VERSION = "1.0.0-phase12";