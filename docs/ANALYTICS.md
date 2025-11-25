# Analytics Guide

This document describes recommended analytics choices for the MoodyJW Portfolio demo, covering both quick no-host options (GA4 + Looker Studio) and self-hostable alternatives (PostHog, SigNoz). It also includes implementation checklists, privacy notes, and embedding strategies for surfacing analytics within the app.

## Recommendation Summary

- For a zero-host demo: use **Google Analytics 4 (GA4)** for collection + **Looker Studio** (public report) for embedding dashboards into the app.
- If you want a self-hosted product analytics experience: use **PostHog** (requires Docker or hosting) and embed dashboards or use public insights.
- If you want Datadog-like APM (traces + metrics) consider **SigNoz** or OpenTelemetry -> Tempo/Prometheus/Grafana stack.

---

## GA4 Quick Start (no hosting)

### Goals

- Track pageviews and core events: `page_view`, `project_open`, `theme_change`, `contact_submit`.
- Respect user consent and `Do Not Track`.
- Provide a visible demo dashboard via Looker Studio embed.

### Checklist

- [ ] Create a GA4 property and copy the Measurement ID (`G-XXXXXXX`).
- [ ] Add `GA_MEASUREMENT_ID` to `src/environments/*.ts` (or use Vite envs for Storybook).
- [ ] Insert GA script in `index.html` with `send_page_view: false`.
- [ ] Implement `AnalyticsService` wrapper to call `gtag('event', ...)`.
- [ ] Fire `trackPage()` on route changes and `trackEvent()` for interactions.
- [ ] Add a simple consent banner that blocks analytics until opt-in.
- [ ] Create a Looker Studio report connected to the GA4 property and set sharing to "Anyone with the link can view" for demo embedding.
- [ ] Embed the Looker Studio report via iframe in `AnalyticsViewerComponent` at route `/analytics`.

### Example `index.html` snippet

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
</script>
```

### Event naming conventions

- `page_view` (auto) with `page_path` and `page_title`
- `project_open` with `{ project_id, project_slug }`
- `theme_change` with `{ from_theme, to_theme }`
- `contact_submit` with `{ success: boolean }` (no PII)

```markdown
# Analytics Guide — GA4 Only

This repository uses Google Analytics 4 (GA4) as the canonical analytics provider for Phase 1. We keep documentation for self-hosted alternatives out of the core plan to reduce scope and avoid privacy/hosting complications for the demo. If you later opt into PostHog/SigNoz, create a separate doc that lives under `docs/`.

## Recommendation Summary

- Primary provider: **Google Analytics 4 (GA4)** (no PostHog variant during Phase 1).
- Visual demo dashboards: **Looker Studio** (report shared for demo embedding).
- Consent-first: analytics MUST be initialized only after explicit user consent; respect `navigator.doNotTrack`.

---

## GA4 Implementation (consent-first)

### Goals

- Track pageviews and core events: `page_view`, `project_open`, `theme_change`, `contact_submit`.
- Respect user consent and `Do Not Track` settings.
- Provide a visible demo dashboard via Looker Studio embed for reviewers.

### Checklist

- [ ] Create a GA4 property and copy the Measurement ID (`G-XXXXXXX`).
- [ ] Add `GA_MEASUREMENT_ID` to environment configuration (`src/environments/*.ts` or Vite envs for Storybook).
- [ ] Implement a small `AnalyticsService` wrapper (see snippet below) that defers loading `gtag` until the user consents.
- [ ] Fire `trackPage()` on route changes and `trackEvent()` for interactions.
- [ ] Provide a lightweight consent banner that toggles analytics on opt-in and rejects on opt-out.
- [ ] Create a Looker Studio report and set sharing to a demo-friendly mode for embedding.

### Minimal consent-aware `AnalyticsService` (example)

Create `src/app/core/services/analytics.service.ts` with a minimal wrapper around `gtag` that only injects the script after consent. This is a small pseudocode example — adapt to your app patterns and DI:

```ts
export class AnalyticsService {
  private measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  private enabled = false;

  initOnConsent() {
    if (this.enabled || !this.measurementId) return;
    if (navigator.doNotTrack === '1') return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag() { (window as any).dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', this.measurementId, { send_page_view: false });
    this.enabled = true;
  }

  trackPage(path: string, title?: string) {
    if (!this.enabled) return;
    (window as any).gtag('event', 'page_view', { page_path: path, page_title: title });
  }

  trackEvent(name: string, params: Record<string, any> = {}) {
    if (!this.enabled) return;
    (window as any).gtag('event', name, params);
  }
}
```

### Event naming conventions

- `page_view` with `page_path` and `page_title`
- `project_open` with `{ project_id, project_slug }` (no PII)
- `theme_change` with `{ from_theme, to_theme }`
- `contact_submit` with `{ success: boolean }` — do not record form inputs or PII

### QA & Acceptance

- GA4 receives test events in staging (verify via GA real-time debug view).
- Consent banner blocks analytics until opt-in and opt-out removes/halts event sending.
- Embedded Looker Studio report loads in `/analytics` demo route.

### Where to add code

- `src/app/core/services/analytics.service.ts` — analytics wrapper
- `src/app/features/analytics/analytics-viewer.component.ts` — iframe viewer component for the Looker Studio report
- `docs/ANALYTICS.md` — this document (implementation details here)

**_ End of doc _**
