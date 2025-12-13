import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { CaseStudiesService } from './case-studies.service';

describe('CaseStudiesService', () => {
  let service: CaseStudiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaseStudiesService],
    });

    service = TestBed.inject(CaseStudiesService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all case studies', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      expect(caseStudies).toBeDefined();
      expect(Array.isArray(caseStudies)).toBe(true);
      expect(caseStudies.length).toBeGreaterThan(0);
    });

    it('should return case studies with all required fields', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const caseStudy = caseStudies[0];
      expect(caseStudy.id).toBeDefined();
      expect(caseStudy.slug).toBeDefined();
      expect(caseStudy.title).toBeDefined();
      expect(caseStudy.description).toBeDefined();
      expect(caseStudy.client).toBeDefined();
      expect(caseStudy.role).toBeDefined();
      expect(caseStudy.duration).toBeDefined();
      expect(caseStudy.challenge).toBeDefined();
      expect(caseStudy.solution).toBeDefined();
      expect(caseStudy.results).toBeDefined();
      expect(caseStudy.technologies).toBeDefined();
      expect(caseStudy.images).toBeDefined();
      expect(caseStudy.publishedDate).toBeDefined();
    });

    it('should return case studies with valid results structure', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const caseStudy = caseStudies[0];
      expect(caseStudy.results.metrics).toBeDefined();
      expect(Array.isArray(caseStudy.results.metrics)).toBe(true);
      expect(caseStudy.results.impact).toBeDefined();
      expect(caseStudy.results.metrics.length).toBeGreaterThan(0);
    });

    it('should return case studies with valid image structure', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const caseStudy = caseStudies[0];
      expect(caseStudy.images.thumbnail).toBeDefined();
      expect(caseStudy.images.hero).toBeDefined();
      expect(Array.isArray(caseStudy.images.gallery)).toBe(true);
    });

    it('should return case studies with valid technologies array', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const caseStudy = caseStudies[0];
      expect(Array.isArray(caseStudy.technologies)).toBe(true);
      expect(caseStudy.technologies.length).toBeGreaterThan(0);
      expect(typeof caseStudy.technologies[0]).toBe('string');
    });
  });

  describe('getBySlug', () => {
    it('should return a case study by slug', async () => {
      const promise = firstValueFrom(service.getBySlug('enterprise-dashboard-redesign'));
      vi.advanceTimersByTime(500);
      const caseStudy = await promise;

      expect(caseStudy).toBeDefined();
      expect(caseStudy?.slug).toBe('enterprise-dashboard-redesign');
      expect(caseStudy?.title).toBeDefined();
    });

    it('should return undefined for non-existent slug', async () => {
      const promise = firstValueFrom(service.getBySlug('non-existent-case-study'));
      vi.advanceTimersByTime(500);
      const caseStudy = await promise;

      expect(caseStudy).toBeUndefined();
    });

    it('should be case-sensitive for slug matching', async () => {
      const promise = firstValueFrom(service.getBySlug('ENTERPRISE-DASHBOARD-REDESIGN'));
      vi.advanceTimersByTime(500);
      const caseStudy = await promise;

      expect(caseStudy).toBeUndefined();
    });

    it('should return case study with all required fields', async () => {
      const promise = firstValueFrom(service.getBySlug('enterprise-dashboard-redesign'));
      vi.advanceTimersByTime(500);
      const caseStudy = await promise;

      expect(caseStudy?.id).toBeDefined();
      expect(caseStudy?.slug).toBe('enterprise-dashboard-redesign');
      expect(caseStudy?.title).toBeDefined();
      expect(caseStudy?.description).toBeDefined();
      expect(caseStudy?.client).toBeDefined();
      expect(caseStudy?.challenge).toBeDefined();
      expect(caseStudy?.solution).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should have unique case study IDs', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const ids = caseStudies.map((cs) => cs.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique case study slugs', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const slugs = caseStudies.map((cs) => cs.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid date formats', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      caseStudies.forEach((caseStudy) => {
        const date = new Date(caseStudy.publishedDate);
        expect(date instanceof Date && !isNaN(date.getTime())).toBe(true);
      });
    });

    it('should have non-empty titles', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      caseStudies.forEach((caseStudy) => {
        expect(caseStudy.title.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty descriptions', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      caseStudies.forEach((caseStudy) => {
        expect(caseStudy.description.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one technology per case study', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      caseStudies.forEach((caseStudy) => {
        expect(caseStudy.technologies.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one metric in results', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      caseStudies.forEach((caseStudy) => {
        expect(caseStudy.results.metrics.length).toBeGreaterThan(0);
      });
    });

    it('should have valid metric structure', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const caseStudies = await promise;

      const caseStudy = caseStudies[0];
      const metric = caseStudy.results.metrics[0];
      expect(metric.label).toBeDefined();
      expect(metric.value).toBeDefined();
      expect(typeof metric.label).toBe('string');
      expect(typeof metric.value).toBe('string');
    });
  });
});
