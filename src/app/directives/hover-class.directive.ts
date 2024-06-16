import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[hover-classes]',
  standalone: true,
})
export class HoverClassDirective {
  constructor(public elementRef: ElementRef) {}
  @Input('hover-classes') hoverClasses: any;

  @HostListener('mouseenter') onMouseEnter() {
    // console.log('herere');
    this.hoverClasses.split(' ').forEach((cls: string) => !!cls && this.elementRef.nativeElement.classList.add(cls));
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hoverClasses.split(' ').forEach((cls: string) => !!cls && this.elementRef.nativeElement.classList.remove(cls));
  }
}
