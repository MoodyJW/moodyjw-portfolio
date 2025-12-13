import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { Project } from '@core/models/project.model';

import { ProjectCard } from './project-card';

describe('ProjectCard', () => {
  let component: ProjectCard;
  let fixture: ComponentFixture<ProjectCard>;

  const mockProject: Project = {
    id: '1',
    slug: 'test-project',
    title: 'Test Project',
    shortDescription: 'A test project description',
    description: 'Full description',
    category: 'Web Development',
    technologies: ['Angular', 'TypeScript', 'SCSS', 'RxJS', 'Playwright'],
    images: {
      thumbnail: 'test-image.jpg',
      hero: 'test-hero.jpg',
      gallery: [],
    },
    links: {
      live: 'https://example.com',
      github: 'https://github.com/test',
    },
    githubStars: 42,
    metadata: {
      status: 'Active' as const,
      teamSize: 'Solo',
    },
    featured: true,
    createdDate: '2024-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', mockProject);
    fixture.componentRef.setInput('selectedTags', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Properties', () => {
    it('should compute displayTechs correctly', () => {
      const displayTechs = component['displayTechs']();
      expect(displayTechs).toEqual(['Angular', 'TypeScript', 'SCSS']);
    });

    it('should compute remainingTechCount correctly', () => {
      const remainingCount = component['remainingTechCount']();
      expect(remainingCount).toBe(2);
    });

    it('should compute remainingTechCount as 0 when 3 or fewer techs', () => {
      const projectWith2Techs = { ...mockProject, technologies: ['Angular', 'TypeScript'] };
      fixture.componentRef.setInput('project', projectWith2Techs);
      fixture.detectChanges();

      const remainingCount = component['remainingTechCount']();
      expect(remainingCount).toBe(0);
    });

    it('should compute hasGitHubStars correctly when stars exist', () => {
      expect(component['hasGitHubStars']()).toBe(true);
    });

    it('should compute hasGitHubStars as false when stars are 0', () => {
      const projectWithNoStars = { ...mockProject, githubStars: 0 };
      fixture.componentRef.setInput('project', projectWithNoStars);
      fixture.detectChanges();

      expect(component['hasGitHubStars']()).toBe(false);
    });

    it('should compute hasGitHubStars as false when stars are undefined', () => {
      const projectWithNoStars = { ...mockProject, githubStars: undefined };
      fixture.componentRef.setInput('project', projectWithNoStars);
      fixture.detectChanges();

      expect(component['hasGitHubStars']()).toBe(false);
    });

    it('should compute hasLiveLink correctly when link exists', () => {
      expect(component['hasLiveLink']()).toBe(true);
    });

    it('should compute hasLiveLink as false when link does not exist', () => {
      const projectWithoutLive = { ...mockProject, links: { github: 'https://github.com/test' } };
      fixture.componentRef.setInput('project', projectWithoutLive);
      fixture.detectChanges();

      expect(component['hasLiveLink']()).toBe(false);
    });

    it('should compute hasGitHubLink correctly when link exists', () => {
      expect(component['hasGitHubLink']()).toBe(true);
    });

    it('should compute hasGitHubLink as false when link does not exist', () => {
      const projectWithoutGithub = { ...mockProject, links: { live: 'https://example.com' } };
      fixture.componentRef.setInput('project', projectWithoutGithub);
      fixture.detectChanges();

      expect(component['hasGitHubLink']()).toBe(false);
    });

    it('should compute hasStatus correctly when metadata exists', () => {
      expect(component['hasStatus']()).toBe(true);
    });

    it('should compute hasStatus as false when metadata does not exist', () => {
      const projectWithoutMetadata = { ...mockProject, metadata: undefined };
      fixture.componentRef.setInput('project', projectWithoutMetadata);
      fixture.detectChanges();

      expect(component['hasStatus']()).toBe(false);
    });

    it('should compute statusIcon correctly for Active status', () => {
      expect(component['statusIcon']()).toBe('heroCheckCircle');
    });

    it('should compute statusIcon correctly for non-Active status', () => {
      const archivedProject = {
        ...mockProject,
        metadata: { ...mockProject.metadata!, status: 'Archived' as const },
      };
      fixture.componentRef.setInput('project', archivedProject);
      fixture.detectChanges();

      expect(component['statusIcon']()).toBe('heroXCircle');
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
      expect(component.isTagSelected('SCSS')).toBe(false);
    });
  });

  describe('Project Route', () => {
    it('should generate correct project route', () => {
      expect(component.getProjectRoute()).toBe('/projects/test-project');
    });

    it('should generate route based on project slug', () => {
      const differentProject = { ...mockProject, slug: 'my-awesome-project' };
      fixture.componentRef.setInput('project', differentProject);
      fixture.detectChanges();

      expect(component.getProjectRoute()).toBe('/projects/my-awesome-project');
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
      component.onTagClick('SCSS');

      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).toHaveBeenNthCalledWith(1, 'TypeScript');
      expect(emitSpy).toHaveBeenNthCalledWith(2, 'SCSS');
    });
  });

  describe('Input Changes', () => {
    it('should react to project input changes', () => {
      const newProject = { ...mockProject, title: 'New Title', slug: 'new-slug' };
      fixture.componentRef.setInput('project', newProject);
      fixture.detectChanges();

      expect(component.getProjectRoute()).toBe('/projects/new-slug');
    });

    it('should react to selectedTags input changes', () => {
      expect(component.isTagSelected('Angular')).toBe(false);

      fixture.componentRef.setInput('selectedTags', ['Angular']);
      fixture.detectChanges();

      expect(component.isTagSelected('Angular')).toBe(true);
    });
  });
});
