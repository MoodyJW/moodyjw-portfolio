# SEO Service

> **Last Updated**: December 6, 2025
> **Status**: Production Ready
> **Test Coverage**: >95%

Service for managing SEO meta tags, Open Graph tags, Twitter cards, and structured data (JSON-LD) with signal-based reactive state management.

## Features

- ✅ **Dynamic Title Updates**: Set page titles with automatic site name suffix
- ✅ **Meta Descriptions**: Update page descriptions for search engines
- ✅ **Open Graph Tags**: Social media preview tags (title, description, image, type)
- ✅ **Twitter Cards**: Twitter-specific meta tags with card type support
- ✅ **Canonical URLs**: Manage canonical link elements for SEO
- ✅ **Article Tags**: Support for article-specific metadata (published time, author, tags)
- ✅ **Structured Data**: Add/remove JSON-LD structured data for rich snippets
- ✅ **Signal-based State**: Reactive title and description signals
- ✅ **Reset Functionality**: Reset all SEO tags to defaults
- ✅ **Type-safe**: Full TypeScript type safety with interfaces

## Usage

### Basic Usage

Inject the service and update SEO tags for a page:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '@shared/services';

@Component({
  selector: 'app-my-page',
  // ...
})
export class MyPageComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.updateTags({
      title: 'My Page Title',
      description: 'This is a description of my page for search engines.',
      url: 'https://example.com/my-page',
      image: 'https://example.com/images/my-page-preview.jpg',
    });
  }
}
```

### Update Title Only

```typescript
ngOnInit() {
  // With default site name suffix
  this.seoService.updateTitle('About Me');
  // Result: "About Me | MoodyJW Portfolio"

  // With custom suffix
  this.seoService.updateTitle('About Me', 'Custom Site');
  // Result: "About Me | Custom Site"
}
```

### Update Description Only

```typescript
ngOnInit() {
  this.seoService.updateDescription(
    'Learn more about my background, skills, and experience in software engineering.'
  );
}
```

### Article-specific Tags

For blog posts or articles, include article-specific metadata:

```typescript
ngOnInit() {
  this.seoService.updateTags({
    title: 'Building a Component Library with Angular',
    description: 'A comprehensive guide to creating reusable Angular components.',
    url: 'https://example.com/blog/angular-component-library',
    image: 'https://example.com/images/blog/angular-components.jpg',
    type: 'article',
    publishedTime: '2025-12-01T00:00:00Z',
    modifiedTime: '2025-12-06T00:00:00Z',
    author: 'John Doe',
    tags: ['Angular', 'TypeScript', 'Web Development'],
  });
}
```

### Structured Data (JSON-LD)

Add structured data for rich search results:

```typescript
ngOnInit() {
  // Person schema
  const personId = this.seoService.addStructuredData({
    type: 'Person',
    data: {
      name: 'John Doe',
      jobTitle: 'Software Engineer',
      url: 'https://example.com',
      sameAs: [
        'https://twitter.com/johndoe',
        'https://linkedin.com/in/johndoe',
        'https://github.com/johndoe',
      ],
    },
  });

  // Organization schema
  this.seoService.addStructuredData({
    type: 'Organization',
    data: {
      name: 'MoodyJW',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png',
    },
  });

  // Article schema
  this.seoService.addStructuredData({
    type: 'Article',
    data: {
      headline: 'My Article Title',
      datePublished: '2025-12-01T00:00:00Z',
      dateModified: '2025-12-06T00:00:00Z',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
      image: 'https://example.com/article-image.jpg',
    },
  });
}
```

### Remove Structured Data

```typescript
ngOnDestroy() {
  // Remove specific structured data by ID
  this.seoService.removeStructuredData('structured-data-person');

  // Or remove all structured data
  this.seoService.removeAllStructuredData();
}
```

### Reset to Defaults

Reset all SEO tags to their default values:

```typescript
ngOnDestroy() {
  this.seoService.reset();
}
```

### Reactive State with Signals

Access current title and description reactively:

```typescript
export class MyComponent {
  private seoService = inject(SeoService);

  // Get reactive signals
  currentTitle = this.seoService.getTitle();
  currentDescription = this.seoService.getDescription();
}
```

```html
<p>Current page title: {{ currentTitle() }}</p>
<p>Current description: {{ currentDescription() }}</p>
```

## Service API

### `updateTitle(title: string, suffix?: string): void`

Update the page title with an optional custom suffix.

**Parameters:**
- `title` - The page title
- `suffix` - Optional suffix (defaults to site name: "MoodyJW Portfolio")

**Example:**
```typescript
this.seoService.updateTitle('Contact');
// Result: "Contact | MoodyJW Portfolio"
```

### `updateDescription(description: string): void`

Update the meta description tag.

**Parameters:**
- `description` - The page description

**Example:**
```typescript
this.seoService.updateDescription('Get in touch with me.');
```

### `updateCanonicalUrl(url: string): void`

Update the canonical URL link element.

**Parameters:**
- `url` - The canonical URL

**Example:**
```typescript
this.seoService.updateCanonicalUrl('https://example.com/about');
```

### `updateTags(config: SeoConfig): void`

Update all SEO meta tags at once.

**Parameters:**
- `config` - SEO configuration object (see SeoConfig interface below)

**Example:**
```typescript
this.seoService.updateTags({
  title: 'Projects',
  description: 'View my latest projects and case studies.',
  url: 'https://example.com/projects',
  image: 'https://example.com/projects-preview.jpg',
});
```

### `addStructuredData(config: StructuredDataConfig): string`

Add structured data (JSON-LD) to the page for rich search results.

**Parameters:**
- `config` - Structured data configuration (type and data)

**Returns:**
- `string` - The ID of the created script element

**Example:**
```typescript
const id = this.seoService.addStructuredData({
  type: 'Person',
  data: { name: 'John Doe', jobTitle: 'Software Engineer' },
});
```

### `removeStructuredData(id: string): void`

Remove a specific structured data script by ID.

**Parameters:**
- `id` - The ID of the script element to remove

**Example:**
```typescript
this.seoService.removeStructuredData('structured-data-person');
```

### `removeAllStructuredData(): void`

Remove all structured data scripts from the page.

**Example:**
```typescript
this.seoService.removeAllStructuredData();
```

### `reset(): void`

Reset all SEO meta tags to default values.

**Example:**
```typescript
this.seoService.reset();
```

### `getTitle(): Signal<string>`

Get a readonly signal for the current page title.

**Returns:**
- Readonly signal with the current title

**Example:**
```typescript
const currentTitle = this.seoService.getTitle();
console.log(currentTitle()); // "Home | MoodyJW Portfolio"
```

### `getDescription(): Signal<string>`

Get a readonly signal for the current meta description.

**Returns:**
- Readonly signal with the current description

**Example:**
```typescript
const currentDesc = this.seoService.getDescription();
console.log(currentDesc()); // "Full-stack software engineer..."
```

## Configuration Interfaces

### `SeoConfig`

```typescript
interface SeoConfig {
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
```

### `StructuredDataConfig`

```typescript
interface StructuredDataConfig {
  /** Type of structured data (e.g., 'Person', 'Organization', 'Article') */
  type: string;

  /** Structured data properties */
  data: Record<string, unknown>;
}
```

## Meta Tags Generated

### Basic Tags

- `<title>` - Page title
- `<meta name="description">` - Page description
- `<link rel="canonical">` - Canonical URL

### Open Graph Tags

- `<meta property="og:title">` - OG title
- `<meta property="og:description">` - OG description
- `<meta property="og:url">` - OG URL
- `<meta property="og:image">` - OG image
- `<meta property="og:type">` - OG type
- `<meta property="og:site_name">` - Site name

### Twitter Card Tags

- `<meta name="twitter:card">` - Card type
- `<meta name="twitter:title">` - Twitter title
- `<meta name="twitter:description">` - Twitter description
- `<meta name="twitter:image">` - Twitter image

### Article Tags (when type="article")

- `<meta property="article:published_time">` - Published time
- `<meta property="article:modified_time">` - Modified time
- `<meta property="article:author">` - Author
- `<meta property="article:tag">` - Tags (multiple)

## Default Values

- **Site Name**: "MoodyJW Portfolio"
- **Default Image**: "/assets/images/og-default.jpg"
- **Default Type**: "website"
- **Default Twitter Card**: "summary_large_image"
- **Default Title**: "Home | MoodyJW Portfolio"
- **Default Description**: "Full-stack software engineer specializing in Angular, TypeScript, and modern web development."

## Best Practices

### 1. Update SEO Tags in Component Lifecycle

Always update SEO tags in `ngOnInit()` or when route data changes:

```typescript
ngOnInit() {
  this.seoService.updateTags({
    title: this.pageTitle,
    description: this.pageDescription,
    url: this.pageUrl,
  });
}
```

### 2. Reset Tags in ngOnDestroy (Optional)

For single-page applications, consider resetting tags when leaving a page:

```typescript
ngOnDestroy() {
  this.seoService.reset();
}
```

### 3. Use Absolute URLs

Always use absolute URLs for images and canonical links:

```typescript
// Good
image: 'https://example.com/images/preview.jpg'
url: 'https://example.com/my-page'

// Bad
image: '/images/preview.jpg'
url: '/my-page'
```

### 4. Keep Descriptions Concise

Meta descriptions should be 150-160 characters for optimal display in search results.

### 5. Use Structured Data Appropriately

Only add structured data that accurately represents your content. See [schema.org](https://schema.org) for valid types and properties.

### 6. Test Social Sharing

Use these tools to test your Open Graph and Twitter Card tags:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## Testing

Comprehensive unit tests are provided with 57 test cases:

```bash
npm test
```

### Test Coverage

- ✅ Service creation and dependency injection
- ✅ Title updates with default and custom suffixes
- ✅ Description updates
- ✅ Canonical URL management
- ✅ Open Graph tag updates
- ✅ Twitter card tag updates
- ✅ Article-specific tags
- ✅ Structured data addition/removal
- ✅ Reset functionality
- ✅ Signal reactivity
- ✅ Edge cases (empty strings, undefined values)

## Architecture

```
services/
├── seo.service.ts           # Service implementation
├── seo.service.spec.ts      # Unit tests (57 tests)
├── index.ts                 # Barrel export
└── README.md                # This file
```

## Dependencies

### Angular Core
- `@angular/core` - Injectable, inject, signal
- `@angular/platform-browser` - Meta, Title services

### Browser APIs
- `document` - DOM manipulation for canonical links and structured data

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- **OnPush Compatible**: Works with OnPush change detection strategy
- **Signal-based**: Efficient reactive state management
- **DOM Efficient**: Reuses and updates existing elements when possible
- **Tree-shakeable**: Provided at root level for optimal bundle size

## SEO Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

## License

Part of the MoodyJW Portfolio project.
