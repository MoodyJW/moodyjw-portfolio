import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ToastPosition } from './toast.component';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';

/**
 * Container component for displaying toast notifications.
 * Manages positioning and rendering of all active toasts.
 * Should be placed once in the app root layout.
 *
 * @example
 * ```html
 * <!-- In app.component.html or main-layout.component.html -->
 * <app-toast-container />
 * ```
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  /**
   * Inject the toast service
   */
  private readonly toastService = inject(ToastService);

  /**
   * All positions where toasts can be rendered
   */
  readonly positions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  /**
   * Get toasts for a specific position
   */
  getToastsForPosition(position: ToastPosition) {
    return this.toastService.getToastsByPosition(position);
  }

  /**
   * Handle toast dismissal
   */
  handleDismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
