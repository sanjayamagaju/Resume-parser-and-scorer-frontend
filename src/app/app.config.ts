import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideToastr} from 'ngx-toastr';
import {provideMarkdown} from 'ngx-markdown';

import {routes} from './app.routes';
import {TOASTER_TIMEOUT_SESSION} from '../utils/constants';
import {HttpClientModule} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideToastr({
      timeOut: TOASTER_TIMEOUT_SESSION,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      easing: 'ease-in-out',
      easeTime: 300,
      progressBar: true,
    }),
  ]
};
