import { provideLocationMocks } from '@angular/common/testing';
import { signal } from '@angular/core';
import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { Project } from '@core/models/project.model';
import { type ProjectSortBy,ProjectStore } from '@core/store/project.store';

import { ProjectsList } from './projects-list';

describe('ProjectsList', () => {
  let component: ProjectsList;
  let fixture: ComponentFixture<ProjectsList>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStore: any;

  const mockProjects: Project[] = [
    {
      id: '1',
      slug: 'project-1',
      title: 'Angular Portfolio',
      shortDescription: 'A portfolio built with Angular',
      description: 'Full description',
      category: 'Web Development',
      technologies: ['Angular', 'TypeScript', 'SCSS'],
      images: {
        thumbnail: 'image1.jpg',
        hero: 'hero1.jpg',
        gallery: [],
      },
      links: { live: 'https://example.com', github: 'https://github.com/test' },
      githubStars: 50,
      metadata: { status: 'Active' as const, teamSize: 'Solo' },
      featured: true,
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      slug: 'project-2',
      title: 'React Dashboard',
      shortDescription: 'Analytics dashboard in React',
      description: 'Full description',
      category: 'Web Development',
      technologies: ['React', 'JavaScript', 'CSS'],
      images: {
        thumbnail: 'image2.jpg',
        hero: 'hero2.jpg',
        gallery: [],
      },
      links: { live: 'https://example2.com' },
      githubStars: 100,
      featured: false,
      createdDate: '2024-02-01',
    },
    {
      id: '3',
      slug: 'project-3',
      title: 'Mobile App',
      shortDescription: 'Cross-platform mobile app',
      description: 'Full description',
      category: 'Mobile',
      technologies: ['React Native', 'TypeScript'],
      images: {
        thumbnail: 'image3.jpg',
        hero: 'hero3.jpg',
        gallery: [],
      },
      links: { github: 'https://github.com/test2' },
      githubStars: 25,
      featured: false,
      createdDate: '2024-03-01',
    },
  ];

  beforeEach(async () => {
    // Create mock store with signals
    mockStore = {
      filteredProjects: signal(mockProjects),
      allCategories: signal(['Web Development', 'Mobile']),
      selectedTags: signal([]),
      searchQuery: signal(''),
      sortBy: signal('recent' as ProjectSortBy),
      isLoading: signal(false),
      error: signal(null),
      loadProjects: vi.fn(),
      setSearchQuery: vi.fn(),
      toggleTag: vi.fn(),
      setSortBy: vi.fn(),
      clearFilters: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectsList],
      providers: [provideLocationMocks(), { provide: ProjectStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load projects on init', () => {
      expect(mockStore.loadProjects).toHaveBeenCalled();
    });

    it('should have correct breadcrumb items', () => {
      expect(component['breadcrumbs']).toEqual([
        { label: 'Home', url: '/' },
        { label: 'Projects', url: '/projects' },
      ]);
    });
  });

  describe('Search Functionality', () => {
    it('should update local search query on input', () => {
      component.onSearchChange('angular');
      expect(component['localSearchQuery']()).toBe('angular');
    });

    it('should debounce search query updates', async () => {
      vi.useFakeTimers();
      component.onSearchChange('test');
      expect(mockStore.setSearchQuery).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(350);
      expect(mockStore.setSearchQuery).toHaveBeenCalledWith('test');
      vi.useRealTimers();
    });
  });

  describe('Category Filtering', () => {
    it('should include "All" category', () => {
      const categories = component['categories']();
      expect(categories[0]).toBe('All');
    });

    it('should include all project categories', () => {
      const categories = component['categories']();
      expect(categories).toContain('Web Development');
      expect(categories).toContain('Mobile');
    });

    it('should set selected category on tab change', () => {
      component.onCategoryChange('web-development');
      expect(component['selectedCategory']()).toBe('Web Development');
    });

    it('should default to "All" category', () => {
      expect(component['selectedCategory']()).toBe('All');
    });

    it('should generate correct tab IDs', () => {
      const tabs = component['tabs']();
      const webDevTab = tabs.find((t) => t.label === 'Web Development');
      expect(webDevTab?.id).toBe('web-development');
    });

    it('should mark active tab', () => {
      component['selectedCategory'].set('Mobile');
      fixture.detectChanges();
      const tabs = component['tabs']();
      const mobileTab = tabs.find((t) => t.label === 'Mobile');
      expect(mobileTab?.active).toBe(true);
    });
  });

  describe('Sorting', () => {
    it('should have correct sort options', () => {
      expect(component['sortOptions']).toEqual([
        { value: 'recent', label: 'Most Recent' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'name', label: 'A-Z' },
      ]);
    });

    it('should call store setSortBy on sort change', () => {
      component.onSortChange('popular');
      expect(mockStore.setSortBy).toHaveBeenCalledWith('popular');
    });

    it('should not call setSortBy for array or null values', () => {
      component.onSortChange(['recent', 'popular']);
      expect(mockStore.setSortBy).not.toHaveBeenCalled();

      mockStore.setSortBy.calls?.reset();
      component.onSortChange(null);
      expect(mockStore.setSortBy).not.toHaveBeenCalled();
    });

    it('should get current sort from store', () => {
      mockStore.sortBy.set('popular');
      expect(component.getCurrentSort()).toBe('popular');
    });
  });

  describe('Tag Filtering', () => {
    it('should call store toggleTag when tag is clicked', () => {
      component.onToggleTag('Angular');
      expect(mockStore.toggleTag).toHaveBeenCalledWith('Angular');
    });
  });

  describe('Active Filters', () => {
    it('should compute active filter count', () => {
      mockStore.searchQuery.set('test');
      mockStore.selectedTags.set(['Angular', 'TypeScript']);
      component['selectedCategory'].set('Web Development');
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(4);
    });

    it('should not count "All" category as active filter', () => {
      mockStore.searchQuery.set('test');
      component['selectedCategory'].set('All');
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(1);
    });

    it('should clear all filters when clear button is clicked', () => {
      component.onClearFilters();
      expect(mockStore.clearFilters).toHaveBeenCalled();
      expect(component['selectedCategory']()).toBe('All');
      expect(component['localSearchQuery']()).toBe('');
    });
  });

  describe('Filtered Projects', () => {
    it('should filter projects by selected category', () => {
      component['selectedCategory'].set('Mobile');
      fixture.detectChanges();

      const filtered = component['filteredProjects']();
      expect(filtered.length).toBe(1);
      expect(filtered[0].category).toBe('Mobile');
    });

    it('should show all projects when "All" category is selected', () => {
      component['selectedCategory'].set('All');
      fixture.detectChanges();

      const filtered = component['filteredProjects']();
      expect(filtered.length).toBe(3);
    });

    it('should combine category filter with store filters', () => {
      mockStore.filteredProjects.set([mockProjects[0]]);
      component['selectedCategory'].set('Web Development');
      fixture.detectChanges();

      const filtered = component['filteredProjects']();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined category gracefully', () => {
      const initialCategory = component['selectedCategory']();
      component.onCategoryChange('non-existent-category');
      expect(component['selectedCategory']()).toBe(initialCategory);
    });

    it('should handle empty search query', () => {
      component.onSearchChange('');
      expect(component['localSearchQuery']()).toBe('');
    });

    it('should handle whitespace-only search query', () => {
      component.onSearchChange('   ');
      expect(component['localSearchQuery']()).toBe('   ');
    });

    it('should compute zero active filters when none are set', () => {
      mockStore.searchQuery.set('');
      mockStore.selectedTags.set([]);
      component['selectedCategory'].set('All');
      fixture.detectChanges();

      expect(component['activeFilterCount']()).toBe(0);
    });
  });
});
