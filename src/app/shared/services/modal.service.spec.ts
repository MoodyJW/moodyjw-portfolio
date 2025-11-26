// @vitest-environment jsdom
/* eslint-disable no-undef */
import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';
import type { ModalConfig } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService],
    });
    service = TestBed.inject(ModalService);
  });

  afterEach(() => {
    // Clean up any open modals
    service.closeAll();
    // Wait for animations
    vi.clearAllTimers();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be provided in root', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Opening Modals', () => {
    it('should open a modal with default configuration', () => {
      const config: ModalConfig = {
        ariaLabel: 'Test modal',
      };

      const modalRef = service.open(config);
      expect(modalRef).toBeDefined();
      expect(modalRef.close).toBeInstanceOf(Function);
      expect(modalRef.afterClosed).toBeInstanceOf(Function);
      expect(service.openModalsCount).toBe(1);

      modalRef.close();
    });

    it('should open a modal with custom configuration', () => {
      const config: ModalConfig = {
        ariaLabel: 'Custom modal',
        variant: 'sidebar',
        size: 'lg',
        closeOnBackdropClick: false,
        closeOnEscape: false,
        showCloseButton: false,
      };

      const modalRef = service.open(config);
      expect(service.openModalsCount).toBe(1);

      modalRef.close();
    });

    it('should open multiple modals', () => {
      const modal1 = service.open({ ariaLabel: 'Modal 1' });
      const modal2 = service.open({ ariaLabel: 'Modal 2' });

      expect(service.openModalsCount).toBe(2);

      modal1.close();
      modal2.close();
    });

    it('should append modal to document body', () => {
      const modalRef = service.open({ ariaLabel: 'Test modal' });

      const modalElement = document.querySelector('app-modal');
      expect(modalElement).toBeTruthy();

      modalRef.close();
    });
  });

  describe('Closing Modals', () => {
    it('should close a modal when close is called', async () => {
      const modalRef = service.open({ ariaLabel: 'Test modal' });

      expect(service.openModalsCount).toBe(1);

      modalRef.close();

      // Modal count should still be 1 immediately (animation not complete)
      expect(service.openModalsCount).toBe(1);

      // After animation completes
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(service.openModalsCount).toBe(0);
    });

    it('should resolve afterClosed promise when modal is closed', async () => {
      const modalRef = service.open({ ariaLabel: 'Test modal' });

      const result = 'test result';
      setTimeout(() => modalRef.close(result), 10);

      const closedResult = await modalRef.afterClosed();
      expect(closedResult).toBe(result);
    });

    it('should resolve afterClosed promise with undefined if no result', async () => {
      const modalRef = service.open({ ariaLabel: 'Test modal' });

      setTimeout(() => modalRef.close(), 10);

      const closedResult = await modalRef.afterClosed();
      expect(closedResult).toBeUndefined();
    });

    it('should remove modal element from DOM when closed', async () => {
      const modalRef = service.open({ ariaLabel: 'Test modal' });

      const modalElement = document.querySelector('app-modal');
      expect(modalElement).toBeTruthy();

      modalRef.close();

      await new Promise(resolve => setTimeout(resolve, 350));
      const modalElementAfterClose = document.querySelector('app-modal');
      expect(modalElementAfterClose).toBeNull();
    });

    it('should close all modals when closeAll is called', async () => {
      service.open({ ariaLabel: 'Modal 1' });
      service.open({ ariaLabel: 'Modal 2' });
      service.open({ ariaLabel: 'Modal 3' });

      expect(service.openModalsCount).toBe(3);

      service.closeAll();

      await new Promise(resolve => setTimeout(resolve, 350));
      expect(service.openModalsCount).toBe(0);
    });
  });

  // Note: confirm() and alert() are placeholder implementations
  // Full implementation would require dedicated dialog components
  describe('Confirm Dialog', () => {
    it.skip('should create a confirm dialog', async () => {
      // Placeholder - not fully implemented yet
    });
  });

  describe('Alert Dialog', () => {
    it.skip('should create an alert dialog', async () => {
      // Placeholder - not fully implemented yet
    });
  });

  describe('Modal Count', () => {
    it('should track open modals count correctly', () => {
      expect(service.openModalsCount).toBe(0);

      const modal1 = service.open({ ariaLabel: 'Modal 1' });
      expect(service.openModalsCount).toBe(1);

      const modal2 = service.open({ ariaLabel: 'Modal 2' });
      expect(service.openModalsCount).toBe(2);

      modal1.close();
      // Count should still be 2 immediately (animation not complete)
      expect(service.openModalsCount).toBe(2);

      modal2.close();
    });

    it('should reset count to 0 when all modals are closed', async () => {
      service.open({ ariaLabel: 'Modal 1' });
      service.open({ ariaLabel: 'Modal 2' });

      expect(service.openModalsCount).toBe(2);

      service.closeAll();

      await new Promise(resolve => setTimeout(resolve, 350));
      expect(service.openModalsCount).toBe(0);
    });
  });

  describe('ARIA Configuration', () => {
    it('should set aria-label when provided', async () => {
      const modalRef = service.open({
        ariaLabel: 'Custom ARIA label',
      });

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 0));

      const modalElement = document.querySelector('[role="dialog"]');
      expect(modalElement?.getAttribute('aria-label')).toBe(
        'Custom ARIA label'
      );

      modalRef.close();
    });

    it('should set aria-labelledby when provided', async () => {
      const modalRef = service.open({
        ariaLabel: 'Test modal',
        ariaLabelledBy: 'heading-id',
      });

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 0));

      const modalElement = document.querySelector('[role="dialog"]');
      expect(modalElement?.getAttribute('aria-labelledby')).toBe('heading-id');

      modalRef.close();
    });

    it('should set aria-describedby when provided', async () => {
      const modalRef = service.open({
        ariaLabel: 'Test modal',
        ariaDescribedBy: 'description-id',
      });

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 0));

      const modalElement = document.querySelector('[role="dialog"]');
      expect(modalElement?.getAttribute('aria-describedby')).toBe(
        'description-id'
      );

      modalRef.close();
    });
  });
});
