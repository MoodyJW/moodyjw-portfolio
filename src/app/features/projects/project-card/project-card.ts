import { Component, computed, input, output } from '@angular/core';

import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StackComponent } from '@shared/components/stack/stack.component';
import type { Project } from '@core/models/project.model';

/**
 * Project Card Component
 *
 * @remarks
 * Displays a single project card with image, title, description, technologies, and actions.
 * Extracted from ProjectsList to reduce cyclomatic complexity.
 *
 * @example
 * ```html
 * <app-project-card
 *   [project]="project"
 *   [selectedTags]="selectedTags"
 *   (tagClick)="onToggleTag($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [
    CardComponent,
    StackComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  /** Project data to display */
  project = input.required<Project>();

  /** Currently selected technology tags for filter highlighting */
  selectedTags = input<string[]>([]);

  /** Emitted when a technology tag is clicked */
  tagClick = output<string>();

  /** Limited tech list for display (first 3) */
  protected readonly displayTechs = computed(() =>
    this.project().technologies.slice(0, 3)
  );

  /** Remaining tech count */
  protected readonly remainingTechCount = computed(() => {
    const remaining = this.project().technologies.length - 3;
    return remaining > 0 ? remaining : 0;
  });

  /** Has GitHub stars */
  protected readonly hasGitHubStars = computed(() => {
    const stars = this.project().githubStars;
    return stars !== undefined && stars > 0;
  });

  /** Status icon name */
  protected readonly statusIcon = computed(() =>
    this.project().metadata?.status === 'Active' ? 'heroCheckCircle' : 'heroXCircle'
  );

  /** Has live link */
  protected readonly hasLiveLink = computed(() => !!this.project().links.live);

  /** Has GitHub link */
  protected readonly hasGitHubLink = computed(() => !!this.project().links.github);

  /** Has status */
  protected readonly hasStatus = computed(() => !!this.project().metadata?.status);

  /**
   * Check if a technology tag is currently selected
   */
  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  /**
   * Get project detail route
   */
  getProjectRoute(): string {
    return `/projects/${this.project().slug}`;
  }

  /**
   * Handle tag click
   */
  onTagClick(tag: string): void {
    this.tagClick.emit(tag);
  }
}
