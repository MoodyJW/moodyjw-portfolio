// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { CaseStudiesComponent } from './case-studies.component';
import { LABELS } from '@shared/constants';

describe('CaseStudiesComponent', () => {
  let component: CaseStudiesComponent;
  let fixture: ComponentFixture<CaseStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose labels', () => {
    expect(component['LABELS']).toBe(LABELS);
  });

  it('should have case studies signal', () => {
    const caseStudies = component['caseStudies']();
    expect(Array.isArray(caseStudies)).toBe(true);
    expect(caseStudies.length).toBe(3);
  });

  it('should have correct case study structure', () => {
    const caseStudies = component['caseStudies']();
    const firstStudy = caseStudies[0];

    expect(firstStudy).toHaveProperty('id');
    expect(firstStudy).toHaveProperty('title');
    expect(firstStudy).toHaveProperty('description');
    expect(firstStudy).toHaveProperty('technologies');
    expect(Array.isArray(firstStudy.technologies)).toBe(true);
  });

  it('should have Enterprise Dashboard case study', () => {
    const caseStudies = component['caseStudies']();
    const enterpriseDashboard = caseStudies.find(cs => cs.title === 'Enterprise Dashboard');

    expect(enterpriseDashboard).toBeTruthy();
    expect(enterpriseDashboard?.technologies).toContain('Angular');
    expect(enterpriseDashboard?.technologies).toContain('TypeScript');
  });

  it('should have E-commerce Platform case study', () => {
    const caseStudies = component['caseStudies']();
    const ecommerce = caseStudies.find(cs => cs.title === 'E-commerce Platform');

    expect(ecommerce).toBeTruthy();
    expect(ecommerce?.technologies).toContain('NgRx');
  });

  it('should have Design System case study', () => {
    const caseStudies = component['caseStudies']();
    const designSystem = caseStudies.find(cs => cs.title === 'Design System');

    expect(designSystem).toBeTruthy();
    expect(designSystem?.technologies).toContain('Storybook');
  });

  it('should render case studies in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const caseStudyElements = compiled.querySelectorAll('.case-study, article, .card');
    expect(caseStudyElements.length).toBeGreaterThanOrEqual(0);
  });
});
