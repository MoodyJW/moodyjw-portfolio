// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { APP_NAME, COPYRIGHT_YEAR, EXTERNAL_LINKS, NAV_ITEMS } from '@shared/constants';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  const numberOfSocialLinks = 3;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should expose app name', () => {
      expect(component['APP_NAME']).toBe(APP_NAME);
    });

    it('should expose copyright year', () => {
      expect(component['COPYRIGHT_YEAR']).toBe(COPYRIGHT_YEAR);
    });

    it('should expose external links', () => {
      expect(component['EXTERNAL_LINKS']).toBe(EXTERNAL_LINKS);
    });

    it('should expose navigation items', () => {
      expect(component['NAV_ITEMS']).toBe(NAV_ITEMS);
    });

    it('should have social links configuration', () => {
      expect(component['socialLinks']).toBeDefined();
      expect(component['socialLinks'].length).toBe(numberOfSocialLinks);
    });
  });

  describe('Template Rendering', () => {
    it('should render footer element', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('.footer');
      expect(footer).toBeTruthy();
    });

    it('should render brand name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const brandName = compiled.querySelector('.footer__brand-name');
      expect(brandName).toBeTruthy();
      expect(brandName?.textContent?.trim()).toBe(APP_NAME);
    });

    it('should render brand description', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const description = compiled.querySelector('.footer__brand-description');
      expect(description).toBeTruthy();
      expect(description?.textContent).toContain('Angular');
    });

    it('should render copyright notice', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('.footer__copyright');
      expect(copyright).toBeTruthy();
      expect(copyright?.textContent).toContain(COPYRIGHT_YEAR.toString());
      expect(copyright?.textContent).toContain(APP_NAME);
    });

    it('should render built-with section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const builtWith = compiled.querySelector('.footer__built-with');
      expect(builtWith).toBeTruthy();
      expect(builtWith?.textContent).toContain('Angular');
      expect(builtWith?.textContent).toContain('TypeScript');
    });

    it('should render divider', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const divider = compiled.querySelector('app-divider');
      expect(divider).toBeTruthy();
    });
  });

  describe('Navigation Links', () => {
    it('should render footer navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('.footer__nav');
      expect(nav).toBeTruthy();
    });

    it('should render navigation title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.footer__nav-title');
      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Navigate');
    });

    it('should render all navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__nav-link');
      expect(links.length).toBe(NAV_ITEMS.length);
    });

    it('should have correct labels for navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__nav-link');

      NAV_ITEMS.forEach((item, index) => {
        expect(links[index]?.textContent?.trim()).toBe(item.label);
      });
    });

    it('should have aria-labels on navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__nav-link');

      NAV_ITEMS.forEach((item, index) => {
        expect(links[index]?.getAttribute('aria-label')).toBe(item.ariaLabel);
      });
    });

    it('should have routerLink on navigation links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__nav-link');

      // Verify all links have routerLink attribute (href will be set by Angular router)
      links.forEach((link) => {
        expect(
          link.hasAttribute('ng-reflect-router-link') || link.getAttribute('href')
        ).toBeTruthy();
      });
    });
  });

  describe('Social Links', () => {
    it('should render social links section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const social = compiled.querySelector('.footer__social');
      expect(social).toBeTruthy();
    });

    it('should render social links title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('.footer__social-title');
      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Connect');
    });

    it('should render all social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__social-link');
      expect(links.length).toBe(numberOfSocialLinks);
    });

    it('should have correct hrefs for social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__social-link');

      component['socialLinks'].forEach((link, index) => {
        expect(links[index]?.getAttribute('href')).toBe(link.url);
      });
    });

    it('should have target="_blank" for all social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__social-link');

      links.forEach((link) => {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });

    it('should render icons for social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const icons = compiled.querySelectorAll('.footer__social-icon');
      expect(icons.length).toBe(numberOfSocialLinks);
    });

    it('should have aria-labels on social links', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('.footer__social-link');

      component['socialLinks'].forEach((link, index) => {
        expect(links[index]?.getAttribute('aria-label')).toBe(link.ariaLabel);
      });
    });
  });

  describe('Tech Links', () => {
    it('should render Angular tech link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const techLinks = compiled.querySelectorAll('.footer__tech-link');
      const angularLink = Array.from(techLinks).find(
        (link) => link.textContent?.trim() === 'Angular'
      );

      expect(angularLink).toBeTruthy();
      expect(angularLink?.getAttribute('href')).toBe('https://angular.dev');
      expect(angularLink?.getAttribute('target')).toBe('_blank');
      expect(angularLink?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should render TypeScript tech link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const techLinks = compiled.querySelectorAll('.footer__tech-link');
      const tsLink = Array.from(techLinks).find(
        (link) => link.textContent?.trim() === 'TypeScript'
      );

      expect(tsLink).toBeTruthy();
      expect(tsLink?.getAttribute('href')).toBe('https://www.typescriptlang.org');
      expect(tsLink?.getAttribute('target')).toBe('_blank');
      expect(tsLink?.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    it('should have contentinfo role on footer', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('footer');
      // The footer element itself is implicitly contentinfo
      expect(footer).toBeTruthy();
    });

    it('should have aria-label on footer navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('.footer__nav');
      expect(nav?.getAttribute('aria-label')).toBe('Footer navigation');
    });

    it('should have accessible headings', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headings = compiled.querySelectorAll('h2, h3');

      // Should have h2 for brand and h3 for sections
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const h2 = compiled.querySelector('h2');
      const h3s = compiled.querySelectorAll('h3');

      expect(h2).toBeTruthy(); // Brand name
      expect(h3s.length).toBe(2); // Navigate and Connect
    });
  });

  describe('Layout', () => {
    it('should use container for max-width', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const container = compiled.querySelector('.footer__container');
      expect(container).toBeTruthy();
    });

    it('should use stack components for layout', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const stacks = compiled.querySelectorAll('app-stack');
      expect(stacks.length).toBeGreaterThan(0);
    });

    it('should have responsive top section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const top = compiled.querySelector('.footer__top');
      expect(top).toBeTruthy();
    });

    it('should have bottom section', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const bottom = compiled.querySelector('.footer__bottom');
      expect(bottom).toBeTruthy();
    });
  });

  describe('Social Links Configuration', () => {
    it('should have GitHub link', () => {
      const githubLink = component['socialLinks'].find((link) => link.label === 'GitHub');
      expect(githubLink).toBeDefined();
      expect(githubLink?.url).toBe(EXTERNAL_LINKS.GITHUB.url);
    });

    it('should have LinkedIn link', () => {
      const linkedinLink = component['socialLinks'].find((link) => link.label === 'LinkedIn');
      expect(linkedinLink).toBeDefined();
      expect(linkedinLink?.url).toBe(EXTERNAL_LINKS.LINKEDIN.url);
    });

    it('should have icons for all social links', () => {
      component['socialLinks'].forEach((link) => {
        expect(link.icon).toBeDefined();
        expect(typeof link.icon).toBe('string');
      });
    });

    it('should have aria labels for all social links', () => {
      component['socialLinks'].forEach((link) => {
        expect(link.ariaLabel).toBeDefined();
        expect(typeof link.ariaLabel).toBe('string');
      });
    });
  });
});
