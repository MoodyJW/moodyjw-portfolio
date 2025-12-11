import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

import { ButtonComponent, IconComponent, StackComponent } from '@shared/components';
import {
  APP_NAME,
  ARIA_LABELS,
  ICON_REGISTRY,
  KEYBOARD_KEYS,
  NAV_ITEMS,
  ROUTE_PATHS,
} from '@shared/constants';

import { ThemePickerComponent } from '../../shared/components/theme-picker/theme-picker.component';

/**
 * Application header component with navigation and mobile menu
 *
 * Features:
 * - Desktop navigation menu with active route highlighting
 * - Mobile hamburger menu with slide-out drawer
 * - Theme picker integration
 * - Keyboard navigation support
 * - WCAG 2.1 AAA compliant
 *
 * @example
 * ```html
 * <app-header />
 * ```
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
    IconComponent,
    StackComponent,
    ThemePickerComponent,
  ],
  viewProviders: [provideIcons(ICON_REGISTRY)],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  /** Route paths for navigation */
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  /** Navigation menu items */
  protected readonly NAV_ITEMS = NAV_ITEMS;

  /** Application name */
  protected readonly APP_NAME = APP_NAME;

  /** ARIA labels for accessibility */
  protected readonly ARIA_LABELS = ARIA_LABELS;

  /** Keyboard keys for accessibility */
  protected readonly KEYBOARD_KEYS = KEYBOARD_KEYS;

  /** Mobile menu open/closed state */
  protected readonly isMobileMenuOpen = signal(false);

  /**
   * Toggle mobile menu open/closed state
   */
  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  /**
   * Close mobile menu
   */
  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Handle keyboard navigation for mobile menu toggle
   * @param event - Keyboard event
   */
  protected onMenuToggleKeydown(event: KeyboardEvent): void {
    if (
      event.key === this.KEYBOARD_KEYS.ENTER ||
      event.key === this.KEYBOARD_KEYS.SPACE
    ) {
      event.preventDefault();
      this.toggleMobileMenu();
    }
  }

  /**
   * Handle keyboard navigation for closing mobile menu
   * @param event - Keyboard event
   */
  protected onMenuCloseKeydown(event: KeyboardEvent): void {
    if (event.key === this.KEYBOARD_KEYS.ESCAPE) {
      this.closeMobileMenu();
    }
  }
}
