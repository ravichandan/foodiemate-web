import {
  AfterContentInit, AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  OperatorFunction,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { customerSelector, postReviewResultSelector, preloadReviewDataSelector } from '../selectors/foodie.selector';
import { Place } from '../models/Place';
import { NewReview } from '../models/Review';
import { AsyncPipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTypeahead, NgbTypeaheadConfig, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../services/app.service';
import { PlacesResponse } from '../models/PlacesResponse';
import { Item } from '../models/Item';
import { ReplacePipe } from '../directives/replace.pipe';
import { generateCorrelationId, getFileType } from '../services/Utils';
import * as FoodieActions from '../actions/foodie.actions';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ConnectFormDirective } from '../directives/connectForm.directive';
import { CustomerInfo } from '../models/CustomerInfo';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-post-review-item-unit',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, NgbTypeahead, ReplacePipe, DecimalPipe, NgTemplateOutlet],
  templateUrl: 'post-review-item-unit.component.html',
  styleUrl: './post-review.component.scss',
  providers: [NgbTypeaheadConfig], // add NgbTypeaheadConfig to the component providers
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostReviewItemUnitComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;

  @Input('selectedItems')
  selectedItems!: { [k: string]: string };

  @Input('itemControlName')
  itemControlName!: string;

  @Input('itemGroupName')
  itemGroupName!: string;

  @Input('index')
  index!: number;

  @Input('reviewFormGroup')
  reviewFormGroup!: FormGroup;

  @Output()
  close: EventEmitter<string>;

  appService= inject(AppService);

  itemGroup: FormGroup | undefined;
  itemFocus$ = new Subject<any>();
  itemClick$ = new Subject<any>();

  showNext: boolean = false;
  ctrlSuffix: string = '';

  filename: string = '';
  uploadSub: Subscription | undefined;
  protected readonly Object = Object;
  correlationId: string = generateCorrelationId();
  mediaTemplates: any = {
    1: {
      id: 1,
      filename: undefined,
      uploadProgress: 0,
    },
    2: {
      id: 2,
      filename: undefined,
      uploadProgress: 0,
    },
    3: {
      id: 3,
      filename: undefined,
      uploadProgress: 0,
    },
  };

  constructor(
    public route: ActivatedRoute,
    private store: Store<State>,
    private cdRef: ChangeDetectorRef,
    ngbConfig: NgbTypeaheadConfig,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.close = new EventEmitter();
    // this.reviewFormGroup = this.defaultForm();

    // customize default values of typeahead used by this component tree
    ngbConfig.showHint = true;
  }

  ngOnInit() {
    console.log('in PostReviewItemUnitComponent, ngOnInit(), itemGroupName:', this.itemGroupName);
    this.ctrlSuffix =
      // this.itemGroupName.replace('item','').replace('Group','') +
      'Ctrl';
    this.itemGroup = this.reviewFormGroup.controls[this.getFormGroupName()] as FormGroup;
    this.itemGroup?.controls['item' + this.ctrlSuffix].valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter((data) => !!data),
        tap((x) => console.log('In itemCtrl value changes, value:: ', x)),
        tap((x) => (this.showNext = true)),
        tap((x) => this.itemGroup?.controls['item' + this.ctrlSuffix].addValidators(Validators.required)),
        tap((x) => this.itemGroup?.controls['taste' + this.ctrlSuffix].addValidators(Validators.min(1))),
        tap((x) => this.itemGroup?.controls['presentation' + this.ctrlSuffix].addValidators(Validators.min(1))),
        tap((x) => this.cdRef?.detectChanges()),
      )
      .subscribe();

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  formatter = (x: Place | Item) => x.name;

  extractItems: () => Item[] = () => Object.values(this.reviewFormGroup.value.placeCtrl?.items ?? [] ) as Item[];

  searchItemTypeahead: OperatorFunction<string, readonly Item[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(350), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.itemClick$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.itemFocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        this.extractItems()
          .filter(Boolean)
          .filter((v) => v.name.toLowerCase().includes(term.toLocaleLowerCase()))
          .filter((v) => !Object.values(this.selectedItems).includes(v.name))
          .splice(0, 10),
      ),
      catchError((err) => {
        console.log('catcherror::::', err);
        return of([]);
      }),
    );
  };

  // getFormGroupName = () => 'item' + this.ctrlSuffix.replace('Ctrl','') + 'Group'
  getFormGroupName = () => this.itemGroupName; //.replace('item','').replace('Group','')
  // 'item' + this.ctrlSuffix.replace('Ctrl','') + 'Group'
  // getFormGroup = () => {
  //   // console.log('in PostReviewItemUnitComponent -> getFormGroup, his.reviewFormGroup::',this.reviewFormGroup);
  //   return this.reviewFormGroup.controls[this.getFormGroupName()] as FormGroup;
  // }

  onFileSelected(event: Event, id: number) {
    if (!event.target) return;

    const file: File = (event.target as any).files[0];

    if (file) {
      this.mediaTemplates[id].filename = file.name;
      this.correlationId = this.correlationId ?? generateCorrelationId();
      this.store.dispatch(FoodieActions.storeCorrelationId({ correlationId: this.correlationId }));
      const upload$ = this.appService
        .uploadMedia({
          file: file,
          correlationId: this.correlationId,
        })
        .pipe(
          takeUntil(this.destroy$),
          // finalize(() => this.reset(id))
          catchError(err => {
            console.log('error in onFileSelected:: ', err);
            this.mediaTemplates[id].uploadProgress=0;
            this.mediaTemplates[id].filename=undefined;
            this.mediaTemplates[id].error=err.statusText + ': ' + (err.error?.message || err. message);
            return of(err);
          })
        );


      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.mediaTemplates[id].uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
        // console.log('here in ukkgfghgfgh', this.mediaTemplates[id].uploadProgress)
        if (event.type == HttpEventType.Response) {
          console.log('here in uzbekistan', event);
          this.mediaTemplates[id].uploadProgress = 100;
          this.itemGroup?.controls['mediaCtrl'].setValue(
            [
              {
                id: event.body?.[0]?._id,
                name: file.name,
                type: getFileType(file),
                correlationId: this.correlationId,
                customerId: event.body?.[0]?.customerId,
                url: event.body?.[0]?.url,
              },
            ].concat(...this.itemGroup?.value.mediaCtrl),
          );
        }
        this.cdRef.detectChanges();
      });
    }
  }

  cancelUpload(id: number) {
    console.log('in PostReviewItemUnitComponent -> cancelUpload', id);
    this.uploadSub?.unsubscribe();
    this.reset(id);
  }

  reset(id: number) {
    console.log('reset', id);
    this.mediaTemplates[id].uploadProgress = 0;
    this.mediaTemplates[id].filename = undefined;
    this.uploadSub = undefined;
  }

  protected readonly JSON = JSON;
}

// =============================================================
@Component({
  selector: 'app-post-review',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgbTypeahead,
    PostReviewItemUnitComponent,
    ConnectFormDirective,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './post-review.component.html',
  styleUrl: './post-review.component.scss',
  providers: [NgbTypeaheadConfig],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostReviewComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, AfterViewChecked, AfterViewChecked {
  private readonly destroy$: Subject<any>;
  config: any;

  preloadReview$: Observable<NewReview | undefined> | undefined;
  form$: Observable<any>;

  toastService = inject(ToastService);
  searching = false;
  searchFailed = false;
  selectedItems: { [k: string]: string } = {} as any;

  currentItemCount = 0;

  @ViewChild('reviewForm')
  reviewForm!: ElementRef;

  previousPage: string = '/';
  reviewFormGroup: FormGroup;
  itemCtrlNames: string[] = [];
  reserveItemCtrl: FormControl | undefined;
  reserveItemGroup: FormGroup | undefined;
  uploadSub: Subscription | undefined;
  protected readonly Object = Object;
  correlationId: string = generateCorrelationId();
  submitted: boolean = false;
  postingReview: boolean = false;
  customer: CustomerInfo | undefined;
  errorMsg: string | undefined;
  postReview: any;
  mediaTemplates: any = {
    1: {
      id: 1,
      filename: undefined,
      uploadProgress: 0,
      error: undefined
    },
    2: {
      id: 2,
      filename: undefined,
      uploadProgress: 0,
      error: undefined
    },
    3: {
      id: 3,
      filename: undefined,
      uploadProgress: 0,
      error: undefined
    },
  };

  constructor(
    public route: ActivatedRoute,
    private store: Store<State>,
    private fb: FormBuilder,
    private appService: AppService,
    ngbConfig: NgbTypeaheadConfig,
    private cdRef: ChangeDetectorRef,
    private router: Router,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.reviewFormGroup = this.defaultForm();
    // this.reserveItemCtrl = this.reviewFormGroup.controls['item2Ctrl'] as FormControl;
    // customize default values of typeaheads used by this component tree
    ngbConfig.showHint = true;
    this.form$ = this.store.select(preloadReviewDataSelector()).pipe(
      takeUntil(this.destroy$),
      // tap((x) => console.log('preloadReview', x)),
    );
    console.log('123 ' + this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString());
    this.previousPage =
      this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString() ?? this.previousPage;
    this.addNewItemGroup();

  }

  ngOnInit() {
    console.log('in post-review.component, ngOnInit()...');
    // this.reserveItemGroup?.controls['placeCtrl'].valueChanges.subscribe((value) => {
    //
    // });

    this.store
      .select(postReviewResultSelector())
      .pipe(
        filter((data) => !!data),
        take(1),
        tap((x) => console.log('Navigating to previous page: ', this.previousPage)),
      )
      .subscribe((x) => this.router.navigate(['' + this.previousPage?.trim()]));
    this.store
      .select(customerSelector())
      .pipe(takeUntil(this.destroy$))
      .subscribe((cust) => (this.customer = cust));
    this.preloadReview$ = this.store.select(preloadReviewDataSelector()).pipe(
      takeUntil(this.destroy$),
      filter((data) => !!data),
      map(data => data.postReview),
      tap((x) => console.log('review from state received in post-review.component:: ', x)),
      tap((x) => this.postReview = x),

    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  defaultForm(): FormGroup {
    return this.fb.group(
      {
        placeCtrl: [null, [Validators.required]],
        ambienceCtrl: [0, Validators.min(1)],
        serviceCtrl: [0, Validators.min(1)],
        // item1Ctrl: [null, [Validators.required]],
        // item2Ctrl: [null, []],
        descriptionCtrl: [null, []],
        mediaCtrl: [[], []],

        // userNameCtrl: [null, [Validators.required]],
      },
      {
        updateOn: 'change',
      },
    );
  }

  getLatestItemCtrlName() {
    return 'item' + this.currentItemCount + 'Ctrl';
  }

  getLatestItemGroupName() {
    return 'item' + this.currentItemCount + 'Group';
  }

  /*addNewItemCtrl() {
    console.log('adding new item');

    let name = this.currentItemCount === 0 ? undefined : this.getLatestItemCtrlName();
    this.currentItemCount = this.currentItemCount + 1;
    let nextName = 'item' + (this.currentItemCount) + 'Ctrl';

    name && this.reviewFormGroup.controls[name].addValidators(Validators.required)
    this.reviewFormGroup.addControl(nextName, new FormControl(''));
    this.reserveItemCtrl = this.reviewFormGroup.controls[nextName] as FormControl;
    this.reserveItemCtrl.valueChanges.pipe(filter(d => !!d),
      take(1),
      // tap(val => console.log('In new item ctrl valueChanges, value:: ', val)),
    ).subscribe(_ => this.addNewItemCtrl());
    this.reserveItemCtrl.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap(val => this.selectedItems[nextName] = val.name),
    ).subscribe();
    this.itemCtrlNames.indexOf(this.getLatestItemCtrlName()) === -1 ? this.itemCtrlNames.push(this.getLatestItemCtrlName()) : [];
    console.log('this.selectedItems:: ', this.selectedItems);
    console.log('this.reviewFormGroup.controls:: ', this.reviewFormGroup.controls);

  }
*/
  addNewItemGroup() {
    console.log('adding new item group');
    let name = this.currentItemCount === 0 ? undefined : this.getLatestItemGroupName();
    this.currentItemCount = this.currentItemCount + 1;
    let nextName = 'item' + this.currentItemCount; //+'Group';

    // name &&
    //   Object.keys(this.reviewFormGroup.controls).forEach((key) => {
    //     console.log('making this control required: ', key);
    //     this.reviewFormGroup.controls[key].addValidators(Validators.required);
    //   });

    // this.reviewFormGroup.controls[name].addValidators(Validators.required)
    this.reviewFormGroup.addControl(
      nextName + 'Group',
      this.fb.group(
        {
          // nextName +
          ['itemCtrl']: [null, []],
          ['tasteCtrl']: [0, []],
          ['presentationCtrl']: [0, []],
          ['mediaCtrl']: [[], []],
          ['itemReviewCtrl']: [null, []],
        },
        {
          updateOn: 'change',
        },
      ),
    );
    this.reserveItemGroup = this.reviewFormGroup.controls[nextName + 'Group'] as FormGroup;
    this.reserveItemGroup.controls[
      // nextName +
      'itemCtrl'
    ].valueChanges
      .pipe(
        filter((d) => !!d),
        take(1),
        // tap(val => console.log('In new item ctrl valueChanges, value:: ', val)),
      )
      .subscribe((_: any) => this.addNewItemGroup());
    this.reserveItemGroup.controls[
      // nextName +
      'itemCtrl'
    ].valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((val: any) => (this.selectedItems[nextName] = val?.name)),
      )
      .subscribe();
    this.itemCtrlNames.indexOf(this.getLatestItemGroupName()) === -1
      ? this.itemCtrlNames.push(this.getLatestItemGroupName())
      : [];
    console.log('this.selectedItems:: ', this.selectedItems);
    console.log('this.reviewFormGroup.controls:: ', this.reviewFormGroup.controls);
  }

  formatter = (x: any) => x.placeName;

  searchPlaceTypeahead: OperatorFunction<string, readonly Place[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length > 2),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.appService.searchPlaceWithName({ placeName: term }).pipe(
          filter(Boolean),
          tap((res) => res && (this.searchFailed = false)),
          map((response: PlacesResponse | undefined) => response?.places??[]),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searching = false)),
    );

  extractItems: () => Item[] = () => Object.values(this.reviewFormGroup.value.placeCtrl?.items) as Item[];

  // searchItemTypeahead: OperatorFunction<string, readonly Item[]> = (text$: Observable<string>) =>
  // {
  //   const debouncedText$ = text$.pipe(debounceTime(350), distinctUntilChanged());
  //   const clicksWithClosedPopup$ = this.itemClick$.pipe(filter(() => !this.instance.isPopupOpen()));
  //   const inputFocus$ = this.itemFocus$;
  //
  //   return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
  //     map((term) =>
  //       this.extractItems().filter((v) => v.name.toLowerCase().includes(term.toLocaleLowerCase())).splice(0, 10),
  //     ),
  //     catchError(() => {
  //       console.log('catcherror::::');
  //       return of([]);
  //     }),
  //   );
  // }

  // ==============================================
  // text$.pipe(
  //     debounceTime(350),
  //     distinctUntilChanged(),
  //     // filter(term => term.length>1),
  //     // tap(() => (this.searching = true)),
  //     tap((data) => console.log('this.extractItems():: ', this.extractItems())),
  //     map((term) =>
  //         this.extractItems().filter((v) => v.name.toLowerCase().includes(term.toLocaleLowerCase())).splice(0, 10),
  //     ),
  //     catchError(() => {
  //       console.log('catcherror::::');
  //       return of([]);
  //     }),
  //     tap((data) => console.log('data:: ', data)),
  //     // tap(() => (this.searching = false)),
  // );

  formSubmitted() {
    // this.reviewFormGroup.updateValueAndValidity();

    console.log('in formSubmitted(), form: ', this.reviewFormGroup);
    console.log('in formSubmitted(), customer: ', this.customer);
    this.submitted = true;
    this.errorMsg=undefined;
    if (!this.reviewFormGroup.valid) {
      this.reviewForm.nativeElement.classList.add('was-validated');
    } else {
      // this.store.dispatch(FoodieActions.newPostReview());
      this.postingReview = true;

      this.appService.postReview().pipe(take(1)).subscribe({
        next: (review) => {
          this.store.dispatch(FoodieActions.newPostReviewSuccess({ review }));
          this.toastService.showSuccess(this.config.postReviewSuccessMessage);
        },
        error: (error) => {
          console.error('Error while posting the review to backend, :: ', error);
          if(!!error.error) {
            let e = error.error;
            e=e.errors ?? e;
            const keys = Object.keys(e);
            if(keys.length < 1){
              this.errorMsg = this.config.defaultApiFailedErrorMsg;
            } else {
              this.errorMsg = e[keys[0]].path + ': ' + (e[keys[0]].msg ?? e[keys[0]].message);
            }
            this.postingReview = false;
          }
          this.cdRef.detectChanges();
        },
      });
    }
  }

  onCloseItemGroup(groupName: string) {
    console.log('Closing itemGroup:: ', groupName);
    this.reviewFormGroup.removeControl(groupName);
    this.reviewFormGroup.updateValueAndValidity();
    this.itemCtrlNames = this.itemCtrlNames.filter((n) => n !== groupName);
    delete this.selectedItems[groupName.replace('Group', '')];
  }

  onFileSelected(event: Event, id: number) {
    if (!event.target) return;

    const file: File = (event.target as any).files[0];

    if (file) {
      this.mediaTemplates[id].filename = file.name;
      this.correlationId = this.correlationId ?? generateCorrelationId();
      this.store.dispatch(FoodieActions.storeCorrelationId({ correlationId: this.correlationId }));
      const upload$ = this.appService
        .uploadMedia({
          file: file,
          correlationId: this.correlationId,
        })
        .pipe(
          takeUntil(this.destroy$),
          // finalize(() => this.reset(id))
          catchError(err => {
            console.log('error in onFileSelected:: ', err);
            this.mediaTemplates[id].uploadProgress=0;
            this.mediaTemplates[id].filename=undefined;
            this.mediaTemplates[id].error=err.statusText + ': ' + (err.error?.message || err. message);
            return of(err);
          })
        );

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.mediaTemplates[id].uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
        // console.log('here in ukkgfghgfgh', this.mediaTemplates[id].uploadProgress)
        if (event.type == HttpEventType.Response) {
          console.log('post-review.component -> onFileSelected, event: ', event);
          this.mediaTemplates[id].uploadProgress = 100;
          this.reviewFormGroup.controls['mediaCtrl'].setValue(
            [
              {
                id: event.body?.[0]?._id,
                name: file.name,
                type: getFileType(file),
                correlationId: this.correlationId,
                customerId: event.body?.[0]?.customerId,
                url: event.body?.[0]?.url,
              },
            ].concat(...this.reviewFormGroup.value.mediaCtrl),
          );
        }
        this.cdRef.detectChanges();
      });
    }
  }

  cancelUpload(id: number) {
    console.log('in PostReviewItemUnitComponent -> cancelUpload', id);
    this.uploadSub?.unsubscribe();
    this.reset(id);
    // this.mediaTemplates[id].uploadProgress = 0;
  }

  reset(id: number) {
    console.log('reset', id);
    this.mediaTemplates[id].uploadProgress = 0;
    this.mediaTemplates[id].filename = undefined;
    this.uploadSub = undefined;
  }

  beforeSelectingPlace($event: NgbTypeaheadSelectItemEvent<any>) {
    console.log('beforeSelectingPlace, $event: ', $event);
  }


  ngAfterContentInit(): void {
    console.log('1. ngAfterContentInit');
  }

  ngAfterViewChecked(): void {
    console.log('2. ngAfterViewChecked');
  }

  ngAfterViewInit(): void {
    console.log('3. ngAfterViewInit');
    if(this.postReview.place){
      this.reviewFormGroup?.controls?.['placeCtrl']?.setValue(this.postReview.place);
    }
    if(this.postReview.item){
      (this.reviewFormGroup?.controls?.['item1Group'] as any)?.controls?.['itemCtrl']?.setValue(this.postReview.item);
    }
    this.reviewFormGroup?.updateValueAndValidity({onlySelf: true});
  }
}
