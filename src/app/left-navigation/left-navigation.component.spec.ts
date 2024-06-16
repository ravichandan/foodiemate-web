import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftNavigationComponent } from './left-navigation.component';

describe('LeftNavigationComponent', () => {
  let component: LeftNavigationComponent;
  let fixture: ComponentFixture<LeftNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
