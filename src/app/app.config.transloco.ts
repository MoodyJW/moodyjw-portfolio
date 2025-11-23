import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { isDevMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';

/**
 * Transloco configuration provider
 * Provides internationalization (i18n) support for the application
 */
export const translocoConfig = [
  provideHttpClient(),
  provideTransloco({
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
  }),
];

export { TranslocoModule };
