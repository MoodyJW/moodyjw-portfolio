import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService],
    });

    service = TestBed.inject(ProjectService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all projects', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should return projects with all required fields', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const project = projects[0];
      expect(project.id).toBeDefined();
      expect(project.slug).toBeDefined();
      expect(project.title).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.shortDescription).toBeDefined();
      expect(project.technologies).toBeDefined();
      expect(project.category).toBeDefined();
      expect(project.featured).toBeDefined();
      expect(project.images).toBeDefined();
      expect(project.links).toBeDefined();
      expect(project.createdDate).toBeDefined();
    });

    it('should return projects with valid image structure', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const project = projects[0];
      expect(project.images.thumbnail).toBeDefined();
      expect(project.images.hero).toBeDefined();
      expect(Array.isArray(project.images.gallery)).toBe(true);
    });

    it('should return projects with valid technologies array', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const project = projects[0];
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(typeof project.technologies[0]).toBe('string');
    });
  });

  describe('getBySlug', () => {
    it('should return a project by slug', async () => {
      const promise = firstValueFrom(service.getBySlug('angular-portfolio'));
      vi.advanceTimersByTime(500);
      const project = await promise;

      expect(project).toBeDefined();
      expect(project?.slug).toBe('angular-portfolio');
      expect(project?.title).toBeDefined();
    });

    it('should return undefined for non-existent slug', async () => {
      const promise = firstValueFrom(service.getBySlug('non-existent-project'));
      vi.advanceTimersByTime(500);
      const project = await promise;

      expect(project).toBeUndefined();
    });

    it('should be case-sensitive for slug matching', async () => {
      const promise = firstValueFrom(service.getBySlug('ANGULAR-PORTFOLIO'));
      vi.advanceTimersByTime(500);
      const project = await promise;

      expect(project).toBeUndefined();
    });

    it('should return project with all required fields', async () => {
      const promise = firstValueFrom(service.getBySlug('angular-portfolio'));
      vi.advanceTimersByTime(500);
      const project = await promise;

      expect(project?.id).toBeDefined();
      expect(project?.slug).toBe('angular-portfolio');
      expect(project?.title).toBeDefined();
      expect(project?.description).toBeDefined();
      expect(project?.technologies).toBeDefined();
    });
  });

  describe('getFeatured', () => {
    it('should return only featured projects', async () => {
      const promise = firstValueFrom(service.getFeatured());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      projects.forEach((project) => {
        expect(project.featured).toBe(true);
      });
    });

    it('should return fewer projects than getAll', async () => {
      const allPromise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const allProjects = await allPromise;

      const featuredPromise = firstValueFrom(service.getFeatured());
      vi.advanceTimersByTime(500);
      const featuredProjects = await featuredPromise;

      expect(featuredProjects.length).toBeLessThanOrEqual(allProjects.length);
      expect(featuredProjects.length).toBeGreaterThan(0);
    });

    it('should return featured projects with all required fields', async () => {
      const promise = firstValueFrom(service.getFeatured());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const project = projects[0];
      expect(project.id).toBeDefined();
      expect(project.slug).toBeDefined();
      expect(project.title).toBeDefined();
      expect(project.featured).toBe(true);
    });
  });

  describe('Legacy Methods', () => {
    describe('getProjects (deprecated)', () => {
      it('should return all projects', async () => {
        const promise = firstValueFrom(service.getProjects());
        vi.advanceTimersByTime(500);
        const projects = await promise;

        expect(projects).toBeDefined();
        expect(Array.isArray(projects)).toBe(true);
        expect(projects.length).toBeGreaterThan(0);
      });

      it('should return same data as getAll', async () => {
        const allPromise = firstValueFrom(service.getAll());
        vi.advanceTimersByTime(500);
        const allProjects = await allPromise;

        const legacyPromise = firstValueFrom(service.getProjects());
        vi.advanceTimersByTime(500);
        const legacyProjects = await legacyPromise;

        expect(legacyProjects).toEqual(allProjects);
      });
    });

    describe('getProjectById (deprecated)', () => {
      it('should return a project by id', async () => {
        const promise = firstValueFrom(service.getProjectById('1'));
        vi.advanceTimersByTime(500);
        const project = await promise;

        expect(project).toBeDefined();
        expect(project?.id).toBe('1');
      });

      it('should return undefined for non-existent id', async () => {
        const promise = firstValueFrom(service.getProjectById('non-existent'));
        vi.advanceTimersByTime(500);
        const project = await promise;

        expect(project).toBeUndefined();
      });
    });
  });

  describe('Data Validation', () => {
    it('should have unique project IDs', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const ids = projects.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique project slugs', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const slugs = projects.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid date formats', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      projects.forEach((project) => {
        const date = new Date(project.createdDate);
        expect(date instanceof Date && !isNaN(date.getTime())).toBe(true);
      });
    });

    it('should have non-empty titles', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      projects.forEach((project) => {
        expect(project.title.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty descriptions', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      projects.forEach((project) => {
        expect(project.description.length).toBeGreaterThan(0);
      });
    });

    it('should have at least one technology per project', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      projects.forEach((project) => {
        expect(project.technologies.length).toBeGreaterThan(0);
      });
    });

    it('should have valid category values', async () => {
      const promise = firstValueFrom(service.getAll());
      vi.advanceTimersByTime(500);
      const projects = await promise;

      const validCategories = ['Web App', 'Mobile App', 'Library', 'Tool', 'Demo'];
      projects.forEach((project) => {
        expect(validCategories).toContain(project.category);
      });
    });
  });
});
