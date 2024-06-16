import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[smaller-font]',
  standalone: true,
})
export class SmallerFontDirective {
  @Input('smaller-font') maxSize: any;
  constructor(public elementRef: ElementRef) {
    console.log('smaller font directive, this.elementRef.nativeElement.text(): ', this.elementRef.nativeElement.text());
    if (this.elementRef.nativeElement.text()?.length > this.maxSize) {
      this.elementRef.nativeElement.classList.add('fs-smaller');
    }
  }

  // @HostListener('mouseenter') onMouseEnter() {
  //   // console.log('herere');
  //   this.hoverClasses.split(' ').forEach((cls: string) => !!cls && this.elementRef.nativeElement.classList.add(cls))
  //
  // }
  //
  // @HostListener('mouseleave') onMouseLeave() {
  //   this.hoverClasses.split(' ').forEach((cls: string) => !!cls && this.elementRef.nativeElement.classList.remove(cls))
  // }
}
