// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  APP_NAME,
  ARIA_LABELS,
  COPYRIGHT_YEAR,
  KEYBOARD_KEYS,
  NAV_ITEMS,
  ROUTE_PATHS,
} from '@shared/constants';

import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should expose route paths', () => {
      expect(component['ROUTE_PATHS']).toBe(ROUTE_PATHS);
    });

    it('should expose navigation items', () => {
      expect(component['NAV_ITEMS']).toBe(NAV_ITEMS);
    });

    it('should expose app name', () => {
      expect(component['APP_NAME']).toBe(APP_NAME);
    });

    it('should expose copyright year', () => {
      expect(component['COPYRIGHT_YEAR']).toBe(COPYRIGHT_YEAR);
    });

    it('should expose ARIA labels', () => {
      expect(component['ARIA_LABELS']).toBe(ARIA_LABELS);
    });

    it('should expose keyboard keys', () => {
      expect(component['KEYBOARD_KEYS']).toBe(KEYBOARD_KEYS);
    });

    it('should initialize mobile menu as closed', () => {
      expect(component['isMobileMenuOpen']()).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should render skip link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('.main-layout__skip-link');
      expect(skipLink).toBeTruthy();
      expect(skipLink?.textContent).toContain('Skip to main content');
    });

    it('should render brand link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const brandLink = compiled.querySelector('.main-layout__brand-link');
      expect(brandLink).toBeTruthy();
      expect(brandLink?.textContent?.trim()).toBe(APP_NAME);
    });

    it('should render desktop navigation menu', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopMenu = compiled.querySelector(
        '.main-layout__menu--desktop'
      );
      expect(desktopMenu).toBeTruthy();
    });

    it('should render navigation items in desktop menu', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const menuItems = compiled.querySelectorAll(
        '.main-layout__menu--desktop .main-layout__menu-item'
      );
      expect(menuItems.length).toBe(NAV_ITEMS.length);
    });

    it('should render mobile menu toggle button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector(
        '.main-layout__mobile-toggle'
      );
      expect(toggleButton).toBeTruthy();
    });

    it('should render router outlet', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should render footer with copyright', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('.main-layout__footer-text');
      expect(footer).toBeTruthy();
      expect(footer?.textContent).toContain(COPYRIGHT_YEAR.toString());
      expect(footer?.textContent).toContain(APP_NAME);
    });

    it('should render main content with correct id', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mainContent = compiled.querySelector('#main-content');
      expect(mainContent).toBeTruthy();
    });
  });

  describe('Mobile Menu State Management', () => {
    it('should not render mobile menu when closed', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mobileMenu = compiled.querySelector('.main-layout__mobile-menu');
      expect(mobileMenu).toBeFalsy();
    });

    it('should render mobile menu when open', () => {
      component['toggleMobileMenu']();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mobileMenu = compiled.querySelector('.main-layout__mobile-menu');
      expect(mobileMenu).toBeTruthy();
    });

    it('should toggle mobile menu state', () => {
      expect(component['isMobileMenuOpen']()).toBe(false);

      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);

      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should close mobile menu', () => {
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);

      component['closeMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(false);
    });
  });

  describe('Mobile Menu Rendering', () => {
    beforeEach(() => {
      component['toggleMobileMenu']();
      fixture.detectChanges();
    });

    it('should render mobile menu backdrop', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const backdrop = compiled.querySelector('.main-layout__mobile-backdrop');
      expect(backdrop).toBeTruthy();
    });

    it('should render mobile menu drawer', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const drawer = compiled.querySelector('.main-layout__mobile-drawer');
      expect(drawer).toBeTruthy();
    });

    it('should render navigation items in mobile menu', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mobileLinks = compiled.querySelectorAll(
        '.main-layout__mobile-link'
      );
      expect(mobileLinks.length).toBe(NAV_ITEMS.length);
    });

    it('should have correct aria attributes on mobile menu', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mobileMenu = compiled.querySelector('.main-layout__mobile-menu');
      expect(mobileMenu?.getAttribute('role')).toBe('dialog');
      expect(mobileMenu?.getAttribute('aria-modal')).toBe('true');
      expect(mobileMenu?.getAttribute('id')).toBe('mobile-menu');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should toggle menu on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.ENTER });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component['onMenuToggleKeydown'](event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component['isMobileMenuOpen']()).toBe(true);
    });

    it('should toggle menu on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: KEYBOARD_KEYS.SPACE });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component['onMenuToggleKeydown'](event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component['isMobileMenuOpen']()).toBe(true);
    });

    it('should not toggle menu on other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component['onMenuToggleKeydown'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should close menu on Escape key', () => {
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);

      const event = new KeyboardEvent('keydown', {
        key: KEYBOARD_KEYS.ESCAPE,
      });
      component['onMenuCloseKeydown'](event);

      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should not close menu on other keys', () => {
      component['toggleMobileMenu']();
      expect(component['isMobileMenuOpen']()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'a' });
      component['onMenuCloseKeydown'](event);

      expect(component['isMobileMenuOpen']()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have skip link with correct href', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('.main-layout__skip-link');
      expect(skipLink?.getAttribute('href')).toBe('#main-content');
    });

    it('should have main navigation with aria-label', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('.main-layout__nav');
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('should have mobile toggle with aria-expanded attribute', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector(
        '.main-layout__mobile-toggle'
      );
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('false');

      component['toggleMobileMenu']();
      fixture.detectChanges();

      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have mobile toggle with aria-controls attribute', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleButton = compiled.querySelector(
        '.main-layout__mobile-toggle'
      );
      expect(toggleButton?.getAttribute('aria-controls')).toBe('mobile-menu');
    });

    it('should have desktop menu with menubar role', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopMenu = compiled.querySelector(
        '.main-layout__menu--desktop'
      );
      expect(desktopMenu?.getAttribute('role')).toBe('menubar');
    });

    it('should have main content with tabindex for focus management', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const mainContent = compiled.querySelector('.main-layout__content');
      expect(mainContent?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('User Interactions', () => {
    it('should close mobile menu when backdrop is clicked', () => {
      component['toggleMobileMenu']();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const backdrop = compiled.querySelector(
        '.main-layout__mobile-backdrop'
      ) as HTMLElement;

      backdrop?.click();
      fixture.detectChanges();

      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should close mobile menu when mobile link is clicked', () => {
      component['toggleMobileMenu']();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mobileLink = compiled.querySelector(
        '.main-layout__mobile-link'
      ) as HTMLElement;

      mobileLink?.click();
      fixture.detectChanges();

      expect(component['isMobileMenuOpen']()).toBe(false);
    });

    it('should toggle mobile menu icon based on state', () => {
      // Menu closed - should show bars icon
      expect(component['isMobileMenuOpen']()).toBe(false);

      // Open menu
      component['toggleMobileMenu']();
      fixture.detectChanges();

      // Menu open - should show close icon
      expect(component['isMobileMenuOpen']()).toBe(true);
    });
  });

  describe('Navigation Items', () => {
    it('should render all navigation items with correct labels', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopMenuItems = compiled.querySelectorAll(
        '.main-layout__menu--desktop .main-layout__menu-item'
      );

      NAV_ITEMS.forEach((item, index) => {
        const menuItem = desktopMenuItems[index];
        expect(menuItem?.textContent?.trim()).toContain(item.label);
      });
    });

    it('should have navigation items with aria-labels', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const desktopButtons = compiled.querySelectorAll(
        '.main-layout__menu--desktop .main-layout__menu-link'
      );

      expect(desktopButtons.length).toBe(NAV_ITEMS.length);
    });
  });
});
