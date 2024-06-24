import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { loginSelector } from '../selectors/foodie.selector';
import { map, Observable, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private store: Store<State>,
    private router: Router,
  ) {}

  canActivate() {
    return this.store.select(loginSelector()).pipe(
      take(1),
      map((loggedIn: boolean) => {
        if (loggedIn) {
          return true;
        }
        console.log('User not authenticated, redirecting to login');
        this.router.navigate(['login']);
        return false;
      }),
    );
  }
}
