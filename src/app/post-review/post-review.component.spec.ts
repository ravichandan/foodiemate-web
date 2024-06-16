import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostReviewComponent } from './post-review.component';

describe('PostReviewComponent', () => {
  let component: PostReviewComponent;
  let fixture: ComponentFixture<PostReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
