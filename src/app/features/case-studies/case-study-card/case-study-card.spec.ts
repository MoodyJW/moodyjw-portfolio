import { provideLocationMocks } from '@angular/common/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import type { CaseStudy } from '@core/models/case-study.model';

import { CaseStudyCard } from './case-study-card';

describe('CaseStudyCard', () => {
  let component: CaseStudyCard;
  let fixture: ComponentFixture<CaseStudyCard>;

  const mockCaseStudy: CaseStudy = {
    id: '1',
    slug: 'test-case-study',
    title: 'Test Case Study',
    description: 'A detailed case study description for testing purposes.',
    client: 'Test Client Corp',
    role: 'Lead Developer',
    duration: '6 months',
    challenge: 'Test challenge description',
    solution: 'Test solution description',
    results: {
      metrics: [
        { label: 'Test Metric', value: '+50%' },
      ],
      impact: 'Test impact description',
    },
    technologies: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Playwright'],
    images: {
      thumbnail: 'test-image.jpg',
      hero: 'test-hero.jpg',
      gallery: [],
    },
    tags: ['Frontend', 'Performance'],
    publishedDate: '2024-03-15',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudyCard],
      providers: [
        provideLocationMocks(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudyCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('caseStudy', mockCaseStudy);
    fixture.componentRef.setInput('selectedTags', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Properties', () => {
    it('should compute displayTechs correctly (first 3 technologies)', () => {
      const displayTechs = component['displayTechs']();
      expect(displayTechs).toEqual(['Angular', 'TypeScript', 'RxJS']);
    });

    it('should compute displayTechs with fewer than 3 technologies', () => {
      const caseStudyWith2Techs = { ...mockCaseStudy, technologies: ['Angular', 'TypeScript'] };
      fixture.componentRef.setInput('caseStudy', caseStudyWith2Techs);
      fixture.detectChanges();

      const displayTechs = component['displayTechs']();
      expect(displayTechs).toEqual(['Angular', 'TypeScript']);
    });

    it('should compute remainingTechCount correctly', () => {
      const remainingCount = component['remainingTechCount']();
      expect(remainingCount).toBe(2); // 5 total - 3 displayed = 2 remaining
    });

    it('should compute remainingTechCount as 0 when 3 or fewer techs', () => {
      const caseStudyWith3Techs = {
        ...mockCaseStudy,
        technologies: ['Angular', 'TypeScript', 'SCSS'],
      };
      fixture.componentRef.setInput('caseStudy', caseStudyWith3Techs);
      fixture.detectChanges();

      const remainingCount = component['remainingTechCount']();
      expect(remainingCount).toBe(0);
    });

    it('should compute remainingTechCount correctly with many technologies', () => {
      const caseStudyWithManyTechs = {
        ...mockCaseStudy,
        technologies: [
          'Angular',
          'TypeScript',
          'RxJS',
          'SCSS',
          'Playwright',
          'Storybook',
          'Vitest',
          'NgRx',
        ],
      };
      fixture.componentRef.setInput('caseStudy', caseStudyWithManyTechs);
      fixture.detectChanges();

      const remainingCount = component['remainingTechCount']();
      expect(remainingCount).toBe(5); // 8 total - 3 displayed = 5 remaining
    });
  });

  describe('Tag Selection', () => {
    it('should return true for selected tags', () => {
      fixture.componentRef.setInput('selectedTags', ['Angular', 'TypeScript']);
      fixture.detectChanges();

      expect(component.isTagSelected('Angular')).toBe(true);
      expect(component.isTagSelected('TypeScript')).toBe(true);
    });

    it('should return false for non-selected tags', () => {
      fixture.componentRef.setInput('selectedTags', ['Angular']);
      fixture.detectChanges();

      expect(component.isTagSelected('TypeScript')).toBe(false);
      expect(component.isTagSelected('RxJS')).toBe(false);
    });

    it('should return false when no tags are selected', () => {
      fixture.componentRef.setInput('selectedTags', []);
      fixture.detectChanges();

      expect(component.isTagSelected('Angular')).toBe(false);
      expect(component.isTagSelected('TypeScript')).toBe(false);
    });

    it('should handle empty selectedTags array', () => {
      expect(component.isTagSelected('Angular')).toBe(false);
    });
  });

  describe('Case Study Route', () => {
    it('should generate correct case study route', () => {
      expect(component.getCaseStudyRoute()).toBe('/case-studies/test-case-study');
    });

    it('should generate route based on case study slug', () => {
      const differentCaseStudy = { ...mockCaseStudy, slug: 'enterprise-dashboard-redesign' };
      fixture.componentRef.setInput('caseStudy', differentCaseStudy);
      fixture.detectChanges();

      expect(component.getCaseStudyRoute()).toBe('/case-studies/enterprise-dashboard-redesign');
    });

    it('should handle slugs with special characters', () => {
      const caseStudyWithSpecialSlug = { ...mockCaseStudy, slug: 'my-awesome-project-v2' };
      fixture.componentRef.setInput('caseStudy', caseStudyWithSpecialSlug);
      fixture.detectChanges();

      expect(component.getCaseStudyRoute()).toBe('/case-studies/my-awesome-project-v2');
    });
  });

  describe('Tag Click Event', () => {
    it('should emit tagClick event with correct tag', () => {
      const emitSpy = vi.spyOn(component.tagClick, 'emit');

      component.onTagClick('Angular');

      expect(emitSpy).toHaveBeenCalledWith('Angular');
    });

    it('should emit tagClick for different tags', () => {
      const emitSpy = vi.spyOn(component.tagClick, 'emit');

      component.onTagClick('TypeScript');
      component.onTagClick('RxJS');

      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).toHaveBeenNthCalledWith(1, 'TypeScript');
      expect(emitSpy).toHaveBeenNthCalledWith(2, 'RxJS');
    });

    it('should emit tagClick event independently', () => {
      const emitSpy = vi.spyOn(component.tagClick, 'emit');

      component.onTagClick('SCSS');

      expect(emitSpy).toHaveBeenCalledOnce();
      expect(emitSpy).toHaveBeenCalledWith('SCSS');
    });
  });

  describe('Input Changes', () => {
    it('should react to caseStudy input changes', () => {
      const newCaseStudy = {
        ...mockCaseStudy,
        title: 'New Title',
        slug: 'new-slug',
        client: 'New Client',
      };
      fixture.componentRef.setInput('caseStudy', newCaseStudy);
      fixture.detectChanges();

      expect(component.getCaseStudyRoute()).toBe('/case-studies/new-slug');
    });

    it('should react to selectedTags input changes', () => {
      expect(component.isTagSelected('Angular')).toBe(false);

      fixture.componentRef.setInput('selectedTags', ['Angular']);
      fixture.detectChanges();

      expect(component.isTagSelected('Angular')).toBe(true);
    });

    it('should update displayTechs when technologies change', () => {
      const newCaseStudy = {
        ...mockCaseStudy,
        technologies: ['React', 'Vue', 'Svelte', 'Next.js'],
      };
      fixture.componentRef.setInput('caseStudy', newCaseStudy);
      fixture.detectChanges();

      const displayTechs = component['displayTechs']();
      expect(displayTechs).toEqual(['React', 'Vue', 'Svelte']);
    });

    it('should update remainingTechCount when technologies change', () => {
      const newCaseStudy = {
        ...mockCaseStudy,
        technologies: ['React', 'Vue'],
      };
      fixture.componentRef.setInput('caseStudy', newCaseStudy);
      fixture.detectChanges();

      const remainingCount = component['remainingTechCount']();
      expect(remainingCount).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle case study with no technologies', () => {
      const caseStudyWithNoTechs = { ...mockCaseStudy, technologies: [] };
      fixture.componentRef.setInput('caseStudy', caseStudyWithNoTechs);
      fixture.detectChanges();

      const displayTechs = component['displayTechs']();
      const remainingCount = component['remainingTechCount']();

      expect(displayTechs).toEqual([]);
      expect(remainingCount).toBe(0);
    });

    it('should handle case study with exactly 3 technologies', () => {
      const caseStudyWith3Techs = {
        ...mockCaseStudy,
        technologies: ['Angular', 'TypeScript', 'SCSS'],
      };
      fixture.componentRef.setInput('caseStudy', caseStudyWith3Techs);
      fixture.detectChanges();

      const displayTechs = component['displayTechs']();
      const remainingCount = component['remainingTechCount']();

      expect(displayTechs).toEqual(['Angular', 'TypeScript', 'SCSS']);
      expect(remainingCount).toBe(0);
    });

    it('should handle case study with single technology', () => {
      const caseStudyWith1Tech = { ...mockCaseStudy, technologies: ['Angular'] };
      fixture.componentRef.setInput('caseStudy', caseStudyWith1Tech);
      fixture.detectChanges();

      const displayTechs = component['displayTechs']();
      const remainingCount = component['remainingTechCount']();

      expect(displayTechs).toEqual(['Angular']);
      expect(remainingCount).toBe(0);
    });
  });
});
