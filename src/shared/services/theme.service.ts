// These declarations silence linter errors for browser globals in browser-only code
declare var window: Window;
declare var document: Document;
declare var localStorage: Storage;
import { computed, effect, Injectable, signal } from '@angular/core';

import { THEMES } from '../constants/themes.constants';

const THEME_STORAGE_KEY = 'theme-preference-v1';

/**
 * Type for a theme object (from THEMES)
 */
export type Theme = (typeof THEMES)[number];

/**
 * Type for persisted theme preference
 */
interface ThemePreference {
  slug: string;
  timestamp: number;
  version: number;
}

/**
 * Utility: Get system theme slug ('lumen' for light, 'nocturne' for dark by default)
 */

/**
 * Exported for testing: Get system theme slug
 */
export function getSystemThemeSlug(): string {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'nocturne';
  }
  return 'lumen';
}

/**
 * Utility: Listen for OS theme changes
 */

/**
 * Exported for testing: Listen for OS theme changes
 */
export function onSystemThemeChange(callback: (slug: string) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => callback(getSystemThemeSlug());
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** All available themes */
  readonly availableThemes = THEMES;

  /** Signal: active theme slug */
  private readonly _activeThemeSlug = signal<string>(this._getInitialThemeSlug());

  /** Signal: is system default mode */
  private readonly _isSystemDefault = signal<boolean>(!this._getStoredPreference());

  /** Signal: active theme object */
  readonly activeTheme = computed(
    () =>
      this.availableThemes.find((t) => t.slug === this._activeThemeSlug()) ||
      this.availableThemes[0]
  );

  /** Signal: is dark mode */
  readonly isDarkMode = computed(() => this.activeTheme().isDark);

  /** Signal: is system default */
  readonly isSystemDefault = this._isSystemDefault.asReadonly();

  /** Expose available themes as signal */
  readonly themes = signal<readonly Theme[]>(this.availableThemes);

  private _removeSystemListener: (() => void) | null = null;

  constructor() {
    // Apply theme on init
    this._applyTheme(this._activeThemeSlug());
    // Listen for system theme changes if in system mode
    if (this._isSystemDefault()) {
      this._listenToSystemTheme();
    }
    // React to theme changes
    effect(() => {
      this._applyTheme(this._activeThemeSlug());
    });
  }

  /** Set theme by slug */
  setTheme(slug: string) {
    if (!this.availableThemes.some((t) => t.slug === slug)) return;
    this._activeThemeSlug.set(slug);
    this._isSystemDefault.set(false);
    this._storePreference(slug);
    this._removeSystemListener?.();
  }

  /** Reset to system theme */
  resetToSystem() {
    const systemSlug = getSystemThemeSlug();
    this._activeThemeSlug.set(systemSlug);
    this._isSystemDefault.set(true);
    this._removeSystemListener?.();
    this._listenToSystemTheme();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }

  /** Internal: Listen for OS theme changes */
  private _listenToSystemTheme() {
    this._removeSystemListener = onSystemThemeChange((slug) => {
      this._activeThemeSlug.set(slug);
      this._applyTheme(slug);
    });
  }

  /** Internal: Apply theme by slug (set data-theme, inject CSS vars) */
  private _applyTheme(slug: string) {
    const theme = this.availableThemes.find((t) => t.slug === slug) || this.availableThemes[0];
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme.slug);
      // Inject CSS variables, converting camelCase to kebab-case
      Object.entries(theme.tokens).forEach(([key, value]) => {
        const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        document.documentElement.style.setProperty(`--color-${kebabKey}`, value);
      });
    }
  }

  /** Internal: Get initial theme slug (from storage or system) */
  private _getInitialThemeSlug(): string {
    const pref = this._getStoredPreference();
    if (pref && this.availableThemes.some((t) => t.slug === pref.slug)) {
      return pref.slug;
    }
    return getSystemThemeSlug();
  }

  /** Internal: Get stored preference */
  private _getStoredPreference(): ThemePreference | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) return null;
      const pref = JSON.parse(raw);
      if (typeof pref.slug === 'string' && typeof pref.timestamp === 'number') {
        return pref;
      }
      return null;
    } catch {
      return null;
    }
  }

  /** Internal: Store preference */
  private _storePreference(slug: string) {
    const pref: ThemePreference = {
      slug,
      timestamp: Date.now(),
      version: 1,
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(pref));
    }
  }
}
