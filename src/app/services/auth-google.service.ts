import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import config from '../../config.json';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import * as FoodieActions from '../actions/foodie.actions';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AppService } from './app.service';

// import {generateCorrelationId} from "./Utils";

@Injectable({ providedIn: 'root' })
export class AuthGoogleService {
  private oa: OAuthService = inject(OAuthService);
  private appService = inject(AppService)
  private router: Router = inject(Router);
  private store: Store<State> = inject(Store);

  config: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.config = this.appService.getConfig();

    if (isPlatformBrowser(platformId)) {
      this.initConfig({ customHashFragment: window.location.search }, this.config.oauthRedirectUrl?? undefined);
    }
  }

  public getConfig() {
    return this.config;
  }

  public initConfig(options: any = {}, redirectUrl: string = 'http://localhost:4300/index.html') {
    const authCodeFlowConfig: AuthConfig = {
      // Url of the Identity Provider
      issuer: 'https://accounts.google.com',

      // URL of the SPA to redirect the user to after login
      // redirectUri: window.location.origin + '/index.html',
      redirectUri: redirectUrl,
      // redirectUri: 'http://localhost:4300/index.html',

      // The SPA's id. The SPA is registerd with this id at the auth-server
      // clientId: 'server.code',
      clientId: '7360139281-qbgics3laaps2sapu417fhkfmgcc4bja.apps.googleusercontent.com',

      // Just needed if your auth server demands a secret. In general, this
      // is a sign that the auth server is not configured with SPAs in mind
      // and it might not enforce further best practices vital for security
      // such applications.
      dummyClientSecret: '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',
      // dummyClientSecret: 'secret',
      userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',

      responseType: 'code',
      useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
      silentRefreshTimeout: 5000,
      // set the scope for the permissions the client should request
      // The first four are defined by OIDC.
      // Important: Request offline_access to get a refresh token
      // The api scope is a usecase specific one
      scope: 'openid profile email ',

      showDebugInformation: true,
      requestAccessToken: true,
      // Not recommended:
      // disablePKCI: true,
      strictDiscoveryDocumentValidation: false,

      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      // silentRefreshTimeout: 5000, // For faster testing
      // timeoutFactor: 0.25,
    };

    this.oa.configure(authCodeFlowConfig);

    this.oa.events.subscribe((e) => {
      if (['token_received'].includes(e.type)) {
        console.log('token_recieveddd:: ');
        this.oa.loadUserProfile().then((userInfo: any) => {
          // console.log('in auth-google.service, userInfo: ', userInfo);
          userInfo.token=this.getToken();
          this.store.dispatch(
            FoodieActions.loginOidcCustomer({
              userInfo
            }),
          );
        });
      } else if (['session_error', 'session_terminated'].includes(e.type)) {
        this.store.dispatch(FoodieActions.logoutCustomer());
      }
    });
    // this.oa.setupAutomaticSilentRefresh();
    // this.oa.loadDiscoveryDocument();//AndTryLogin();
    this.oa.loadDiscoveryDocumentAndTryLogin(options).then();

    /* 3
    this.oa.events.subscribe(e => {
        console.log('in new code, event, ', e);
        console.log('in new code, event, his.oa.hasValidAccessToken()', this.oa.hasValidAccessToken());
        // this.isAuthenticatedSubject$.next(this.oa.hasValidAccessToken());
      });
    this.oa.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(e => {
        console.log('2. in token_received:: ');
        this.oa.loadUserProfile();
      });

    this.oa.events
      .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
      .subscribe(e => console.log('1. session terminated'));

    this.oa.setupAutomaticSilentRefresh();
    this.oa.loadDiscoveryDocument(options)
      .then(
      val=> {

        console.log('loaded DD, val::',val);

        return this.oa.tryLogin(options)
      }
    )
      .then(() => new Promise<void>(resolve => setTimeout(() => resolve(), 1000)))
      .then(_=> console.log('loadDDAndTryLogin(), validTOken: ', this.oa.hasValidAccessToken()))
      // .then(_=> !this.oa.hasValidAccessToken() ? this.oa.silentRefresh(): undefined)
      .catch(err => console.error('loadDDAndTryLogin(), error', err))
      // .then(r => console.log('result of silentRefresh, hasValidAccessToken :: ', this.oa.hasValidAccessToken()))
    ;

    */
    // this.oa.tryLogin({
    //   onTokenReceived: context => {
    //     console.debug('2222 logged innnnn');
    //     console.log('2222 logged innnnn');
    //     console.debug(context);
    //   },
    // });

    // this.oa.strictDiscoveryDocumentValidation = false;
    // this.oa.loadDiscoveryDocumentAndTryLogin({
    //   onTokenReceived: context => {
    //     console.debug('1111 logged innnnn');
    //     console.debug(context);
    //   },
    // }).then((val) =>
    //   console.log('loadDDAndTryLogin():: val :: ', val))
    //   .catch(err => console.error('loadDDAndTryLogin(), error', err));
    // this.oa.tryLogin({
    //   onTokenReceived: context => {
    //     console.debug('2222 logged innnnn');
    //     console.debug(context);
    //   },
    // });

    /* //copied
    `//this.oa.configure(authCodeFlowConfig);
    // this.oa.tokenValidationHandler = new JwksValidationHandler();
    // this.oa.events.subscribe(e => {
    //   console.log('in new code, event, ', e);
    //   console.log('in new code, event, his.oa.hasValidAccessToken()', this.oa.hasValidAccessToken());
    //   // this.isAuthenticatedSubject$.next(this.oa.hasValidAccessToken());
    // });
    this.oa.loadDiscoveryDocumentAndLogin()
      .then((val ) => console.log('loadDDAndTryLogin()->then, val:: ', val))
      .catch((err) => console.error('loadDDAndTryLogin()->error:: ', err));

     */
  }

  public async login(args?:{ redirectUrl?: string, state?: string
}) {
    console.log('in auth-google.service, state:: ', args?.state);
    // http://localhost:4300/places/6681190cfba0035e4672b98a/items/668a7fd5ed97f7a5de5f5690
    // this.initConfig(redirectUrl);
    // this.oa.redirectUri = redirectUrl;
    // setTimeout(()=> {
    this.oa.initCodeFlow(args?.state);
    // }, 10)

    console.log('end in auth-google.service, state:: ', args?.state);
  }

  public logout() {
    // this.oa.revokeTokenAndLogout();
    this.store.dispatch(FoodieActions.logoutCustomer());
    this.oa
      .revokeTokenAndLogout()
      .then((val) => console.log('revokeTokenAndLogout():: val :: ', val))
      .catch((err) => console.error('revokeTokenAndLogout(), error', err));
    this.oa.logOut();
  }

  public getProfile() {
    this.oa.getIdentityClaims();
  }

  public getToken() {
    return this.oa.getIdToken();
  }

  public hasValidAccessToken(): boolean {
    return this.oa.hasValidAccessToken();
  }

  public getUserInfo() {
    return this.oa.loadUserProfile();
  }
}
