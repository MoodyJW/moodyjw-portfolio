// @vitest-environment jsdom
/// <reference types="vitest/globals" />
import { TestBed } from '@angular/core/testing';
// import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { ThemeService } from './theme.service';
import { THEMES } from '../constants/themes.constants';

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
  let service: ThemeService;
  let store: Record<string, string>;
  let origLocalStorage: Storage | undefined;
  let origMatchMedia: typeof window.matchMedia | undefined;
  let origDocumentElement: Element | undefined;

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
});
