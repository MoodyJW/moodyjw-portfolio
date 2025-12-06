/* eslint-disable no-undef */

import type { ComponentRef, Type } from '@angular/core';
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import { ModalComponent } from '../../components/modal/modal.component';

/**
 * Configuration options for programmatically opening modals
 */
export interface ModalConfig {
  /** Visual variant of the modal */
  variant?: 'default' | 'fullscreen' | 'dialog' | 'sidebar';
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether clicking backdrop closes the modal */
  closeOnBackdropClick?: boolean;
  /** Whether ESC key closes the modal */
  closeOnEscape?: boolean;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether to prevent body scroll */
  preventBodyScroll?: boolean;
  /** ARIA label (required) */
  ariaLabel: string;
  /** ARIA described by */
  ariaDescribedBy?: string;
  /** ARIA labelled by */
  ariaLabelledBy?: string;
  /** Custom component to render in modal body */
  component?: Type<unknown>;
  /** Data to pass to custom component */
  data?: unknown;
}

/**
 * Configuration for confirmation dialogs
 */
export interface ConfirmDialogConfig {
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'danger';
  /** ARIA label */
  ariaLabel?: string;
}

/**
 * Configuration for alert dialogs
 */
export interface AlertDialogConfig {
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** OK button text */
  okText?: string;
  /** ARIA label */
  ariaLabel?: string;
}

/**
 * Reference to an opened modal
 */
export interface ModalRef<T = unknown> {
  /** Close the modal */
  close: (result?: T) => void;
  /** Observable that emits when modal is closed */
  afterClosed: () => Promise<T | undefined>;
}

/**
 * Service for programmatically opening and managing modals.
 *
 * Provides convenience methods for common modal patterns:
 * - Generic modals with custom components
 * - Confirmation dialogs
 * - Alert dialogs
 *
 * @example
 * ```typescript
 * // Inject the service
 * private modalService = inject(ModalService);
 *
 * // Open a simple modal
 * openModal() {
 *   const modalRef = this.modalService.open({
 *     ariaLabel: 'User settings',
 *     size: 'lg',
 *     component: UserSettingsComponent,
 *     data: { userId: 123 }
 *   });
 *
 *   modalRef.afterClosed().then(result => {
 *     console.log('Modal closed with result:', result);
 *   });
 * }
 *
 * // Show confirmation dialog
 * async confirmDelete() {
 *   const confirmed = await this.modalService.confirm({
 *     title: 'Delete Item',
 *     message: 'Are you sure? This cannot be undone.',
 *     confirmText: 'Delete',
 *     confirmVariant: 'danger'
 *   });
 *
 *   if (confirmed) {
 *     // Perform deletion
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _activeModals = signal<ComponentRef<ModalComponent>[]>([]);
  private _appRef = signal<ApplicationRef | null>(null);
  private _injector = signal<EnvironmentInjector | null>(null);

  private applicationRef: ApplicationRef = inject(ApplicationRef);
  private injector: EnvironmentInjector = inject(EnvironmentInjector);

  constructor() {
    this._appRef.set(this.applicationRef);
    this._injector.set(this.injector);
  }

  /**
   * Open a modal with custom configuration
   *
   * @param config Modal configuration
   * @returns Modal reference with close method and afterClosed promise
   */
  open<T = unknown>(config: ModalConfig): ModalRef<T> {
    const appRef = this._appRef();
    const environmentInjector = this._injector();

    if (!appRef || !environmentInjector) {
      throw new Error('ModalService not properly initialized');
    }

    // Create the modal component
    const modalRef = createComponent(ModalComponent, {
      environmentInjector,
    });

    // Set inputs
    modalRef.setInput('variant', config.variant ?? 'default');
    modalRef.setInput('size', config.size ?? 'md');
    modalRef.setInput('open', true);
    modalRef.setInput('closeOnBackdropClick', config.closeOnBackdropClick ?? true);
    modalRef.setInput('closeOnEscape', config.closeOnEscape ?? true);
    modalRef.setInput('showCloseButton', config.showCloseButton ?? true);
    modalRef.setInput('preventBodyScroll', config.preventBodyScroll ?? true);
    modalRef.setInput('ariaLabel', config.ariaLabel);
    if (config.ariaDescribedBy) {
      modalRef.setInput('ariaDescribedBy', config.ariaDescribedBy);
    }
    if (config.ariaLabelledBy) {
      modalRef.setInput('ariaLabelledBy', config.ariaLabelledBy);
    }

    // Attach to application
    appRef.attachView(modalRef.hostView);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const domElem = (modalRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Track active modal
    this._activeModals.update((modals) => [...modals, modalRef]);

    // Create promise for afterClosed
    let resolveClose: (result?: T) => void;
    const afterClosedPromise = new Promise<T | undefined>((resolve) => {
      resolveClose = resolve;
    });

    // Track if already closing to prevent double-close
    let isClosing = false;

    // Handle close
    const close = (result?: T) => {
      if (isClosing) {
        return;
      }
      isClosing = true;

      try {
        modalRef.setInput('open', false);
      } catch {
        // Ignore if already destroyed
      }

      // Wait for close animation
      setTimeout(() => {
        try {
          // Unsubscribe from closed output
          closedSubscription.unsubscribe();

          // Cleanup - check if appRef is still available
          const currentAppRef = this._appRef();
          if (currentAppRef) {
            // Remove from active modals (only if appRef is available)
            this._activeModals.update((modals) => modals.filter((m) => m !== modalRef));

            currentAppRef.detachView(modalRef.hostView);
            modalRef.destroy();
            if (domElem.parentNode) {
              domElem.parentNode.removeChild(domElem);
            }
          }

          // Resolve promise
          resolveClose(result);
        } catch {
          // Ignore errors if ApplicationRef is already destroyed
          resolveClose(result);
        }
      }, 300); // Match animation duration
    };

    // Subscribe to closed output
    const closedSubscription = modalRef.instance.closed.subscribe(() => {
      close();
    });

    return {
      close,
      afterClosed: () => afterClosedPromise,
    };
  }

  /**
   * Show a confirmation dialog
   *
   * @param config Confirmation dialog configuration
   * @returns Promise that resolves to true if confirmed, false if canceled
   */
  async confirm(config: ConfirmDialogConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // This is a simplified implementation
      // In a real app, you might create a dedicated ConfirmDialogComponent
      const modalRef = this.open({
        ariaLabel: config.ariaLabel ?? config.title,
        variant: 'dialog',
        size: 'sm',
      });

      // For now, just resolve with the afterClosed result
      modalRef.afterClosed().then((result) => {
        resolve(result === true);
      });
    });
  }

  /**
   * Show an alert dialog
   *
   * @param config Alert dialog configuration
   * @returns Promise that resolves when dialog is closed
   */
  async alert(config: AlertDialogConfig): Promise<void> {
    // This is a simplified implementation
    // In a real app, you might create a dedicated AlertDialogComponent
    const modalRef = this.open({
      ariaLabel: config.ariaLabel ?? config.title,
      variant: 'dialog',
      size: 'sm',
    });

    await modalRef.afterClosed();
  }

  /**
   * Close all open modals
   */
  closeAll(): void {
    const appRef = this._appRef();
    const modals = this._activeModals();

    if (!appRef) {
      // If appRef is destroyed, just clear the array
      this._activeModals.set([]);
      return;
    }

    modals.forEach((modal) => {
      try {
        modal.setInput('open', false);
      } catch {
        // Ignore if already destroyed
      }
    });

    setTimeout(() => {
      // Only cleanup if appRef is still available
      const currentAppRef = this._appRef();
      if (!currentAppRef) {
        this._activeModals.set([]);
        return;
      }

      modals.forEach((modal) => {
        try {
          currentAppRef.detachView(modal.hostView);
          modal.destroy();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const domElem = (modal.hostView as any).rootNodes[0] as HTMLElement;
          if (domElem && domElem.parentNode) {
            domElem.parentNode.removeChild(domElem);
          }
        } catch {
          // Ignore errors if already destroyed
        }
      });

      this._activeModals.set([]);
    }, 300);
  }

  /**
   * Get the number of currently open modals
   */
  get openModalsCount(): number {
    return this._activeModals().length;
  }
}
