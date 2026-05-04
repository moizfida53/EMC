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

export type MiniBarTone = 'brand' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  // ── Inputs ────────────────────────────────────────────────
  label  = input.required<string>();
  value  = input.required<string | number>();
  unit   = input<string | null>(null);
  hint   = input<string | null>(null);
  active = input<boolean>(false);
  trend  = input<Trend | null>(null);

  // ── Computed ──────────────────────────────────────────────
  protected readonly hostClasses = computed(() => ({
    'kpi-card':         true,
    'kpi-card--active': this.active(),
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