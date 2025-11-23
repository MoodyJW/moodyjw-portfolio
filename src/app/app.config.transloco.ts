import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';

/**
 * Transloco configuration provider
 * Provides internationalization (i18n) support for the application
 * Note: HttpClient is provided in app.config.ts with interceptors
 */
export const translocoConfig = provideTransloco({
  config: {
    availableLangs: ['en'],
    defaultLang: 'en',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
    fallbackLang: 'en',
    missingHandler: {
      useFallbackTranslation: true,
    },
  },
  loader: TranslocoHttpLoader,
});

export { TranslocoModule };
