import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { CaseStudyCard } from './case-study-card';

const meta: Meta<CaseStudyCard> = {
  title: 'Features/Case Studies/CaseStudyCard',
  component: CaseStudyCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Case Study Card component displays a single case study with image, title, description,
client, role, technologies, and action buttons.

## Features
- Responsive card layout with hover effects
- Technology tags (clickable for filtering)
- Client and role metadata
- Duration display
- Multiple action buttons (view details)
- Support for selected tag highlighting
        `,
      },
    },
  },
  argTypes: {
    caseStudy: {
      description: 'Case study data to display',
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
type Story = StoryObj<CaseStudyCard>;

const mockCaseStudy = {
  id: '1',
  slug: 'enterprise-dashboard-redesign',
  title: 'Enterprise Dashboard Redesign',
  description:
    'Led the complete overhaul of a legacy enterprise dashboard, transforming it into a modern, accessible, and performant application. Reduced load times by 60% and improved user satisfaction scores by 45%.',
  client: 'Tech Corp',
  role: 'Lead Frontend Developer',
  duration: '6 months',
  challenge: 'Legacy dashboard with poor performance and outdated UX patterns',
  solution: 'Rebuilt with modern Angular, implemented state management with NgRx, and added real-time data visualization',
  results: {
    metrics: [
      { label: 'Load Time', value: '-60%' },
      { label: 'User Satisfaction', value: '+45%' },
    ],
    impact: 'Significantly improved user productivity and system performance',
  },
  technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'SCSS', 'D3.js'],
  images: {
    thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Dashboard+Redesign',
    hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Dashboard+Redesign',
    gallery: [],
  },
  tags: ['Frontend', 'Performance', 'Accessibility'],
  publishedDate: '2024-03-15',
};

export const Default: Story = {
  args: {
    caseStudy: mockCaseStudy,
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithSelectedTags: Story = {
  args: {
    caseStudy: mockCaseStudy,
    selectedTags: ['Angular', 'TypeScript'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithManyTechnologies: Story = {
  args: {
    caseStudy: {
      ...mockCaseStudy,
      technologies: [
        'Angular',
        'TypeScript',
        'RxJS',
        'NgRx',
        'SCSS',
        'D3.js',
        'Playwright',
        'Storybook',
        'Vitest',
      ],
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const ShortDuration: Story = {
  args: {
    caseStudy: {
      ...mockCaseStudy,
      duration: '2 weeks',
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const LongDescription: Story = {
  args: {
    caseStudy: {
      ...mockCaseStudy,
      description:
        'This is a much longer description that demonstrates how the card handles text overflow. The description should be truncated to three lines with an ellipsis at the end. This ensures the card maintains a consistent height even when the description text is very long. The overflow is handled using CSS line-clamp to provide a clean, professional appearance.',
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const MinimalCaseStudy: Story = {
  args: {
    caseStudy: {
      id: '2',
      slug: 'simple-project',
      title: 'Simple Website Refresh',
      description: 'A quick redesign of a marketing website with modern best practices.',
      client: 'Small Business Inc',
      role: 'Consultant',
      duration: '1 month',
      challenge: 'Outdated website design',
      solution: 'Modern responsive redesign',
      results: {
        metrics: [{ label: 'Bounce Rate', value: '-30%' }],
        impact: 'Improved user engagement',
      },
      technologies: ['HTML', 'CSS', 'JavaScript'],
      images: {
        thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Simple+Project',
        hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Simple+Project',
        gallery: [],
      },
      tags: ['Frontend'],
      publishedDate: '2024-01-10',
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const WithoutImage: Story = {
  args: {
    caseStudy: {
      ...mockCaseStudy,
      images: {
        thumbnail: '',
        hero: '',
        gallery: [],
      },
    },
    selectedTags: [],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px;">
        <app-case-study-card ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

export const MultipleCards: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 1.5rem;">
        <app-case-study-card
          [caseStudy]="{
            id: '1',
            slug: 'dashboard-redesign',
            title: 'Enterprise Dashboard Redesign',
            description: 'Led the complete overhaul of a legacy enterprise dashboard, transforming it into a modern, accessible, and performant application.',
            client: 'Tech Corp',
            role: 'Lead Frontend Developer',
            duration: '6 months',
            challenge: 'Legacy system performance issues',
            solution: 'Modern Angular rebuild',
            results: { metrics: [{ label: 'Performance', value: '+60%' }], impact: 'Improved efficiency' },
            technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
            images: { thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Dashboard', hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Dashboard', gallery: [] },
            tags: ['Frontend', 'Performance'],
            publishedDate: '2024-03-15'
          }"
          [selectedTags]="['Angular']"
        />
        <app-case-study-card
          [caseStudy]="{
            id: '2',
            slug: 'mobile-app',
            title: 'Healthcare Mobile App',
            description: 'Built a HIPAA-compliant mobile app for patient engagement with real-time notifications and secure messaging.',
            client: 'MedTech Solutions',
            role: 'Senior Developer',
            duration: '9 months',
            challenge: 'HIPAA compliance requirements',
            solution: 'Secure mobile architecture',
            results: { metrics: [{ label: 'Users', value: '50K+' }], impact: 'Better patient engagement' },
            technologies: ['React Native', 'Node.js', 'PostgreSQL'],
            images: { thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=Mobile+App', hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=Mobile+App', gallery: [] },
            tags: ['Mobile', 'Security'],
            publishedDate: '2024-02-01'
          }"
        />
        <app-case-study-card
          [caseStudy]="{
            id: '3',
            slug: 'api-migration',
            title: 'API Migration & Modernization',
            description: 'Migrated a monolithic REST API to a microservices architecture, improving scalability and reducing deployment times.',
            client: 'FinanceApp Inc',
            role: 'Backend Architect',
            duration: '4 months',
            challenge: 'Monolithic architecture limitations',
            solution: 'Microservices migration',
            results: { metrics: [{ label: 'Scalability', value: '10x' }], impact: 'Faster deployments' },
            technologies: ['Node.js', 'Docker', 'Kubernetes', 'GraphQL'],
            images: { thumbnail: 'https://placehold.co/800x450/e5e7eb/64748b?text=API+Migration', hero: 'https://placehold.co/1200x600/e5e7eb/64748b?text=API+Migration', gallery: [] },
            tags: ['Backend', 'DevOps'],
            publishedDate: '2023-12-10'
          }"
        />
      </div>
    `,
  }),
};
