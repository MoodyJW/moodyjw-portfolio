import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';

import { API_CONFIG } from '@shared/constants';
import type { Translation, TranslocoLoader } from '@jsverse/transloco';

/**
 * Custom Transloco loader for loading translation files
 * Loads translations from assets/i18n/{lang}.json
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  /**
   * Loads translation file for the specified language
   * @param lang - Language code (e.g., 'en', 'es')
   * @returns Observable of translation object
   */
  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`${API_CONFIG.I18N_BASE}/${lang}.json`);
  }
}
