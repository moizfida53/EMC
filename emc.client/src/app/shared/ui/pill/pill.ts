// emc.client/src/app/shared/ui/pill/pill.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type PillTone =
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'neutral';

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill.html',
  styleUrl: './pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pill {
  /** Colour tone */
  tone = input<PillTone>('neutral');
  /** Show the coloured dot indicator on the left */
  dot  = input<boolean>(false);

  protected readonly classes = computed(() => ({
    [`pill--${this.tone()}`]: true,
  }));
}