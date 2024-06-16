import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceReviewUnitComponent } from './place-review-unit.component';

describe('PlaceReviewUnitComponent', () => {
  let component: PlaceReviewUnitComponent;
  let fixture: ComponentFixture<PlaceReviewUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceReviewUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceReviewUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
