import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import configJson from '../../config.json';
import * as FoodieActions from '../actions/foodie.actions';
import { FormsModule } from '@angular/forms';
import { EditInputComponent } from '../edit-input/edit-input.component';
import { cuisinesSelector, customerSelector } from '../selectors/foodie.selector';
import { CustomerInfo } from '../models/CustomerInfo';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    EditInputComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  config: any;
  customer!: CustomerInfo;
  allCuisines: any[] | undefined;
  private readonly destroy$: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = configJson;
  }


  ngOnInit() {
    const custInterests=[{
      name: 'ITALIAN',
      id: 1
    },
      {
        name: 'INDIAN',
        id: 2
      }
      ]
    this.store.select(customerSelector()).pipe(
      takeUntil(this.destroy$), filter(Boolean))
      .subscribe(cust => this.customer = cust);
    this.store.select(cuisinesSelector()).pipe(
      takeUntil(this.destroy$), filter(Boolean))
      .subscribe(cuisines => this.allCuisines = cuisines?.filter(Boolean).map(
        cuisine => ({
          id: cuisine.id,
          name: cuisine.name,
          selected: this.customer?.interestedIn.includes(cuisine) || custInterests.includes(cuisine)
        }),
      ));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  saveProfile() {
    this.store.dispatch(FoodieActions.updateCustomer());
  }

}
