// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Layout Structure', () => {
    it('should render skip link for accessibility', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('.main-layout__skip-link');
      expect(skipLink).toBeTruthy();
      expect(skipLink?.textContent).toContain('Skip to main content');
    });

    it('should link skip link to main content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const skipLink = compiled.querySelector('.main-layout__skip-link');
      expect(skipLink?.getAttribute('href')).toBe('#main-content');
    });

    it('should render header component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('app-header');
      expect(header).toBeTruthy();
    });

    it('should render main content area', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const main = compiled.querySelector('main#main-content');
      expect(main).toBeTruthy();
    });

    it('should have tabindex -1 on main content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const main = compiled.querySelector('main');
      expect(main?.getAttribute('tabindex')).toBe('-1');
    });

    it('should render router outlet', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should render footer component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const footer = compiled.querySelector('app-footer');
      expect(footer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper main landmark', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const main = compiled.querySelector('main');
      expect(main).toBeTruthy();
    });

    it('should have id on main content for skip link target', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const main = compiled.querySelector('#main-content');
      expect(main).toBeTruthy();
    });
  });
});
