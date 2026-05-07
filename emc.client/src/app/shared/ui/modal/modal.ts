// emc.client/src/app/shared/ui/modal/modal.ts
//
// Thin Angular wrapper around Bootstrap's vanilla Modal JS.
// Avoids the lifecycle bugs we hit when components instantiate
// `new bootstrap.Modal(...)` themselves and forget to dispose.
//
// Usage:
//   <app-modal #m title="Open a new ticket" subtitle="Our duty team typically responds…" size="lg">
//     <form [formGroup]="form"> … </form>
//
//     <ng-container slot="footer">
//       <app-button variant="secondary" (clicked)="m.close()">Cancel</app-button>
//       <app-button variant="primary" (clicked)="submit()">Submit ticket</app-button>
//     </ng-container>
//   </app-modal>
//
//   <app-button (clicked)="m.open()">+ Open new ticket</app-button>
//
// Backdrop click + Escape close the modal automatically (Bootstrap default).
// Emits (opened) / (closed) events so the host component can react.

import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Vanilla Bootstrap JS — already loaded globally via angular.json scripts.
declare const bootstrap: { Modal: new (el: Element, opts?: any) => {
  show(): void;
  hide(): void;
  dispose(): void;
} };

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal implements AfterViewInit, OnDestroy {
  // ── Inputs ─────────────────────────────────────────────────
  title    = input<string | null>(null);
  subtitle = input<string | null>(null);
  size     = input<ModalSize>('md');
  /** Hide the default close (×) button in the header */
  hideClose = input<boolean>(false);
  /** Hide the default header bar entirely (use custom <header slot="header">) */
  hideHeader = input<boolean>(false);
  /** Disable backdrop-click and Escape-to-close */
  static_   = input<boolean>(false);

  // ── Outputs ────────────────────────────────────────────────
  opened = output<void>();
  closed = output<void>();

  // ── Internal ──────────────────────────────────────────────
  private readonly modalEl = viewChild<ElementRef<HTMLDivElement>>('modalRef');
  private bs?: { show(): void; hide(): void; dispose(): void };
  private readonly platformId = inject(PLATFORM_ID);

  // Boundless arrow handlers so we can add/remove the same reference
  private readonly onShown  = () => this.opened.emit();
  private readonly onHidden = () => this.closed.emit();

  // Track whether we moved the element to <body> so we can put it back / clean up.
  private movedToBody = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof bootstrap === 'undefined') {
      console.warn('[app-modal] window.bootstrap is undefined. Ensure node_modules/bootstrap/dist/js/bootstrap.min.js is loaded via angular.json scripts.');
      return;
    }
    const el = this.modalEl()?.nativeElement;
    if (!el) return;

    // Portal the modal element to <body>.
    //
    // WHY: Bootstrap appends `.modal-backdrop` directly to <body>. If the
    // modal element itself stays nested inside a component subtree that
    // forms its own stacking layer, the backdrop ends up *in front of*
    // the modal — looks like a translucent layer covering everything and
    // blocks all clicks. Moving the modal to <body> puts it in the same
    // stacking root as the backdrop, so Bootstrap's z-index hierarchy
    // (modal: 1055, backdrop: 1050) wins.
    if (el.parentElement && el.parentElement !== document.body) {
      document.body.appendChild(el);
      this.movedToBody = true;
    }

    this.bs = new bootstrap.Modal(el, {
      backdrop: this.static_() ? 'static' : true,
      keyboard: !this.static_(),
    });
    el.addEventListener('shown.bs.modal',  this.onShown);
    el.addEventListener('hidden.bs.modal', this.onHidden);
  }

  ngOnDestroy(): void {
    const el = this.modalEl()?.nativeElement;
    if (el) {
      el.removeEventListener('shown.bs.modal',  this.onShown);
      el.removeEventListener('hidden.bs.modal', this.onHidden);
      // We portaled the node to <body>; remove it before Angular tries to
      // detach (Angular only knows about its original anchor).
      if (this.movedToBody && el.parentElement === document.body) {
        document.body.removeChild(el);
      }
    }
    this.bs?.dispose();
  }

  // ── Public API ────────────────────────────────────────────
  open():  void { this.bs?.show(); }
  close(): void { this.bs?.hide(); }
}
