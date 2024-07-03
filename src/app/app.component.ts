import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AppService } from './services/app.service';
import { LeftNavigationComponent } from './left-navigation/left-navigation.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { Subject, takeUntil } from 'rxjs';
import { State } from './reducers';
import { Store } from '@ngrx/store';
import * as FoodieActions from './actions/foodie.actions';
import { HomeComponent } from './home/home.component';
import { SharingButtonsComponent } from './review-reply/sharing-buttons.component';
import { loginSelector } from './selectors/foodie.selector';
import { AuthGoogleService } from './services/auth-google.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BrowserModule } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    FormsModule,
    LeftNavigationComponent,
    NgTemplateOutlet,
    NgForOf,
    NavigationComponent,
    HoverClassDirective,
    NgIf,
    AsyncPipe,
    NgClass,
    HomeComponent,
    SharingButtonsComponent,
    RouterLink,
    OAuthModule,
    // BrowserModule,
    // OAuthModule.forRoot({
    //   resourceServer: {
    //     allowedUrls: [
    //       'http://www.angular.at/api',
    //       'http://localhost:3000/',
    //       'http://127.0.0.1:3000/'
    //     ],
    //     sendAccessToken: true
    //   }
    // })
    // OAuthModule.forRoot({
    //   resourceServer: {
    //     allowedUrls: ['http://www.angular.at/api'],
    //     sendAccessToken: true
    //   }
    // })
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  config: any;
  protected isLoggedIn: boolean = false;
  private readonly destroy$: Subject<any>;
  private isBrowser: boolean = false;

  authGoogleService = inject(AuthGoogleService);

  constructor(
    private appService: AppService,
    private authService: AppService,
    private store: Store<State>,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      console.log('in app.component.ts constructor, window.location.href:: ', window.location.href);
    }
    this.config = this.appService.getConfig();

    this.destroy$ = new Subject<any>();
    this.store
      .select(loginSelector())
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => (this.isLoggedIn = val));
  }

  ngOnInit(): void {
    console.log('environment.production::', environment.production);
    if (this.isBrowser) {
      console.log('in app.component.ts ngOnInit, window.location.href:: ', window.location.href);
    }
    this.items = this.config.navigation_menu;
    this.store.dispatch(FoodieActions.fetchCuisines());
    // this.store.dispatch(FoodieActions.fetchCuisinesItems());
    // console.log('in app.component, onInit, this.oauthService.hasValidAccessToken();:: ', this.authGoogleService.hasValidAccessToken())
    // if(this.authGoogleService.hasValidAccessToken()){
    //   this.authGoogleService.getUserInfo().then((userInfo:any)=> {
    //     console.log('in userinfo:: ', userInfo);
    //     this.store.dispatch(FoodieActions.loginOidcCustomer({ email: userInfo.info.email, token: this.authGoogleService.getToken(),expiry: userInfo.info.exp  }));
    //   })
    // }else {
    //   this.store.dispatch(FoodieActions.logoutCustomer());
    // }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(FoodieActions.pageDestroyed());
  }

  logoutClicked() {
    console.log(
      'in app.component.onLogoutClicked, this.oauthService.hasValidAccessToken();:: ',
      this.authGoogleService.hasValidAccessToken(),
    );
    this.authGoogleService.logout();
  }
}
