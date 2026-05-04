// emc.client/src/app/shared/ui/status-badge/status-badge.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { Pill, PillTone } from '../pill/pill';

type StatusValue =
  // Active / in-flight
  | 'Active' | 'In Progress' | 'On BlueLink' | 'Staged' | 'QA'
  // Positive end-states
  | 'Resolved' | 'Completed' | 'Released' | 'Healthy'
  | 'Within SLA' | 'On Track'
  // Needs-attention
  | 'At Risk' | 'Expiring' | 'Degraded' | 'On Customer'
  | 'Delayed' | 'Planned' | 'In Development' | 'Maintenance'
  // Negative end-states
  | 'Off Track' | 'Breached' | 'Down' | 'Expired'
  // Neutral closed
  | 'Closed' | 'New'
  // Allow any string for extensibility
  | string;

const STATUS_TONE_MAP: Record<string, PillTone> = {
  // brand
  'active':         'brand',
  'in progress':    'brand',
  'on bluelink':    'brand',
  'staged':         'brand',
  'qa':             'brand',
  // success
  'resolved':       'success',
  'completed':      'success',
  'released':       'success',
  'healthy':        'success',
  'within sla':     'success',
  'on track':       'success',
  // warning
  'at risk':        'warning',
  'expiring':       'warning',
  'degraded':       'warning',
  'on customer':    'warning',
  'delayed':        'warning',
  'planned':        'warning',
  'in development': 'warning',
  'maintenance':    'warning',
  // danger
  'off track':      'danger',
  'breached':       'danger',
  'down':           'danger',
  'expired':        'danger',
  // muted / neutral
  'closed':         'muted',
  'new':            'neutral',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [Pill],
  template: `
    <app-pill [tone]="tone()" [dot]="true">
      {{ value() }}
    </app-pill>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  value = input.required<StatusValue>();

  protected readonly tone = computed<PillTone>(() => {
    const key = this.value().toLowerCase();
    return STATUS_TONE_MAP[key] ?? 'neutral';
  });
}