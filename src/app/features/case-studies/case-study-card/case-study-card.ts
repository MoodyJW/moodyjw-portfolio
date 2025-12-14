import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StackComponent } from '@shared/components/stack/stack.component';
import type { CaseStudy } from '@core/models/case-study.model';

/**
 * CaseStudyCard component displays a single case study with image, title, description,
 * client, role, technologies, and action buttons.
 *
 * Features:
 * - Responsive card layout with hover effects
 * - Technology tags (clickable for filtering)
 * - Client and role metadata
 * - Duration display
 * - Multiple action buttons (view details)
 * - Support for selected tag highlighting
 *
 * @example
 * ```html
 * <app-case-study-card
 *   [caseStudy]="caseStudy"
 *   [selectedTags]="['Angular', 'TypeScript']"
 *   (tagClick)="onTagClick($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-case-study-card',
  standalone: true,
  imports: [RouterLink, CardComponent, StackComponent, ButtonComponent, IconComponent],
  templateUrl: './case-study-card.html',
  styleUrl: './case-study-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudyCard {
  /** Case study data to display */
  caseStudy = input.required<CaseStudy>();

  /** Currently selected technology tags for filter highlighting */
  selectedTags = input<string[]>([]);

  /** Emitted when a technology tag is clicked */
  tagClick = output<string>();

  /** Display technologies (limited to first 3) */
  protected displayTechs = computed(() => this.caseStudy().technologies.slice(0, 3));

  /** Remaining technology count (if more than 3) */
  protected remainingTechCount = computed(() => {
    const total = this.caseStudy().technologies.length;
    return total > 3 ? total - 3 : 0;
  });

  /**
   * Check if a technology tag is currently selected
   */
  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  /**
   * Get the route to the case study detail page
   */
  getCaseStudyRoute(): string {
    return `/case-studies/${this.caseStudy().slug}`;
  }

  /**
   * Handle tag click event
   */
  onTagClick(tag: string): void {
    this.tagClick.emit(tag);
  }
}
