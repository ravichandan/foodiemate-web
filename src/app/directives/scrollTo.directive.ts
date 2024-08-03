import { ChangeDetectorRef, Directive, HostListener, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[scrollTo]',
})
export class ScrollToDirective {

  @Input() target = '';
  constructor() { }

  @HostListener('click')
  onClick() {
    const targetElement = document.querySelector(this.target);
    if(targetElement)
      targetElement.scrollIntoView({block: 'start',behavior: 'smooth', inline:'nearest'});
  }
}
