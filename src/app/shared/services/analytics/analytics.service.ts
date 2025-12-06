import { Injectable, signal } from '@angular/core';

/**
 * Analytics event data structure
 */
export interface AnalyticsEvent {
  /** Event name (e.g., 'page_view', 'project_view') */
  name: string;
  /** Event parameters */
  params?: Record<string, string | number | boolean>;
}

/**
 * Custom dimensions for analytics
 */
export interface CustomDimensions {
  /** Current theme (e.g., 'lumen', 'aurora') */
  theme?: string;
  /** User type (e.g., 'recruiter', 'developer') */
  userType?: string;
  /** Device type (e.g., 'mobile', 'desktop') */
  deviceType?: string;
  /** Any additional custom dimensions */
  [key: string]: string | undefined;
}

/**
 * Page view tracking data
 */
export interface PageView {
  /** Page title */
  pageTitle: string;
  /** Page path (e.g., '/about') */
  pagePath: string;
  /** Page location (full URL) */
  pageLocation?: string;
}

/**
 * Analytics consent status
 */
export interface ConsentStatus {
  /** Analytics cookies consent */
  analytics: boolean;
  /** Marketing cookies consent */
  marketing: boolean;
}

/**
 * Service for Google Analytics 4 (GA4) tracking
 * Provides privacy-friendly analytics with consent-aware initialization
 * Uses signal-based state management for reactive tracking status
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private analyticsService = inject(AnalyticsService);
 *
 *   ngOnInit() {
 *     // Initialize with consent
 *     this.analyticsService.initialize('G-XXXXXXXXXX', true);
 *
 *     // Track page view
 *     this.analyticsService.trackPageView({
 *       pageTitle: 'About',
 *       pagePath: '/about'
 *     });
 *
 *     // Track custom event
 *     this.analyticsService.trackEvent({
 *       name: 'project_view',
 *       params: { project_id: 'my-project' }
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  /** Whether analytics is initialized and ready */
  private readonly isInitialized = signal<boolean>(false);

  /** Whether user has consented to analytics */
  private readonly hasConsent = signal<boolean>(false);

  /** Whether analytics is enabled (initialized AND consented) */
  private readonly isEnabled = signal<boolean>(false);

  /** GA4 measurement ID */
  private measurementId: string | null = null;

  /** Custom dimensions applied to all events */
  private customDimensions: CustomDimensions = {};

  /** Queue for events sent before initialization */
  private eventQueue: AnalyticsEvent[] = [];

  /**
   * Get the analytics initialization status
   */
  getIsInitialized = this.isInitialized.asReadonly();

  /**
   * Get the user consent status
   */
  getHasConsent = this.hasConsent.asReadonly();

  /**
   * Get the analytics enabled status
   */
  getIsEnabled = this.isEnabled.asReadonly();

  /**
   * Initialize Google Analytics with the provided measurement ID
   * @param measurementId - GA4 measurement ID (e.g., 'G-XXXXXXXXXX')
   * @param consent - Whether user has consented to analytics (default: false)
   */
  initialize(measurementId: string, consent = false): void {
    if (this.isInitialized()) {
      console.warn('[AnalyticsService] Already initialized');
      return;
    }

    this.measurementId = measurementId;
    this.hasConsent.set(consent);

    // Load GA4 script if consent is given
    if (consent) {
      this.loadGoogleAnalytics();
    }

    this.isInitialized.set(true);
    this.updateEnabledStatus();

    // Process queued events if enabled
    if (this.isEnabled()) {
      this.processEventQueue();
    }
  }

  /**
   * Update user consent status
   * @param consent - Consent status for analytics and marketing
   */
  updateConsent(consent: ConsentStatus): void {
    const analyticsConsent = consent.analytics;
    this.hasConsent.set(analyticsConsent);

    if (analyticsConsent && this.isInitialized() && !this.isEnabled()) {
      // User just gave consent, load GA4
      this.loadGoogleAnalytics();
      // Update enabled status BEFORE processing queue
      this.updateEnabledStatus();
      this.processEventQueue();
    } else if (!analyticsConsent && this.isEnabled()) {
      // User revoked consent, disable tracking
      this.disableTracking();
      this.updateEnabledStatus();
    } else {
      this.updateEnabledStatus();
    }
  }

  /**
   * Set custom dimensions to be included with all events
   * @param dimensions - Custom dimensions object
   */
  setCustomDimensions(dimensions: CustomDimensions): void {
    this.customDimensions = { ...this.customDimensions, ...dimensions };

    if (this.isEnabled() && typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', dimensions);
    }
  }

  /**
   * Track a page view
   * @param pageView - Page view data
   */
  trackPageView(pageView: PageView): void {
    if (!this.canTrack()) {
      this.queueEvent({
        name: 'page_view',
        params: {
          page_title: pageView.pageTitle,
          page_path: pageView.pagePath,
          page_location: pageView.pageLocation || window.location.href,
        },
      });
      return;
    }

    const params = {
      page_title: pageView.pageTitle,
      page_path: pageView.pagePath,
      page_location: pageView.pageLocation || window.location.href,
      ...this.customDimensions,
    };

    window.gtag('event', 'page_view', params);
  }

  /**
   * Track a custom event
   * @param event - Event data with name and optional parameters
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.canTrack()) {
      this.queueEvent(event);
      return;
    }

    const params = {
      ...event.params,
      ...this.customDimensions,
    };

    window.gtag('event', event.name, params);
  }

  /**
   * Track a project view event
   * @param projectId - Project identifier
   * @param projectTitle - Project title
   */
  trackProjectView(projectId: string, projectTitle: string): void {
    this.trackEvent({
      name: 'project_view',
      params: {
        project_id: projectId,
        project_title: projectTitle,
      },
    });
  }

  /**
   * Track a theme change event
   * @param themeName - Theme name (e.g., 'lumen', 'aurora')
   */
  trackThemeChange(themeName: string): void {
    this.trackEvent({
      name: 'theme_change',
      params: {
        theme_name: themeName,
      },
    });

    // Update custom dimension
    this.setCustomDimensions({ theme: themeName });
  }

  /**
   * Track a contact form submission event
   * @param method - Contact method (e.g., 'email', 'linkedin')
   */
  trackContactSubmit(method: string): void {
    this.trackEvent({
      name: 'contact_submit',
      params: {
        contact_method: method,
      },
    });
  }

  /**
   * Track an outbound link click
   * @param url - Destination URL
   * @param linkText - Link text or label
   */
  trackOutboundLink(url: string, linkText?: string): void {
    this.trackEvent({
      name: 'click',
      params: {
        link_url: url,
        link_text: linkText || url,
        outbound: true,
      },
    });
  }

  /**
   * Disable all analytics tracking
   * Sets the GA4 opt-out flag and clears consent
   */
  private disableTracking(): void {
    if (this.measurementId && typeof window !== 'undefined') {
      window[`ga-disable-${this.measurementId}`] = true;
    }
  }

  /**
   * Load the Google Analytics script
   */
  private loadGoogleAnalytics(): void {
    if (!this.measurementId || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Check if gtag is already loaded
    if (typeof window.gtag !== 'undefined') {
      this.configureGoogleAnalytics();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;

    // Initialize gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
       
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());

    // Configure GA4
    this.configureGoogleAnalytics();

    // Append script to head
    document.head.appendChild(script);
  }

  /**
   * Configure Google Analytics with the measurement ID and settings
   */
  private configureGoogleAnalytics(): void {
    if (!this.measurementId || typeof window === 'undefined' || !window.gtag) {
      return;
    }

    window.gtag('config', this.measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure',
      send_page_view: false, // Manual page view tracking
    });

    // Apply custom dimensions if any
    if (Object.keys(this.customDimensions).length > 0) {
      window.gtag('set', 'user_properties', this.customDimensions);
    }
  }

  /**
   * Update the enabled status based on initialization and consent
   */
  private updateEnabledStatus(): void {
    const enabled = this.isInitialized() && this.hasConsent();
    this.isEnabled.set(enabled);
  }

  /**
   * Check if tracking is allowed
   */
  private canTrack(): boolean {
    return this.isEnabled() && typeof window !== 'undefined' && !!window.gtag;
  }

  /**
   * Queue an event to be sent after initialization
   * @param event - Event to queue
   */
  private queueEvent(event: AnalyticsEvent): void {
    // Queue events if not initialized OR if initialized but not yet enabled
    if (!this.isInitialized() || (this.isInitialized() && !this.isEnabled())) {
      this.eventQueue.push(event);
    }
  }

  /**
   * Process all queued events
   */
  private processEventQueue(): void {
    if (!this.canTrack() || this.eventQueue.length === 0) {
      return;
    }

    // Process each queued event
    this.eventQueue.forEach((event) => {
      if (event.name === 'page_view' && event.params) {
        this.trackPageView({
          pageTitle: String(event.params['page_title'] || ''),
          pagePath: String(event.params['page_path'] || ''),
          pageLocation: event.params['page_location']
            ? String(event.params['page_location'])
            : undefined,
        });
      } else {
        this.trackEvent(event);
      }
    });

    // Clear the queue
    this.eventQueue = [];
  }
}

/**
 * Extend Window interface for gtag
 */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    gtag: (...args: unknown[]) => void;
    [key: string]: unknown;
  }
}
