import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, isPlatformBrowser, NgClass, NgForOf, NgIf, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { AppService } from './services/app.service';
import { LeftNavigationComponent } from './left-navigation/left-navigation.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { delay, Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { State } from './reducers';
import { Store } from '@ngrx/store';
import * as FoodieActions from './actions/foodie.actions';
import { HomeComponent } from './home/home.component';
import { SharingButtonsComponent } from './review-reply/sharing-buttons.component';
import { customerSelector, loggedInSelector } from './selectors/foodie.selector';
import { AuthGoogleService } from './services/auth-google.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { ToastService } from './services/toast.service';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { InViewportAction, InViewportModule } from 'ng-in-viewport';
import { ScrollPromptComponent } from './cutil/scroll-prompt.component';
import { ScrollToTopComponent } from './cutil/scroll-to-top.component';
import {GeolocationService} from '@ng-web-apis/geolocation';

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
    InViewportModule,

    HomeComponent,
    SharingButtonsComponent,
    RouterLink,
    OAuthModule,
    ToastContainerComponent,
    SlicePipe,
    ScrollPromptComponent,
    ScrollToTopComponent,
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
  customer$: Observable<any>;
  authGoogleService = inject(AuthGoogleService);
  toastService = inject(ToastService);
  cookieService: CookieService = inject(CookieService);
  protected isLoggedIn: boolean = false;
  private readonly destroy$: Subject<any>;
  private isBrowser: boolean = false;

  showScrollPrompt;
  showScrollToTop = true;

  constructor(
    private appService: AppService,
    // private authService: AppService,
    private store: Store<State>,
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly geolocation$: GeolocationService,
    private router: Router) {
      geolocation$.pipe(
        
        tap(position => {
          console.log('JSON.string(position):: ', JSON.stringify(position));
          this.store.dispatch(FoodieActions.updateLocation({location:{latitude: position.coords?.latitude, longitude: position.coords?.longitude}} ))
        }),
        switchMap((position: GeolocationPosition) => 
          this.appService.getSuburbNameFromLocation(position.coords?.latitude.toString(), position.coords?.longitude.toString()).pipe(
            take(1),
            tap(response => {
              this.store.dispatch(FoodieActions.updateLocation({
                location:{latitude: position.coords?.latitude, longitude: position.coords?.longitude},
                suburb: response.name
              }));
            })
          )
        ),
        // delay(3000),
        take(1),
      ).subscribe();

      this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.store.dispatch(FoodieActions.clearError());
      }
    });
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      console.log('in app.component.ts constructor, window.location.href:: ', window.location.href);
    }
    this.config = this.appService.getConfig();

    this.showScrollPrompt = this.config.showScrollPrompt ?? false;
    this.destroy$ = new Subject<any>();
    this.store
      .select(loggedInSelector())
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => (this.isLoggedIn = val));

    this.customer$ = this.store
      .select(customerSelector())
      .pipe(takeUntil(this.destroy$));
    // .subscribe(();
  }

  ngOnInit(): void {

    if (this.isBrowser) {
      // console.log('in app.component.ts ngOnInit, window.location.href:: ', window.location.href);
      const x = new URLSearchParams(window.location.search);
      const y = x.get('state');
      if (y) {
        const states = y.split(';');
        if (states.length > 1) {
          const state = states[1];
          if (!!state) {
            let url = decodeURIComponent(state);
            console.log('Redirecting to ', url);
            this.router.navigate([url]).then();
          }
        }
      } else {
        console.log('User must be already logged in');

        // const token = "eyJ0eXAiO.../// jwt token";
        const act = this.cookieService.get('id_token');
        if(!!act) {
          // console.log('Access token: ', act);
          const decoded: any = jwtDecode(act);
          // console.log('Decoded Access token: ', decoded);
          this.store.dispatch(
            FoodieActions.loginOidcCustomer({
              userInfo: {
                info: {
                  email: decoded.email,
                },
                token:act
              },
            }),
          );
        }
      }

    }
    this.items = this.config.navigation_menu;
    this.store.dispatch(FoodieActions.fetchCuisines());
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

  navigateHome() {
    this.router.navigate(['/home']).then();
  }

  testToast() {
    this.toastService.showSuccess('Thank you, we have received your review');
    this.toastService.showDanger('Thank you, we have received your review');
  }

  submitSearch(topSearch: HTMLInputElement) {
    if(!!topSearch.value) {
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['home'], { queryParams: { search: topSearch.value } }));
    }
  }

  endInSight({ target, visible }: { target: Element; visible: boolean }) {
    this.showScrollPrompt=!visible;
  }

  startOutOfSight({ target, visible }: { target: Element; visible: boolean }) {
    this.showScrollToTop=!visible;
  }

 /* handlePermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        this.report(result.state);
        // geoBtn.style.display = "none";
      } else if (result.state === "prompt") {
        this.report(result.state);
        // geoBtn.style.display = "none";
        // navigator.geolocation.getCurrentPosition(
        //   revealPosition,
        //   positionDenied,
        //   geoSettings,
        // );
      } else if (result.state === "denied") {
       this.report(result.state);
        // geoBtn.style.display = "inline";
      }
      result.addEventListener("change", () => {
        this.report(result.state);
      });
    });
  }

  report(state: any) {
    console.log(`Permission ${state}`);
  }*/
}






