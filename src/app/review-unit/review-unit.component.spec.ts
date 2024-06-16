import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUnitComponent } from './review-unit.component';

describe('ReviewUnitComponent', () => {
  let component: ReviewUnitComponent;
  let fixture: ComponentFixture<ReviewUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
