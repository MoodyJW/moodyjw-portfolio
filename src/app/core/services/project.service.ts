import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { catchError, map, of, timeout } from 'rxjs';

import { HTTP_TIMEOUTS, MOCK_ENDPOINTS } from '@shared/constants';

import type { Project } from '../models/project.model';

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
    return this.getProjects().pipe(
      timeout(HTTP_TIMEOUTS.DEFAULT),
      map((projects) => projects.find((p) => p.id === id)),
      catchError((error) => {
        console.error('Failed to load project', { id, error });
        return of(undefined);
      })
    );
  }
}
