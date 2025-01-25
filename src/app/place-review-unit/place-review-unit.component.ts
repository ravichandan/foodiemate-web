import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Review } from '../models/Review';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { DatePipe, DecimalPipe, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { ReviewFeedbackComponent } from '../review-feedback/review-feedback.component';
import { Place } from '../models/Place';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-place-review-unit',
  standalone: true,
  imports: [DatePipe, NgForOf, TitleCasePipe, NgIf, NgbRating, ReviewFeedbackComponent, DecimalPipe, NgTemplateOutlet],
  templateUrl: './place-review-unit.component.html',
  styleUrl: './place-review-unit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceReviewUnitComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;
  @Input('review')
  review!: Review;

  @Input('place')
  place!: Place;

  appService= inject(AppService);

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ariaValueText(current: number, max: number) {
    return `${current} out of ${max}`;
  }

  protected readonly Math = Math;
}
