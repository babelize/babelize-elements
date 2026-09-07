/** A locale entry shared by every locale-aware component. */
export interface Locale {
  /** ISO 639-1 / BCP 47 code (e.g. "en", "fr-FR", "ar-SA") */
  code: string;
  /** Override display name (auto-resolved from built-in mapping if omitted) */
  label?: string;
  /** Override flag emoji (auto-detected from code if omitted) */
  flag?: string;
  /** Override RTL (auto-detected from code if omitted) */
  rtl?: boolean;
}
