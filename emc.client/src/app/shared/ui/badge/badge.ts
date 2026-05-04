// emc.client/src/app/shared/ui/badge/badge.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { Pill, PillTone } from '../pill/pill';

export type Priority = 'High' | 'Medium' | 'Low';

const PRIORITY_TONE: Record<Priority, PillTone> = {
  High:   'danger',
  Medium: 'warning',
  Low:    'muted',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [Pill],
  template: `
    <app-pill [tone]="tone()" [dot]="true">
      {{ priority() }}
    </app-pill>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  /** Priority level — renders the correctly toned pill */
  priority = input.required<Priority>();

  protected readonly tone = computed<PillTone>(
    () => PRIORITY_TONE[this.priority()]
  );
}