import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingButtonsComponent } from './sharing-buttons.component';

describe('ReviewReplyComponent', () => {
  let component: SharingButtonsComponent;
  let fixture: ComponentFixture<SharingButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharingButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharingButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
