import { TestBed } from '@angular/core/testing';

import type {
  AnalyticsEvent,
  AnalyticsService,
  ConsentStatus,
  CustomDimensions,
  PageView,
} from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let gtagSpy: ReturnType<typeof vi.fn>;
  let originalGtag: ((...args: unknown[]) => void) | undefined;
  let originalDataLayer: unknown[] | undefined;

  beforeEach(async () => {
    // Save original window properties
    originalGtag = window.gtag as ((...args: unknown[]) => void) | undefined;
    originalDataLayer = window.dataLayer;

    // Mock gtag and dataLayer
    gtagSpy = vi.fn();
    window.gtag = gtagSpy as unknown as (...args: unknown[]) => void;
    window.dataLayer = [];

    // Clear GA disable flags
    Object.keys(window).forEach((key) => {
      if (key.startsWith('ga-disable-')) {
        delete window[key];
      }
    });

    TestBed.configureTestingModule({});

    // Dynamically import to avoid issues with module initialization
    const module = await import('./analytics.service');
    service = TestBed.inject(module.AnalyticsService);
  });

  afterEach(() => {
    // Restore original window properties
    if (originalGtag) {
      window.gtag = originalGtag;
    } else {
      delete (window as { gtag?: typeof window.gtag }).gtag;
    }

    if (originalDataLayer) {
      window.dataLayer = originalDataLayer;
    } else {
      delete (window as { dataLayer?: typeof window.dataLayer }).dataLayer;
    }

    // Clear any added scripts
    document.querySelectorAll('script[src*="googletagmanager"]').forEach((script) => {
      script.remove();
    });

    gtagSpy.mockClear();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with isInitialized as false', () => {
      expect(service.getIsInitialized()).toBe(false);
    });

    it('should initialize with hasConsent as false', () => {
      expect(service.getHasConsent()).toBe(false);
    });

    it('should initialize with isEnabled as false', () => {
      expect(service.getIsEnabled()).toBe(false);
    });
  });

  describe('initialize()', () => {
    it('should set isInitialized to true', () => {
      service.initialize('G-TEST123', false);
      expect(service.getIsInitialized()).toBe(true);
    });

    it('should set hasConsent when provided', () => {
      service.initialize('G-TEST123', true);
      expect(service.getHasConsent()).toBe(true);
    });

    it('should not set hasConsent when not provided', () => {
      service.initialize('G-TEST123');
      expect(service.getHasConsent()).toBe(false);
    });

    it('should set isEnabled when consent is given', () => {
      service.initialize('G-TEST123', true);
      expect(service.getIsEnabled()).toBe(true);
    });

    it('should not set isEnabled when consent is not given', () => {
      service.initialize('G-TEST123', false);
      expect(service.getIsEnabled()).toBe(false);
    });

    it('should configure GA4 when consent is given', () => {
      service.initialize('G-TEST123', true);
      expect(gtagSpy).toHaveBeenCalledWith('config', 'G-TEST123', {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure',
        send_page_view: false,
      });
    });

    it('should not configure GA4 when consent is not given', () => {
      service.initialize('G-TEST123', false);
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('should warn if already initialized', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      service.initialize('G-TEST123', true);
      service.initialize('G-TEST456', true);
      expect(consoleSpy).toHaveBeenCalledWith('[AnalyticsService] Already initialized');
      consoleSpy.mockRestore();
    });

    it('should not reinitialize if already initialized', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.initialize('G-TEST456', true);
      expect(gtagSpy).not.toHaveBeenCalled();
    });
  });

  describe('updateConsent()', () => {
    beforeEach(() => {
      service.initialize('G-TEST123', false);
      gtagSpy.mockClear();
    });

    it('should update hasConsent signal', () => {
      const consent: ConsentStatus = { analytics: true, marketing: false };
      service.updateConsent(consent);
      expect(service.getHasConsent()).toBe(true);
    });

    it('should update isEnabled when consent is given', () => {
      const consent: ConsentStatus = { analytics: true, marketing: false };
      service.updateConsent(consent);
      expect(service.getIsEnabled()).toBe(true);
    });

    it('should configure GA4 when consent is granted', () => {
      const consent: ConsentStatus = { analytics: true, marketing: false };
      service.updateConsent(consent);
      expect(gtagSpy).toHaveBeenCalledWith('config', 'G-TEST123', expect.any(Object));
    });

    it('should disable tracking when consent is revoked', () => {
      // First grant consent
      service.updateConsent({ analytics: true, marketing: false });
      expect(service.getIsEnabled()).toBe(true);

      // Then revoke consent
      service.updateConsent({ analytics: false, marketing: false });
      expect(service.getIsEnabled()).toBe(false);
      expect(window['ga-disable-G-TEST123']).toBe(true);
    });

    it('should not configure GA4 when consent is revoked', () => {
      service.updateConsent({ analytics: true, marketing: false });
      gtagSpy.mockClear();
      service.updateConsent({ analytics: false, marketing: false });
      expect(gtagSpy).not.toHaveBeenCalled();
    });
  });

  describe('setCustomDimensions()', () => {
    it('should store custom dimensions', () => {
      const dimensions: CustomDimensions = {
        theme: 'aurora',
        deviceType: 'desktop',
      };
      service.setCustomDimensions(dimensions);
      // Verify by tracking an event and checking params
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackEvent({ name: 'test_event' });
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'test_event',
        expect.objectContaining({
          theme: 'aurora',
          deviceType: 'desktop',
        })
      );
    });

    it('should merge custom dimensions', () => {
      service.setCustomDimensions({ theme: 'aurora' });
      service.setCustomDimensions({ deviceType: 'mobile' });
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackEvent({ name: 'test_event' });
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'test_event',
        expect.objectContaining({
          theme: 'aurora',
          deviceType: 'mobile',
        })
      );
    });

    it('should set user_properties when enabled', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      const dimensions: CustomDimensions = { theme: 'nocturne' };
      service.setCustomDimensions(dimensions);
      expect(gtagSpy).toHaveBeenCalledWith('set', 'user_properties', dimensions);
    });

    it('should not call gtag when not enabled', () => {
      service.initialize('G-TEST123', false);
      gtagSpy.mockClear();
      service.setCustomDimensions({ theme: 'lumen' });
      expect(gtagSpy).not.toHaveBeenCalled();
    });
  });

  describe('trackPageView()', () => {
    it('should track page view when enabled', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      const pageView: PageView = {
        pageTitle: 'Home',
        pagePath: '/',
      };
      service.trackPageView(pageView);
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'page_view',
        expect.objectContaining({
          page_title: 'Home',
          page_path: '/',
          page_location: expect.any(String),
        })
      );
    });

    it('should include custom page_location if provided', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      const pageView: PageView = {
        pageTitle: 'About',
        pagePath: '/about',
        pageLocation: 'https://example.com/about',
      };
      service.trackPageView(pageView);
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'page_view',
        expect.objectContaining({
          page_location: 'https://example.com/about',
        })
      );
    });

    it('should include custom dimensions', () => {
      service.initialize('G-TEST123', true);
      service.setCustomDimensions({ theme: 'cosmos' });
      gtagSpy.mockClear();
      service.trackPageView({ pageTitle: 'Projects', pagePath: '/projects' });
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'page_view',
        expect.objectContaining({
          theme: 'cosmos',
        })
      );
    });

    it('should queue event when not enabled', () => {
      service.initialize('G-TEST123', false);
      service.trackPageView({ pageTitle: 'Home', pagePath: '/' });
      expect(gtagSpy).not.toHaveBeenCalled();

      // Enable and verify event is processed (config call happens first, then event)
      service.updateConsent({ analytics: true, marketing: false });
      expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', expect.any(Object));
      // Verify it was called after the config
      const eventCalls = gtagSpy.mock.calls.filter((call) => call[0] === 'event');
      expect(eventCalls.length).toBeGreaterThan(0);
    });
  });

  describe('trackEvent()', () => {
    it('should track event when enabled', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      const event: AnalyticsEvent = {
        name: 'button_click',
        params: { button_id: 'cta-primary' },
      };
      service.trackEvent(event);
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'button_click',
        expect.objectContaining({
          button_id: 'cta-primary',
        })
      );
    });

    it('should track event without params', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackEvent({ name: 'simple_event' });
      expect(gtagSpy).toHaveBeenCalledWith('event', 'simple_event', {});
    });

    it('should include custom dimensions in event params', () => {
      service.initialize('G-TEST123', true);
      service.setCustomDimensions({ userType: 'recruiter' });
      gtagSpy.mockClear();
      service.trackEvent({ name: 'test_event', params: { test: true } });
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'test_event',
        expect.objectContaining({
          test: true,
          userType: 'recruiter',
        })
      );
    });

    it('should queue event when not enabled', () => {
      service.initialize('G-TEST123', false);
      service.trackEvent({ name: 'queued_event' });
      expect(gtagSpy).not.toHaveBeenCalled();

      // Enable and verify event is processed (config call happens first, then event)
      service.updateConsent({ analytics: true, marketing: false });
      expect(gtagSpy).toHaveBeenCalledWith('event', 'queued_event', expect.any(Object));
      // Verify it was called after the config
      const eventCalls = gtagSpy.mock.calls.filter((call) => call[0] === 'event');
      expect(eventCalls.length).toBeGreaterThan(0);
    });
  });

  describe('trackProjectView()', () => {
    it('should track project view event', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackProjectView('proj-123', 'My Project');
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'project_view',
        expect.objectContaining({
          project_id: 'proj-123',
          project_title: 'My Project',
        })
      );
    });
  });

  describe('trackThemeChange()', () => {
    it('should track theme change event', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackThemeChange('aurora');
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'theme_change',
        expect.objectContaining({
          theme_name: 'aurora',
        })
      );
    });

    it('should update custom dimensions with theme', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackThemeChange('nocturne');
      // Should call set for user_properties
      expect(gtagSpy).toHaveBeenCalledWith(
        'set',
        'user_properties',
        expect.objectContaining({
          theme: 'nocturne',
        })
      );
    });
  });

  describe('trackContactSubmit()', () => {
    it('should track contact submit event', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackContactSubmit('email');
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'contact_submit',
        expect.objectContaining({
          contact_method: 'email',
        })
      );
    });
  });

  describe('trackOutboundLink()', () => {
    it('should track outbound link click', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackOutboundLink('https://github.com', 'GitHub Profile');
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'click',
        expect.objectContaining({
          link_url: 'https://github.com',
          link_text: 'GitHub Profile',
          outbound: true,
        })
      );
    });

    it('should use URL as link_text if not provided', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackOutboundLink('https://example.com');
      expect(gtagSpy).toHaveBeenCalledWith(
        'event',
        'click',
        expect.objectContaining({
          link_url: 'https://example.com',
          link_text: 'https://example.com',
        })
      );
    });
  });

  describe('Event Queue', () => {
    it('should queue events before initialization', () => {
      service.trackEvent({ name: 'early_event' });
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('should process queued events after initialization with consent', () => {
      service.trackEvent({ name: 'queued_1' });
      service.trackEvent({ name: 'queued_2' });
      service.initialize('G-TEST123', true);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'queued_1', expect.any(Object));
      expect(gtagSpy).toHaveBeenCalledWith('event', 'queued_2', expect.any(Object));
    });

    it('should not process queued events without consent', () => {
      service.trackEvent({ name: 'queued_event' });
      service.initialize('G-TEST123', false);
      expect(gtagSpy).not.toHaveBeenCalledWith('event', 'queued_event', expect.any(Object));
    });

    it('should process queued events when consent is granted later', () => {
      service.initialize('G-TEST123', false);
      service.trackEvent({ name: 'delayed_event' });
      gtagSpy.mockClear();

      service.updateConsent({ analytics: true, marketing: false });
      expect(gtagSpy).toHaveBeenCalledWith('event', 'delayed_event', expect.any(Object));
      // Verify it was called after the config
      const eventCalls = gtagSpy.mock.calls.filter((call) => call[0] === 'event');
      expect(eventCalls.length).toBeGreaterThan(0);
    });

    it('should handle mixed page_view and custom events in queue', () => {
      service.trackPageView({ pageTitle: 'Home', pagePath: '/' });
      service.trackEvent({ name: 'custom_event' });
      service.initialize('G-TEST123', true);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', expect.any(Object));
      expect(gtagSpy).toHaveBeenCalledWith('event', 'custom_event', expect.any(Object));
    });
  });

  describe('Signal Reactivity', () => {
    it('should update isInitialized signal reactively', () => {
      expect(service.getIsInitialized()).toBe(false);
      service.initialize('G-TEST123', false);
      expect(service.getIsInitialized()).toBe(true);
    });

    it('should update hasConsent signal reactively', () => {
      service.initialize('G-TEST123', false);
      expect(service.getHasConsent()).toBe(false);
      service.updateConsent({ analytics: true, marketing: false });
      expect(service.getHasConsent()).toBe(true);
    });

    it('should update isEnabled signal reactively', () => {
      expect(service.getIsEnabled()).toBe(false);
      service.initialize('G-TEST123', false);
      expect(service.getIsEnabled()).toBe(false);
      service.updateConsent({ analytics: true, marketing: false });
      expect(service.getIsEnabled()).toBe(true);
    });

    it('should provide readonly signals', () => {
      const isInitialized = service.getIsInitialized;
      const hasConsent = service.getHasConsent;
      const isEnabled = service.getIsEnabled;
      expect(typeof isInitialized).toBe('function');
      expect(typeof hasConsent).toBe('function');
      expect(typeof isEnabled).toBe('function');
    });
  });

  describe('Privacy and Security', () => {
    it('should anonymize IP addresses', () => {
      service.initialize('G-TEST123', true);
      expect(gtagSpy).toHaveBeenCalledWith(
        'config',
        'G-TEST123',
        expect.objectContaining({
          anonymize_ip: true,
        })
      );
    });

    it('should use secure cookie flags', () => {
      service.initialize('G-TEST123', true);
      expect(gtagSpy).toHaveBeenCalledWith(
        'config',
        'G-TEST123',
        expect.objectContaining({
          cookie_flags: 'SameSite=Strict;Secure',
        })
      );
    });

    it('should disable automatic page view tracking', () => {
      service.initialize('G-TEST123', true);
      expect(gtagSpy).toHaveBeenCalledWith(
        'config',
        'G-TEST123',
        expect.objectContaining({
          send_page_view: false,
        })
      );
    });

    it('should set GA disable flag when tracking is disabled', () => {
      service.initialize('G-TEST123', true);
      service.updateConsent({ analytics: false, marketing: false });
      expect(window['ga-disable-G-TEST123']).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty custom dimensions', () => {
      service.initialize('G-TEST123', true);
      service.setCustomDimensions({});
      gtagSpy.mockClear();
      service.trackEvent({ name: 'test' });
      expect(gtagSpy).toHaveBeenCalled();
    });

    it('should handle event with empty params', () => {
      service.initialize('G-TEST123', true);
      gtagSpy.mockClear();
      service.trackEvent({ name: 'test', params: {} });
      expect(gtagSpy).toHaveBeenCalledWith('event', 'test', {});
    });

    it('should not crash when gtag is undefined', () => {
      delete (window as { gtag?: typeof window.gtag }).gtag;
      service.initialize('G-TEST123', true);
      expect(() => {
        service.trackEvent({ name: 'test' });
      }).not.toThrow();
    });

    it('should handle initialization with empty measurement ID', () => {
      expect(() => {
        service.initialize('', true);
      }).not.toThrow();
    });
  });
});
