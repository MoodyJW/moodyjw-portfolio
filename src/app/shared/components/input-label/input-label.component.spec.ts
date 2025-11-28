import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputLabelComponent } from './input-label.component';

describe('InputLabelComponent', () => {
  let component: InputLabelComponent;
  let fixture: ComponentFixture<InputLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputLabelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Label Display', () => {
    it('should display label text', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent.trim()).toContain('Test Label');
    });

    it('should not render when label is undefined', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', undefined);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeFalsy();
    });

    it('should set for attribute on label', () => {
      fixture.componentRef.setInput('forId', 'my-input-id');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.getAttribute('for')).toBe('my-input-id');
    });
  });

  describe('Required Indicator', () => {
    it('should show required indicator when required is true', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const required = fixture.debugElement.query(By.css('.input-label__required'));
      expect(required).toBeTruthy();
      expect(required.nativeElement.textContent).toBe('*');
    });

    it('should not show required indicator when required is false', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', false);
      fixture.detectChanges();

      const required = fixture.debugElement.query(By.css('.input-label__required'));
      expect(required).toBeFalsy();
    });

    it('should have aria-label on required indicator', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const required = fixture.debugElement.query(By.css('.input-label__required'));
      expect(required.nativeElement.getAttribute('aria-label')).toBe('required');
    });
  });

  describe('CSS Classes', () => {
    it('should apply default label class', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.className).toBe('input-label');
    });

    it('should apply custom label class', () => {
      fixture.componentRef.setInput('forId', 'test-input');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('labelClass', 'custom-label');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.className).toBe('custom-label');
    });
  });
});
