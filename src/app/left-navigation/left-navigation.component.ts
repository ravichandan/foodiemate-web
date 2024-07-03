import { Component, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { customerSelector, popularsSelector } from '../selectors/foodie.selector';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { CustomerInfo } from '../models/CustomerInfo';
import * as FoodieActions from '../actions/foodie.actions';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-left-navigation',
  standalone: true,
  imports: [NgForOf, NgClass, NgTemplateOutlet, HoverClassDirective, RouterLink, AsyncPipe],
  templateUrl: './left-navigation.component.html',
  styleUrl: './left-navigation.component.scss',
})
export class LeftNavigationComponent implements OnDestroy{

  private readonly destroy$: Subject<any>;

  config: any;
  customer$: Observable<CustomerInfo | undefined> | undefined;

  items = [
    {
      label: 'Home',
      icon: 'bi-house',
      route: '/home',
    },
    {
      label: 'Cuisines',
      icon: 'bi-gift',
      route: '/browse',
    },
    {
      label: 'Deals',
      icon: 'bi-gift',
      route: '/browse',
    },
    {
      label: 'My Activity',
      icon: 'bi-list-ul',
      route: '/browse',
    },
    {
      label: 'Food Festivals',
      icon: 'bi-cake',
      route: '/browse',
    },
    {
      label: 'Healthy',
      icon: 'bi-heart-pulse',
      route: '/browse',
    },
    {
      label: 'Drinks',
      icon: 'bi-cup-straw',
      route: '/browse',
    },
    {
      label: 'Vegan Friendly',
      icon: 'bi-tree',
      route: '/browse',
    },
  ];
  footer_items = [
    {
      label: 'Contact Us',
      icon: 'bi-telephone',
      route: '/contact-us',
    },
    {
      label: 'T&Cs',
      icon: 'bi-info-circle',
      route: '/tnc',
    },
  ];

  constructor(private store: Store<State>, private appService: AppService) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.customer$ = this.store.select(customerSelector()).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(FoodieActions.pageDestroyed());
  }
}
