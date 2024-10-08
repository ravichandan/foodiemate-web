import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MockDataService } from './services/mock-data.service';
import { createServer } from 'miragejs';
import { provideStore } from '@ngrx/store';
import { metaReducers, reducers } from './reducers';
import { provideEffects } from '@ngrx/effects';
import { FoodieEffects } from './effects/foodie.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { TokenStorageService } from './services/token-storage.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

export function initializeMockData(mockService: MockDataService) {
  if(!environment.production) {
    // createServer({
    //   routes(): void {
    //     mockService.setRouteHandlers(this);
    //   },
    // });
  }
  return () => {
    return new Promise((resolve) => {
      resolve(true);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(),
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['http://www.angular.at/api', 'http://localhost:3000/', 'http://127.0.0.1:3000/'],
        sendAccessToken: true,
      },
    }),
    importProvidersFrom(ModalModule.forRoot()),
    importProvidersFrom(TypeaheadModule.forRoot()),
    // withFetch()
    // importProvidersFrom(    NgMultiSelectDropDownModule.forRoot()),
    // MockDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMockData,
      multi: true,
      deps: [MockDataService],
    },
    provideStore(reducers, { metaReducers }),
    provideEffects(FoodieEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    // importProvidersFrom(OAuthModule.forRoot({
    //   resourceServer: {
    //     allowedUrls: [
    //       'http://www.angular.at/api',
    //       'http://localhost:3000/',
    //       'http://127.0.0.1:3000/'
    //     ],
    //     sendAccessToken: true
    //   }
    // })),
    {
      provide: OAuthStorage,
      useClass: TokenStorageService
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('7360139281-qbgics3laaps2sapu417fhkfmgcc4bja.apps.googleusercontent.com'),
          },
        ],
        onError: (error: any) => {
          console.error(error);
        },
      } as SocialAuthServiceConfig,
    },
  ],
};
