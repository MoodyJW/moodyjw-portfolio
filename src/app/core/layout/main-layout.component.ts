import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

/**
 * Main layout component that provides the application shell
 *
 * Orchestrates the overall page structure with:
 * - Skip-to-content link for accessibility
 * - Header with navigation
 * - Main content area with router outlet
 * - Footer
 *
 * @example
 * ```html
 * <app-main-layout />
 * ```
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
