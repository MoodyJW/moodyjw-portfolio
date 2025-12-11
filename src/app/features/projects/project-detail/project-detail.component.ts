import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContainerComponent } from '@shared/components';

/**
 * Project detail page component
 *
 * Displays detailed information about a single portfolio project.
 * This is a placeholder component that will be enhanced in Phase 4 Part 3.
 *
 * @example
 * ```html
 * <app-project-detail />
 * ```
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected slug: string | null = null;

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
  }
}
