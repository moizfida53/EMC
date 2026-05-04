// src/app/features/dashboard/components/activity-feed/activity-feed.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { MockDataService } from '../../../../core/mock/mock-data.service';
import { Pill }            from '../../../../shared/ui/pill/pill';
import { FormatDatePipe }  from '../../../../shared/pipes/format-date.pipe';
import { RelativeTimePipe }from '../../../../shared/pipes/relative-time.pipe';
import { PillTone }        from '../../../../shared/ui/pill/pill';

const TYPE_TONE: Record<string, PillTone> = {
  Email: 'brand', Meeting: 'brand', Call: 'success',
  Task: 'warning', Note: 'muted',
};

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, Pill, FormatDatePipe, RelativeTimePipe],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeed {
  protected readonly data       = inject(MockDataService);
  protected readonly activities = [...this.data.activities]
    .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());

  protected tone(type: string): PillTone {
    return TYPE_TONE[type] ?? 'neutral';
  }
}