import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable checkmark component for checkbox states
 *
 * Displays SVG icons for checked and indeterminate states.
 * Indeterminate takes precedence over checked.
 */
@Component({
  selector: 'app-checkbox-checkmark',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="checkbox-checkmark" aria-hidden="true">
      @if (indeterminate()) {
        <svg
          class="checkbox-icon checkbox-icon--indeterminate"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      } @else if (checked()) {
        <svg
          class="checkbox-icon checkbox-icon--checked"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 4L6 11L3 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      }
    </span>
  `,
  styles: [
    `
      .checkbox-checkmark {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;

        @media (pointer: coarse) {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .checkbox-icon {
        width: 100%;
        height: 100%;
        color: var(--color-background);
        transition: opacity var(--transition-duration) var(--transition-timing);

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxCheckmarkComponent {
  /**
   * Whether the checkbox is checked
   */
  readonly checked = input<boolean>(false);

  /**
   * Whether the checkbox is indeterminate
   */
  readonly indeterminate = input<boolean>(false);
}
