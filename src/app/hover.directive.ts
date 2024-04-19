import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2, SimpleChange, ViewChild } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  @Input() hover: any;
  constructor(private el: ElementRef, private rend: Renderer2) {}
  
  @HostBinding('style.background') color;
  @HostListener("mouseenter", ['$event.target']) hoverChange() {
    this.color = 'green'
  }
  @HostListener("mouseleave", ['$event.target']) afterhoverChange() {
    this.color = 'red'
  }

  ngOnInit() {
  }
}
