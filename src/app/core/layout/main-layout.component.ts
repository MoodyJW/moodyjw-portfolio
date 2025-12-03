import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

import {
  ButtonComponent,
  IconComponent,
  StackComponent,
} from '@shared/components';
import {
  APP_NAME,
  ARIA_LABELS,
  COPYRIGHT_YEAR,
  ICON_REGISTRY,
  KEYBOARD_KEYS,
  NAV_ITEMS,
  ROUTE_PATHS,
} from '@shared/constants';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonComponent,
    IconComponent,
    StackComponent,
  ],
  viewProviders: [provideIcons(ICON_REGISTRY)],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  /** Route paths for navigation */
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  /** Navigation menu items */
  protected readonly NAV_ITEMS = NAV_ITEMS;

  /** Application name */
  protected readonly APP_NAME = APP_NAME;

  /** Copyright year */
  protected readonly COPYRIGHT_YEAR = COPYRIGHT_YEAR;

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
