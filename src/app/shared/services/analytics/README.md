# Analytics Service

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Privacy-friendly Google Analytics 4 (GA4) service with consent-aware initialization, event queuing, and signal-based reactive state management.

## Features

- ✅ **Consent-Aware**: Initialize with or without consent, update consent dynamically
- ✅ **Event Queuing**: Queue events before initialization/consent, process automatically
- ✅ **Page View Tracking**: Manual page view tracking with custom parameters
- ✅ **Custom Events**: Track custom events with parameters
- ✅ **Custom Dimensions**: User properties applied to all events
- ✅ **Predefined Event Helpers**: Project views, theme changes, contact submissions, outbound links
- ✅ **Signal-based State**: Reactive status signals (isInitialized, hasConsent, isEnabled)
- ✅ **Privacy-First**: IP anonymization, secure cookies, opt-out support
- ✅ **Type-safe**: Full TypeScript type safety with interfaces

## Quick Start

### 1. Initialize the Service

In your app initialization (e.g., `app.component.ts`):

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsService } from '@shared/services';

@Component({
  selector: 'app-root',
  // ...
})
export class AppComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  ngOnInit() {
    // Initialize with measurement ID (consent will be requested separately)
    this.analyticsService.initialize('G-XXXXXXXXXX', false);
  }
}
```

### 2. Request and Update Consent

```typescript
// When user accepts analytics cookies
this.analyticsService.updateConsent({
  analytics: true,
  marketing: false,
});

// When user revokes consent
this.analyticsService.updateConsent({
  analytics: false,
  marketing: false,
});
```

### 3. Track Page Views

In your router or component:

```typescript
ngOnInit() {
  this.analyticsService.trackPageView({
    pageTitle: 'Home',
    pagePath: '/',
    pageLocation: window.location.href, // optional
  });
}
```

### 4. Track Custom Events

```typescript
this.analyticsService.trackEvent({
  name: 'button_click',
  params: {
    button_id: 'cta-primary',
    button_text: 'Get Started',
  },
});
```

## Usage

### Initialize with Consent

If you have consent from the start (e.g., returning user with saved preferences):

```typescript
this.analyticsService.initialize('G-XXXXXXXXXX', true);
```

### Initialize without Consent

Queue events until user provides consent:

```typescript
// Initialize without consent
this.analyticsService.initialize('G-XXXXXXXXXX', false);

// Events are queued automatically
this.analyticsService.trackPageView({ pageTitle: 'Home', pagePath: '/' });
this.analyticsService.trackEvent({ name: 'app_load' });

// Later, when user consents
this.analyticsService.updateConsent({ analytics: true, marketing: false });
// All queued events are automatically sent
```

### Set Custom Dimensions

Apply custom dimensions to all events:

```typescript
// Set theme dimension
this.analyticsService.setCustomDimensions({
  theme: 'aurora',
  deviceType: 'desktop',
});

// All subsequent events include these dimensions
```

### Track Page Views

```typescript
// Basic page view
this.analyticsService.trackPageView({
  pageTitle: 'About',
  pagePath: '/about',
});

// With custom location
this.analyticsService.trackPageView({
  pageTitle: 'Project Details',
  pagePath: '/projects/my-project',
  pageLocation: 'https://example.com/projects/my-project?ref=home',
});
```

### Track Custom Events

```typescript
// Simple event
this.analyticsService.trackEvent({
  name: 'newsletter_signup',
});

// Event with parameters
this.analyticsService.trackEvent({
  name: 'search',
  params: {
    search_term: 'angular components',
    results_count: 42,
  },
});
```

### Predefined Event Helpers

#### Track Project Views

```typescript
this.analyticsService.trackProjectView('proj-123', 'My Awesome Project');
```

#### Track Theme Changes

```typescript
// Automatically updates custom dimensions too
this.analyticsService.trackThemeChange('nocturne');
```

#### Track Contact Submissions

```typescript
this.analyticsService.trackContactSubmit('email');
```

#### Track Outbound Links

```typescript
this.analyticsService.trackOutboundLink(
  'https://github.com/username',
  'GitHub Profile'
);
```

### Reactive State with Signals

Monitor analytics status reactively:

```typescript
export class MyComponent {
  private analyticsService = inject(AnalyticsService);

  isInitialized = this.analyticsService.getIsInitialized();
  hasConsent = this.analyticsService.getHasConsent();
  isEnabled = this.analyticsService.getIsEnabled();
}
```

```html
<p *ngIf="!hasConsent()">
  We use analytics to improve your experience.
  <button (click)="acceptAnalytics()">Accept</button>
</p>

<p *ngIf="isEnabled()">Analytics: Active ✓</p>
```

## Service API

### `initialize(measurementId: string, consent?: boolean): void`

Initialize Google Analytics with the provided measurement ID.

**Parameters:**
- `measurementId` - GA4 measurement ID (e.g., 'G-XXXXXXXXXX')
- `consent` - Whether user has consented to analytics (default: false)

**Example:**
```typescript
this.analyticsService.initialize('G-ABC123XYZ', true);
```

### `updateConsent(consent: ConsentStatus): void`

Update user consent status for analytics.

**Parameters:**
- `consent` - Consent status object

**Example:**
```typescript
this.analyticsService.updateConsent({
  analytics: true,
  marketing: false,
});
```

### `setCustomDimensions(dimensions: CustomDimensions): void`

Set custom dimensions to be included with all events.

**Parameters:**
- `dimensions` - Custom dimensions object

**Example:**
```typescript
this.analyticsService.setCustomDimensions({
  theme: 'lumen',
  userType: 'developer',
});
```

### `trackPageView(pageView: PageView): void`

Track a page view event.

**Parameters:**
- `pageView` - Page view data

**Example:**
```typescript
this.analyticsService.trackPageView({
  pageTitle: 'Contact',
  pagePath: '/contact',
  pageLocation: window.location.href,
});
```

### `trackEvent(event: AnalyticsEvent): void`

Track a custom event.

**Parameters:**
- `event` - Event data with name and optional parameters

**Example:**
```typescript
this.analyticsService.trackEvent({
  name: 'file_download',
  params: {
    file_name: 'resume.pdf',
    file_size: '245KB',
  },
});
```

### `trackProjectView(projectId: string, projectTitle: string): void`

Track a project view event.

**Parameters:**
- `projectId` - Project identifier
- `projectTitle` - Project title

**Example:**
```typescript
this.analyticsService.trackProjectView('ecommerce-app', 'E-commerce Platform');
```

### `trackThemeChange(themeName: string): void`

Track a theme change event and update custom dimensions.

**Parameters:**
- `themeName` - Theme name

**Example:**
```typescript
this.analyticsService.trackThemeChange('cosmos');
```

### `trackContactSubmit(method: string): void`

Track a contact form submission event.

**Parameters:**
- `method` - Contact method (e.g., 'email', 'linkedin')

**Example:**
```typescript
this.analyticsService.trackContactSubmit('email');
```

### `trackOutboundLink(url: string, linkText?: string): void`

Track an outbound link click.

**Parameters:**
- `url` - Destination URL
- `linkText` - Link text or label (optional)

**Example:**
```typescript
this.analyticsService.trackOutboundLink(
  'https://twitter.com/username',
  'Twitter Profile'
);
```

### `getIsInitialized(): Signal<boolean>`

Get a readonly signal for the initialization status.

**Returns:** Readonly signal indicating if service is initialized

**Example:**
```typescript
const isInit = this.analyticsService.getIsInitialized();
console.log(isInit()); // true or false
```

### `getHasConsent(): Signal<boolean>`

Get a readonly signal for the consent status.

**Returns:** Readonly signal indicating if user has consented

**Example:**
```typescript
const consented = this.analyticsService.getHasConsent();
```

### `getIsEnabled(): Signal<boolean>`

Get a readonly signal for the enabled status (initialized AND consented).

**Returns:** Readonly signal indicating if tracking is enabled

**Example:**
```typescript
const enabled = this.analyticsService.getIsEnabled();
```

## Configuration Interfaces

### `AnalyticsEvent`

```typescript
interface AnalyticsEvent {
  /** Event name (e.g., 'page_view', 'project_view') */
  name: string;
  /** Event parameters */
  params?: Record<string, string | number | boolean>;
}
```

### `PageView`

```typescript
interface PageView {
  /** Page title */
  pageTitle: string;
  /** Page path (e.g., '/about') */
  pagePath: string;
  /** Page location (full URL) */
  pageLocation?: string;
}
```

### `CustomDimensions`

```typescript
interface CustomDimensions {
  /** Current theme (e.g., 'lumen', 'aurora') */
  theme?: string;
  /** User type (e.g., 'recruiter', 'developer') */
  userType?: string;
  /** Device type (e.g., 'mobile', 'desktop') */
  deviceType?: string;
  /** Any additional custom dimensions */
  [key: string]: string | undefined;
}
```

### `ConsentStatus`

```typescript
interface ConsentStatus {
  /** Analytics cookies consent */
  analytics: boolean;
  /** Marketing cookies consent */
  marketing: boolean;
}
```

## Privacy & Security

### Built-in Privacy Features

1. **IP Anonymization**: All IP addresses are anonymized
2. **Secure Cookies**: Cookies use `SameSite=Strict;Secure` flags
3. **Manual Page View Tracking**: Automatic page views disabled for better control
4. **Opt-out Support**: Users can revoke consent at any time
5. **Event Queuing**: No data sent until explicit consent

### GDPR Compliance

```typescript
// Don't initialize until user interaction
// Show cookie banner first

// When user accepts
this.analyticsService.initialize('G-XXXXXXXXXX', true);

// When user declines
this.analyticsService.initialize('G-XXXXXXXXXX', false);

// When user revokes consent later
this.analyticsService.updateConsent({ analytics: false, marketing: false });
```

### GA4 Configuration

The service configures GA4 with:

```typescript
{
  anonymize_ip: true,                  // Anonymize IP addresses
  cookie_flags: 'SameSite=Strict;Secure', // Secure cookie flags
  send_page_view: false,                // Manual page view tracking only
}
```

## Event Queuing

Events are automatically queued when:
- Service is not yet initialized
- Service is initialized but consent has not been granted

```typescript
// Before initialization - events are queued
this.analyticsService.trackEvent({ name: 'early_event' });

// Initialize without consent - more events are queued
this.analyticsService.initialize('G-XXXXXXXXXX', false);
this.analyticsService.trackEvent({ name: 'another_event' });

// Grant consent - all queued events are sent automatically
this.analyticsService.updateConsent({ analytics: true, marketing: false });
// Both 'early_event' and 'another_event' are now sent
```

## Best Practices

### 1. Initialize Early

Initialize the service as early as possible in your app lifecycle:

```typescript
// app.component.ts
ngOnInit() {
  this.analyticsService.initialize('G-XXXXXXXXXX', this.hasStoredConsent());
}
```

### 2. Track Page Views on Route Changes

```typescript
// app.component.ts
constructor(
  private router: Router,
  private analyticsService: AnalyticsService
) {
  this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.analyticsService.trackPageView({
        pageTitle: this.getPageTitle(),
        pagePath: event.urlAfterRedirects,
      });
    });
}
```

### 3. Use Predefined Helpers

Prefer helper methods for common events:

```typescript
// Good
this.analyticsService.trackThemeChange('aurora');

// Less ideal
this.analyticsService.trackEvent({
  name: 'theme_change',
  params: { theme_name: 'aurora' },
});
```

### 4. Set Custom Dimensions Early

```typescript
ngOnInit() {
  // Set dimensions that apply to all events
  this.analyticsService.setCustomDimensions({
    theme: this.themeService.currentTheme(),
    deviceType: this.deviceDetector.getDeviceType(),
  });
}
```

### 5. Respect User Privacy

Always check consent before initializing with tracking enabled:

```typescript
const hasConsent = this.cookieService.getConsentStatus();
this.analyticsService.initialize('G-XXXXXXXXXX', hasConsent);
```

## Testing

Comprehensive unit tests are provided with 60+ test cases:

```bash
npm test
```

### Test Coverage

- ✅ Service creation and initialization
- ✅ Consent management
- ✅ Event tracking (page views, custom events)
- ✅ Event queuing and processing
- ✅ Custom dimensions
- ✅ Predefined event helpers
- ✅ Signal reactivity
- ✅ Privacy features
- ✅ Edge cases

### Mocking in Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('MyComponent', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Service is provided at root
    });
    analyticsService = TestBed.inject(AnalyticsService);

    // Mock gtag
    window.gtag = vi.fn();
  });

  it('should track page view', () => {
    analyticsService.initialize('G-TEST', true);
    analyticsService.trackPageView({ pageTitle: 'Test', pagePath: '/test' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.any(Object));
  });
});
```

## Architecture

```
services/
├── analytics.service.ts           # Service implementation
├── analytics.service.spec.ts      # Unit tests (60+ tests)
├── index.ts                       # Barrel export
└── ANALYTICS_README.md            # This file
```

## Dependencies

### Angular Core
- `@angular/core` - Injectable, inject, signal

### Browser APIs
- `window` - gtag, dataLayer
- `document` - Script loading

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **Signal-based**: Efficient reactive state management
- **Lazy Loading**: GA4 script loaded only when consent is granted
- **Event Queuing**: No wasted requests before consent
- **Tree-shakeable**: Provided at root level for optimal bundle size

## Common Integration Patterns

### With Cookie Consent Banner

```typescript
export class CookieBannerComponent {
  private analyticsService = inject(AnalyticsService);

  acceptAll() {
    this.analyticsService.updateConsent({
      analytics: true,
      marketing: true,
    });
    this.storeCookiePreference('all');
  }

  acceptEssentialOnly() {
    this.analyticsService.updateConsent({
      analytics: false,
      marketing: false,
    });
    this.storeCookiePreference('essential');
  }
}
```

### With Theme Service

```typescript
export class ThemeService {
  private analyticsService = inject(AnalyticsService);

  setTheme(themeName: string) {
    this.applyTheme(themeName);
    this.analyticsService.trackThemeChange(themeName);
  }
}
```

### With Router

```typescript
export class AppComponent implements OnInit {
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);
  private titleService = inject(Title);

  ngOnInit() {
    this.analyticsService.initialize('G-XXXXXXXXXX', this.getStoredConsent());

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.analyticsService.trackPageView({
          pageTitle: this.titleService.getTitle(),
          pagePath: event.urlAfterRedirects,
        });
      });
  }
}
```

## Troubleshooting

### Events Not Being Sent

1. Check that consent has been granted:
```typescript
console.log(this.analyticsService.getIsEnabled()); // Should be true
```

2. Verify GA4 measurement ID is correct

3. Check browser console for errors

### Queued Events Not Processing

Events are automatically processed when:
- Service is initialized with consent = true
- Consent is granted via `updateConsent()`

Check that `isEnabled()` signal is true.

### Double-Counting Page Views

Ensure automatic page views are disabled (already done in service):
```typescript
send_page_view: false
```

Track page views manually using `trackPageView()`.

## GA4 Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Privacy & GDPR](https://support.google.com/analytics/answer/9019185)
- [Debugging with GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)

## License

Part of the MoodyJW Portfolio project.
