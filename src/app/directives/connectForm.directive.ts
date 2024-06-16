import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, of, Subject, Subscription, switchMap, take, takeUntil, tap } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { itemSelector, placeSelector, preloadReviewDataSelector } from '../selectors/foodie.selector';
import * as FoodieActions from '../actions/foodie.actions';
import { NewReview } from '../models/Review';
import { Place } from '../models/Place';
import { Item } from '../models/Item';

@Directive({
  selector: '[connectForm]',
  standalone: true,
})
export class ConnectFormDirective implements OnDestroy, OnInit {
  @Input('connectForm') path!: string | number;
  @Input() debounce = 300;

  @Output() error = new EventEmitter();
  @Output() success = new EventEmitter();

  destroy$: Subject<any>;

  formChange: Subscription | undefined;
  // formSuccess: Subscription;
  // formError: Subscription;

  constructor(
    private formGroupDirective: FormGroupDirective,
    private actions$: Actions,
    private store: Store<any>,
  ) {
    this.destroy$ = new Subject();
  }

  ngOnInit() {
    this.store
      .select(preloadReviewDataSelector())
      .pipe(
        take(1),
        tap((x) => console.log('in connectForm->preloadReviewDataSelector(), x:: ', x)),
        switchMap((preload: NewReview) =>
          preload.place
            ? this.store.select(placeSelector(preload.place.id)).pipe(
                tap((x) => console.log('in connectForm->placeSelector(), x:: ', x)),
                switchMap((place: Place) => {
                  return preload.item
                    ? of({ ...preload, placeCtrl: place, item1Group: { itemCtrl: place.items[preload.item.id] } })
                    : of({ ...preload, placeCtrl: place });
                }),
              )
            : of(preload),
        ),
        // switchMap((preload: NewReview) =>
        //   preload.item ?  of({...preload, item1Group: {itemCtrl: item}}))) : of(preload)
        // )
      )
      .subscribe((val) => {
        // console.log('in connectForm.directive, patching val');
        this.formGroupDirective.form?.patchValue(val);
      });
    this.formChange = this.formGroupDirective.form.valueChanges
      .pipe(
        debounceTime(this.debounce),
        takeUntil(this.destroy$),
        tap((x) => console.log('in connectForm formChange, x:: ', x)),
      )
      .subscribe((form) => this.store.dispatch(FoodieActions.updateNewPostReviewState({ form })));

    // this.formSuccess = this.actions$
    //   .pipe(ofType(FoodieActions.ACTION_SUBMIT_REVIEW), takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     // TODO this.formGroupDirective.form.reset();
    //     this.success.emit();
    //   });
    //
    // this.formError = this.actions$
    //   .pipe(ofType(PaymentActions.ACTION_FAILURE), takeUntil(this.destroy$))
    //   .subscribe(({ err }) => this.error.emit(err));
  }

  ngOnDestroy() {
    /* rxjs in version 7+ requires an argument */
    this.destroy$.next(true);
  }
}
