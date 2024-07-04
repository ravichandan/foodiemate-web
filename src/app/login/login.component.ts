import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGoogleService } from '../services/auth-google.service';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { AppService } from '../services/app.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, AsyncPipe, ReactiveFormsModule, FormsModule, GoogleSigninButtonModule, NgbNavModule, NgTemplateOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy, OnInit {
  private readonly destroy$: Subject<any>;

  config: any;
  appService= inject(AppService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private store: Store<State> = inject(Store);
  private router: Router = inject(Router);
  loginFG!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  authGoogleService = inject(AuthGoogleService);
  active=1;
  // constructor( private authService:SocialAuthService) {}

  // ngOnInit(): void {
  //   this.authService.authState.subscribe((user) => {
  //     console.log(user)
  //     //perform further logics
  //   });
  // }
  constructor(private authService: SocialAuthService) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.loginFG = this.fb.group({});
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log('in this.authService.authState.subscribe, user:: ', user);
      //perform further logics
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  submitLogin() {
    console.log('in login.component.ts->submitLogin');
    this.authGoogleService.login();
  }
}
