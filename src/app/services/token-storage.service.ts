import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class TokenStorageService extends OAuthStorage{

  constructor(private cookieService:CookieService){
    super();
  }

  getItem(key: string): string {
    const val = this.cookieService.get(key)
    console.log('in TokenStorageService->getItem(), key:: '+ key+', val: '+val);
    return val;
  }
  removeItem(key: string): void {
    this.cookieService.delete(key);
  }
  setItem(key: string, data: string): void {
    // debugger;
    this.cookieService.set(key, data,undefined,undefined,undefined,true);
  }

}
