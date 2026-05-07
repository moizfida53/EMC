// emc.client/src/app/shared/ui/page-header/page-header.ts
//
// Common page-top anatomy used by every feature page:
//   eyebrow micro-label → bold title → description → optional actions slot
//
// Usage:
//   <app-page-header
//     eyebrow="Support Center"
//     title="Tickets & conversations"
//     description="A real-time view of every support engagement…">
//     <app-button variant="primary" slot="actions">+ Open new ticket</app-button>
//   </app-page-header>

import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="page-header">
      <div class="page-header__text">
        <p *ngIf="eyebrow()" class="micro-label page-header__eyebrow mb-1">
          {{ eyebrow() }}
        </p>
        <h1 class="page-header__title font-display mb-0">
          {{ title() }}
        </h1>
        <p *ngIf="description()" class="page-header__description mt-2 mb-0">
          {{ description() }}
        </p>
      </div>

      <div class="page-header__actions">
        <ng-content select="[slot='actions']" />
      </div>
    </header>
  `,
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  eyebrow     = input<string | null>(null);
  title       = input.required<string>();
  description = input<string | null>(null);
}
