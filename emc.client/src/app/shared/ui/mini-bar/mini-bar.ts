// emc.client/src/app/shared/ui/mini-bar/mini-bar.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MiniBarTone = 'brand' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-mini-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-bar.html',
  styleUrl: './mini-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBar {
  value = input.required<number>();
  max   = input<number>(100);
  tone  = input<MiniBarTone>('brand');

  /** Clamped 0–100 percentage */
  protected readonly pct = computed(() => {
    const raw = (this.value() / this.max()) * 100;
    return Math.max(0, Math.min(100, raw));
  });

  protected readonly fillClasses = computed(() => ({
    [`mini-bar__fill--${this.tone()}`]: true,
  }));
}