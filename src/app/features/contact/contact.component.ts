import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContainerComponent } from '@shared/components';

/**
 * Contact page component
 *
 * Displays contact form and contact information.
 * This is a placeholder component that will be enhanced in Phase 4 Part 4.
 *
 * @example
 * ```html
 * <app-contact />
 * ```
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {}
