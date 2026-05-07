// emc.client/src/app/shared/ui/kpi-card/kpi-card.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TrendDir = 'up' | 'down' | 'flat';

export interface Trend {
  dir:  TrendDir;
  text: string;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<div [ngClass]="hostClasses()">
  <!-- Active accent bar -->
  <div *ngIf="active()" class="kpi-card__bar" aria-hidden="true"></div>

  <!-- Header row: label + meta/trend -->
  <div class="d-flex align-items-start justify-content-between mb-3 flex-narrow-stack">
    <div class="d-flex flex-column gap-1 min-w-0">
      <div class="kpi-card__label text-uppercase">{{ label() }}</div>
      <div *ngIf="subLabel()" class="kpi-card__sub-label">{{ subLabel() }}</div>
    </div>
    <div class="d-flex flex-column align-items-end gap-1 flex-shrink-0">
      <div *ngIf="meta()" class="kpi-card__meta-text">{{ meta() }}</div>
      <span *ngIf="trend()" [ngClass]="trendClasses()">{{ trend()!.text }}</span>
    </div>
  </div>

  <!-- Main value -->
  <div class="d-flex align-items-baseline">
    <div class="kpi-card__value">
      {{ value() }}
      <span *ngIf="unit()" class="kpi-card__unit">{{ unit() }}</span>
    </div>
  </div>

  <!-- Hint text -->
  <div *ngIf="hint()" class="kpi-card__hint mt-2">{{ hint() }}</div>

  <!-- Optional slotted content (chart, list, breakdown, etc.) -->
  <div class="kpi-card__content">
    <ng-content />
  </div>
</div>
  `,
  styleUrl: './kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  // ── Inputs ────────────────────────────────────────────────
  label    = input.required<string>();
  subLabel = input<string | null>(null);
  value    = input.required<string | number>();
  unit     = input<string | null>(null);
  hint     = input<string | null>(null);
  meta     = input<string | null>(null);
  active   = input<boolean>(false);
  trend    = input<Trend | null>(null);

  // ── Computed ──────────────────────────────────────────────
  protected readonly hostClasses = computed(() => ({
    'kpi-card':         true,
    'kpi-card--active': this.active(),
    'd-flex':           true,
    'flex-column':      true,
  }));

  protected readonly trendClasses = computed(() => {
    const dir = this.trend()?.dir;
    return {
      'kpi-card__trend':        true,
      'kpi-card__trend--up':    dir === 'up',
      'kpi-card__trend--down':  dir === 'down',
      'kpi-card__trend--flat':  dir === 'flat',
    };
  });
}
