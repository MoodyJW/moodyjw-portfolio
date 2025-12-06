import { inject, Injectable, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Configuration for SEO meta tags
 */
export interface SeoConfig {
  /** Page title */
  title?: string;
  /** Meta description */
  description?: string;
  /** Page URL for canonical link */
  url?: string;
  /** Open Graph image URL */
  image?: string;
  /** Open Graph type (default: 'website') */
  type?: 'website' | 'article' | 'profile';
  /** Twitter card type (default: 'summary_large_image') */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Article published time (ISO 8601) */
  publishedTime?: string;
  /** Article modified time (ISO 8601) */
  modifiedTime?: string;
  /** Article author */
  author?: string;
  /** Article tags */
  tags?: string[];
}

/**
 * Structured data configuration for JSON-LD
 */
export interface StructuredDataConfig {
  /** Type of structured data (e.g., 'Person', 'Organization', 'Article') */
  type: string;
  /** Structured data properties */
  data: Record<string, unknown>;
}

/**
 * Service for managing SEO meta tags, Open Graph tags, and structured data
 * Uses signal-based state management for reactive updates
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private seoService = inject(SeoService);
 *
 *   ngOnInit() {
 *     this.seoService.updateTags({
 *       title: 'My Page',
 *       description: 'Page description',
 *       url: 'https://example.com/my-page',
 *       image: 'https://example.com/image.jpg'
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);

  /** Current page title */
  private readonly currentTitle = signal<string>('');

  /** Current meta description */
  private readonly currentDescription = signal<string>('');

  /** Site name for Open Graph */
  private readonly siteName = 'MoodyJW Portfolio';

  /** Default image for Open Graph */
  private readonly defaultImage = '/assets/images/og-default.jpg';

  /**
   * Get the current page title
   */
  getTitle = this.currentTitle.asReadonly();

  /**
   * Get the current meta description
   */
  getDescription = this.currentDescription.asReadonly();

  /**
   * Update the page title
   * @param title - The new page title
   * @param suffix - Optional suffix to append (default: site name)
   */
  updateTitle(title: string, suffix?: string): void {
    const fullTitle = suffix !== undefined ? `${title} | ${suffix}` : `${title} | ${this.siteName}`;
    this.titleService.setTitle(fullTitle);
    this.currentTitle.set(fullTitle);

    // Update Open Graph title
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  /**
   * Update the meta description
   * @param description - The new meta description
   */
  updateDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.currentDescription.set(description);

    // Update Open Graph description
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  /**
   * Update all SEO meta tags at once
   * @param config - SEO configuration object
   */
  updateTags(config: SeoConfig): void {
    // Update title
    if (config.title) {
      this.updateTitle(config.title);
    }

    // Update description
    if (config.description) {
      this.updateDescription(config.description);
    }

    // Update canonical URL
    if (config.url) {
      this.updateCanonicalUrl(config.url);
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    // Update Open Graph image
    const imageUrl = config.image || this.defaultImage;
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // Update Open Graph type
    const type = config.type || 'website';
    this.meta.updateTag({ property: 'og:type', content: type });

    // Update Open Graph site name
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Update Twitter card type
    const twitterCard = config.twitterCard || 'summary_large_image';
    this.meta.updateTag({ name: 'twitter:card', content: twitterCard });

    // Update article-specific tags
    if (type === 'article') {
      if (config.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: config.publishedTime });
      }
      if (config.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
      }
      if (config.author) {
        this.meta.updateTag({ property: 'article:author', content: config.author });
      }
      if (config.tags && config.tags.length > 0) {
        // Remove existing article tags
        this.meta.removeTag('property="article:tag"');
        // Add new tags
        config.tags.forEach((tag) => {
          this.meta.addTag({ property: 'article:tag', content: tag });
        });
      }
    }
  }

  /**
   * Update the canonical URL
   * @param url - The canonical URL
   */
  updateCanonicalUrl(url: string): void {
    // Remove existing canonical link
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  /**
   * Add structured data (JSON-LD) to the page
   * @param config - Structured data configuration
   * @returns The ID of the created script element
   */
  addStructuredData(config: StructuredDataConfig): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': config.type,
      ...config.data,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${config.type.toLowerCase()}`;
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return script.id;
  }

  /**
   * Remove structured data by ID
   * @param id - The ID of the script element to remove
   */
  removeStructuredData(id: string): void {
    const script = document.getElementById(id);
    if (script) {
      script.remove();
    }
  }

  /**
   * Remove all structured data scripts
   */
  removeAllStructuredData(): void {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach((script) => script.remove());
  }

  /**
   * Reset all SEO meta tags to defaults
   */
  reset(): void {
    this.updateTitle('Home');
    this.updateDescription('Full-stack software engineer specializing in Angular, TypeScript, and modern web development.');
    this.meta.removeTag('property="og:url"');
    this.meta.updateTag({ property: 'og:image', content: this.defaultImage });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:modified_time"');
    this.meta.removeTag('property="article:author"');
    this.meta.removeTag('property="article:tag"');

    // Remove canonical link
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Remove all structured data
    this.removeAllStructuredData();
  }
}
