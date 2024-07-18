import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DecimalPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../models/Place';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AppService } from '../services/app.service';
import { Item } from '../models/Item';
import { ReplacePipe } from '../directives/replace.pipe';

@Component({
  selector: 'app-place-list-unit',
  standalone: true,
  imports: [DecimalPipe, NgForOf, NgbCarousel, NgbSlide, NgTemplateOutlet, NgIf, NgClass, SlicePipe, ReplacePipe],
  templateUrl: './place-list-unit.component.html',
  styleUrl: './place-list-unit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private router: Router
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

  canShowViewAllPhotosLink(reviews: any[], name: any) {
    console.log('in place-list-unit.component -> canShowViewAllPhotosLink(), name:: ', name);
    console.log('in place-list-unit.component -> canShowViewAllPhotosLink(), reviews:: ', reviews);
    return reviews.find(review => !!review?.medias?.length);

  }

  // protected readonly length = length;
  // protected readonly Object = Object;
  // protected readonly Math = Math;

  getItemValues(items: { [s: string]: Item; } | ArrayLike<Item>) {
    console.log('in this.getItemValues()');
    return Object.values(items) as Item[];
  }


  goToItemDetail(place: Place, item: Item) {

    console.log('in place-list-unit.component-> goToItemDetail', item);
    let r = 'places/:placeId/items/:itemId';
    r=r.replace(':placeId', place.id);
    r=r.replace(':itemId', item.id);
    this.router.navigate([r]).then();


  }
}
