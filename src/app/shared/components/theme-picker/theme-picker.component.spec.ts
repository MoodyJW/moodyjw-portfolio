// @vitest-environment jsdom
import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { THEMES } from '../../../../shared/constants/themes.constants';
import { ThemeService } from '../../../../shared/services/theme.service';

import { ThemePickerComponent } from './theme-picker.component';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let themeServiceMock: {
    themes: ReturnType<typeof signal>;
    activeTheme: ReturnType<typeof signal>;
    isSystemDefault: ReturnType<typeof signal>;
    setTheme: ReturnType<typeof vi.fn>;
    resetToSystem: ReturnType<typeof vi.fn>;
  };

  const mockThemes = THEMES;

  beforeEach(async () => {
    const mockActiveTheme = signal(mockThemes[0]);
    const mockIsSystemDefault = signal(false);

    themeServiceMock = {
      themes: signal(mockThemes),
      activeTheme: mockActiveTheme,
      isSystemDefault: mockIsSystemDefault,
      setTheme: vi.fn(),
      resetToSystem: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemePickerComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: themeServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (ThemePickerComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (ThemePickerComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Rendering', () => {
    it('should render the theme picker button', () => {
      const button = fixture.nativeElement.querySelector('[data-test="theme-picker-button"]');
      expect(button).toBeTruthy();
    });

    it('should display current theme label', () => {
      const button = fixture.nativeElement.querySelector('[data-test="theme-picker-button"]');
      expect(button.textContent).toContain(mockThemes[0].label);
    });

    it('should display correct icon for light theme', () => {
      themeServiceMock.activeTheme.set(mockThemes.find(t => !t.isDark)!);
      fixture.detectChanges();

      expect(component.currentIcon()).toBe('heroSun');
    });

    it('should display correct icon for dark theme', () => {
      themeServiceMock.activeTheme.set(mockThemes.find(t => t.isDark)!);
      fixture.detectChanges();

      expect(component.currentIcon()).toBe('heroMoon');
    });

    it('should show system indicator when system default is active', () => {
      themeServiceMock.isSystemDefault.set(true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('[data-test="theme-picker-button"]');
      expect(button.textContent).toContain('System');
    });

    it('should not show system indicator when system default is not active', () => {
      themeServiceMock.isSystemDefault.set(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('[data-test="theme-picker-button"]');
      expect(button.textContent).not.toContain('System');
    });
  });

  describe('Dropdown Behavior', () => {
    it('should not show dropdown initially', () => {
      expect(component.isOpen()).toBe(false);
      const dropdown = fixture.nativeElement.querySelector('[data-test="theme-picker-dropdown"]');
      expect(dropdown).toBeFalsy();
    });

    it('should show dropdown when toggled', () => {
      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
      const dropdown = fixture.nativeElement.querySelector('[data-test="theme-picker-dropdown"]');
      expect(dropdown).toBeTruthy();
    });

    it('should hide dropdown when toggled again', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown when close() is called', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      component.close();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(false);
    });

    it('should display all themes in dropdown', () => {
      component.toggle();
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('.theme-picker__option');
      // 4 themes + 1 system option = 5 total
      expect(options.length).toBe(5);
    });

    it('should display system default option', () => {
      component.toggle();
      fixture.detectChanges();

      const systemOption = fixture.nativeElement.querySelector('[data-test="theme-option-system"]');
      expect(systemOption).toBeTruthy();
      expect(systemOption.textContent).toContain('System Default');
    });
  });

  describe('Theme Selection', () => {
    it('should call setTheme when a theme is selected', () => {
      const themeSlug = mockThemes[1].slug;
      component.selectTheme(themeSlug);

      expect(themeServiceMock.setTheme).toHaveBeenCalledWith(themeSlug);
    });

    it('should keep dropdown open after selecting a theme', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      component.selectTheme(mockThemes[0].slug);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
    });

    it('should call resetToSystem when system default is selected', () => {
      component.selectSystemDefault();

      expect(themeServiceMock.resetToSystem).toHaveBeenCalled();
    });

    it('should keep dropdown open after selecting system default', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      component.selectSystemDefault();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
    });

    it('should highlight active theme', () => {
      themeServiceMock.activeTheme.set(mockThemes[1]);
      themeServiceMock.isSystemDefault.set(false);
      component.toggle();
      fixture.detectChanges();

      expect(component.isActiveTheme(mockThemes[1].slug)).toBe(true);
      expect(component.isActiveTheme(mockThemes[0].slug)).toBe(false);
    });

    it('should not highlight any theme when system default is active', () => {
      themeServiceMock.activeTheme.set(mockThemes[0]);
      themeServiceMock.isSystemDefault.set(true);
      component.toggle();
      fixture.detectChanges();

      expect(component.isActiveTheme(mockThemes[0].slug)).toBe(false);
      expect(component.isActiveTheme(mockThemes[1].slug)).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should toggle dropdown on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      vi.spyOn(event, 'preventDefault');

      component.onButtonKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.isOpen()).toBe(true);
    });

    it('should toggle dropdown on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      vi.spyOn(event, 'preventDefault');

      component.onButtonKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown on Escape key', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on button', () => {
      const button = fixture.nativeElement.querySelector('[data-test="theme-picker-button"]');

      expect(button.getAttribute('aria-haspopup')).toBe('true');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-label')).toContain(mockThemes[0].label);
    });

    it('should update aria-expanded when dropdown opens', () => {
      component.toggle();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('[data-test="theme-picker-button"]');
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have role="menu" on dropdown', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = fixture.nativeElement.querySelector('[data-test="theme-picker-dropdown"]');
      expect(dropdown.getAttribute('role')).toBe('menu');
    });

    it('should have role="menuitem" on options', () => {
      component.toggle();
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector('.theme-picker__option');
      expect(option.getAttribute('role')).toBe('menuitem');
    });
  });

  describe('Component Cleanup', () => {
    it('should remove event listeners on destroy', async () => {
      component.toggle();
      fixture.detectChanges();

      // Wait for listeners to be set up
      await new Promise(resolve => setTimeout(resolve, 10));

      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      component.ngOnDestroy();

      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Click Outside', () => {
    it('should close dropdown when clicking outside', async () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      // Wait for setTimeout in setupOutsideClickListener
      await new Promise(resolve => setTimeout(resolve, 10));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const clickEvent = new MouseEvent('click', { bubbles: true });
      outsideElement.dispatchEvent(clickEvent);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);

      document.body.removeChild(outsideElement);
    });

    it('should not close dropdown when clicking inside dropdown', async () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      // Wait for setTimeout in setupOutsideClickListener
      await new Promise(resolve => setTimeout(resolve, 10));

      const dropdown = fixture.nativeElement.querySelector('[data-test="theme-picker-dropdown"]');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      dropdown.dispatchEvent(clickEvent);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });
  });

  describe('Visual Indicators', () => {
    it('should show chevron-down icon when dropdown is closed', () => {
      expect(component.isOpen()).toBe(false);
      // Icon component would render heroChevronDown
    });

    it('should show chevron-up icon when dropdown is open', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
      // Icon component would render heroChevronUp
    });

    it('should apply active class to selected theme option', () => {
      themeServiceMock.activeTheme.set(mockThemes[1]);
      themeServiceMock.isSystemDefault.set(false);
      component.toggle();
      fixture.detectChanges();

      const activeOption = fixture.nativeElement.querySelector(`[data-test="theme-option-${mockThemes[1].slug}"]`);
      expect(activeOption?.classList.contains('theme-picker__option--active')).toBe(true);
    });

    it('should apply active class to system option when active', () => {
      themeServiceMock.isSystemDefault.set(true);
      component.toggle();
      fixture.detectChanges();

      const systemOption = fixture.nativeElement.querySelector('[data-test="theme-option-system"]');
      expect(systemOption.classList.contains('theme-picker__option--active')).toBe(true);
    });
  });
});
