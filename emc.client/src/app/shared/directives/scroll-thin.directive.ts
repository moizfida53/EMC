// emc.client/src/app/shared/directives/scroll-thin.directive.ts
import {
  Directive,
  ElementRef,
  OnInit,
  inject,
  input,
} from '@angular/core';

/**
 * Applies the `.scroll-thin` scrollbar styling from our global SCSS
 * AND sets `overflow-y: auto` on the host element.
 *
 * Usage:
 *   <div appScrollThin>...</div>
 *   <div appScrollThin axis="x">...</div>
 *   <div appScrollThin [maxHeight]="360">...</div>
 */
@Directive({
  selector: '[appScrollThin]',
  standalone: true,
})
export class ScrollThin implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  /** 'y' | 'x' | 'both' — which axis to scroll */
  axis      = input<'y' | 'x' | 'both'>('y');
  /** Optional max-height in px (0 = no limit) */
  maxHeight = input<number>(0);

  ngOnInit(): void {
    const el  = this.el.nativeElement;
    const ax  = this.axis();
    const mh  = this.maxHeight();

    // Apply the global utility class (defined in utilities.scss)
    el.classList.add('scroll-thin');

    if (ax === 'y' || ax === 'both') {
      el.style.overflowY = 'auto';
    }
    if (ax === 'x' || ax === 'both') {
      el.style.overflowX = 'auto';
    }
    if (mh > 0) {
      el.style.maxHeight = `${mh}px`;
    }
  }
}