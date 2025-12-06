import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';

import type { SeoConfig, StructuredDataConfig } from './seo.service';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let metaService: Meta;
  let titleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    metaService = TestBed.inject(Meta);
    titleService = TestBed.inject(Title);
  });

  afterEach(() => {
    // Clean up any added tags and scripts
    service.reset();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should inject Meta service', () => {
      expect(metaService).toBeTruthy();
    });

    it('should inject Title service', () => {
      expect(titleService).toBeTruthy();
    });

    it('should initialize with empty title signal', () => {
      expect(service.getTitle()).toBe('');
    });

    it('should initialize with empty description signal', () => {
      expect(service.getDescription()).toBe('');
    });
  });

  describe('updateTitle()', () => {
    it('should update the page title with default suffix', () => {
      const spy = vi.spyOn(titleService, 'setTitle');
      service.updateTitle('Test Page');
      expect(spy).toHaveBeenCalledWith('Test Page | MoodyJW Portfolio');
    });

    it('should update the page title with custom suffix', () => {
      const spy = vi.spyOn(titleService, 'setTitle');
      service.updateTitle('Test Page', 'Custom Suffix');
      expect(spy).toHaveBeenCalledWith('Test Page | Custom Suffix');
    });

    it('should update the title signal', () => {
      service.updateTitle('Test Page');
      expect(service.getTitle()).toBe('Test Page | MoodyJW Portfolio');
    });

    it('should update Open Graph title meta tag', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      service.updateTitle('Test Page');
      expect(spy).toHaveBeenCalledWith({ property: 'og:title', content: 'Test Page' });
    });

    it('should update Twitter title meta tag', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      service.updateTitle('Test Page');
      expect(spy).toHaveBeenCalledWith({ name: 'twitter:title', content: 'Test Page' });
    });

    it('should handle empty string title', () => {
      const spy = vi.spyOn(titleService, 'setTitle');
      service.updateTitle('');
      expect(spy).toHaveBeenCalledWith(' | MoodyJW Portfolio');
    });
  });

  describe('updateDescription()', () => {
    it('should update the meta description tag', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      service.updateDescription('Test description');
      expect(spy).toHaveBeenCalledWith({
        name: 'description',
        content: 'Test description',
      });
    });

    it('should update the description signal', () => {
      service.updateDescription('Test description');
      expect(service.getDescription()).toBe('Test description');
    });

    it('should update Open Graph description meta tag', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      service.updateDescription('Test description');
      expect(spy).toHaveBeenCalledWith({
        property: 'og:description',
        content: 'Test description',
      });
    });

    it('should update Twitter description meta tag', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      service.updateDescription('Test description');
      expect(spy).toHaveBeenCalledWith({
        name: 'twitter:description',
        content: 'Test description',
      });
    });

    it('should handle empty string description', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      service.updateDescription('');
      expect(spy).toHaveBeenCalledWith({ name: 'description', content: '' });
    });
  });

  describe('updateCanonicalUrl()', () => {
    it('should add a canonical link element', () => {
      service.updateCanonicalUrl('https://example.com/page');
      const link = document.querySelector('link[rel="canonical"]');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe('https://example.com/page');
    });

    it('should remove existing canonical link before adding new one', () => {
      service.updateCanonicalUrl('https://example.com/page1');
      service.updateCanonicalUrl('https://example.com/page2');
      const links = document.querySelectorAll('link[rel="canonical"]');
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toBe('https://example.com/page2');
    });

    it('should handle relative URLs', () => {
      service.updateCanonicalUrl('/page');
      const link = document.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('/page');
    });
  });

  describe('updateTags()', () => {
    it('should update title when provided', () => {
      const spy = vi.spyOn(service, 'updateTitle');
      const config: SeoConfig = { title: 'Test Page' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith('Test Page');
    });

    it('should update description when provided', () => {
      const spy = vi.spyOn(service, 'updateDescription');
      const config: SeoConfig = { description: 'Test description' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith('Test description');
    });

    it('should update canonical URL when provided', () => {
      const spy = vi.spyOn(service, 'updateCanonicalUrl');
      const config: SeoConfig = { url: 'https://example.com/page' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith('https://example.com/page');
    });

    it('should update Open Graph URL when provided', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { url: 'https://example.com/page' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'https://example.com/page',
      });
    });

    it('should update Open Graph image with provided image', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { image: 'https://example.com/image.jpg' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'https://example.com/image.jpg',
      });
    });

    it('should use default image when not provided', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { title: 'Test' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'og:image',
        content: '/assets/images/og-default.jpg',
      });
    });

    it('should update Twitter image', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { image: 'https://example.com/image.jpg' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        name: 'twitter:image',
        content: 'https://example.com/image.jpg',
      });
    });

    it('should set Open Graph type to provided value', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { type: 'article' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({ property: 'og:type', content: 'article' });
    });

    it('should default Open Graph type to website', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { title: 'Test' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({ property: 'og:type', content: 'website' });
    });

    it('should update Open Graph site name', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { title: 'Test' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'og:site_name',
        content: 'MoodyJW Portfolio',
      });
    });

    it('should set Twitter card to provided value', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { twitterCard: 'summary' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({ name: 'twitter:card', content: 'summary' });
    });

    it('should default Twitter card to summary_large_image', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = { title: 'Test' };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        name: 'twitter:card',
        content: 'summary_large_image',
      });
    });

    it('should update all tags at once', () => {
      const titleSpy = vi.spyOn(service, 'updateTitle');
      const descSpy = vi.spyOn(service, 'updateDescription');
      const urlSpy = vi.spyOn(service, 'updateCanonicalUrl');

      const config: SeoConfig = {
        title: 'Test Page',
        description: 'Test description',
        url: 'https://example.com/page',
        image: 'https://example.com/image.jpg',
        type: 'article',
        twitterCard: 'summary',
      };

      service.updateTags(config);

      expect(titleSpy).toHaveBeenCalledWith('Test Page');
      expect(descSpy).toHaveBeenCalledWith('Test description');
      expect(urlSpy).toHaveBeenCalledWith('https://example.com/page');
    });
  });

  describe('Article-specific tags', () => {
    it('should update article published time', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = {
        type: 'article',
        publishedTime: '2025-12-01T00:00:00Z',
      };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'article:published_time',
        content: '2025-12-01T00:00:00Z',
      });
    });

    it('should update article modified time', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = {
        type: 'article',
        modifiedTime: '2025-12-05T00:00:00Z',
      };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'article:modified_time',
        content: '2025-12-05T00:00:00Z',
      });
    });

    it('should update article author', () => {
      const spy = vi.spyOn(metaService, 'updateTag');
      const config: SeoConfig = {
        type: 'article',
        author: 'John Doe',
      };
      service.updateTags(config);
      expect(spy).toHaveBeenCalledWith({
        property: 'article:author',
        content: 'John Doe',
      });
    });

    it('should add article tags', () => {
      const removeSpy = vi.spyOn(metaService, 'removeTag');
      const addSpy = vi.spyOn(metaService, 'addTag');
      const config: SeoConfig = {
        type: 'article',
        tags: ['angular', 'typescript', 'web development'],
      };
      service.updateTags(config);
      expect(removeSpy).toHaveBeenCalledWith('property="article:tag"');
      expect(addSpy).toHaveBeenCalledTimes(3);
      expect(addSpy).toHaveBeenCalledWith({ property: 'article:tag', content: 'angular' });
      expect(addSpy).toHaveBeenCalledWith({
        property: 'article:tag',
        content: 'typescript',
      });
      expect(addSpy).toHaveBeenCalledWith({
        property: 'article:tag',
        content: 'web development',
      });
    });

    it('should not add article tags for non-article types', () => {
      const addSpy = vi.spyOn(metaService, 'addTag');
      const config: SeoConfig = {
        type: 'website',
        tags: ['angular', 'typescript'],
      };
      service.updateTags(config);
      expect(addSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ property: 'article:tag' })
      );
    });

    it('should handle empty article tags array', () => {
      const removeSpy = vi.spyOn(metaService, 'removeTag');
      const addSpy = vi.spyOn(metaService, 'addTag');
      const config: SeoConfig = {
        type: 'article',
        tags: [],
      };
      service.updateTags(config);
      expect(removeSpy).not.toHaveBeenCalled();
      expect(addSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ property: 'article:tag' })
      );
    });
  });

  describe('addStructuredData()', () => {
    it('should add structured data script to head', () => {
      const config: StructuredDataConfig = {
        type: 'Person',
        data: { name: 'John Doe', jobTitle: 'Software Engineer' },
      };
      service.addStructuredData(config);
      const script = document.getElementById('structured-data-person');
      expect(script).toBeTruthy();
      expect(script?.getAttribute('type')).toBe('application/ld+json');
    });

    it('should include @context and @type in structured data', () => {
      const config: StructuredDataConfig = {
        type: 'Person',
        data: { name: 'John Doe' },
      };
      service.addStructuredData(config);
      const script = document.getElementById('structured-data-person');
      const data = JSON.parse(script?.textContent || '{}');
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('Person');
      expect(data.name).toBe('John Doe');
    });

    it('should return the script element ID', () => {
      const config: StructuredDataConfig = {
        type: 'Organization',
        data: { name: 'Test Org' },
      };
      const id = service.addStructuredData(config);
      expect(id).toBe('structured-data-organization');
    });

    it('should handle complex nested data', () => {
      const config: StructuredDataConfig = {
        type: 'Article',
        data: {
          headline: 'Test Article',
          author: { '@type': 'Person', name: 'John Doe' },
          datePublished: '2025-12-01',
        },
      };
      service.addStructuredData(config);
      const script = document.getElementById('structured-data-article');
      const data = JSON.parse(script?.textContent || '{}');
      expect(data.author['@type']).toBe('Person');
      expect(data.author.name).toBe('John Doe');
    });
  });

  describe('removeStructuredData()', () => {
    it('should remove structured data script by ID', () => {
      const config: StructuredDataConfig = {
        type: 'Person',
        data: { name: 'John Doe' },
      };
      const id = service.addStructuredData(config);
      expect(document.getElementById(id)).toBeTruthy();
      service.removeStructuredData(id);
      expect(document.getElementById(id)).toBeFalsy();
    });

    it('should handle removing non-existent ID gracefully', () => {
      expect(() => {
        service.removeStructuredData('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('removeAllStructuredData()', () => {
    it('should remove all structured data scripts', () => {
      service.addStructuredData({ type: 'Person', data: { name: 'John' } });
      service.addStructuredData({ type: 'Organization', data: { name: 'Org' } });
      service.addStructuredData({ type: 'Article', data: { headline: 'Test' } });

      expect(
        document.querySelectorAll('script[type="application/ld+json"]').length
      ).toBeGreaterThanOrEqual(3);

      service.removeAllStructuredData();
      expect(document.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);
    });

    it('should handle empty structured data gracefully', () => {
      expect(() => {
        service.removeAllStructuredData();
      }).not.toThrow();
    });
  });

  describe('reset()', () => {
    it('should reset title to default', () => {
      service.updateTitle('Custom Title');
      const spy = vi.spyOn(service, 'updateTitle');
      service.reset();
      expect(spy).toHaveBeenCalledWith('Home');
    });

    it('should reset description to default', () => {
      service.updateDescription('Custom description');
      const spy = vi.spyOn(service, 'updateDescription');
      service.reset();
      expect(spy).toHaveBeenCalledWith(
        'Full-stack software engineer specializing in Angular, TypeScript, and modern web development.'
      );
    });

    it('should remove Open Graph URL tag', () => {
      const spy = vi.spyOn(metaService, 'removeTag');
      service.reset();
      expect(spy).toHaveBeenCalledWith('property="og:url"');
    });

    it('should reset Open Graph image to default', () => {
      service.updateTags({ image: 'https://example.com/custom.jpg' });
      const spy = vi.spyOn(metaService, 'updateTag');
      service.reset();
      expect(spy).toHaveBeenCalledWith({
        property: 'og:image',
        content: '/assets/images/og-default.jpg',
      });
    });

    it('should reset Open Graph type to website', () => {
      service.updateTags({ type: 'article' });
      const spy = vi.spyOn(metaService, 'updateTag');
      service.reset();
      expect(spy).toHaveBeenCalledWith({ property: 'og:type', content: 'website' });
    });

    it('should remove article meta tags', () => {
      const spy = vi.spyOn(metaService, 'removeTag');
      service.reset();
      expect(spy).toHaveBeenCalledWith('property="article:published_time"');
      expect(spy).toHaveBeenCalledWith('property="article:modified_time"');
      expect(spy).toHaveBeenCalledWith('property="article:author"');
      expect(spy).toHaveBeenCalledWith('property="article:tag"');
    });

    it('should remove canonical link', () => {
      service.updateCanonicalUrl('https://example.com/page');
      service.reset();
      expect(document.querySelector('link[rel="canonical"]')).toBeFalsy();
    });

    it('should remove all structured data', () => {
      service.addStructuredData({ type: 'Person', data: { name: 'John' } });
      service.reset();
      expect(document.querySelectorAll('script[type="application/ld+json"]').length).toBe(0);
    });
  });

  describe('Signal reactivity', () => {
    it('should update title signal reactively', () => {
      expect(service.getTitle()).toBe('');
      service.updateTitle('New Title');
      expect(service.getTitle()).toBe('New Title | MoodyJW Portfolio');
    });

    it('should update description signal reactively', () => {
      expect(service.getDescription()).toBe('');
      service.updateDescription('New description');
      expect(service.getDescription()).toBe('New description');
    });

    it('should provide readonly signals', () => {
      const titleSignal = service.getTitle;
      const descSignal = service.getDescription;
      expect(typeof titleSignal).toBe('function');
      expect(typeof descSignal).toBe('function');
    });
  });
});
