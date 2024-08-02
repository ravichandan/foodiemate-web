import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { DecimalPipe, LowerCasePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Item } from '../models/Item';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { AppService } from '../services/app.service';
import { ReplacePipe } from '../directives/replace.pipe';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-item-list-unit',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgbCarousel,
    NgbSlide,
    NgTemplateOutlet,
    NgIf,
    NgClass,
    NgImageFullscreenViewModule,
    LowerCasePipe,
    ReplacePipe,
    AccordionModule,
    SlicePipe,
  ],
  templateUrl: './item-list-unit.component.html',
  styleUrl: './item-list-unit.component.scss',
})
export class ItemListUnitComponent {

  private readonly destroy$: Subject<any>;

  config: any;

  currentIndex: number = -1;
  showFlag: boolean = false;

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

  @Input('item')
  item: Item | undefined;

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

  showLightbox(index: any) {
    this.currentIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
}
