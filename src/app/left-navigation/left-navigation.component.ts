import { Component } from '@angular/core';
import { NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-left-navigation',
  standalone: true,
  imports: [NgForOf, NgClass, NgTemplateOutlet, HoverClassDirective, RouterLink],
  templateUrl: './left-navigation.component.html',
  styleUrl: './left-navigation.component.scss',
})
export class LeftNavigationComponent {
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
}
