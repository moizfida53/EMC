// src/app/features/dashboard/components/activity-feed/activity-feed.ts
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../../../../app/core/mock/mock-data.service';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeed {
  private readonly data = inject(MockDataService);

  protected readonly activities = computed(() => 
    [...this.data.activities].sort((a, b) => 
      new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()
    )
  );

  protected icon(type: string): string {
    // Based on the design icons
    switch (type) {
      case 'Email':   return 'bi-envelope';
      case 'Call':    return 'bi-telephone';
      case 'Task':    return 'bi-check2-square';
      case 'Meeting': return 'bi-calendar-event';
      case 'Note':    return 'bi-sticky';
      default:        return 'bi-circle';
    }
  }

  protected formatRelative(iso: string): string {
    return this.data.relativeTime(iso);
  }

  protected formatDateTime(iso: string): string {
    return this.data.formatDateTime(iso);
  }
}
