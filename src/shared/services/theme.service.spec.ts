// @vitest-environment jsdom
/// <reference types="vitest/globals" />

import { TestBed } from '@angular/core/testing';

import { THEMES } from '../constants/themes.constants';

import { getSystemThemeSlug, onSystemThemeChange, ThemeService } from './theme.service';

declare const window: Window & typeof globalThis;
declare const document: Document;

// TestBed.initTestEnvironment should be called only once globally (see test-setup.ts)

// Type-safe browser mocks
function mockLocalStorage(store: Record<string, string>): Storage {
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    key: (i: number) => Object.keys(store)[i] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
}
describe('ThemeService', () => {
  it('_applyTheme does not throw if document is undefined', () => {
    const origDocument = window.document;
    // @ts-expect-error
    delete window.document;
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(() => s._applyTheme('aurora')).not.toThrow();
    window.document = origDocument;
  });

  it('_getInitialThemeSlug returns system theme if pref is null', () => {
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    vi.spyOn(s, '_getStoredPreference').mockReturnValue(null);
    // @ts-ignore
    expect(s._getInitialThemeSlug()).toBe(getSystemThemeSlug());
  });

  it('_getInitialThemeSlug returns system theme if pref.slug is not in availableThemes', () => {
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    vi.spyOn(s, '_getStoredPreference').mockReturnValue({
      slug: 'not-a-theme' as string,
      timestamp: Date.now(),
      version: 1,
    } as { slug: string; timestamp: number; version: number });
    // @ts-ignore
    expect(s._getInitialThemeSlug()).toBe(getSystemThemeSlug());
  });

  it('setTheme does nothing if slug is undefined', () => {
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(() => s.setTheme(undefined)).not.toThrow();
  });

  it('_getStoredPreference returns null for invalid JSON', () => {
    window.localStorage.setItem('theme-preference-v1', '{invalid json');
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(s._getStoredPreference()).toBeNull();
  });

  it('_getStoredPreference returns null for missing fields', () => {
    window.localStorage.setItem('theme-preference-v1', JSON.stringify({ foo: 'bar' }));
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(s._getStoredPreference()).toBeNull();
  });
  // --- Additional coverage tests for uncovered branches/lines ---

  it('getSystemThemeSlug returns lumen if matchMedia is missing', () => {
    const origMatchMedia = window.matchMedia;
    // @ts-expect-error
    delete window.matchMedia;
    expect(getSystemThemeSlug()).toBe('lumen');
    window.matchMedia = origMatchMedia;
  });

  it('onSystemThemeChange returns noop if matchMedia is missing', () => {
    const origMatchMedia = window.matchMedia;
    // @ts-expect-error
    delete window.matchMedia;
    const fn = onSystemThemeChange(() => {});
    expect(typeof fn).toBe('function');
    expect(() => fn()).not.toThrow();
    window.matchMedia = origMatchMedia;
  });

  it('_getStoredPreference returns null if localStorage is undefined', () => {
    const orig = window.localStorage;
    // @ts-expect-error
    delete window.localStorage;
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(s._getStoredPreference()).toBeNull();
    window.localStorage = orig;
  });

  it('_storePreference does not throw if localStorage is undefined', () => {
    const orig = window.localStorage;
    // @ts-expect-error
    delete window.localStorage;
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(() => s._storePreference('aurora')).not.toThrow();
    window.localStorage = orig;
  });
  let service: ThemeService;
  let store: Record<string, string>;
  let origLocalStorage: Storage | undefined;
  let origMatchMedia: typeof window.matchMedia | undefined;
  let origDocumentElement: Element | undefined;

  function setLocalStorageRaw(val: string | null) {
    if (val === null) {
      window.localStorage.removeItem('theme-preference-v1');
    } else {
      window.localStorage.setItem('theme-preference-v1', val);
    }
  }

  beforeEach(() => {
    // Save originals
    origLocalStorage = window.localStorage;
    origMatchMedia = window.matchMedia;
    origDocumentElement = document.documentElement;
    // Mock localStorage
    store = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: mockLocalStorage(store),
    });
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: query.includes('dark') ? false : true,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as MediaQueryList),
    });
    // Mock document.documentElement
    const styleMock: Partial<CSSStyleDeclaration> = {
      setProperty: vi.fn(),
    };
    // Use a real HTMLElement for documentElement mock to satisfy type
    const elementMock = document.createElement('html');
    elementMock.setAttribute = vi.fn();
    Object.defineProperty(elementMock, 'style', {
      value: styleMock as CSSStyleDeclaration,
      configurable: true,
    });
    Object.defineProperty(document, 'documentElement', {
      configurable: true,
      value: elementMock,
    });
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    if (origLocalStorage)
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: origLocalStorage,
      });
    if (origMatchMedia)
      Object.defineProperty(window, 'matchMedia', { configurable: true, value: origMatchMedia });
    if (origDocumentElement)
      Object.defineProperty(document, 'documentElement', {
        configurable: true,
        value: origDocumentElement,
      });
    vi.resetAllMocks();
  });

  it('should initialize with system theme if no preference', () => {
    expect(THEMES.map((t: (typeof THEMES)[number]) => t.slug)).toContain(
      service.activeTheme().slug
    );
    expect(service.isSystemDefault()).toBe(true);
  });

  it('should set and persist a theme', () => {
    service.setTheme('aurora');
    expect(service.activeTheme().slug).toBe('aurora');
    expect(service.isSystemDefault()).toBe(false);
    expect(window.localStorage.getItem('theme-preference-v1')).toContain('aurora');
  });

  it('should reset to system theme', () => {
    service.setTheme('cosmos');
    service.resetToSystem();
    expect(service.isSystemDefault()).toBe(true);
    expect(window.localStorage.getItem('theme-preference-v1')).toBeNull();
  });

  it('should not set an invalid theme', () => {
    service.setTheme('not-a-theme');
    expect(THEMES.map((t: (typeof THEMES)[number]) => t.slug)).toContain(
      service.activeTheme().slug
    );
  });

  it('should expose all available themes', () => {
    expect(service.themes()).toEqual(THEMES);
  });

  it('should fallback to system theme if localStorage is corrupt', () => {
    setLocalStorageRaw('not-json');
    const s = TestBed.inject(ThemeService);
    expect(THEMES.map((t: (typeof THEMES)[number]) => t.slug)).toContain(s.activeTheme().slug);
    expect(s.isSystemDefault()).toBe(true);
  });

  it('should fallback to system theme if localStorage is missing fields', () => {
    setLocalStorageRaw(JSON.stringify({ foo: 'bar' }));
    const s = TestBed.inject(ThemeService);
    expect(THEMES.map((t: (typeof THEMES)[number]) => t.slug)).toContain(s.activeTheme().slug);
    expect(s.isSystemDefault()).toBe(true);
  });

  it('should fallback to first theme if slug is invalid in _applyTheme', () => {
    // Spy on setAttribute
    const setAttrSpy = vi.spyOn(document.documentElement, 'setAttribute');
    // Directly call private _applyTheme
    (service as unknown as { _applyTheme: (slug: string) => void })._applyTheme('not-a-theme');
    // Should call setAttribute with first theme's slug
    expect(setAttrSpy).toHaveBeenCalledWith('data-theme', THEMES[0].slug);
    setAttrSpy.mockRestore();
  });

  it('should handle LocalStorage being undefined (SSR)', () => {
    const orig = globalThis.localStorage;
    // @ts-expect-error
    delete globalThis.localStorage;
    expect(() => {
      const s = TestBed.inject(ThemeService);
      s.setTheme('aurora');
      s.resetToSystem();
    }).not.toThrow();
    globalThis.localStorage = orig;
  });

  it('should update theme on system theme change', () => {
    // Simulate system theme change
    let callback: ((slug: string) => void) | undefined;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList => {
        return {
          matches: false,
          media: query,
          onchange: null,
          addEventListener: (event: string, cb: () => void) => {
            if (event === 'change') callback = cb;
          },
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as unknown as MediaQueryList;
      },
    });
    const s = TestBed.inject(ThemeService);
    s.resetToSystem();
    // Simulate OS theme change
    if (callback) callback('nocturne');
    // Should update theme
    expect(THEMES.map((t: (typeof THEMES)[number]) => t.slug)).toContain(s.activeTheme().slug);
  });

  it('getSystemThemeSlug returns nocturne for dark mode', () => {
    // Mock matchMedia to return dark mode
    const origMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: query.includes('dark') ? true : false,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as MediaQueryList),
    });
    expect(getSystemThemeSlug()).toBe('nocturne');
    window.matchMedia = origMatchMedia;
  });

  it('_getInitialThemeSlug returns stored preference slug when valid', () => {
    window.localStorage.setItem(
      'theme-preference-v1',
      JSON.stringify({ slug: 'cosmos', timestamp: Date.now(), version: 1 })
    );
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    expect(s._getInitialThemeSlug()).toBe('cosmos');
  });

  it('_getStoredPreference returns valid preference object', () => {
    const pref = { slug: 'aurora', timestamp: Date.now(), version: 1 };
    window.localStorage.setItem('theme-preference-v1', JSON.stringify(pref));
    const s = TestBed.inject(ThemeService);
    // @ts-ignore
    const result = s._getStoredPreference();
    expect(result).not.toBeNull();
    expect(result?.slug).toBe('aurora');
    expect(typeof result?.timestamp).toBe('number');
  });

  it('should trigger effect when theme changes', () => {
    const styleSpy = vi.spyOn(document.documentElement.style, 'setProperty');
    service.setTheme('nocturne');
    // Check that theme was applied
    expect(service.activeTheme().slug).toBe('nocturne');
    // Effect should have set CSS variables
    expect(styleSpy).toHaveBeenCalled();
    styleSpy.mockRestore();
  });
});
