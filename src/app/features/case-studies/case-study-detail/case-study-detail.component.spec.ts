import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CaseStudyDetailComponent } from './case-study-detail.component';

describe('CaseStudyDetailComponent', () => {
  let component: CaseStudyDetailComponent;
  let fixture: ComponentFixture<CaseStudyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) =>
                  key === 'slug' ? 'test-case-study' : null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract slug from route params', () => {
    expect(component['slug']).toBe('test-case-study');
  });

  it('should render the page title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.case-study-detail__title');
    expect(title?.textContent).toContain('Case Study Detail');
  });

  it('should display the case study slug', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const slug = compiled.querySelector('.case-study-detail__slug');
    expect(slug?.textContent).toContain('test-case-study');
  });
});
