import {
  AfterContentInit, AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as FoodieActions from '../actions/foodie.actions';
import { filter, Subject, take, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { NgClass } from '@angular/common';
import { Review } from '../models/Review';
import { AppService } from '../services/app.service';
import { customerSelector, loggedInSelector } from '../selectors/foodie.selector';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

class ReviewFeedback {
  liked: boolean = false;
  disliked: boolean = false;
}

@Component({
  selector: 'app-review-feedback',
  standalone: true,
  imports: [NgClass],
  templateUrl: './review-feedback.component.html',
  styleUrl: './review-feedback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFeedbackComponent implements OnInit, OnDestroy
  , AfterViewInit, AfterContentInit, AfterViewChecked, AfterViewChecked
{
  @Input('review')
  review!: Review;

  appService= inject(AppService);

  private readonly destroy$: Subject<any>;
  config: any;
  feedback: ReviewFeedback;

  loggedIn = false;

  // review: Review= {} as Review;

  constructor(
    private router: Router,
    private store: Store<State>,
    private cdRef: ChangeDetectorRef,
  ) {

    this.destroy$ = new Subject<any>();
    this.feedback = new ReviewFeedback();
  }

  ngOnInit() {
    this.config = this.appService.getConfig();
    // if (this.review?.likedBy.find((val) => this.review?.customer.id === val.id)) {
    //   this.feedback.liked = true;
    // }
    this.store.select(loggedInSelector()).pipe(
      takeUntil(this.destroy$),
      filter(x=> x !== undefined)).subscribe(loggedIn => this.loggedIn = loggedIn)
    this.store.select(customerSelector()).pipe(
      take(1),
      filter(Boolean),
      tap(cust => {
        console.log('inreview-feedback.component, likebY:: ', this.review?.info?.likedBy);
        this.feedback.liked = this.review?.info?.likedBy?.findIndex(liked => liked._id === cust._id) > -1;
      } ),
      tap(cust => console.log('this.feedback in pipe:: ', this.feedback)),
    ).subscribe(x => setTimeout(()=>this.cdRef.detectChanges(),1));

// this.review! = this.rev;

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  likeClicked($event: Event) {

    if(!this.loggedIn) {
      console.log('customer has to login first before liking anything.. redirecting to login page');
      this.router.navigate(['/login']).then();
      return;
    }
    this.feedback.liked = !this.feedback.liked;
    this.feedback.disliked = false;
    // console.log('likeClicked() this.feedback.disliked %s',this.feedback.disliked , $event);
    if (this.feedback.liked) {
      this.store.dispatch(FoodieActions.likeReview({ reviewId: this.review._id }));
    } else {
      this.store.dispatch(
        FoodieActions.unlikeReview({ reviewId: this.review._id }),
      );
    }
  }
  dislikeClicked($event: Event) {
    if(!this.loggedIn) {
      console.log('customer has to login first before disliking anything.. redirecting to login page');
      this.router.navigate(['/login']).then();
      return;
    }
    this.feedback.disliked = !this.feedback.disliked;
    this.feedback.liked = false;
    // console.log('dislikeClicked() this.feedback.liked %s',this.feedback.liked , $event);
    // console.log('dislikeClicked() this.feedback.disliked %s',this.feedback.disliked , $event);
    if (this.feedback.disliked) {
      this.store.dispatch(
        FoodieActions.dislikeReview({ reviewId: this.review._id }),
      );
    } else {
      this.store.dispatch(
        FoodieActions.undislikeReview({ reviewId: this.review._id }),
      );
    }
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit(),  reviewId:: ' + this.review?._id);

  }

  ngAfterViewChecked(): void {
    console.log('ngAfterContentInit(),  reviewId:: ' + this.review?._id);

  }

  ngAfterViewInit(): void {
    console.log('ngAfterContentInit(),  reviewId:: ' + this.review?._id);

  }
}
