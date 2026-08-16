export const themeNames = ["emerald", "ocean", "sunset", "midnight", "arctic", "rose", "forest", "phantom", "retro"] as const;
export type ThemeName = (typeof themeNames)[number];
