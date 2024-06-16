import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListUnitComponent } from './item-list-unit.component';

describe('ItemListUnitComponent', () => {
  let component: ItemListUnitComponent;
  let fixture: ComponentFixture<ItemListUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListUnitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
