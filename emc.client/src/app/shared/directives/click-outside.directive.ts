// emc.client/src/app/shared/directives/click-outside.directive.ts
import {
  Directive,
  ElementRef,
  output,
  inject,
  HostListener,
} from '@angular/core';

/**
 * Emits (clickOutside) whenever a click occurs outside the host element.
 *
 * Usage:
 *   <div appClickOutside (clickOutside)="close()">...</div>
 */
@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutside {
  private readonly el = inject(ElementRef<HTMLElement>);

  clickOutside = output<MouseEvent>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (!this.el.nativeElement.contains(target)) {
      this.clickOutside.emit(event);
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent): void {
    const target = event.target as Node;
    if (!this.el.nativeElement.contains(target)) {
      // Emit a synthetic MouseEvent so callers don't need to handle both types
      this.clickOutside.emit(new MouseEvent('click'));
    }
  }
}