import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="surface-elev relative overflow-hidden p-5 transition-shadow hover:shadow-md"
         [class.ring-1]="active()"
         [class.ring-brand-200]="active()">
      @if (active()) {
        <div class="absolute inset-y-3 left-0 w-[3px] rounded-r-md bg-brand-600"></div>
      }
      <div class="flex items-start justify-between gap-3">
        <div class="micro-label">{{ label() }}</div>
        @if (trend()) {
          <span class="text-[11px] font-semibold" [ngClass]="trendClass()">
            {{ trend()!.text }}
          </span>
        }
      </div>
      <div class="mt-2 flex items-baseline gap-1.5">
        <div class="font-display text-3xl font-bold tracking-tight text-slate-900 num-tabular">
          {{ value() }}
        </div>
        @if (unit()) {
          <div class="text-sm text-slate-500">{{ unit() }}</div>
        }
      </div>
      @if (hint()) {
        <div class="mt-1 text-xs text-slate-500">{{ hint() }}</div>
      }
      <ng-content />
    </div>
  `
})
export class KpiCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  unit = input<string>();
  hint = input<string>();
  active = input<boolean>(false);
  trend = input<{ dir: 'up' | 'down' | 'flat'; text: string }>();

  trendClass = computed(() => {
    const dir = this.trend()?.dir;
    return {
      'text-emerald-600': dir === 'up',
      'text-rose-600': dir === 'down',
      'text-slate-500': dir === 'flat',
    };
  });
}