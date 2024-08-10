import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import * as FoodieActions from '../actions/foodie.actions';
import { FormsModule } from '@angular/forms';
import { EditInputComponent } from '../edit-input/edit-input.component';
import { cuisinesSelector, customerSelector } from '../selectors/foodie.selector';
import { CustomerInfo } from '../models/CustomerInfo';
import { AppService } from '../services/app.service';
import { Cuisine, parseCuisine } from '../models/Cuisine';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, EditInputComponent, TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  appService= inject(AppService);

  config: any;
  customer!: CustomerInfo;
  allCuisines: any[] | undefined;
  private readonly destroy$: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
  }

  ngOnInit() {
    const custInterests = [
      // {
      //   name: 'ITALIAN',
      //   value: 'Italian',
      //   id: 2,
      // },
      {
        name: 'INDIAN',
        value: 'Indian',
        id: 1,
      },
    ];
    this.store
      .select(customerSelector())
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((cust) => (this.customer = cust));
    this.store
      .select(cuisinesSelector())
      .pipe(takeUntil(this.destroy$), filter(Boolean),
      tap(x => console.log('in profile.component, tap(), x:',x)))
      .subscribe(
        (cuisines) => {
          console.log(cuisines);
          this.allCuisines = cuisines?.filter(Boolean).map((cuisine) => ({
            cuisine,
            selected: this.customer?.interestedIn.findIndex(ci => {
              console.log('comparing ' + ci + ' to ' + cuisine);
              // console.log('comparing '+ci.name+' to '+cuisine.name);
              return ci.toLowerCase() === cuisine.toLowerCase();
            }) > -1,
          }));
        }
      );
  }

  ngOnDestroy() {
  }

  saveProfile() {

    this.store.dispatch(FoodieActions.updateCustomer());
  }

  changeCuisines($event: any) {
    console.log('in inputChanged, $event:: ', $event);
    const cu = parseCuisine($event.target.value);
    if($event.target.check) {
      this.customer.interestedIn.push(cu);
    } else {
      const index = this.customer?.interestedIn.indexOf(cu);
      this.customer?.interestedIn.splice(index, 1);
    }
    this.saveProfile();
  }

  protected readonly JSON = JSON;
}
