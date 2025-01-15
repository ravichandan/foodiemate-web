import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { filter, map, Observable, of, Subject, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { Place } from '../models/Place';
import { NewReview, Review } from '../models/Review';
import { CustomerInfo } from '../models/CustomerInfo';
import { join } from '@fireflysemantics/join';
import { StaticDataService } from './static-data.service';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { customerSelector, locationSelector, preloadReviewDataSelector } from '../selectors/foodie.selector';
import { State } from '../reducers';
import { PlacesResponse } from '../models/PlacesResponse';
import { ItemResponse } from '../models/ItemResponse';
import { Location } from '../models/Location';
import { PopularResponse } from '../models/PopularResponse';

@Injectable({ providedIn: 'root' })
export class AppService implements OnDestroy{
  private readonly destroy$: Subject<any>;

  sds=inject(StaticDataService);
  private correlationId: string | undefined;
  private customer: CustomerInfo | undefined;
  private location: Location|undefined;
  constructor(private http: HttpClient, private store: Store< State>) {
    this.destroy$ = new Subject<any>();
    this.store.select(customerSelector()).pipe(
      takeUntil(this.destroy$)).subscribe( cust => this.customer = cust);

    this.store.select(locationSelector()).pipe(
      takeUntil(this.destroy$)).subscribe( loc => this.location = loc);
  }

  public getConfig() {
    return environment;
  }

  public getPopularItems(args: { city?: string; postcode?: string; suburb?: string; diets?: any[]; distance: number; pageSize?: number; pageNum?: number }) {
    console.log('in app.service, getPopularItems() -> args', args);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    const url = join(this.getConfig().host, this.getConfig().popularItemsEndpoint);
    let params = new HttpParams();
    !!args?.city && (params =  params.append('city', args.city));
    !!args?.postcode && (params =  params.append('postcode', args.postcode));
    !!args?.suburb && (params =  params.append('suburb', args.suburb));
    !!args?.distance && (params =  params.append('distance', args.distance));
    params =  params.append('state', 'nsw');

    // location query params
    !!this.location && (params =  params.append('latitude', this.location.latitude));
    !!this.location && (params =  params.append('longitude', this.location.longitude));

    if(args?.diets){
      const diets: string = args.diets.map(d => d.value).filter(Boolean).join(',');
      !!diets && (params =  params.append('diets', diets));
    }

    params = params.append('pageSize', args.pageSize || 8);
    params = params.append('pageNum', args.pageNum || 1);

    console.log('in app.service, getPopularItems() -> params', params);
    return this.http
      .get<PopularResponse>(url , { headers , params});//
      // .pipe(tap((t: any) => console.log('popular-searches response:: ', t)));
  }

  public getPopularPlaces(args: { city?: string; postcode?: string; suburb?: string; diets?: any[]; distance: number; }) {
    console.log('in app.service, getPopularPlaces() -> args', args);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    const url = join(this.getConfig().host, this.getConfig().popularPlacesEndpoint);
    let params = new HttpParams();
    !!args?.city && (params =  params.append('city', args.city));
    !!args?.postcode && (params =  params.append('postcode', args.postcode));
    !!args?.suburb && (params =  params.append('suburb', args.suburb));
    !!args?.distance && (params =  params.append('distance', args.distance));
    params =  params.append('state', 'nsw');
    // location query params
    !!this.location && (params =  params.append('latitude', this.location.latitude));
    !!this.location && (params =  params.append('longitude', this.location.longitude));

    if(args?.diets){
      const diets: string = args.diets.map(d=> d.value).filter(Boolean).join(',');
      !!diets && (params =  params.append('diets', diets));
    }
    console.log('in app.service, getPopularPlaces() -> params', params);
    return this.http
      .get<PopularResponse>(url , { headers , params});//
      // .pipe(tap((t: any) => console.log('popular-searches response:: ', t)));
  }

  public getAllSuburbs(city: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().suburbsEndpoint);
    let params = new HttpParams();
    params = params.append('city', city);
    console.log('in app.service, getAllSuburbs() -> params',params);

    return this.http
      .get(url , { headers , params})
      .pipe(tap((t: any) => console.log('/suburbs response:: ', t)));
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

  public getItem(args: { id: string; city?: string; suburb?: string; postcode?: string; pageSize?: number; pageNum?: number }) {
    if (!args.id) return of(undefined);
    console.log('in app.service->getItem, args:: ', args);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().itemEndpoint.replace(':itemId', args.id));
    let httpParams = new HttpParams();
    httpParams = httpParams.append('pageSize', args.pageSize || 1);
    httpParams = httpParams.append('pageNum', args.pageNum || 1);
    httpParams = args.city ? httpParams.append('city', args.city): httpParams;
    httpParams = args.suburb ? httpParams.append('suburb', args.suburb): httpParams;
    httpParams = args.postcode ? httpParams.append('postcode', args.postcode): httpParams;

    return this.http.get(url, { headers, params: httpParams }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('getItem response:: ', t)),
    );
  }

  public getPlace(args: { id: string; fetchMenu?: boolean; fetchReviews?: boolean; pageSize?: number; pageNum?: number }): Observable<any> {
    if (!args.id) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    console.log('in app.service.getPlace, args:: ', args);
    const url = join(this.getConfig().host, this.getConfig().placeEndpoint.replace(':placeId', args.id));
    let params = new HttpParams();
    params = params.append('pageSize', args.pageSize || 5);
    params = params.append('pageNum', args.pageNum || 1);
    params = args.fetchMenu? params.append('fetchMenu', true): params ;
    params = args.fetchReviews? params.append('fetchReviews', true): params ;

    return this.http
      .get<Place>(url, { headers, params})
      .pipe(tap((t: any) => console.log('getPlace response:: ', t)));
  }

  public fetchItemInAPlace(args: { placeId?: string; itemId?: string ; placeItemId?: string }) {
    if (!args.itemId && !args.placeId && !args.placeItemId) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    console.log('in app.service, fetchItemInAPlace, args:: ', args);
    let url ;
    if(args.placeItemId) {
      url = join(this.getConfig().host, this.getConfig()
        .itemOfAPlaceEndpoint.replace(':itemId', args.placeItemId)
        .replace('/:placeId', ''));
    } else {
      url = join(this.getConfig().host, this.getConfig()
        .itemOfAPlaceEndpoint.replace(':itemId', args.itemId)
        .replace(':placeId', args.placeId));
    }
    return this.http.get(url, { headers }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('fetchItemInAPlace response:: ', t)),
    );
  }


  public getReviewMediasOfItem(args: { placeId: string; itemId: string;  pageSize?: number; pageNum?: number  }) {
    console.log('in app.service, getReviewMediasOfItem, args:: ', args);
    if (!args.itemId || !args.placeId) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    
    
    let params = new HttpParams();
    params = params.append('pageSize', args.pageSize || 30);
    params = params.append('pageNum', args.pageNum || 1);
    
    let url ;

    url = join(this.getConfig().host, this.getConfig()
      .reviewMediasOfItemEndpoint.replace(':itemId', args.itemId)
      .replace(':placeId', args.placeId));

    return this.http.get(url, { headers, params }).pipe(
      // map((item: any) => ({data: items})),
      tap((t: any) => console.log('getReviewMediasOfItem response:: ', t)),
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

  public feedbackReview(args: { reviewId: string; action: string }): Observable<any> {
    if(!this.customer){
      let msg ='You have to login first to do this';
      console.error(msg);
      return throwError(() => new HttpErrorResponse({error: new Error(msg), status: 401, statusText: msg}));
    }
    if (!args?.reviewId || !args.action) throw new Error('At least one of the required args is missing: '+ args);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'CUSTOMER_ID': this.customer?._id || '',
      'x-action': args.action
    });

    console.log('in app.service, feedbackReview(), params: ', args);
    const url = join(this.getConfig().host, this.getConfig().feedbackAReviewEndpoint.replace(':reviewId', args.reviewId));

    // const
    // let httpParams = new HttpParams();
    // httpParams = httpParams.append('customerId', customerId);
    // httpParams = httpParams.append('action', action);
    return this.http.put(url, {
      customerId: this.customer._id,
      action: args.action,
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
            'CUSTOMER_ID': this.customer?._id || '',
            'x-token': data.token
          });

        let endpoint: any = this.getConfig().postAReviewEndpoint;
        const url = join(this.getConfig().host, endpoint); //.replace(':reviewId', params.reviewId);

        return this.http.post(url, data.postReview,{headers});
        })
    );
  }

  public searchPlaceWithName(args: { placeName: string,itemName?: string, suburbs?: string, dietaries? : any[], cuisines?: string[], includeSurroundingSuburbs?: boolean, distance?: number }): Observable<PlacesResponse| undefined> {
    console.log(
      'in app.service->searchPlaceWithName args:: ',args
    )
    if (!args.placeName) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().searchForPlaceEndpoint); //.replace(':reviewId', params.reviewId);

    let params = new HttpParams();
    params = params.append('placeName', args.placeName);
    if(args.itemName) {
      params = params.append('itemName', args.itemName);
    }
    if(args.suburbs?.length) {
      params = params.append('suburbs', args.suburbs);//.join(','));
      params = params.append('includeSurroundingSuburbs', !!args.includeSurroundingSuburbs);
    }

    if(args.dietaries?.length) {
      params = params.append('dietaries', args.dietaries.map(x=> x.value).join(','));
    }

    if(args.cuisines?.length) {
      params = params.append('cuisines', args.cuisines.join(','));
    }

    !!args?.distance && (params =  params.append('distance', args.distance));

    // location query params
    !!this.location && (params =  params.append('latitude', this.location.latitude));
    !!this.location && (params =  params.append('longitude', this.location.longitude));

    params = params.append('city', 'sydney');
    return this.http.get<PlacesResponse>(url, { params });//.pipe(tap(x =>
    // console.log('app.service -> searchPlaceWithName, response:: ', x)));
  }


  public searchItemsWithName(args: { itemName?: string, postcode?: string, suburbs?: string[], dietaries? : any[], cuisines?: string[], includeSurroundingSuburbs?: boolean, distance?: number }): Observable<ItemResponse| undefined> {
    if (!args.itemName) return of(undefined);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    const url = join(this.getConfig().host, this.getConfig().searchForItemsEndpoint); //.replace(':reviewId', params.reviewId);

    let params = new HttpParams();
    params = params.append('itemName', args.itemName);
    if(args.suburbs) {
      params = params.append('suburbs', args.suburbs.join(','));
      params = params.append('includeSurroundingSuburbs', !!args.includeSurroundingSuburbs);
    }

    if(args.dietaries?.length) {
      params = params.append('dietaries', args.dietaries.map(x=> x.value).join(','));
    }

    if(args.cuisines?.length) {
      params = params.append('cuisines', args.cuisines.join(','));
    }
    
    if(args.distance){
      params = params.append('distance', args.distance);
    }
    // location query params
    !!this.location && (params =  params.append('latitude', this.location.latitude));
    !!this.location && (params =  params.append('longitude', this.location.longitude));

    params = params.append('city', 'Sydney');
    return this.http.get<ItemResponse>(url, { params });//.pipe(tap(x =>
    // console.log('app.service -> searchItemsWithName, response:: ', x)));
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
      'CUSTOMER_ID': this.customer?._id || ''
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

    const url = join(this.getConfig().host, this.getConfig().customerByIdEndpoint.replace(':customerId', customer._id));

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

  getSuburbNameFromLocation(latitude: string | undefined, longitude: string| undefined): Observable<any> {
    if (!latitude || !longitude) return of(undefined);
    console.log('in getSuburbNameFromLocation, latitude ', latitude, 'longitude: ', longitude);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'ngsw-bypass': '',
    });

    let params = new HttpParams();
    params = params.append('latitude', latitude);
    params = params.append('longitude', longitude);

    const url = join(this.getConfig().host, this.getConfig().suburbNameFromLocationEndpoint);

    console.log('in getSuburbNameFromLocation url: ', url);
    return this.http.get(url, {headers, params});
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
