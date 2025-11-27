import { ChangeDetectionStrategy,Component } from '@angular/core';
import { RouterLink, RouterLinkActive,RouterOutlet } from '@angular/router';

import { APP_NAME, COPYRIGHT_YEAR,NAV_ITEMS, ROUTE_PATHS } from '@shared/constants';

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
