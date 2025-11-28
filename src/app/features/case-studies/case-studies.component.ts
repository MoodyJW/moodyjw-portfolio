import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { LABELS } from '@shared/constants';

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  technologies: string[];
}

@Component({
  selector: 'app-case-studies',
  standalone: true,
  imports: [],
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudiesComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly metaTitle = inject(Title);

  /** UI labels */
  protected readonly LABELS = LABELS;
  protected readonly caseStudies = signal<CaseStudy[]>([
    {
      id: 1,
      title: 'Enterprise Dashboard',
      description:
        'Built a scalable enterprise dashboard with real-time data visualization using Angular signals and standalone components.',
      technologies: ['Angular', 'TypeScript', 'RxJS', 'SCSS'],
    },
    {
      id: 2,
      title: 'E-commerce Platform',
      description:
        'Developed a high-performance e-commerce platform with advanced state management and lazy-loaded routes.',
      technologies: ['Angular', 'NgRx', 'Angular Material', 'Firebase'],
    },
    {
      id: 3,
      title: 'Design System',
      description:
        'Created a comprehensive design system with custom theming using CSS variables and reusable components.',
      technologies: ['Angular', 'SCSS', 'Storybook', 'Design Tokens'],
    },
  ]);

  ngOnInit(): void {
    this.metaTitle.setTitle('MoodyJW - Case Studies');
    this.meta.updateTag({
      name: 'case-studies',
      content: 'Case Studies page of MoodyJW Portfolio',
    });
  }
}
