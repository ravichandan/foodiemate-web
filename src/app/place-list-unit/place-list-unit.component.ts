import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, DecimalPipe, JsonPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Place } from '../models/Place';
import { Observable, Subject, take } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AppService } from '../services/app.service';
import { Item } from '../models/Item';
import { ReplacePipe } from '../directives/replace.pipe';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Review } from '../models/Review';

@Component({
  selector: 'app-place-list-unit',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, JsonPipe, NgForOf, NgbCarousel, CarouselModule, NgbSlide, NgTemplateOutlet, NgIf, NgClass, SlicePipe, ReplacePipe, RouterLink],
  templateUrl: './place-list-unit.component.html',
  styleUrl: './place-list-unit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceListUnitComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;


  @Input('item')
  item: Item | undefined;

  appService= inject(AppService);
  modalService: BsModalService = inject(BsModalService);

  @ViewChild('reviewTextCarousel') carousel: NgbCarousel | undefined;
  @ViewChild('reviewImgCarousel') reviewImgCarousel: NgbCarousel | undefined;

  modalRef?: BsModalRef;
  itemId: string ='';
  placeId: string='';

  reviewMedias$: Observable<Review[]|undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    
    
  }

  ngOnInit() {
    this.placeId = this.item?.places?.[0]?._id ?? '';
    this.itemId = this.item?._id ?? '';
  }

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


  goToItemDetail() {

    console.log('in place-list-unit.component-> goToItemDetail', this.item);
    let r = 'places/:placeId/items/:itemId';
    
    r = r.replace(':placeId', this.placeId)
    r = r.replace(':itemId', this.itemId);
    
    this.router.navigate([r]).then();


  }

  goToPlaceDetail() {

    console.log('in place-list-unit.component-> goToPlaceDetail', this.item);
    let r = 'places/:placeId';
    r = r.replace(':placeId', this.placeId)
    console.log('in place-list-unit.component-> going to: ', r);

    this.router.navigate([r]).then();
  }

  openReviewMediasModal(template: TemplateRef<void>, suburbs?: any[]) {
    if(this.item?.noOfReviewPhotos && this.item.noOfReviewPhotos > 0) {
      
      this.reviewMedias$ = this.appService.getReviewMediasOfItem({placeId: this.placeId, itemId: this.itemId }).pipe(take(1));

      const initialState: ModalOptions = {
        initialState: {
          suburbs: suburbs as any[],
        },
        class: 'modal-xl modal-dialog-centered h-75',
        animated: true
      };

      this.modalRef = this.modalService.show(template, initialState);
    }
  }
}
