import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectStore } from './project.store';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { of, throwError } from 'rxjs';

describe('ProjectStore', () => {
  let store: InstanceType<typeof ProjectStore>;
  let projectService: ProjectService;

  const mockProjects: Project[] = [
    {
      id: 'project-1',
      title: 'Project 1',
      description: 'Description 1',
      tags: ['Angular', 'TypeScript'],
    },
    {
      id: 'project-2',
      title: 'Project 2',
      description: 'Description 2',
      tags: ['React', 'JavaScript'],
    },
    {
      id: 'project-3',
      title: 'Project 3',
      description: 'Description 3',
      tags: ['Angular', 'RxJS'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectStore, ProjectService, provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(ProjectStore);
    projectService = TestBed.inject(ProjectService);
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.projects()).toEqual([]);
      expect(store.selectedProject()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });

  describe('Computed Selectors', () => {
    beforeEach(() => {
      vi.spyOn(projectService, 'getProjects').mockReturnValue(of(mockProjects));
      store.loadProjects();
    });

    it('should compute project count', () => {
      expect(store.projectCount()).toBe(3);
    });

    it('should filter projects by tag', () => {
      const angularProjects = store.projectsByTag()('Angular');
      expect(angularProjects.length).toBe(2);
      expect(angularProjects[0].id).toBe('project-1');
      expect(angularProjects[1].id).toBe('project-3');
    });

    it('should compute hasSelection', () => {
      expect(store.hasSelection()).toBe(false);
      store.selectProject(mockProjects[0]);
      expect(store.hasSelection()).toBe(true);
    });

    it('should compute all unique tags', () => {
      const tags = store.allTags();
      expect(tags).toEqual(['Angular', 'JavaScript', 'React', 'RxJS', 'TypeScript']);
    });
  });

  describe('loadProjects', () => {
    it('should load projects successfully', () => {
      vi.spyOn(projectService, 'getProjects').mockReturnValue(of(mockProjects));

      store.loadProjects();

      expect(store.projects()).toEqual(mockProjects);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle loading state', () => {
      vi.spyOn(projectService, 'getProjects').mockReturnValue(of(mockProjects));

      store.loadProjects();

      expect(store.isLoading()).toBe(false);
    });

    it('should handle errors', () => {
      const errorMessage = 'Network error';
      vi.spyOn(projectService, 'getProjects').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      store.loadProjects();

      expect(store.projects()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(errorMessage);
    });
  });

  describe('loadProjectById', () => {
    it('should load and select project by id', () => {
      vi.spyOn(projectService, 'getProjectById').mockReturnValue(of(mockProjects[0]));

      store.loadProjectById('project-1');

      expect(store.selectedProject()).toEqual(mockProjects[0]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle project not found', () => {
      vi.spyOn(projectService, 'getProjectById').mockReturnValue(of(undefined));

      store.loadProjectById('non-existent');

      expect(store.selectedProject()).toBeNull();
      expect(store.error()).toContain('not found');
    });

    it('should handle errors when loading project', () => {
      const errorMessage = 'Failed to fetch';
      vi.spyOn(projectService, 'getProjectById').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      store.loadProjectById('project-1');

      expect(store.selectedProject()).toBeNull();
      expect(store.error()).toBe(errorMessage);
    });
  });

  describe('State Management Methods', () => {
    it('should clear selection', () => {
      store.selectProject(mockProjects[0]);
      expect(store.selectedProject()).toEqual(mockProjects[0]);

      store.clearSelection();
      expect(store.selectedProject()).toBeNull();
    });

    it('should manually select project', () => {
      store.selectProject(mockProjects[1]);
      expect(store.selectedProject()).toEqual(mockProjects[1]);
    });

    it('should clear error', () => {
      vi.spyOn(projectService, 'getProjects').mockReturnValue(
        throwError(() => new Error('Test error'))
      );
      store.loadProjects();
      expect(store.error()).toBeTruthy();

      store.clearError();
      expect(store.error()).toBeNull();
    });

    it('should reset store to initial state', () => {
      vi.spyOn(projectService, 'getProjects').mockReturnValue(of(mockProjects));
      store.loadProjects();
      store.selectProject(mockProjects[0]);

      expect(store.projects().length).toBeGreaterThan(0);
      expect(store.selectedProject()).not.toBeNull();

      store.reset();

      expect(store.projects()).toEqual([]);
      expect(store.selectedProject()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });
});
