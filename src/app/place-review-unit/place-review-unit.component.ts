import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Review } from '../models/Review';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import configJson from '../../config.json';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { ReviewFeedbackComponent } from '../review-feedback/review-feedback.component';
import { Place } from '../models/Place';

@Component({
  selector: 'app-place-review-unit',
  standalone: true,
  imports: [DatePipe, NgForOf, NgIf, NgbRating, ReviewFeedbackComponent],
  templateUrl: './place-review-unit.component.html',
  styleUrl: './place-review-unit.component.scss',
})
export class PlaceReviewUnitComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;
  @Input('review')
  review!: Review;

  @Input('place')
  place!: Place;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = configJson;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ariaValueText(current: number, max: number) {
    return `${current} out of ${max}`;
  }
}
