import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { EXTERNAL_LINKS, LABELS, ROUTE_PATHS } from '@shared/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly metaTitle = inject(Title);

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

  ngOnInit(): void {
    this.metaTitle.setTitle('MoodyJW - Home');
    this.meta.updateTag({ name: 'home', content: 'Home page of MoodyJW Portfolio' });
  }
}
