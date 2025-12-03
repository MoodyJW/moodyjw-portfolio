import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';

import { DividerComponent, IconComponent, StackComponent } from '@shared/components';
import {
  APP_NAME,
  COPYRIGHT_YEAR,
  EXTERNAL_LINKS,
  ICON_NAMES,
  ICON_REGISTRY,
  NAV_ITEMS,
} from '@shared/constants';

/**
 * Application footer component with social links and navigation
 *
 * Features:
 * - Social media links (GitHub, LinkedIn, Email)
 * - Footer navigation
 * - Copyright notice
 * - Responsive layout
 * - WCAG 2.1 AAA compliant
 *
 * Uses:
 * - IconComponent for social icons
 * - StackComponent for layout
 * - DividerComponent for visual separation
 * - RouterLink for navigation
 *
 * @example
 * ```html
 * <app-footer />
 * ```
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent, StackComponent, DividerComponent],
  viewProviders: [provideIcons(ICON_REGISTRY)],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  /** Application name */
  protected readonly APP_NAME = APP_NAME;

  /** Copyright year */
  protected readonly COPYRIGHT_YEAR = COPYRIGHT_YEAR;

  /** External links */
  protected readonly EXTERNAL_LINKS = EXTERNAL_LINKS;

  /** Icon names */
  protected readonly ICON_NAMES = ICON_NAMES;

  /** Navigation items */
  protected readonly NAV_ITEMS = NAV_ITEMS;

  /**
   * Social media links configuration
   */
  protected readonly socialLinks = [
    {
      ...EXTERNAL_LINKS.GITHUB,
      icon: ICON_NAMES.GITHUB,
    },
    {
      ...EXTERNAL_LINKS.LINKEDIN,
      icon: ICON_NAMES.LINKEDIN,
    },
    {
      ...EXTERNAL_LINKS.EMAIL,
      icon: ICON_NAMES.EMAIL,
    },
  ] as const;
}
