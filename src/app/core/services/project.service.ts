import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Project } from '../models/project.model';
import { MOCK_ENDPOINTS } from '@shared/constants';

/**
 * Service for managing project/case study data
 * Fetches data from local JSON files (Mockend pattern)
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly projectsUrl = MOCK_ENDPOINTS.PROJECTS;

  /**
   * Fetches all projects from the mock data source
   * @returns Observable of Project array
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl);
  }

  /**
   * Fetches a single project by ID
   * @param id - The unique identifier of the project
   * @returns Observable of Project or undefined if not found
   */
  getProjectById(id: string): Observable<Project | undefined> {
    return new Observable((observer) => {
      this.getProjects().subscribe({
        next: (projects) => {
          const project = projects.find((p) => p.id === id);
          observer.next(project);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
