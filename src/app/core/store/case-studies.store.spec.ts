import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import type { CaseStudy } from '../models/case-study.model';
import { CaseStudiesService } from '../services/case-studies.service';

import { CaseStudiesStore } from './case-studies.store';

describe('CaseStudiesStore', () => {
  let store: InstanceType<typeof CaseStudiesStore>;
  let caseStudiesService: CaseStudiesService;

  const mockCaseStudies: CaseStudy[] = [
    {
      id: 'cs-1',
      slug: 'case-study-1',
      title: 'Case Study 1',
      description: 'Description 1',
      client: 'Client 1',
      role: 'Developer',
      duration: '3 months',
      challenge: 'Challenge 1',
      solution: 'Solution 1',
      results: {
        metrics: [{ label: 'Metric 1', value: '+50%' }],
        impact: 'Impact 1',
      },
      technologies: ['Angular', 'TypeScript'],
      images: {
        thumbnail: '/thumb1.jpg',
        hero: '/hero1.jpg',
        gallery: [],
      },
      publishedDate: '2024-01-01',
      tags: ['Performance', 'UX'],
    },
    {
      id: 'cs-2',
      slug: 'case-study-2',
      title: 'Case Study 2',
      description: 'Description 2',
      client: 'Client 2',
      role: 'Lead Developer',
      duration: '6 months',
      challenge: 'Challenge 2',
      solution: 'Solution 2',
      results: {
        metrics: [{ label: 'Metric 2', value: '+75%' }],
        impact: 'Impact 2',
      },
      technologies: ['React', 'JavaScript'],
      images: {
        thumbnail: '/thumb2.jpg',
        hero: '/hero2.jpg',
        gallery: [],
      },
      publishedDate: '2024-02-01',
      tags: ['Real-Time', 'Collaboration'],
    },
    {
      id: 'cs-3',
      slug: 'case-study-3',
      title: 'Case Study 3',
      description: 'Description 3',
      client: 'Client 3',
      role: 'Senior Developer',
      duration: '4 months',
      challenge: 'Challenge 3',
      solution: 'Solution 3',
      results: {
        metrics: [{ label: 'Metric 3', value: '+60%' }],
        impact: 'Impact 3',
      },
      technologies: ['Angular', 'RxJS'],
      images: {
        thumbnail: '/thumb3.jpg',
        hero: '/hero3.jpg',
        gallery: [],
      },
      publishedDate: '2024-03-01',
      tags: ['Performance', 'Optimization'],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaseStudiesStore, CaseStudiesService, provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(CaseStudiesStore);
    caseStudiesService = TestBed.inject(CaseStudiesService);
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.caseStudies()).toEqual([]);
      expect(store.selectedCaseStudy()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });
  });

  describe('Computed Selectors', () => {
    beforeEach(() => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));
      store.loadCaseStudies();
    });

    it('should compute case study count', () => {
      expect(store.caseStudyCount()).toBe(3);
    });

    it('should filter case studies by technology', () => {
      const angularCaseStudies = store.caseStudiesByTechnology()('Angular');
      expect(angularCaseStudies.length).toBe(2);
      expect(angularCaseStudies[0].id).toBe('cs-1');
      expect(angularCaseStudies[1].id).toBe('cs-3');
    });

    it('should compute hasSelection', () => {
      expect(store.hasSelection()).toBe(false);
      vi.spyOn(caseStudiesService, 'getBySlug').mockReturnValue(of(mockCaseStudies[0]));
      store.selectCaseStudy('case-study-1');
      expect(store.hasSelection()).toBe(true);
    });

    it('should compute all unique technologies', () => {
      const technologies = store.allTechnologies();
      expect(technologies).toEqual(['Angular', 'JavaScript', 'React', 'RxJS', 'TypeScript']);
    });

    it('should compute all unique tags', () => {
      const tags = store.allTags();
      expect(tags).toEqual(['Collaboration', 'Optimization', 'Performance', 'Real-Time', 'UX']);
    });
  });

  describe('loadCaseStudies', () => {
    it('should load case studies successfully', () => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));

      store.loadCaseStudies();

      expect(store.caseStudies()).toEqual(mockCaseStudies);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle loading state', () => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));

      store.loadCaseStudies();

      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle errors', () => {
      const errorMessage = 'Network error';
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      store.loadCaseStudies();

      expect(store.caseStudies()).toEqual([]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBe(errorMessage);
    });
  });

  describe('selectCaseStudy', () => {
    it('should select a case study by slug', () => {
      vi.spyOn(caseStudiesService, 'getBySlug').mockReturnValue(of(mockCaseStudies[0]));

      store.selectCaseStudy('case-study-1');

      expect(store.selectedCaseStudy()).toEqual(mockCaseStudies[0]);
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle case study not found', () => {
      vi.spyOn(caseStudiesService, 'getBySlug').mockReturnValue(of(undefined));

      store.selectCaseStudy('non-existent');

      expect(store.selectedCaseStudy()).toBeNull();
      expect(store.error()).toBe('Case study "non-existent" not found');
    });

    it('should handle errors when selecting', () => {
      const errorMessage = 'Failed to fetch';
      vi.spyOn(caseStudiesService, 'getBySlug').mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      store.selectCaseStudy('case-study-1');

      expect(store.selectedCaseStudy()).toBeNull();
      expect(store.error()).toBe(errorMessage);
    });
  });

  describe('setSearchQuery', () => {
    beforeEach(() => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));
      store.loadCaseStudies();
    });

    it('should filter by search query in title', () => {
      store.setSearchQuery('Case Study 1');
      const filtered = store.filteredCaseStudies();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('cs-1');
    });

    it('should filter by search query in client', () => {
      store.setSearchQuery('Client 2');
      const filtered = store.filteredCaseStudies();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('cs-2');
    });

    it('should filter by technology', () => {
      store.setSearchQuery('Angular');
      const filtered = store.filteredCaseStudies();
      expect(filtered.length).toBe(2);
    });

    it('should be case insensitive', () => {
      store.setSearchQuery('ANGULAR');
      const filtered = store.filteredCaseStudies();
      expect(filtered.length).toBe(2);
    });

    it('should return all when query is empty', () => {
      store.setSearchQuery('');
      expect(store.filteredCaseStudies().length).toBe(3);
    });
  });

  describe('toggleTag', () => {
    beforeEach(() => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));
      store.loadCaseStudies();
    });

    it('should add a tag', () => {
      store.toggleTag('Angular');
      expect(store.selectedTags()).toContain('Angular');
    });

    it('should remove a tag when toggled again', () => {
      store.toggleTag('Angular');
      expect(store.selectedTags()).toContain('Angular');
      store.toggleTag('Angular');
      expect(store.selectedTags()).not.toContain('Angular');
    });

    it('should filter by selected tags', () => {
      store.toggleTag('Performance');
      const filtered = store.filteredCaseStudies();
      expect(filtered.length).toBe(2);
      expect(filtered.every((cs) => cs.tags?.includes('Performance'))).toBe(true);
    });
  });

  describe('clearFilters', () => {
    beforeEach(() => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));
      store.loadCaseStudies();
    });

    it('should clear search query and tags', () => {
      store.setSearchQuery('Angular');
      store.toggleTag('Performance');
      store.clearFilters();

      expect(store.searchQuery()).toBe('');
      expect(store.selectedTags()).toEqual([]);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters are active', () => {
      expect(store.hasActiveFilters()).toBe(false);
    });

    it('should return true when search query is set', () => {
      store.setSearchQuery('test');
      expect(store.hasActiveFilters()).toBe(true);
    });

    it('should return true when tags are selected', () => {
      store.toggleTag('Angular');
      expect(store.hasActiveFilters()).toBe(true);
    });
  });

  describe('clearSelection', () => {
    it('should clear selected case study', () => {
      vi.spyOn(caseStudiesService, 'getBySlug').mockReturnValue(of(mockCaseStudies[0]));
      store.selectCaseStudy('case-study-1');
      expect(store.selectedCaseStudy()).not.toBeNull();

      store.clearSelection();
      expect(store.selectedCaseStudy()).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(
        throwError(() => new Error('Test error'))
      );
      store.loadCaseStudies();
      expect(store.error()).not.toBeNull();

      store.clearError();
      expect(store.error()).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', () => {
      vi.spyOn(caseStudiesService, 'getAll').mockReturnValue(of(mockCaseStudies));
      store.loadCaseStudies();
      store.setSearchQuery('test');

      store.reset();

      expect(store.caseStudies()).toEqual([]);
      expect(store.selectedCaseStudy()).toBeNull();
      expect(store.isLoading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.searchQuery()).toBe('');
      expect(store.selectedTags()).toEqual([]);
    });
  });
});
