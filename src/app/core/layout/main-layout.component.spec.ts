// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { provideRouter } from '@angular/router';
import { ROUTE_PATHS, NAV_ITEMS, APP_NAME, COPYRIGHT_YEAR } from '@shared/constants';

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

  it('should expose route paths', () => {
    expect(component['ROUTE_PATHS']).toBe(ROUTE_PATHS);
  });

  it('should expose navigation items', () => {
    expect(component['NAV_ITEMS']).toBe(NAV_ITEMS);
  });

  it('should expose app name', () => {
    expect(component['APP_NAME']).toBe(APP_NAME);
  });

  it('should expose copyright year', () => {
    expect(component['COPYRIGHT_YEAR']).toBe(COPYRIGHT_YEAR);
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('nav a');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('should render router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
