import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ContainerComponent } from '@shared/components';

/**
 * About page component
 *
 * Displays professional bio, skills, experience timeline, and certifications.
 * This is a placeholder component that will be enhanced in Phase 4 Part 4.
 *
 * @example
 * ```html
 * <app-about />
 * ```
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('MoodyJW - About');
  }
}
