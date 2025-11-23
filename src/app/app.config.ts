import type { ApplicationConfig} from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { latencyInterceptor } from './core/interceptors/latency.interceptor';
import { translocoConfig } from './app.config.transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([latencyInterceptor])),
    ...translocoConfig,
  ],
};
