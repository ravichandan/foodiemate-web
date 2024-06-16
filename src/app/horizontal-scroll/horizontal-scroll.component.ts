import { Component, ElementRef, ViewChild } from '@angular/core';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-horizontal-scroll',
  standalone: true,
  imports: [HoverClassDirective, NgForOf],
  templateUrl: './horizontal-scroll.component.html',
  styleUrl: './horizontal-scroll.component.scss',
})
export class HorizontalScrollComponent {
  @ViewChild('widgetsContent') widgetsContent: ElementRef | undefined;

  scrollLeft() {
    if (!!this.widgetsContent) {
      this.widgetsContent.nativeElement.scrollLeft -= 150;
    }
  }

  scrollRight() {
    if (!!this.widgetsContent) {
      this.widgetsContent.nativeElement.scrollLeft += 150;
    }
  }
}
