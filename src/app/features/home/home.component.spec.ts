// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { ROUTE_PATHS, EXTERNAL_LINKS, LABELS } from '@shared/constants';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose route paths', () => {
    expect(component['ROUTE_PATHS']).toBe(ROUTE_PATHS);
  });

  it('should expose external links', () => {
    expect(component['EXTERNAL_LINKS']).toBe(EXTERNAL_LINKS);
  });

  it('should expose labels', () => {
    expect(component['LABELS']).toBe(LABELS);
  });

  it('should have title signal', () => {
    expect(component['title']()).toBe('Welcome to MoodyJW Portfolio');
  });

  it('should have subtitle signal', () => {
    expect(component['subtitle']()).toBe('Lead Frontend Developer | Angular Specialist');
  });

  it('should have description signal', () => {
    const description = component['description']();
    expect(description).toContain('Building scalable');
    expect(description).toContain('Angular');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1, .home__title');
    expect(titleElement?.textContent).toContain('MoodyJW');
  });

  it('should render subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitleElement = compiled.querySelector('.home__subtitle');
    expect(subtitleElement?.textContent).toContain('Lead Frontend Developer');
  });

  it('should render description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const descriptionElement = compiled.querySelector('.home__description');
    expect(descriptionElement?.textContent).toContain('Building scalable');
  });

  it('should render case studies link with correct route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.home__cta');
    const caseStudiesLink = Array.from(links).find(link =>
      link.textContent?.includes('Case Studies')
    );
    expect(caseStudiesLink).toBeTruthy();
    expect(caseStudiesLink?.classList.contains('home__cta--primary')).toBe(true);
  });

  it('should render GitHub profile link with correct attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const githubLink = compiled.querySelector('a[target="_blank"]') as HTMLAnchorElement;
    expect(githubLink).toBeTruthy();
    expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(githubLink.textContent || '').toContain('GitHub Profile');
  });

  it('should render Core Expertise section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillsSection = compiled.querySelector('.home__skills');
    const sectionTitle = skillsSection?.querySelector('.home__section-title');
    expect(sectionTitle?.textContent).toContain('Core Expertise');
  });

  it('should render all skill cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillCards = compiled.querySelectorAll('.home__skill-card');
    expect(skillCards.length).toBe(4);
  });

  it('should render Angular skill card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillTitles = Array.from(compiled.querySelectorAll('.home__skill-title'));
    const angularTitle = skillTitles.find(el => el.textContent?.includes('Angular'));
    expect(angularTitle).toBeTruthy();
  });

  it('should render Architecture skill card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillTitles = Array.from(compiled.querySelectorAll('.home__skill-title'));
    const architectureTitle = skillTitles.find(el => el.textContent?.includes('Architecture'));
    expect(architectureTitle).toBeTruthy();
  });

  it('should render Performance skill card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillTitles = Array.from(compiled.querySelectorAll('.home__skill-title'));
    const performanceTitle = skillTitles.find(el => el.textContent?.includes('Performance'));
    expect(performanceTitle).toBeTruthy();
  });

  it('should render Design Systems skill card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skillTitles = Array.from(compiled.querySelectorAll('.home__skill-title'));
    const designSystemsTitle = skillTitles.find(el => el.textContent?.includes('Design Systems'));
    expect(designSystemsTitle).toBeTruthy();
  });

  it('should have proper hero section structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroSection = compiled.querySelector('.home__hero');
    expect(heroSection).toBeTruthy();

    const actions = heroSection?.querySelector('.home__actions');
    expect(actions).toBeTruthy();

    const ctaButtons = actions?.querySelectorAll('.home__cta');
    expect(ctaButtons?.length).toBe(2);
  });
});
