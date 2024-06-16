import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import config from '../../config.json';
import { finalize, map, Observable, of, tap } from 'rxjs';
import { Place } from '../models/Place';
import { NewReview } from '../models/Review';

// import {generateCorrelationId} from "./Utils";

@Injectable({ providedIn: 'root' })
export class AppService {
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
