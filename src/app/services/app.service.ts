import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import config from '../../config.json';
import { finalize, map, Observable, of, tap } from 'rxjs';
import { Place } from '../models/Place';
import { NewReview } from '../models/Review';
import { CustomerInfo } from '../models/CustomerInfo';

// import {generateCorrelationId} from "./Utils";

@Injectable({ providedIn: 'root' })
export class AppService {
  private correlationId: string | undefined;

  constructor(private http: HttpClient) {}

  public getConfig() {
    return config;
  }

  public getPopularSearches() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    return this.http
      .get(this.getConfig().popularSearchesEndpoint, { headers })
      .pipe(tap((t: any) => console.log('popular-searches response:: ', t)));
  }

  public getAllCuisines() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    return this.http
      .get(this.getConfig().allCuisinesEndpoint, { headers })
      .pipe(tap((t: any) => console.log('getAllCuisines response:: ', t)));
  }

  public getCuisinesItems() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    return this.http.get(this.getConfig().cuisinesItemsEndpoint, { headers }).pipe(
      map((items: any) => ({ data: items })),
      tap((t: any) => console.log('getCuisinesItems response:: ', t)),
    );
  }

  public getItem(params: { id: string; pageSize?: number; pageNum?: number }) {
    if (!params.id) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig().itemEndpoint.replace(':itemId', params.id);
    let httpParams = new HttpParams();
    httpParams = httpParams.append('pageSize', params.pageSize || 1);
    httpParams = httpParams.append('pageNum', params.pageNum || 1);
    return this.http.get(url, { headers, params: httpParams }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('getItem response:: ', t)),
    );
  }

  public getPlace(params: { id: string; pageSize?: number; pageNum?: number }): Observable<any> {
    if (!params.id) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig().placeEndpoint.replace(':placeId', params.id);
    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('pageSize', params.pageSize || 1);
    // httpParams = httpParams.append('pageNum', params.pageNum || 1);
    return this.http
      .get<Place>(url, {
        headers,
        // params: httpParams
      })
      .pipe(tap((t: any) => console.log('getPlace response:: ', t)));
  }

  public fetchItemInAPlace(params: { placeId: string; itemId: string }) {
    if (!params.itemId || !params.placeId) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig()
      .itemOfAPlaceEndpoint.replace(':itemId', params.itemId)
      .replace(':placeId', params.placeId);
    return this.http.get(url, { headers }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('fetchItemInAPlace response:: ', t)),
    );
  }

  public fetchReviewsOfItemInAPlace(params: { placeId: string; itemId: string; pageSize?: number; pageNum?: number }) {
    if (!params.itemId || !params.placeId) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig()
      .itemOfAPlaceEndpoint.replace(':itemId', params.itemId)
      .replace(':placeId', params.placeId);

    let httpParams = new HttpParams();
    httpParams = httpParams.append('pageSize', params.pageSize || 1);
    httpParams = httpParams.append('pageNum', params.pageNum || 1);
    // return this.http.get(url, {headers, params: httpParams})

    return this.http.get(url, { headers, params: httpParams }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('fetchReviewsOfItemInAPlace response:: ', t)),
    );
  }

  public feedbackReview(params: { reviewId: string; customerId: string; action: string }): Observable<any> {
    if (!params?.reviewId || !params.customerId || !params.action) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig().itemEndpoint.replace(':reviewId', params.reviewId);

    // const
    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('customerId', customerId);
    // httpParams = httpParams.append('action', action);
    return this.http.post(url, {
      customerId: params.customerId,
      action: params.action,
    });
  }

  public postReview(newReview: NewReview): Observable<any> {
    console.log('in app.service->postreview', newReview);
    if (!newReview.place) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig().postAReviewEndpoint; //.replace(':reviewId', params.reviewId);

    // const
    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('customerId', customerId);
    // httpParams = httpParams.append('action', action);
    return this.http.post(url, newReview);
  }

  public searchPlaceWithName(name: string): Observable<any> {
    if (!name) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = this.getConfig().searchForPlaceEndpoint; //.replace(':reviewId', params.reviewId);

    // const
    let params = new HttpParams();
    params = params.append('name', name);
    params = params.append('postcode', 2000);
    return this.http.get(url, { params });
  }

  public uploadMedia(data: {
    customerId?: string;
    correlationId: string;
    placeId?: string;
    itemId?: string;
    file: File;
  }): Observable<any> {
    // if (!name) return of(undefined);
    // this.correlationId = generateCorrelationId();
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
    });

    const url = this.getConfig().uploadMediaEndpoint; //.replace(':reviewId', params.reviewId);

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('correlationId', data.correlationId);
    if (!!data.customerId) {
      formData.append('customerId', data.customerId);
    }
    if (!!data.placeId) {
      formData.append('placeId', data.placeId);
    }
    if (!!data.itemId) {
      formData.append('itemId', data.itemId);
    }
    // const
    // let params = new HttpParams();
    // params = params.append('name', name);
    // const headers = new HttpHeaders({ 'ngsw-bypass': ''});

    // params = params.append('postcode', 2000);
    // return this.http.get(url, {params});
    return this.http.post(url, formData, { headers, reportProgress: true, observe: 'events' });
  }

  updateCustomer(customer: CustomerInfo): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
    });

    const url = this.getConfig().customerByIdEndpoint.replace(':customerId', customer.id);

    console.log('in updateCustomer url: ', url);
    return this.http.post(url, customer);
  }

  loginCustomer(params: { expiry: string; email: string; token: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
    });

    const url = this.getConfig().loginOidcCustomerEndpoint; //.replace(':reviewId', params.reviewId);

    console.log('in loginCustomer url: ', url);
    console.log('in loginCustomer ', params);
    return this.http.post(
      url,
      {
        email: params.email,
        token: params.token,
        expiry: params.expiry,
      },
      // {observe: 'response'}
    );
  }

  logoutCustomer(id: string | undefined): Observable<any> {
    if (!id) return of(undefined);
    console.log('in logoutCustomer, id: ', id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
    });

    const url = this.getConfig().logoutCustomerEndpoint.replace(':customerId', id);

    console.log('in logoutCustomer url: ', url);
    return this.http.post(url, {});
  }
}
