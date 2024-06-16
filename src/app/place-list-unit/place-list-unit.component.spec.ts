import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceListUnitComponent } from './place-list-unit.component';

describe('PlaceListItemComponent', () => {
  let component: PlaceListUnitComponent;
  let fixture: ComponentFixture<PlaceListUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceListUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceListUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
