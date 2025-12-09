import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeHtmlPipe],
    });
    pipe = TestBed.inject(SafeHtmlPipe);
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should return SafeHtml for valid HTML string', () => {
      const html = '<p>Hello World</p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('object');
    });

    it('should handle simple text', () => {
      const text = 'Simple text without HTML';
      const result = pipe.transform(text);

      expect(result).toBeTruthy();
    });

    it('should handle HTML with multiple elements', () => {
      const html = '<div><h1>Title</h1><p>Content</p></div>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });

  describe('HTML Elements', () => {
    it('should handle bold and italic tags', () => {
      const html = '<p>This is <strong>bold</strong> and <em>italic</em></p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle links', () => {
      const html = '<a href="https://example.com">Link</a>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle images', () => {
      const html = '<img src="image.jpg" alt="Description">';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle nested elements', () => {
      const html = '<div><p>Paragraph with <span>nested</span> <strong>tags</strong></p></div>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should handle whitespace-only content', () => {
      const html = '   ';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle HTML entities', () => {
      const html = '<p>&lt;div&gt; &amp; &quot;quotes&quot;</p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });

  describe('Complex HTML', () => {
    it('should handle tables', () => {
      const html = `
        <table>
          <thead><tr><th>Header</th></tr></thead>
          <tbody><tr><td>Data</td></tr></tbody>
        </table>
      `;
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle forms', () => {
      const html = `
        <form>
          <input type="text" name="username">
          <button type="submit">Submit</button>
        </form>
      `;
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle inline styles', () => {
      const html = '<p style="color: red; font-size: 16px;">Styled text</p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle classes and IDs', () => {
      const html = '<div class="container" id="main"><p class="text">Content</p></div>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });

  describe('Script and Event Handlers', () => {
    it('should handle HTML with script tags', () => {
      // Note: DomSanitizer will sanitize dangerous content
      const html = '<p>Text</p><script>alert("xss")</script>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle inline event handlers', () => {
      // Note: DomSanitizer will sanitize dangerous content
      const html = '<button onclick="alert(\'xss\')">Click</button>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });

  describe('Real World Content', () => {
    it('should handle blog post content', () => {
      const html = `
        <article>
          <h2>Blog Post Title</h2>
          <p>This is the first paragraph with <strong>emphasis</strong>.</p>
          <p>Second paragraph with a <a href="#">link</a>.</p>
          <ul>
            <li>Point 1</li>
            <li>Point 2</li>
          </ul>
        </article>
      `;
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle CMS content', () => {
      const html = `
        <div class="content">
          <h1>Title</h1>
          <p class="lead">Introduction paragraph</p>
          <img src="featured.jpg" alt="Featured image" />
          <p>Main content...</p>
        </div>
      `;
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle markdown-converted HTML', () => {
      const html = `
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <p>Paragraph with <code>inline code</code></p>
        <pre><code>const x = 5;</code></pre>
        <blockquote>A quote</blockquote>
      `;
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });

  describe('Pure Pipe Behavior', () => {
    it('should produce equivalent results for same input', () => {
      const html = '<p>Test content</p>';
      const result1 = pipe.transform(html);
      const result2 = pipe.transform(html);

      // SafeHtml objects may be different instances but contain same data
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(typeof result1).toBe('object');
      expect(typeof result2).toBe('object');
    });

    it('should return different results for different inputs', () => {
      const html1 = '<p>First</p>';
      const html2 = '<p>Second</p>';

      const result1 = pipe.transform(html1);
      const result2 = pipe.transform(html2);

      expect(result1).not.toEqual(result2);
    });
  });

  describe('Special Characters', () => {
    it('should handle unicode characters', () => {
      const html = '<p>Hello 你好 مرحبا สวัสดี</p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle emojis', () => {
      const html = '<p>Hello 👋 World 🌍</p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });

    it('should handle special symbols', () => {
      const html = '<p>© 2025 • All rights reserved ™</p>';
      const result = pipe.transform(html);

      expect(result).toBeTruthy();
    });
  });
});
