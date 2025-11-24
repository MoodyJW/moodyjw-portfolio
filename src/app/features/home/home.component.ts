import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_PATHS, EXTERNAL_LINKS, LABELS } from '@shared/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  /** Route paths for navigation */
  protected readonly ROUTE_PATHS = ROUTE_PATHS;

  /** External links */
  protected readonly EXTERNAL_LINKS = EXTERNAL_LINKS;

  /** UI labels */
  protected readonly LABELS = LABELS;

  protected readonly title = signal('Welcome to MoodyJW Portfolio');
  protected readonly subtitle = signal('Lead Frontend Developer | Angular Specialist');
  protected readonly description = signal(
    'Building scalable, high-performance web applications with modern Angular, signals, and standalone components.'
  );
}
