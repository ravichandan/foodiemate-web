import { ChangeDetectorRef, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[scrolledTo]',
  standalone: true,
  exportAs: 'scrolledTo',
})
export class ScrolledToDirective {
  @Input() isLast:boolean = false;
  focus = false;

  constructor(public el: ElementRef,private cdRef: ChangeDetectorRef) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const elementPosition = this.el.nativeElement.offsetTop;
    const elementHeight = this.el.nativeElement.clientHeight;

    //you can change the check according to your requirements
    const scrollPosition = window.scrollY + window.screen.height / 2 ;
    // console.log(window.scrollY, window.screen.height, window.screen.height / 2);
    // console.log(scrollPosition, elementPosition);
    // console.log( 'scrollPosition <= elementPosition + elementHeight',  scrollPosition <= elementPosition + elementHeight);
    this.focus = scrollPosition >= elementPosition && scrollPosition <= elementPosition + elementHeight;
    if(this.isLast) {
      this.focus = scrollPosition >= elementPosition;
      this.el.nativeElement.focus = this.focus;
      this.cdRef.detectChanges();
    }
    // console.log('in scrolledTo->windowScroll, this.focus:: ', this.focus);

  }
}
