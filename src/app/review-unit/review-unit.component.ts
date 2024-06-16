import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Review } from '../models/Review';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import configJson from '../../config.json';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import * as FoodieActions from '../actions/foodie.actions';
import { ReviewFeedbackComponent } from '../review-feedback/review-feedback.component';

@Component({
  selector: 'app-review-unit',
  standalone: true,
  imports: [NgIf, DatePipe, NgbRatingModule, NgForOf, NgClass, ReviewFeedbackComponent],
  templateUrl: './review-unit.component.html',
  styleUrl: './review-unit.component.scss',
})
export class ReviewUnitComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;
  @Input('review')
  review!: Review;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = configJson;
    // this.feedback = new ReviewFeedback();
    // if(this.review?.likedBy.find(val => this.review?.customerInfo.id === val.id)){
    //     this.feedback.liked = true;
    // }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ariaValueText(current: number, max: number) {
    return `${current} out of ${max}`;
  }
}
