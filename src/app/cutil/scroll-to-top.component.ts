import { Component, OnInit } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-scroll--to-top',
  standalone: true,
  imports: [
    NgClass,
    TooltipModule,
  ],
  template: `
    <div class="to-top bg-light rounded-5 z-2" (click)="scrollToTop()" [ngClass]="{ 'show-scrollTop': windowScrolled }"
         tooltip="Scroll to the top">
      <svg xmlns="http://www.w3.org/2000/svg" height="56px" viewBox="0 -960 960 960" width="56px" fill="currentcolor">
        <path
          d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z" />
      </svg>
    </div>`,
})
export class ScrollToTopComponent implements OnInit{

  windowScrolled = false;

  scrollToTop(): void {
    // scroll to the top of the body
    window?.scrollTo(0, 0);
    this.windowScrolled=false;
  }

  ngOnInit(): void {
    window?.addEventListener('scroll', () => {
      this.windowScrolled = window.scrollY !== 0;
    });
  }
}
