import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NAV_ITEMS } from '@shared/constants';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Brand', () => {
    it('should display app name in brand', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const brand = compiled.querySelector('.header__brand-link');
      expect(brand?.textContent?.trim()).toBeTruthy();
    });

    it('should link brand to root path', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const brand = compiled.querySelector('.header__brand-link');
      expect(brand?.getAttribute('href')).toBe('/');
    });
  });

  describe('Desktop Navigation', () => {
    it('should render all navigation items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopNav = compiled.querySelector('.header__menu--desktop');
      const navItems = desktopNav?.querySelectorAll('.header__menu-item');
      expect(navItems?.length).toBe(NAV_ITEMS.length);
    });

    it('should have correct labels for navigation items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelectorAll(
        '.header__menu--desktop .header__menu-link'
      );
      navLinks.forEach((link, index) => {
        expect(link.textContent?.trim()).toBe(NAV_ITEMS[index].label);
      });
    });

    it('should have correct paths for navigation items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelectorAll(
        '.header__menu--desktop .header__menu-link'
      );
      navLinks.forEach((link, index) => {
        expect(link.getAttribute('href')).toBe(NAV_ITEMS[index].path);
      });
    });

    it('should have ARIA labels on navigation items', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const navLinks = compiled.querySelectorAll(
        '.header__menu--desktop .header__menu-link'
      );
      navLinks.forEach((link, index) => {
        expect(link.getAttribute('aria-label')).toBe(NAV_ITEMS[index].ariaLabel);
      });
    });
  });

  describe('Mobile Menu', () => {
    it('should not show mobile menu by default', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mobileMenu = compiled.querySelector('.header__mobile-menu');
      expect(mobileMenu).toBeNull();
    });

    it('should toggle mobile menu when toggle button is clicked', () => {
      expect(component['isMobileMenuOpen']()).toBe(false);
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should close mobile menu when closeMobileMenu is called', () => {
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);
      component['closeMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should show mobile menu when isMobileMenuOpen is true', () => {
      component['toggleMobileMenu']();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const mobileMenu = compiled.querySelector('.header__mobile-menu');
      expect(mobileMenu).toBeTruthy();
    });

    it('should render mobile menu toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.header__mobile-toggle');
      expect(toggleButton).toBeTruthy();
    });

    it('should have correct aria-expanded on toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector('.header__mobile-toggle');
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('false');

      component['toggleMobileMenu']();
      fixture.detectChanges();
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should toggle mobile menu on Enter key', () => {
      expect(component['isMobileMenuOpen']()).toBe(false);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component['onMenuToggleKeydown'](event);
      expect(component['isMobileMenuOpen']()).toBe(true);
    });

    it('should toggle mobile menu on Space key', () => {
      expect(component['isMobileMenuOpen']()).toBe(false);
      const event = new KeyboardEvent('keydown', { key: ' ' });
      component['onMenuToggleKeydown'](event);
      expect(component['isMobileMenuOpen']()).toBe(true);
    });

    it('should not toggle mobile menu on other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      component['onMenuToggleKeydown'](event);
      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should close mobile menu on Escape key', () => {
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component['onMenuCloseKeydown'](event);
      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should not close mobile menu on other keys', () => {
      component['toggleMobileMenu']();
      const event = new KeyboardEvent('keydown', { key: 'a' });
      component['onMenuCloseKeydown'](event);
      expect(component['isMobileMenuOpen']()).toBe(true);
    });
  });

  describe('Theme Picker', () => {
    it('should render theme picker', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const themePicker = compiled.querySelector('.header__theme-picker');
      expect(themePicker).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper navigation landmark', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('nav[aria-label="Main navigation"]');
      expect(nav).toBeTruthy();
    });

    it('should have proper menubar role on desktop navigation', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const menubar = compiled.querySelector('[role="menubar"]');
      expect(menubar).toBeTruthy();
    });

    it('should have dialog role on mobile menu', () => {
      component['toggleMobileMenu']();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const dialog = compiled.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should have aria-modal on mobile menu', () => {
      component['toggleMobileMenu']();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const mobileMenu = compiled.querySelector('.header__mobile-menu');
      expect(mobileMenu?.getAttribute('aria-modal')).toBe('true');
    });
  });
});
