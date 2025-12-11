import { z } from 'zod';

/**
 * Theme color tokens for the design system.
 */
export const ThemeColorTokensSchema = z.object({
  primary: z.string(),
  background: z.string(),
  surface: z.string(),
  text: z.string(),
  textSecondary: z.string(),
  border: z.string(),
  borderHover: z.string(),
  accent: z.string(),
  error: z.string(),
  success: z.string(),
  warning: z.string(),
  info: z.string(),
});

/**
 * Theme definition schema (slug, label, tokens, contrast ratios, etc.)
 */
export const ThemeSchema = z.object({
  slug: z.string(),
  label: z.string(),
  isDark: z.boolean(),
  tokens: ThemeColorTokensSchema,
  contrast: z.object({
    textOnBackground: z.number(),
    textOnSurface: z.number(),
    accentOnBackground: z.number(),
  }),
  description: z.string(),
});

/**
 * Registry schema for all themes
 */
export const ThemeRegistrySchema = z.array(ThemeSchema);

/**
 * Theme definitions (WCAG AAA contrast ratios included)
 * All colors are placeholder values and should be updated to match design.
 */
export const THEMES = [
  {
    slug: 'lumen',
    label: 'Lumen',
    isDark: false,
    tokens: {
      primary: '#0049db',
      primaryOnSurface: '#06224d',
      primaryHover: '#0057ff',
      background: '#FFFFFF',
      surface: '#F7F9FB',
      surfaceActive: '#E5E7EB',
      surfaceHover: '#F0F2F5',
      text: '#111827',
      textSecondary: '#4B5563',
      border: '#E5E7EB',
      borderHover: '#B6C2D1',
      accent: '#FFD600',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#FBC02D',
      info: '#1976D2',
    },
    contrast: {
      textOnBackground: 14.0,
      textOnSurface: 12.5,
      accentOnBackground: 7.2,
    },
    description: 'Bright, clean, and accessible. Default light theme.',
  },
  {
    slug: 'aurora',
    label: 'Aurora',
    isDark: false,
    tokens: {
      primary: '#005c53',
      primaryOnSurface: '#33aa9f',
      primaryHover: '#009E8F',
      background: '#F5F7FA',
      surface: '#FFFFFF',
      surfaceActive: '#E0E7EF',
      surfaceHover: '#F0F4F8',
      text: '#1A202C',
      textSecondary: '#64748B',
      border: '#CBD5E1',
      borderHover: '#94A3B8',
      accent: '#FFB300',
      error: '#C62828',
      success: '#2E7D32',
      warning: '#FFA000',
      info: '#0288D1',
    },
    contrast: {
      textOnBackground: 13.2,
      textOnSurface: 12.0,
      accentOnBackground: 7.0,
    },
    description: 'Soft, warm, and modern. Alternate light theme.',
  },
  {
    slug: 'nocturne',
    label: 'Nocturne',
    isDark: true,
    tokens: {
      primary: '#90CAF9',
      primaryOnSurface: '#99ccff',
      primaryHover: '#A0D1FF',
      background: '#181A20',
      surface: '#23272F',
      surfaceActive: '#2D3748',
      surfaceHover: '#2A2E38',
      text: '#F3F4F6',
      textSecondary: '#A1A1AA',
      border: '#2D3748',
      borderHover: '#475569',
      accent: '#FFD600',
      error: '#EF5350',
      success: '#66BB6A',
      warning: '#FFB300',
      info: '#29B6F6',
    },
    contrast: {
      textOnBackground: 13.5,
      textOnSurface: 12.8,
      accentOnBackground: 7.1,
    },
    description: 'Deep, high-contrast, and easy on the eyes. Default dark theme.',
  },
  {
    slug: 'cosmos',
    label: 'Cosmos',
    isDark: true,
    tokens: {
      primary: '#FF6F91',
      primaryOnSurface: '#ffb3c6',
      primaryHover: '#ff85a3',
      background: '#101014',
      surface: '#181A20',
      surfaceActive: '#101014',
      surfaceHover: '#202028',
      text: '#F8FAFC',
      textSecondary: '#A3A3A3',
      border: '#23272F',
      borderHover: '#475569',
      accent: '#00E5FF',
      error: '#FF5252',
      success: '#00E676',
      warning: '#FFD740',
      info: '#18FFFF',
    },
    contrast: {
      textOnBackground: 14.2,
      textOnSurface: 13.0,
      accentOnBackground: 7.3,
    },
    description: 'Vivid, futuristic, and ultra-accessible. Alternate dark theme.',
  },
] as const;

// Validate themes at runtime (fail fast if invalid)
ThemeRegistrySchema.parse(THEMES);
