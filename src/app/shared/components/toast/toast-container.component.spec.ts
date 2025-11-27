// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { afterEach,beforeEach, vi } from 'vitest';

import { ToastService } from '../../services/toast.service';

import { ToastContainerComponent } from './toast-container.component';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (ToastContainerComponent as unknown as { ɵcmp: { standalone: boolean } })
        .ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (ToastContainerComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Position Management', () => {
    it('should define all six positions', () => {
      expect(component.positions).toEqual([
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]);
    });

    it('should get toasts for a specific position', () => {
      toastService.show({ message: 'Test 1', position: 'top-right' });
      toastService.show({ message: 'Test 2', position: 'top-right' });
      toastService.show({ message: 'Test 3', position: 'bottom-left' });

      const topRightToasts = component.getToastsForPosition('top-right');
      expect(topRightToasts.length).toBe(2);

      const bottomLeftToasts = component.getToastsForPosition('bottom-left');
      expect(bottomLeftToasts.length).toBe(1);
    });

    it('should return empty array when no toasts at position', () => {
      const toasts = component.getToastsForPosition('top-center');
      expect(toasts).toEqual([]);
    });
  });

  describe('Toast Dismissal', () => {
    it('should dismiss toast when handleDismiss is called', () => {
      const toastId = toastService.show({ message: 'Test' });
      expect(toastService.toasts().length).toBe(1);

      component.handleDismiss(toastId);

      // Should be marked as exiting
      expect(toastService.toasts()[0].isExiting).toBe(true);

      // After animation completes
      vi.advanceTimersByTime(300);
      expect(toastService.toasts().length).toBe(0);
    });

    it('should handle dismissing non-existent toast gracefully', () => {
      toastService.show({ message: 'Test' });
      expect(toastService.toasts().length).toBe(1);

      component.handleDismiss('non-existent-id');

      expect(toastService.toasts().length).toBe(1);
    });
  });

  describe('DOM Rendering', () => {
    it('should not render containers when no toasts exist', () => {
      fixture.detectChanges();

      const containers = fixture.nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);
    });

    it('should render container for position with toasts', () => {
      toastService.show({ message: 'Test', position: 'top-right' });
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.toast-container--top-right');
      expect(container).toBeTruthy();
    });

    it('should render multiple containers for different positions', () => {
      toastService.show({ message: 'Test 1', position: 'top-right' });
      toastService.show({ message: 'Test 2', position: 'bottom-left' });
      fixture.detectChanges();

      const topRightContainer = fixture.nativeElement.querySelector('.toast-container--top-right');
      const bottomLeftContainer = fixture.nativeElement.querySelector(
        '.toast-container--bottom-left'
      );

      expect(topRightContainer).toBeTruthy();
      expect(bottomLeftContainer).toBeTruthy();
    });

    it('should render correct number of toasts in container', () => {
      toastService.show({ message: 'Test 1', position: 'top-right' });
      toastService.show({ message: 'Test 2', position: 'top-right' });
      toastService.show({ message: 'Test 3', position: 'bottom-left' });
      fixture.detectChanges();

      const topRightToasts = fixture.nativeElement.querySelectorAll(
        '.toast-container--top-right app-toast'
      );
      const bottomLeftToasts = fixture.nativeElement.querySelectorAll(
        '.toast-container--bottom-left app-toast'
      );

      expect(topRightToasts.length).toBe(2);
      expect(bottomLeftToasts.length).toBe(1);
    });

    it('should set correct ARIA attributes on container', () => {
      toastService.show({ message: 'Test', position: 'top-right' });
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.toast-container--top-right');
      expect(container?.getAttribute('role')).toBe('region');
      expect(container?.getAttribute('aria-label')).toContain('top-right');
    });
  });

  describe('Toast Component Integration', () => {
    it('should pass correct props to toast component', () => {
      toastService.show({
        message: 'Test message',
        title: 'Test title',
        variant: 'success',
        duration: 3000,
        dismissible: true,
        position: 'top-right',
      });
      fixture.detectChanges();

      const toastElement = fixture.nativeElement.querySelector('app-toast');
      expect(toastElement).toBeTruthy();
    });

    it('should handle toast dismissal from child component', () => {
      toastService.show({ message: 'Test', dismissible: true });
      fixture.detectChanges();

      const dismissButton = fixture.nativeElement.querySelector('.toast__dismiss');
      dismissButton?.click();

      // Toast should be marked as exiting
      expect(toastService.toasts()[0].isExiting).toBe(true);

      // After animation
      vi.advanceTimersByTime(300);
      expect(toastService.toasts().length).toBe(0);
    });
  });

  describe('Dynamic Toast Management', () => {
    it('should update when new toast is added', () => {
      fixture.detectChanges();

      let containers = fixture.nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);

      toastService.show({ message: 'New toast' });
      fixture.detectChanges();

      containers = fixture.nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(1);
    });

    it('should update when toast is removed', () => {
      const id = toastService.show({ message: 'Test' });
      fixture.detectChanges();

      let containers = fixture.nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(1);

      toastService.dismiss(id);
      vi.advanceTimersByTime(300);
      fixture.detectChanges();

      containers = fixture.nativeElement.querySelectorAll('.toast-container');
      expect(containers.length).toBe(0);
    });

    it('should handle multiple toasts at same position', () => {
      toastService.show({ message: 'Toast 1', position: 'top-right' });
      toastService.show({ message: 'Toast 2', position: 'top-right' });
      toastService.show({ message: 'Toast 3', position: 'top-right' });
      fixture.detectChanges();

      const toasts = fixture.nativeElement.querySelectorAll(
        '.toast-container--top-right app-toast'
      );
      expect(toasts.length).toBe(3);
    });
  });

  describe('All Positions Rendering', () => {
    it('should render containers for all positions when toasts present', () => {
      const positions = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ] as const;

      positions.forEach((position) => {
        toastService.show({ message: `Test ${position}`, position });
      });

      fixture.detectChanges();

      positions.forEach((position) => {
        const container = fixture.nativeElement.querySelector(`.toast-container--${position}`);
        expect(container).toBeTruthy();
      });
    });
  });
});
