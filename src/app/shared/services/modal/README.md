# ModalService

> **Last Updated**: December 6, 2025  
> **Status**: Production Ready  
> **Test Coverage**: 100%

Service for programmatically opening and managing modals, confirmation dialogs, and alert dialogs. Provides a flexible API for custom modal components, accessibility, and global modal management.

## Features

- ✅ **Open Modals Programmatically**: Create modals with custom configuration and content
- ✅ **Confirmation Dialogs**: Built-in method for simple confirm/cancel flows
- ✅ **Alert Dialogs**: Built-in method for simple alert flows
- ✅ **Custom Components**: Render any Angular component inside a modal
- ✅ **ARIA & Accessibility**: Full support for ARIA attributes and keyboard navigation
- ✅ **Global Management**: Track and close all open modals
- ✅ **Type-safe**: Full TypeScript type safety
- ✅ **Signal-based State**: Tracks open modals with Angular signals

## Usage

### Inject and Use the Service

```typescript
import { Component, inject } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { UserSettingsComponent } from '@shared/components/user-settings/user-settings.component';

@Component({
  selector: 'app-my-component',
  // ...
})
export class MyComponent {
  private modalService = inject(ModalService);

  openModal() {
    const modalRef = this.modalService.open({
      ariaLabel: 'User settings',
      size: 'lg',
      component: UserSettingsComponent,
      data: { userId: 123 }
    });

    modalRef.afterClosed().then(result => {
      console.log('Modal closed with result:', result);
    });
  }

  async confirmDelete() {
    const confirmed = await this.modalService.confirm({
      title: 'Delete Item',
      message: 'Are you sure? This cannot be undone.',
      confirmText: 'Delete',
      confirmVariant: 'danger'
    });

    if (confirmed) {
      // Perform deletion
    }
  }
}
```

### Alert Dialog

```typescript
await modalService.alert({
  title: 'Info',
  message: 'Your changes have been saved.',
  okText: 'OK'
});
```

### Close All Modals

```typescript
modalService.closeAll();
```

## API

### `open<T>(config: ModalConfig): ModalRef<T>`
Opens a modal with the given configuration. Returns a reference with `close()` and `afterClosed()`.

### `confirm(config: ConfirmDialogConfig): Promise<boolean>`
Shows a confirmation dialog. Resolves to `true` if confirmed, `false` if canceled.

### `alert(config: AlertDialogConfig): Promise<void>`
Shows an alert dialog. Resolves when closed.

### `closeAll(): void`
Closes all open modals.

### `openModalsCount: number`
Returns the number of currently open modals.

## Accessibility

- All modals require an `ariaLabel` for screen reader support.
- Supports `ariaLabelledBy` and `ariaDescribedBy` for advanced accessibility.
- Keyboard navigation: ESC to close, focus management, and backdrop click support.
- Follows WCAG 2.1 AAA standards.

## Testing

- See `modal.service.spec.ts` for comprehensive unit tests.
- All methods and edge cases are covered.

## License

This project is licensed under the MIT License.
