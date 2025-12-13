import { Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { delay, of } from 'rxjs';

import type { Project } from '../models/project.model';

/**
 * Mock project data for development and testing
 * This data simulates real portfolio projects and will be replaced
 * with actual project data in production
 */
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'angular-portfolio',
    title: 'Angular Portfolio Website',
    description: `A modern, responsive portfolio website built with Angular 18+ featuring advanced architecture patterns, comprehensive testing, and accessibility compliance.

## Key Features
- **Signal-based state management** with NgRx SignalStore
- **Comprehensive component library** with 20+ reusable components
- **WCAG 2.1 AAA accessibility** compliance
- **Extensive testing** with Vitest and Playwright
- **ADR-driven architecture** for maintainable decisions

## Technical Highlights
The project demonstrates expertise in modern Angular development with standalone components, signals, and the inject() function. It includes a custom design system, utility functions, and pipes for common operations.`,
    shortDescription: 'Modern Angular portfolio with signal-based architecture and comprehensive testing',
    technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx SignalStore', 'Vitest', 'Playwright', 'SCSS'],
    category: 'Web App',
    featured: true,
    images: {
      thumbnail: '/assets/images/projects/angular-portfolio-thumb.jpg',
      hero: '/assets/images/projects/angular-portfolio-hero.jpg',
      gallery: [
        '/assets/images/projects/angular-portfolio-1.jpg',
        '/assets/images/projects/angular-portfolio-2.jpg',
      ],
    },
    links: {
      live: 'https://moodyjw.dev',
      github: 'https://github.com/MoodyJW/portfolio',
    },
    createdDate: '2024-01-15',
    updatedDate: '2024-03-20',
    githubStars: 12,
    metadata: {
      teamSize: 'Solo',
      duration: '3 months',
      status: 'Active',
    },
  },
  {
    id: '2',
    slug: 'task-management-app',
    title: 'Task Management Application',
    description: `A feature-rich task management application with real-time collaboration, built using Angular and Firebase.

## Features
- Real-time task updates with Firebase Firestore
- Drag-and-drop task organization
- Team collaboration with role-based permissions
- Advanced filtering and search
- Mobile-responsive design

## Architecture
The application uses a clean architecture approach with feature modules, shared services, and state management. Firebase handles authentication, real-time data sync, and cloud functions for complex operations.`,
    shortDescription: 'Real-time collaborative task management with Firebase integration',
    technologies: ['Angular', 'Firebase', 'TypeScript', 'RxJS', 'Angular Material', 'Firestore'],
    category: 'Web App',
    featured: true,
    images: {
      thumbnail: '/assets/images/projects/task-app-thumb.jpg',
      hero: '/assets/images/projects/task-app-hero.jpg',
      gallery: [],
    },
    links: {
      live: 'https://tasks.example.com',
      github: 'https://github.com/MoodyJW/task-app',
    },
    createdDate: '2023-09-10',
    updatedDate: '2024-02-15',
    githubStars: 28,
    metadata: {
      teamSize: '2-3',
      duration: '6 months',
      status: 'Active',
    },
  },
  {
    id: '3',
    slug: 'data-visualization-dashboard',
    title: 'Data Visualization Dashboard',
    description: `An interactive dashboard for visualizing complex datasets with multiple chart types and real-time updates.

## Capabilities
- Multiple chart types (line, bar, pie, scatter, heatmap)
- Real-time data streaming
- Custom data filtering and aggregation
- Export to PDF and CSV
- Responsive design for mobile viewing

## Technical Stack
Built with Angular and D3.js for powerful visualizations. Uses WebSockets for real-time data updates and implements efficient change detection for performance.`,
    shortDescription: 'Interactive dashboard with real-time data visualization using D3.js',
    technologies: ['Angular', 'D3.js', 'TypeScript', 'WebSocket', 'RxJS', 'Chart.js'],
    category: 'Web App',
    featured: true,
    images: {
      thumbnail: '/assets/images/projects/dashboard-thumb.jpg',
      hero: '/assets/images/projects/dashboard-hero.jpg',
      gallery: [
        '/assets/images/projects/dashboard-1.jpg',
        '/assets/images/projects/dashboard-2.jpg',
        '/assets/images/projects/dashboard-3.jpg',
      ],
    },
    links: {
      live: 'https://dashboard.example.com',
    },
    createdDate: '2023-06-20',
    updatedDate: '2024-01-10',
    metadata: {
      teamSize: 'Solo',
      duration: '4 months',
      status: 'Completed',
    },
  },
  {
    id: '4',
    slug: 'component-library',
    title: 'Angular Component Library',
    description: `A comprehensive, accessible component library for Angular applications with 30+ components.

## Components
- Form controls (input, select, checkbox, radio, textarea)
- Layout components (grid, stack, container)
- Feedback components (toast, modal, loading)
- Navigation components (tabs, breadcrumb)
- Data display components (card, badge, divider)

## Features
- WCAG 2.1 AAA accessibility
- Comprehensive documentation with Storybook
- Full TypeScript support
- Customizable theming system
- Tree-shakable exports`,
    shortDescription: 'Accessible component library with 30+ components and Storybook docs',
    technologies: ['Angular', 'TypeScript', 'Storybook', 'SCSS', 'Vitest'],
    category: 'Library',
    featured: false,
    images: {
      thumbnail: '/assets/images/projects/component-lib-thumb.jpg',
      hero: '/assets/images/projects/component-lib-hero.jpg',
      gallery: [],
    },
    links: {
      github: 'https://github.com/MoodyJW/ng-components',
      other: {
        storybook: 'https://components.example.com',
        npm: 'https://npmjs.com/package/@moodyjw/ng-components',
      },
    },
    createdDate: '2023-03-15',
    updatedDate: '2024-03-01',
    githubStars: 156,
    metadata: {
      teamSize: 'Solo',
      duration: '1 year',
      status: 'Active',
    },
  },
  {
    id: '5',
    slug: 'e-commerce-platform',
    title: 'E-Commerce Platform',
    description: `A full-stack e-commerce solution with product management, shopping cart, and secure checkout.

## Features
- Product catalog with search and filtering
- Shopping cart with persistent storage
- Secure checkout with Stripe integration
- Order tracking and history
- Admin dashboard for product management
- Email notifications

## Technology Stack
Frontend built with Angular, backend with Node.js and Express. Uses MongoDB for data storage and Redis for caching. Stripe handles payment processing.`,
    shortDescription: 'Full-stack e-commerce platform with Stripe integration',
    technologies: ['Angular', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe', 'TypeScript'],
    category: 'Web App',
    featured: true,
    images: {
      thumbnail: '/assets/images/projects/ecommerce-thumb.jpg',
      hero: '/assets/images/projects/ecommerce-hero.jpg',
      gallery: [
        '/assets/images/projects/ecommerce-1.jpg',
        '/assets/images/projects/ecommerce-2.jpg',
      ],
    },
    links: {
      live: 'https://shop.example.com',
    },
    createdDate: '2022-11-01',
    updatedDate: '2023-08-15',
    metadata: {
      teamSize: '4+',
      duration: '9 months',
      status: 'Completed',
    },
  },
  {
    id: '6',
    slug: 'weather-app',
    title: 'Weather Forecast Application',
    description: `A clean, intuitive weather application with 7-day forecasts and location-based weather.

## Features
- Current weather conditions
- 7-day forecast
- Hourly forecast
- Location-based weather detection
- Search by city name
- Favorite locations
- Weather alerts

## Implementation
Uses OpenWeatherMap API for weather data. Implements geolocation for automatic location detection. Features a responsive design optimized for mobile devices.`,
    shortDescription: 'Weather forecast app with geolocation and 7-day forecasts',
    technologies: ['Angular', 'TypeScript', 'RxJS', 'OpenWeatherMap API', 'SCSS'],
    category: 'Demo',
    featured: false,
    images: {
      thumbnail: '/assets/images/projects/weather-thumb.jpg',
      hero: '/assets/images/projects/weather-hero.jpg',
      gallery: [],
    },
    links: {
      live: 'https://weather.example.com',
      github: 'https://github.com/MoodyJW/weather-app',
    },
    createdDate: '2023-04-05',
    githubStars: 8,
    metadata: {
      teamSize: 'Solo',
      duration: '2 weeks',
      status: 'Completed',
    },
  },
  {
    id: '7',
    slug: 'code-snippet-manager',
    title: 'Code Snippet Manager',
    description: `A developer tool for organizing and managing code snippets with syntax highlighting and tagging.

## Features
- Syntax highlighting for 50+ languages
- Tag-based organization
- Search and filter functionality
- Code preview and copy
- Export snippets
- Dark/light theme support

## Technology
Built with Angular and Monaco Editor (VS Code's editor). Uses IndexedDB for local storage. Supports import/export in multiple formats.`,
    shortDescription: 'Developer tool for organizing code snippets with syntax highlighting',
    technologies: ['Angular', 'Monaco Editor', 'TypeScript', 'IndexedDB', 'Prism.js'],
    category: 'Tool',
    featured: false,
    images: {
      thumbnail: '/assets/images/projects/snippets-thumb.jpg',
      hero: '/assets/images/projects/snippets-hero.jpg',
      gallery: [],
    },
    links: {
      live: 'https://snippets.example.com',
      github: 'https://github.com/MoodyJW/snippet-manager',
    },
    createdDate: '2023-07-12',
    updatedDate: '2024-01-20',
    githubStars: 42,
    metadata: {
      teamSize: 'Solo',
      duration: '1 month',
      status: 'Active',
    },
  },
];

/**
 * Service for managing portfolio projects
 *
 * This service provides access to project data using the Mockend pattern
 * (in-memory mock data with RxJS observables). In production, this would
 * be replaced with actual API calls.
 *
 * @example
 * ```typescript
 * export class ProjectsComponent {
 *   private readonly projectService = inject(ProjectService);
 *
 *   ngOnInit() {
 *     this.projectService.getAll().subscribe(projects => {
 *       console.log('Projects:', projects);
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  /**
   * Fetches all projects
   *
   * Uses the Mockend pattern with `of()` and `delay()` to simulate
   * an asynchronous API call with network latency.
   *
   * @returns Observable of all projects
   *
   * @example
   * ```typescript
   * this.projectService.getAll().subscribe(projects => {
   *   console.log('Total projects:', projects.length);
   * });
   * ```
   */
  getAll(): Observable<Project[]> {
    return of(MOCK_PROJECTS).pipe(delay(500));
  }

  /**
   * Fetches a single project by slug
   *
   * @param slug - The URL-friendly slug of the project
   * @returns Observable of project or undefined if not found
   *
   * @example
   * ```typescript
   * this.projectService.getBySlug('angular-portfolio').subscribe(project => {
   *   if (project) {
   *     console.log('Project:', project.title);
   *   } else {
   *     console.log('Project not found');
   *   }
   * });
   * ```
   */
  getBySlug(slug: string): Observable<Project | undefined> {
    return of(MOCK_PROJECTS.find((p) => p.slug === slug)).pipe(delay(500));
  }

  /**
   * Fetches only featured projects
   *
   * Featured projects are displayed on the home page and in featured
   * sections throughout the site.
   *
   * @returns Observable of featured projects
   *
   * @example
   * ```typescript
   * this.projectService.getFeatured().subscribe(projects => {
   *   console.log('Featured projects:', projects.length);
   * });
   * ```
   */
  getFeatured(): Observable<Project[]> {
    return of(MOCK_PROJECTS.filter((p) => p.featured)).pipe(delay(500));
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use getAll() instead
   */
  getProjects(): Observable<Project[]> {
    return this.getAll();
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use getBySlug() instead
   */
  getProjectById(id: string): Observable<Project | undefined> {
    return of(MOCK_PROJECTS.find((p) => p.id === id)).pipe(delay(500));
  }
}
