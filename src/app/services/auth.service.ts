import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from '../../config.json';
import { tap } from 'rxjs';

// import {generateCorrelationId} from "./Utils";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private correlationId: string | undefined;

  constructor(private http: HttpClient) {}

  public getConfig() {
    return config;
  }

  public signInWithGoogle() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    return this.http
      .get(this.getConfig().popularSearchesEndpoint, { headers })
      .pipe(tap((t: any) => console.log('popular-searches response:: ', t)));
  }
}
