import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { filter, map, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Place } from '../models/Place';
import { NewReview, Review } from '../models/Review';
import { CustomerInfo } from '../models/CustomerInfo';
import { join } from '@fireflysemantics/join';
import { StaticDataService } from './static-data.service';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { customerSelector, preloadReviewDataSelector } from '../selectors/foodie.selector';
import { State } from '../reducers';

@Injectable({ providedIn: 'root' })
export class AppService implements OnDestroy{
  private readonly destroy$: Subject<any>;

  sds=inject(StaticDataService);
  private correlationId: string | undefined;
  private customer: CustomerInfo | undefined;
  constructor(private http: HttpClient, private store: Store< State>) {
    this.destroy$ = new Subject<any>();
    this.store.select(customerSelector()).pipe(
      takeUntil(this.destroy$)).subscribe( cust => this.customer = cust)
  }

  public getConfig() {
    return environment;
  }

  public getPopularSearches(args: { city?: string; postcode?: string; suburb?: string }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    const url = join(this.getConfig().host, this.getConfig().popularSearchesEndpoint);
    let params = new HttpParams();
    !!args?.city && (params =  params.append('city', args.city));
    !!args?.postcode && (params =  params.append('postcode', args.postcode));
    !!args?.suburb && (params =  params.append('suburb', args.suburb));
    console.log('in app.service, getPopularSearches() -> params',params);
    return this.http
      .get(url , { headers , params})
      .pipe(tap((t: any) => console.log('popular-searches response:: ', t)));
  }

  public getAllCuisines() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    return of(this.sds.getCuisines())
      .pipe();
  }

  public getCuisinesItems() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().cuisinesItemsEndpoint);
    return this.http.get(url, { headers }).pipe(
      map((items: any) => ({ data: items })),
      tap((t: any) => console.log('getCuisinesItems response:: ', t)),
    );
  }

  public getItem(params: { id: string; pageSize?: number; pageNum?: number }) {
    if (!params.id) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().itemEndpoint.replace(':itemId', params.id));
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

    const url = join(this.getConfig().host, this.getConfig().placeEndpoint.replace(':placeId', params.id));
    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('pageSize', params.pageSize || 1);
    // httpParams = httpParams.append('pageNum', params.pageNum || 1);
    return this.http
      .get<Place>(url, { headers, })
      .pipe(tap((t: any) => console.log('getPlace response:: ', t)));
  }

  public fetchItemInAPlace(params: { placeId: string; itemId: string }) {
    if (!params.itemId || !params.placeId) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });


    const url = join(this.getConfig().host, this.getConfig()
      .itemOfAPlaceEndpoint.replace(':itemId', params.itemId)
      .replace(':placeId', params.placeId));
    return this.http.get(url, { headers }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('fetchItemInAPlace response:: ', t)),
    );
  }

  public fetchReviewsOfItemInAPlace(params: { placeId: string; itemId: string; pageSize?: number; pageNum?: number }) {
    if (!params.itemId || !params.placeId) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig()
      .itemOfAPlaceEndpoint.replace(':itemId', params.itemId)
      .replace(':placeId', params.placeId));

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'CUSTOMER_ID': this.customer?.id || ''
    });

    const url = join(this.getConfig().host, this.getConfig().itemEndpoint.replace(':reviewId', params.reviewId));

    // const
    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('customerId', customerId);
    // httpParams = httpParams.append('action', action);
    return this.http.post(url, {
      customerId: params.customerId,
      action: params.action,
    }, {headers});
  }

  public postReview(/* newReview: NewReview */): Observable<any> {
    console.log('in app.service->postreview');
    return this.store.select(preloadReviewDataSelector()).pipe(
      filter(Boolean),
      take(1),
      tap(x => console.log('in app.service->postReview, found review in state: ', x)),
      switchMap( (data: { postReview: NewReview|Review|undefined, token: string}) => {
        if (!data.postReview || !data.postReview.place) {
          return of(undefined);
        }
        const headers =
          new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'CUSTOMER_ID': this.customer?.id || '',
            'x-token': data.token
          });

        let endpoint: any = this.getConfig().postAReviewEndpoint;
        const url = join(this.getConfig().host, endpoint); //.replace(':reviewId', params.reviewId);

        return this.http.post(url, data.postReview,{headers});
        })
    );
    // if (!newReview.place) return of(undefined);
    //
    // const headers =
    //   new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'CUSTOMER_ID': this.customer?.id || ''
    //   });
    //
    // let endpoint: any = this.getConfig().postAReviewEndpoint;
    // // if(!!newReview.item){
    // //   endpoint=this.getConfig().reviewAnItemOfAPlaceEndpoint.replace(':placeId', newReview.place.id);
    // // } else {
    // //   endpoint=this.getConfig().reviewAPlaceEndpoint.replace(':placeId', newReview.place).replace(':itemId', newReview.item);
    // // }
    // const url = join(this.getConfig().host, endpoint); //.replace(':reviewId', params.reviewId);
    //
    // // const
    // // let httpParams = new HttpParams();
    // // httpParams = httpParams.append('customerId', customerId);
    // // httpParams = httpParams.append('action', action);
    // return this.http.post(url, newReview,{headers});
  }

  public searchPlaceWithName(name: string): Observable<any> {
    if (!name) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().searchForPlaceEndpoint); //.replace(':reviewId', params.reviewId);

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
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
      'CUSTOMER_ID': this.customer?.id || ''
    });

    const url = join(this.getConfig().host, this.getConfig().uploadMediaEndpoint);

    let formData = new FormData();
     formData.append('files', data.file, data.file.name);
    // formData.append('correlationId', data.correlatiDonId);
    console.log('in app.service -> uploadMedia(), formData:: ', formData);
    console.log('in app.service -> uploadMedia(), formData:: ', formData.get('files'));
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

    const url = join(this.getConfig().host, this.getConfig().customerByIdEndpoint.replace(':customerId', customer.id));

    console.log('in updateCustomer url: ', url);
    return this.http.post(url, customer);
  }

  loginCustomer(args: { userInfo: any }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
    });

    const url = join(this.getConfig().host, this.getConfig().loginOidcCustomerEndpoint);

    console.log('in loginCustomer url: ', url);
    const data = {
      userInfo: args.userInfo
    };
    return this.http.post(
      url, data,
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

    const url = join(this.getConfig().host, this.getConfig().logoutCustomerEndpoint.replace(':customerId', id));

    console.log('in logoutCustomer url: ', url);
    return this.http.post(url, {});
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
