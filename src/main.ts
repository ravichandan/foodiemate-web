/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(ref => {
    // Ensure Angular destroys itself on hot reloads.
    // @ts-ignore
    if (window['ngRef']) {
      // @ts-ignore
      window['ngRef'].destroy();
    }
    // @ts-ignore
    window['ngRef'] = ref;

    // Otherwise, log the boot error
  })
  .catch((err) => console.error(err));
