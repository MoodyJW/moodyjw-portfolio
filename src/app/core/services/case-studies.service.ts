import { Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { delay, of } from 'rxjs';

import type { CaseStudy } from '../models/case-study.model';

/**
 * Mock case study data for development and testing
 * This data simulates real case studies and will be replaced
 * with actual data in production
 */
const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    slug: 'enterprise-dashboard-redesign',
    title: 'Enterprise Dashboard Redesign',
    description: `Led the complete redesign of an enterprise analytics dashboard serving 50,000+ daily active users. The project focused on improving data visualization, user experience, and performance while maintaining backward compatibility with existing integrations.

## Project Overview
The existing dashboard had grown organically over 5 years, resulting in inconsistent UI patterns, poor performance, and declining user satisfaction. Our goal was to modernize the platform while preserving all functionality and reducing technical debt.

## Approach
We conducted extensive user research, including interviews with 50+ power users and analysis of 6 months of usage data. This informed our design decisions and helped prioritize features that would have the most impact.`,
    client: 'Fortune 500 Financial Services Company',
    role: 'Lead Frontend Developer',
    duration: '8 months',
    challenge: `The primary challenges included:
- **Performance**: Dashboard was taking 8-12 seconds to load with large datasets
- **User Experience**: Inconsistent navigation and information architecture
- **Technical Debt**: Legacy code and outdated dependencies
- **Data Visualization**: Charts were not interactive or responsive
- **Mobile Support**: No mobile-responsive design

Additionally, we needed to maintain 100% uptime during the migration and ensure zero data loss.`,
    solution: `We implemented a phased approach:

### Phase 1: Foundation (Months 1-2)
- Migrated to Angular 17 with standalone components
- Implemented NgRx SignalStore for state management
- Created a comprehensive design system with 40+ components
- Set up automated testing with 85% code coverage

### Phase 2: Core Features (Months 3-5)
- Rebuilt data visualization layer with D3.js and Chart.js
- Implemented virtual scrolling for large data tables
- Added real-time updates via WebSockets
- Created responsive layouts for mobile devices

### Phase 3: Migration & Optimization (Months 6-8)
- Implemented feature flags for gradual rollout
- Optimized bundle size (reduced by 60%)
- Added comprehensive analytics tracking
- Conducted extensive user acceptance testing`,
    results: {
      metrics: [
        {
          label: 'Page Load Time',
          value: '-75%',
          icon: 'speed',
        },
        {
          label: 'User Satisfaction',
          value: '+58%',
          icon: 'thumbs-up',
        },
        {
          label: 'Support Tickets',
          value: '-42%',
          icon: 'trending-down',
        },
        {
          label: 'Mobile Usage',
          value: '+320%',
          icon: 'phone',
        },
      ],
      impact: `The redesign had significant business impact:
- **User Adoption**: 95% of users actively using the new dashboard within 3 months
- **Efficiency**: Users completing tasks 40% faster on average
- **Revenue**: 15% increase in premium feature adoption
- **Technical**: Reduced infrastructure costs by 30% through optimization
- **Developer Experience**: 50% reduction in bug reports and feature request time`,
    },
    technologies: [
      'Angular',
      'TypeScript',
      'NgRx SignalStore',
      'D3.js',
      'Chart.js',
      'RxJS',
      'WebSocket',
      'SCSS',
      'Vitest',
      'Playwright',
    ],
    images: {
      thumbnail: '/assets/images/case-studies/dashboard-thumb.jpg',
      hero: '/assets/images/case-studies/dashboard-hero.jpg',
      gallery: [
        '/assets/images/case-studies/dashboard-before.jpg',
        '/assets/images/case-studies/dashboard-after.jpg',
        '/assets/images/case-studies/dashboard-mobile.jpg',
      ],
      beforeAfter: [
        {
          before: '/assets/images/case-studies/dashboard-old.jpg',
          after: '/assets/images/case-studies/dashboard-new.jpg',
          caption: 'Main dashboard view - Before and after redesign',
        },
      ],
    },
    testimonial: {
      quote:
        'The new dashboard exceeded our expectations. Our users love it, and our support team has seen a dramatic reduction in help requests. The technical quality and attention to detail were outstanding.',
      author: 'Sarah Johnson',
      title: 'VP of Product',
      avatar: '/assets/images/testimonials/sarah-j.jpg',
    },
    lessonsLearned: `Key takeaways from this project:
- **User Research is Critical**: Direct user feedback shaped many key decisions
- **Incremental Migration**: Feature flags allowed us to roll out gradually and reduce risk
- **Performance Matters**: Users noticed and appreciated the speed improvements
- **Design Systems**: Investing in a solid component library paid dividends
- **Testing**: Comprehensive tests gave us confidence to refactor aggressively`,
    publishedDate: '2024-02-15',
    tags: ['Dashboard', 'Enterprise', 'Performance', 'UX Design'],
  },
  {
    id: '2',
    slug: 'real-time-collaboration-platform',
    title: 'Real-Time Collaboration Platform',
    description: `Built a real-time collaboration platform for distributed teams, enabling seamless document editing, video conferencing, and project management. The platform supports 10,000+ concurrent users with sub-100ms latency for real-time updates.

## Background
A fast-growing startup needed a unified platform to replace their scattered toolset of Slack, Google Docs, Trello, and Zoom. They wanted an all-in-one solution that their remote team of 500+ employees could use effectively.`,
    client: 'TechStart Inc.',
    role: 'Senior Full-Stack Developer',
    duration: '10 months',
    challenge: `Major technical and business challenges:
- **Real-Time Sync**: Maintaining consistency across thousands of concurrent connections
- **Scalability**: Supporting exponential user growth
- **Offline Support**: Enabling work without internet connection
- **Video Infrastructure**: Building reliable video conferencing
- **Security**: End-to-end encryption for sensitive documents
- **Integration**: Connecting with existing tools and APIs`,
    solution: `We built the platform using modern technologies and best practices:

### Architecture
- **Frontend**: Angular 18 with SSR for performance
- **Backend**: Node.js microservices with GraphQL
- **Real-Time**: WebSocket with operational transformation (OT)
- **Storage**: PostgreSQL for data, Redis for caching
- **Video**: WebRTC with SFU architecture
- **Deployment**: Kubernetes on AWS with auto-scaling

### Key Features
- Collaborative document editing with conflict resolution
- HD video conferencing with screen sharing
- Real-time chat with typing indicators
- Kanban boards with drag-and-drop
- File sharing with version control
- Mobile apps for iOS and Android`,
    results: {
      metrics: [
        {
          label: 'Concurrent Users',
          value: '10,000+',
          icon: 'users',
        },
        {
          label: 'Uptime',
          value: '99.9%',
          icon: 'check-circle',
        },
        {
          label: 'Latency',
          value: '<100ms',
          icon: 'zap',
        },
        {
          label: 'Tool Consolidation',
          value: '8 → 1',
          icon: 'merge',
        },
      ],
      impact: `Business and technical outcomes:
- **Productivity**: Teams reported 35% increase in productivity
- **Cost Savings**: Reduced SaaS costs by $500K annually
- **Adoption**: 98% of employees using platform daily within 2 months
- **Engagement**: Average session time of 4.5 hours per day
- **Retention**: 95% user retention after 6 months`,
    },
    technologies: [
      'Angular',
      'Node.js',
      'GraphQL',
      'WebSocket',
      'WebRTC',
      'PostgreSQL',
      'Redis',
      'Kubernetes',
      'Docker',
    ],
    images: {
      thumbnail: '/assets/images/case-studies/collab-thumb.jpg',
      hero: '/assets/images/case-studies/collab-hero.jpg',
      gallery: [
        '/assets/images/case-studies/collab-editor.jpg',
        '/assets/images/case-studies/collab-video.jpg',
        '/assets/images/case-studies/collab-boards.jpg',
      ],
    },
    testimonial: {
      quote:
        'This platform transformed how our team works. The real-time collaboration features are seamless, and our employees love having everything in one place. It was delivered on time and exceeded our requirements.',
      author: 'Michael Chen',
      title: 'CTO',
      avatar: '/assets/images/testimonials/michael-c.jpg',
    },
    nextSteps: `Future enhancements planned:
- AI-powered meeting summaries and action items
- Advanced analytics and productivity insights
- Integration marketplace for third-party apps
- Enhanced mobile experience with offline-first architecture`,
    publishedDate: '2024-01-10',
    updatedDate: '2024-03-01',
    tags: ['Collaboration', 'Real-Time', 'WebRTC', 'Microservices'],
  },
  {
    id: '3',
    slug: 'e-commerce-performance-optimization',
    title: 'E-Commerce Performance Optimization',
    description: `Optimized a high-traffic e-commerce platform serving 2M+ monthly visitors. Reduced page load times by 70% and increased conversion rates by 23% through comprehensive performance improvements and modern best practices.

## Context
An established e-commerce company was losing customers due to slow page loads and poor mobile experience. With peak traffic reaching 50K concurrent users during sales events, performance issues were directly impacting revenue.`,
    client: 'RetailCo',
    role: 'Performance Engineer & Frontend Lead',
    duration: '5 months',
    challenge: `Critical performance and business issues:
- **Slow Load Times**: Homepage taking 12+ seconds on mobile
- **Poor Core Web Vitals**: Failing all Google PageSpeed metrics
- **High Bounce Rate**: 65% of mobile users leaving within 5 seconds
- **Cart Abandonment**: 78% cart abandonment rate
- **SEO Impact**: Declining search rankings due to performance
- **Mobile Experience**: Barely usable on slower connections`,
    solution: `Implemented comprehensive performance optimization strategy:

### Performance Improvements
- **Code Splitting**: Reduced initial bundle from 3.2MB to 380KB
- **Image Optimization**: Implemented WebP with fallbacks, lazy loading
- **Caching Strategy**: Service Worker for offline-first experience
- **CDN**: Moved assets to edge locations worldwide
- **Database**: Optimized queries, added Redis caching layer
- **SSR**: Implemented server-side rendering for faster FCP

### Technical Enhancements
- Migrated to Angular 18 with hydration
- Implemented virtual scrolling for product lists
- Added skeleton screens and progressive loading
- Optimized third-party scripts (analytics, chat)
- Reduced JavaScript execution time by 80%
- Implemented critical CSS inlining`,
    results: {
      metrics: [
        {
          label: 'Load Time',
          value: '-70%',
          icon: 'clock',
        },
        {
          label: 'Conversion Rate',
          value: '+23%',
          icon: 'trending-up',
        },
        {
          label: 'Bounce Rate',
          value: '-45%',
          icon: 'trending-down',
        },
        {
          label: 'Lighthouse Score',
          value: '95/100',
          icon: 'star',
        },
      ],
      impact: `Measurable business impact:
- **Revenue**: $2.3M additional annual revenue from improved conversion
- **SEO**: Returned to first page for 90% of target keywords
- **Mobile**: 180% increase in mobile purchases
- **User Satisfaction**: NPS score improved from 42 to 78
- **Infrastructure**: 40% reduction in server costs through optimization`,
    },
    technologies: ['Angular', 'TypeScript', 'Service Worker', 'Redis', 'CDN', 'WebP', 'SSR'],
    images: {
      thumbnail: '/assets/images/case-studies/ecommerce-thumb.jpg',
      hero: '/assets/images/case-studies/ecommerce-hero.jpg',
      gallery: [
        '/assets/images/case-studies/ecommerce-metrics.jpg',
        '/assets/images/case-studies/ecommerce-mobile.jpg',
      ],
      beforeAfter: [
        {
          before: '/assets/images/case-studies/lighthouse-before.jpg',
          after: '/assets/images/case-studies/lighthouse-after.jpg',
          caption: 'Lighthouse scores - Before and after optimization',
        },
      ],
    },
    testimonial: {
      quote:
        'The performance improvements directly translated to increased revenue. Our customers are happier, our search rankings improved, and our infrastructure costs went down. Outstanding work.',
      author: 'Jennifer Williams',
      title: 'Head of E-Commerce',
      avatar: '/assets/images/testimonials/jennifer-w.jpg',
    },
    lessonsLearned: `Key insights:
- **Measure Everything**: Comprehensive monitoring revealed non-obvious bottlenecks
- **User-Centric Metrics**: Focus on metrics that matter to users, not just technical scores
- **Progressive Enhancement**: Start with performance, add features incrementally
- **Mobile First**: Optimize for slower devices and connections
- **Continuous Monitoring**: Performance is an ongoing effort, not a one-time fix`,
    publishedDate: '2023-11-20',
    tags: ['Performance', 'E-Commerce', 'SEO', 'Optimization'],
  },
];

/**
 * Service for managing case studies
 *
 * This service provides access to case study data using the Mockend pattern
 * (in-memory mock data with RxJS observables). In production, this would
 * be replaced with actual API calls.
 *
 * @example
 * ```typescript
 * export class CaseStudiesComponent {
 *   private readonly caseStudiesService = inject(CaseStudiesService);
 *
 *   ngOnInit() {
 *     this.caseStudiesService.getAll().subscribe(caseStudies => {
 *       console.log('Case Studies:', caseStudies);
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CaseStudiesService {
  /**
   * Fetches all case studies
   *
   * Uses the Mockend pattern with `of()` and `delay()` to simulate
   * an asynchronous API call with network latency.
   *
   * @returns Observable of all case studies
   *
   * @example
   * ```typescript
   * this.caseStudiesService.getAll().subscribe(caseStudies => {
   *   console.log('Total case studies:', caseStudies.length);
   * });
   * ```
   */
  getAll(): Observable<CaseStudy[]> {
    return of(MOCK_CASE_STUDIES).pipe(delay(500));
  }

  /**
   * Fetches a single case study by slug
   *
   * @param slug - The URL-friendly slug of the case study
   * @returns Observable of case study or undefined if not found
   *
   * @example
   * ```typescript
   * this.caseStudiesService.getBySlug('enterprise-dashboard-redesign').subscribe(caseStudy => {
   *   if (caseStudy) {
   *     console.log('Case Study:', caseStudy.title);
   *   } else {
   *     console.log('Case study not found');
   *   }
   * });
   * ```
   */
  getBySlug(slug: string): Observable<CaseStudy | undefined> {
    return of(MOCK_CASE_STUDIES.find((cs) => cs.slug === slug)).pipe(delay(500));
  }
}
