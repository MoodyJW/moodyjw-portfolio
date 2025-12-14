import { provideLocationMocks } from '@angular/common/testing';
import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import type { CaseStudy } from '@core/models/case-study.model';
import { CaseStudiesStore } from '@core/store/case-studies.store';

import { CaseStudiesComponent } from './case-studies.component';

describe('CaseStudiesComponent', () => {
  let component: CaseStudiesComponent;
  let fixture: ComponentFixture<CaseStudiesComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStore: any;

  const mockCaseStudies: CaseStudy[] = [
    {
      id: '1',
      slug: 'enterprise-dashboard',
      title: 'Enterprise Dashboard Redesign',
      description: 'Led the complete overhaul of a legacy enterprise dashboard.',
      client: 'Tech Corp',
      role: 'Lead Frontend Developer',
      duration: '6 months',
      challenge: 'Legacy dashboard with poor performance',
      solution: 'Rebuilt with modern Angular and state management',
      results: {
        metrics: [{ label: 'Performance', value: '+60%' }],
        impact: 'Improved user satisfaction',
      },
      technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
      images: {
        thumbnail: 'dashboard.jpg',
        hero: 'dashboard-hero.jpg',
        gallery: [],
      },
      tags: ['Frontend', 'Performance'],
      publishedDate: '2024-03-15',
    },
    {
      id: '2',
      slug: 'mobile-app-development',
      title: 'Healthcare Mobile App',
      description: 'Built a HIPAA-compliant mobile app for patient engagement.',
      client: 'MedTech Solutions',
      role: 'Senior Developer',
      duration: '9 months',
      challenge: 'Build HIPAA-compliant mobile application',
      solution: 'Implemented secure architecture with React Native',
      results: {
        metrics: [{ label: 'Users', value: '50K+' }],
        impact: 'Improved patient engagement',
      },
      technologies: ['React Native', 'Node.js', 'PostgreSQL'],
      images: {
        thumbnail: 'mobile.jpg',
        hero: 'mobile-hero.jpg',
        gallery: [],
      },
      tags: ['Mobile', 'Security'],
      publishedDate: '2024-02-01',
    },
    {
      id: '3',
      slug: 'api-migration',
      title: 'API Migration & Modernization',
      description: 'Migrated a monolithic REST API to microservices architecture.',
      client: 'FinanceApp Inc',
      role: 'Backend Architect',
      duration: '4 months',
      challenge: 'Monolithic API with scalability issues',
      solution: 'Migrated to microservices with GraphQL',
      results: {
        metrics: [{ label: 'Scalability', value: '10x' }],
        impact: 'Reduced deployment times',
      },
      technologies: ['Node.js', 'Docker', 'Kubernetes', 'GraphQL'],
      images: {
        thumbnail: 'api.jpg',
        hero: 'api-hero.jpg',
        gallery: [],
      },
      tags: ['Backend', 'DevOps'],
      publishedDate: '2023-12-10',
    },
  ];

  beforeEach(async () => {
    // Create mock store with signals
    mockStore = {
      filteredCaseStudies: signal(mockCaseStudies),
      selectedTags: signal([]),
      searchQuery: signal(''),
      isLoading: signal(false),
      error: signal(null),
      loadCaseStudies: vi.fn(),
      setSearchQuery: vi.fn(),
      toggleTag: vi.fn(),
      clearFilters: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CaseStudiesComponent],
      providers: [
        provideLocationMocks(),
        { provide: CaseStudiesStore, useValue: mockStore },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load case studies on init', () => {
      expect(mockStore.loadCaseStudies).toHaveBeenCalled();
    });

    it('should have correct breadcrumb items', () => {
      expect(component['breadcrumbs']).toEqual([
        { label: 'Home', url: '/' },
        { label: 'Case Studies', url: '/case-studies' },
      ]);
    });
  });

  describe('Search Functionality', () => {
    it('should update local search query on input', async () => {
      vi.useFakeTimers();
      component.onSearchChange('angular');
      await vi.advanceTimersByTimeAsync(350);
      expect(component['localSearchQuery']()).toBe('angular');
      vi.useRealTimers();
    });

    it('should debounce search query updates', async () => {
      vi.useFakeTimers();
      component.onSearchChange('dashboard');
      expect(mockStore.setSearchQuery).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(350);
      expect(mockStore.setSearchQuery).toHaveBeenCalledWith('dashboard');
      vi.useRealTimers();
    });

    it('should update store search query after debounce delay', async () => {
      vi.useFakeTimers();
      component.onSearchChange('React');

      await vi.advanceTimersByTimeAsync(100);
      expect(mockStore.setSearchQuery).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(250);
      expect(mockStore.setSearchQuery).toHaveBeenCalledWith('React');
      vi.useRealTimers();
    });

    it('should handle multiple rapid search changes with debouncing', async () => {
      vi.useFakeTimers();
      component.onSearchChange('a');
      await vi.advanceTimersByTimeAsync(100);
      component.onSearchChange('an');
      await vi.advanceTimersByTimeAsync(100);
      component.onSearchChange('ang');
      await vi.advanceTimersByTimeAsync(100);

      expect(mockStore.setSearchQuery).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(250);
      expect(mockStore.setSearchQuery).toHaveBeenCalledOnce();
      expect(mockStore.setSearchQuery).toHaveBeenCalledWith('ang');
      vi.useRealTimers();
    });
  });

  describe('Tag Filtering', () => {
    it('should call store toggleTag when tag is clicked', () => {
      component.onToggleTag('Angular');
      expect(mockStore.toggleTag).toHaveBeenCalledWith('Angular');
    });

    it('should call toggleTag with different tags', () => {
      component.onToggleTag('TypeScript');
      component.onToggleTag('RxJS');
      expect(mockStore.toggleTag).toHaveBeenCalledTimes(2);
      expect(mockStore.toggleTag).toHaveBeenNthCalledWith(1, 'TypeScript');
      expect(mockStore.toggleTag).toHaveBeenNthCalledWith(2, 'RxJS');
    });
  });

  describe('Active Filters', () => {
    it('should compute active filter count with search query', () => {
      mockStore.searchQuery.set('test');
      mockStore.selectedTags.set([]);
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(1);
    });

    it('should compute active filter count with tags', () => {
      mockStore.searchQuery.set('');
      mockStore.selectedTags.set(['Angular', 'TypeScript']);
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(2);
    });

    it('should compute active filter count with both search and tags', () => {
      mockStore.searchQuery.set('dashboard');
      mockStore.selectedTags.set(['Angular', 'TypeScript', 'RxJS']);
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(4); // 1 search + 3 tags
    });

    it('should compute zero active filters when none are set', () => {
      mockStore.searchQuery.set('');
      mockStore.selectedTags.set([]);
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(0);
    });

    it('should clear all filters when clear button is clicked', () => {
      component.onClearFilters();
      expect(mockStore.clearFilters).toHaveBeenCalled();
      expect(component['localSearchQuery']()).toBe('');
    });

    it('should reset local search query to empty string on clear', () => {
      component['localSearchQuery'].set('previous search');
      component.onClearFilters();
      expect(component['localSearchQuery']()).toBe('');
    });
  });

  describe('Store Integration', () => {
    it('should use filteredCaseStudies from store', () => {
      expect(component['store'].filteredCaseStudies()).toEqual(mockCaseStudies);
    });

    it('should use selectedTags from store', () => {
      mockStore.selectedTags.set(['Angular']);
      expect(component['store'].selectedTags()).toEqual(['Angular']);
    });

    it('should use searchQuery from store', () => {
      mockStore.searchQuery.set('test query');
      expect(component['store'].searchQuery()).toBe('test query');
    });

    it('should use isLoading from store', () => {
      mockStore.isLoading.set(true);
      expect(component['store'].isLoading()).toBe(true);
    });

    it('should use error from store', () => {
      mockStore.error.set('Error loading case studies');
      expect(component['store'].error()).toBe('Error loading case studies');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search query', async () => {
      vi.useFakeTimers();
      component.onSearchChange('');
      await vi.advanceTimersByTimeAsync(350);
      expect(component['localSearchQuery']()).toBe('');
      vi.useRealTimers();
    });

    it('should handle whitespace-only search query', async () => {
      vi.useFakeTimers();
      component.onSearchChange('   ');
      await vi.advanceTimersByTimeAsync(350);
      expect(component['localSearchQuery']()).toBe('   ');
      vi.useRealTimers();
    });

    it('should handle empty case studies array', () => {
      mockStore.filteredCaseStudies.set([]);
      fixture.detectChanges();
      expect(component['store'].filteredCaseStudies()).toEqual([]);
    });

    it('should handle loading state', () => {
      mockStore.isLoading.set(true);
      fixture.detectChanges();
      expect(component['store'].isLoading()).toBe(true);
    });

    it('should handle error state', () => {
      mockStore.error.set('Failed to load');
      fixture.detectChanges();
      expect(component['store'].error()).toBe('Failed to load');
    });
  });

  describe('Computed Properties', () => {
    it('should compute activeFilterCount reactively', () => {
      expect(component['activeFilterCount']()).toBe(0);

      mockStore.searchQuery.set('test');
      fixture.detectChanges();
      expect(component['activeFilterCount']()).toBe(1);

      mockStore.selectedTags.set(['Angular']);
      fixture.detectChanges();
      expect(component['activeFilterCount']()).toBe(2);

      mockStore.searchQuery.set('');
      fixture.detectChanges();
      expect(component['activeFilterCount']()).toBe(1);
    });
  });

  describe('Local State Management', () => {
    it('should maintain independent local search query', () => {
      component['localSearchQuery'].set('local query');
      expect(component['localSearchQuery']()).toBe('local query');
      expect(mockStore.searchQuery()).toBe('');
    });

    it('should sync local query to store after debounce', async () => {
      vi.useFakeTimers();
      component.onSearchChange('synced query');
      expect(component['localSearchQuery']()).toBe(''); // Not yet set, still debouncing
      expect(mockStore.setSearchQuery).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(350);
      expect(component['localSearchQuery']()).toBe('synced query'); // Now it's set
      expect(mockStore.setSearchQuery).toHaveBeenCalledWith('synced query');
      vi.useRealTimers();
    });
  });
});
