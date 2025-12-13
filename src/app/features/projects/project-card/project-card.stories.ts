import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { ProjectCard } from './project-card';

const meta: Meta<ProjectCard> = {
  title: 'Features/Projects/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Project Card component displays a single project with image, title, description,
technologies, metadata, and action buttons.

## Features
- Responsive project card with hover effects
- Technology tags (clickable for filtering)
- Conditional metadata (GitHub stars, status)
- Multiple action buttons (view details, live link, GitHub)
- Support for selected tag highlighting
        `,
      },
    },
  },
  argTypes: {
    project: {
      description: 'Project data to display',
      control: { type: 'object' },
    },
    selectedTags: {
      description: 'Currently selected technology tags for filter highlighting',
      control: { type: 'object' },
    },
    tagClick: {
      description: 'Emitted when a technology tag is clicked',
      action: 'tagClick',
    },
  },
};

export default meta;
type Story = StoryObj<ProjectCard>;

const mockProject = {
  id: '1',
  slug: 'portfolio-website',
  title: 'Portfolio Website',
  shortDescription: 'A modern, accessible portfolio website built with Angular and TypeScript.',
  description: 'Full description here...',
  category: 'Web Development',
  technologies: ['Angular', 'TypeScript', 'SCSS', 'Storybook', 'Playwright'],
  images: {
    thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Portfolio+Website',
    hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Portfolio+Website',
    gallery: [],
  },
  links: {
    live: 'https://example.com',
    github: 'https://github.com/example/portfolio',
  },
  githubStars: 42,
  metadata: {
    status: 'Active' as const,
    teamSize: 'Solo',
    duration: '3 months',
  },
  featured: true,
  createdDate: '2024-01-01',
};

export const Default: Story = {
  args: {
    project: mockProject,
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithSelectedTags: Story = {
  args: {
    project: mockProject,
    selectedTags: ['Angular', 'TypeScript'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithoutGitHubStars: Story = {
  args: {
    project: {
      ...mockProject,
      githubStars: undefined,
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithoutStatus: Story = {
  args: {
    project: {
      ...mockProject,
      metadata: undefined,
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithoutLiveLink: Story = {
  args: {
    project: {
      ...mockProject,
      links: {
        github: 'https://github.com/example/portfolio',
      },
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithoutGitHubLink: Story = {
  args: {
    project: {
      ...mockProject,
      links: {
        live: 'https://example.com',
      },
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithManyTechnologies: Story = {
  args: {
    project: {
      ...mockProject,
      technologies: [
        'Angular',
        'TypeScript',
        'SCSS',
        'Storybook',
        'Playwright',
        'RxJS',
        'Signals',
        'Zod',
      ],
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const InactiveStatus: Story = {
  args: {
    project: {
      ...mockProject,
      metadata: {
        ...mockProject.metadata!,
        status: 'Archived' as const,
      },
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const MinimalProject: Story = {
  args: {
    project: {
      id: '2',
      slug: 'minimal-project',
      title: 'Minimal Project',
      shortDescription: 'A project with minimal information.',
      description: 'Full description...',
      category: 'Other',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      images: {
        thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Minimal+Project',
        hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Minimal+Project',
        gallery: [],
      },
      links: {},
      featured: false,
      createdDate: '2024-01-01',
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 400px;">
        <app-project-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const MultipleCards: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
        <app-project-card
          [project]="{
            id: '1',
            slug: 'project-1',
            title: 'E-commerce Platform',
            shortDescription: 'Full-featured online store with cart and checkout.',
            description: 'Full description...',
            category: 'Web Development',
            technologies: ['React', 'Node.js', 'MongoDB'],
            images: { thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=E-commerce', hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=E-commerce', gallery: [] },
            links: { live: 'https://example.com', github: 'https://github.com/example' },
            githubStars: 128,
            metadata: { status: 'Active', teamSize: 'Solo' },
            featured: true,
            createdDate: '2024-01-01'
          }"
        />
        <app-project-card
          [project]="{
            id: '2',
            slug: 'project-2',
            title: 'Mobile App',
            shortDescription: 'Cross-platform mobile application.',
            description: 'Full description...',
            category: 'Mobile',
            technologies: ['React Native', 'TypeScript'],
            images: { thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Mobile+App', hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Mobile+App', gallery: [] },
            links: { github: 'https://github.com/example' },
            githubStars: 56,
            featured: false,
            createdDate: '2024-01-01'
          }"
        />
        <app-project-card
          [project]="{
            id: '3',
            slug: 'project-3',
            title: 'Data Visualization',
            shortDescription: 'Interactive charts and dashboards.',
            description: 'Full description...',
            category: 'Data Science',
            technologies: ['D3.js', 'Python', 'Flask'],
            images: { thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Data+Viz', hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Data+Viz', gallery: [] },
            links: { live: 'https://example.com' },
            metadata: { status: 'Archived' },
            featured: false,
            createdDate: '2023-01-01'
          }"
        />
      </div>
    `,
  }),
};
