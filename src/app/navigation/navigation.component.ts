import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { HoverClassDirective } from '../directives/hover-class.directive';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgForOf, NgIf, NgOptimizedImage, NgClass, HoverClassDirective],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  navigation_menu: any[];
  // showNavContent: boolean = false;
  submenu: any;
  constructor(private appService: AppService) {
    this.navigation_menu = this.appService.getConfig().navigation_menu;
  }

  ngOnInit(): void {}
}
