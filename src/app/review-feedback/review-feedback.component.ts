import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import * as FoodieActions from '../actions/foodie.actions';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { NgClass } from '@angular/common';
import { Review } from '../models/Review';
import { AppService } from '../services/app.service';

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
})
export class ReviewFeedbackComponent implements OnInit, OnDestroy {
  @Input('review')
  review!: Review;

  appService= inject(AppService);

  private readonly destroy$: Subject<any>;
  config: any;
  feedback: ReviewFeedback;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.feedback = new ReviewFeedback();
    if (this.review?.likedBy.find((val) => this.review?.customer.id === val.id)) {
      this.feedback.liked = true;
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  likeClicked($event: Event) {
    console.log('likeClicked() this.feedback.liked %s', this.feedback.liked, $event);
    // console.log('likeClicked() this.feedback.disliked %s',this.feedback.disliked , $event);
    if (this.feedback.liked) {
      this.store.dispatch(FoodieActions.likeReview({ reviewId: this.review._id, customerId: this.review.customer.id }));
    } else {
      this.store.dispatch(
        FoodieActions.unlikeReview({ reviewId: this.review._id, customerId: this.review.customer.id }),
      );
    }
  }
  dislikeClicked($event: Event) {
    // console.log('dislikeClicked() this.feedback.liked %s',this.feedback.liked , $event);
    // console.log('dislikeClicked() this.feedback.disliked %s',this.feedback.disliked , $event);
    if (this.feedback.disliked) {
      this.store.dispatch(
        FoodieActions.dislikeReview({ reviewId: this.review._id, customerId: this.review.customer.id }),
      );
    } else {
      this.store.dispatch(
        FoodieActions.undislikeReview({ reviewId: this.review._id, customerId: this.review.customer.id }),
      );
    }
  }
}
