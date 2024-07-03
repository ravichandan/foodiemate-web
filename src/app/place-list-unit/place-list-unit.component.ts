import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../models/Place';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-place-list-unit',
  standalone: true,
  imports: [DecimalPipe, NgForOf, NgbCarousel, NgbSlide, NgTemplateOutlet, NgIf, NgClass],
  templateUrl: './place-list-unit.component.html',
  styleUrl: './place-list-unit.component.scss',
})
export class PlaceListUnitComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;

  config: any;

  appService= inject(AppService);

  @ViewChild('reviewTextCarousel') carousel: NgbCarousel | undefined;
  @ViewChild('reviewImgCarousel') reviewImgCarousel: NgbCarousel | undefined;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private elementRef: ElementRef,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
  }

  @Input('place')
  place: Place | undefined;

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  changeCarouselSlide($event: NgbSlideEvent) {
    // console.log('22222', $event);
    if ($event.source === NgbSlideEventSource.ARROW_LEFT) {
      this.carousel?.prev(NgbSlideEventSource.ARROW_LEFT);
    } else if ($event.source === NgbSlideEventSource.ARROW_RIGHT) {
      this.carousel?.next(NgbSlideEventSource.ARROW_RIGHT);
    } else {
      this.carousel?.next($event.source);
    }
  }

  canPause($event: Event, pause?: boolean) {
    // console.log('paused carousel..., ' + pause + '......', $event);
    if (pause) {
      this.carousel?.pause();
      this.reviewImgCarousel?.pause();
    } else {
      this.carousel?.cycle();
      this.reviewImgCarousel?.cycle();
    }
  }
}
