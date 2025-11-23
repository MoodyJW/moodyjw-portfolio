import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Translation, TranslocoLoader } from '@jsverse/transloco';
import type { Observable } from 'rxjs';

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
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
