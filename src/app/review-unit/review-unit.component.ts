import { Component, Input, inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Review } from '../models/Review';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { DatePipe, DecimalPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import * as FoodieActions from '../actions/foodie.actions';
import { ReviewFeedbackComponent } from '../review-feedback/review-feedback.component';
import { AppService } from '../services/app.service';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-unit',
  standalone: true,
  imports: [NgIf, DatePipe, NgbRatingModule, NgForOf, NgClass, ReviewFeedbackComponent, RatingModule, FormsModule, NgTemplateOutlet, DecimalPipe],
  templateUrl: './review-unit.component.html',
  styleUrl: './review-unit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewUnitComponent implements OnInit, OnDestroy {
  @Input('review')
  review!: Review;

  appService= inject(AppService);
  private readonly destroy$: Subject<any>;
  config: any;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
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

  onHover($event: any, number?: number) {
    console.log('onHover: $event'+ $event + ' number', number);
    $event.stopPropagation();

  }

  protected readonly Math = Math;
}
