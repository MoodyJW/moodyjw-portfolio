import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ContainerComponent } from '@shared/components';

/**
 * Projects list page component
 *
 * Displays a filterable, sortable grid of portfolio projects.
 * This is a placeholder component that will be enhanced in Phase 4 Part 2.
 *
 * @example
 * ```html
 * <app-projects-list />
 * ```
 */
@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent implements OnInit {
  private readonly titleService = inject(Title);

  ngOnInit(): void {
    this.titleService.setTitle('MoodyJW - Projects');
  }
}
