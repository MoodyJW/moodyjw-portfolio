import { CommonModule } from '@angular/common';
import type {
  OnDestroy} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';

import { ThemeService } from '../../../../shared/services/theme.service';
import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';
import { StackComponent } from '../stack/stack.component';

/**
 * Theme picker component for switching between available themes.
 *
 * @remarks
 * This component provides a dropdown interface for theme selection with the following features:
 * - Displays current theme with appropriate icon
 * - Shows all available themes in a dropdown menu
 * - Supports system default theme option
 * - Indicates when system default is active
 * - Keyboard navigation support (Enter, Space, Escape)
 * - Click-outside-to-close functionality
 * - WCAG 2.1 AAA compliant
 *
 * @example
 * Basic usage:
 * ```html
 * <app-theme-picker />
 * ```
 *
 * @example
 * With custom aria-label:
 * ```html
 * <app-theme-picker ariaLabel="Select application theme" />
 * ```
 */
@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent, StackComponent],
  templateUrl: './theme-picker.component.html',
  styleUrl: './theme-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent implements OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly elementRef = inject(ElementRef);

  /**
   * Signal: Is dropdown open
   */
  readonly isOpen = signal(false);

  /**
   * Computed: Current theme
   */
  readonly currentTheme = this.themeService.activeTheme;

  /**
   * Computed: All available themes
   */
  readonly themes = this.themeService.themes;

  /**
   * Computed: Is system default active
   */
  readonly isSystemDefault = this.themeService.isSystemDefault;

  /**
   * Computed: Current theme icon
   */
  readonly currentIcon = computed(() => {
    const theme = this.currentTheme();
    return theme.isDark ? 'heroMoon' : 'heroSun';
  });

  private clickOutsideListener?: (event: MouseEvent) => void;
  private escapeKeyListener?: (event: KeyboardEvent) => void;

  constructor() {
    // Set up click outside and escape key listeners
    effect(() => {
      if (this.isOpen()) {
        this.setupOutsideClickListener();
        this.setupEscapeKeyListener();
      } else {
        this.removeOutsideClickListener();
        this.removeEscapeKeyListener();
      }
    });
  }

  /**
   * Toggle dropdown open/closed
   */
  toggle(): void {
    this.isOpen.update(open => !open);
  }

  /**
   * Close dropdown
   */
  close(): void {
    this.isOpen.set(false);
  }

  /**
   * Select a theme by slug
   */
  selectTheme(slug: string): void {
    this.themeService.setTheme(slug);
    this.close();
  }

  /**
   * Reset to system default theme
   */
  selectSystemDefault(): void {
    this.themeService.resetToSystem();
    this.close();
  }

  /**
   * Check if a theme is currently active
   */
  isActiveTheme(slug: string): boolean {
    return this.currentTheme().slug === slug && !this.isSystemDefault();
  }

  /**
   * Handle button keydown events
   */
  onButtonKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  /**
   * Handle option keydown events
   */
  onOptionKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }

  /**
   * Setup click outside listener
   */
  private setupOutsideClickListener(): void {
    // Use setTimeout to avoid immediate triggering
    setTimeout(() => {
      this.clickOutsideListener = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const clickedInside = this.elementRef.nativeElement.contains(target);

        if (!clickedInside) {
          this.close();
        }
      };

      document.addEventListener('click', this.clickOutsideListener);
    }, 0);
  }

  /**
   * Remove click outside listener
   */
  private removeOutsideClickListener(): void {
    if (this.clickOutsideListener) {
      document.removeEventListener('click', this.clickOutsideListener);
      this.clickOutsideListener = undefined;
    }
  }

  /**
   * Setup escape key listener
   */
  private setupEscapeKeyListener(): void {
    this.escapeKeyListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }
    };

    document.addEventListener('keydown', this.escapeKeyListener);
  }

  /**
   * Remove escape key listener
   */
  private removeEscapeKeyListener(): void {
    if (this.escapeKeyListener) {
      document.removeEventListener('keydown', this.escapeKeyListener);
      this.escapeKeyListener = undefined;
    }
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    this.removeOutsideClickListener();
    this.removeEscapeKeyListener();
  }
}
