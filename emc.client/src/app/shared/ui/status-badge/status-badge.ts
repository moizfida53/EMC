import { Component, computed, input } from '@angular/core';
import { Pill } from '../pill/pill';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [Pill],
  // template: `<app-pill [tone]="tone()" dot>{{ value() }}</app-pill>`
  templateUrl:'status-badge.html'
})
export class StatusBadge {
  value = input.required<string>();

  // tone = computed((): Tone => {
  //   const v = this.value().toLowerCase();
  //   const map: Record<string, Tone> = {
  //     'healthy': 'success', 'within sla': 'success', 'on track': 'success',
  //     'resolved': 'success', 'completed': 'success', 'released': 'success',
  //     'at risk': 'warning', 'degraded': 'warning', 'in development': 'warning',
  //     'planned': 'warning', 'maintenance': 'warning', 'delayed': 'warning',
  //     'off track': 'danger', 'down': 'danger', 'breached': 'danger',
  //     'expired': 'danger', 'active': 'brand', 'in progress': 'brand',
  //     'staged': 'brand', 'qa': 'brand',
  //   };
  //   return map[v] ?? 'neutral';
  // });
}