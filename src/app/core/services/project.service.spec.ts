import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { Project } from '../models/project.model';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  const mockProjects: Project[] = [
    {
      id: 'test-1',
      slug: 'test-project-1',
      title: 'Test Project 1',
      description: 'Test description 1',
      shortDescription: 'Short description 1',
      technologies: ['Angular', 'TypeScript'],
      category: 'Web App',
      featured: true,
      images: {
        thumbnail: '/assets/images/test-1-thumb.jpg',
        hero: '/assets/images/test-1-hero.jpg',
        gallery: [],
      },
      links: {},
      createdDate: '2024-01-01',
    },
    {
      id: 'test-2',
      slug: 'test-project-2',
      title: 'Test Project 2',
      description: 'Test description 2',
      shortDescription: 'Short description 2',
      technologies: ['React', 'JavaScript'],
      category: 'Mobile App',
      featured: false,
      images: {
        thumbnail: '/assets/images/test-2-thumb.jpg',
        hero: '/assets/images/test-2-hero.jpg',
        gallery: [],
      },
      links: {},
      createdDate: '2024-02-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProjects', () => {
    it('should fetch all projects', () => {
      service.getProjects().subscribe({
        next: (projects) => {
          expect(projects).toEqual(mockProjects);
          expect(projects.length).toBe(2);
        },
      });

      const req = httpMock.expectOne('/assets/data/projects.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockProjects);
    });

    it('should handle error when fetching projects', () => {
      service.getProjects().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('/assets/data/projects.json');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getProjectById', () => {
    it('should fetch a project by id', () => {
      service.getProjectById('test-1').subscribe({
        next: (project) => {
          expect(project).toEqual(mockProjects[0]);
          expect(project?.id).toBe('test-1');
        },
      });

      const req = httpMock.expectOne('/assets/data/projects.json');
      req.flush(mockProjects);
    });

    it('should return undefined when project is not found', () => {
      service.getProjectById('non-existent').subscribe({
        next: (project) => {
          expect(project).toBeUndefined();
        },
      });

      const req = httpMock.expectOne('/assets/data/projects.json');
      req.flush(mockProjects);
    });

    it('should handle error when fetching project by id', () => {
      service.getProjectById('test-1').subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('/assets/data/projects.json');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
