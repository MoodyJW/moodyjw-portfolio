import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ROUTE_PATHS, NAV_ITEMS, APP_NAME, COPYRIGHT_YEAR } from '@shared/constants';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
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
}
