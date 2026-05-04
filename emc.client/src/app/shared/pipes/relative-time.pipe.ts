// emc.client/src/app/shared/pipes/relative-time.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: true,
})
export class RelativeTimePipe implements PipeTransform {

  /**
   * @param value  ISO string, Date, or numeric timestamp
   * @returns      Human-readable relative string e.g. "3 h ago" | "in 2 d"
   *
   * Usage:
   *   {{ activity.scheduledStart | relativeTime }}   → "3 h ago"
   *   {{ ticket.responseBy | relativeTime }}         → "in 4 h"
   */
  transform(value: string | Date | number | null | undefined): string {
    if (value === null || value === undefined) return '—';

    const date =
      value instanceof Date
        ? value
        : new Date(typeof value === 'number' ? value : value);

    if (isNaN(date.getTime())) return '—';

    const diff = date.getTime() - Date.now();
    const abs  = Math.abs(diff);
    const past = diff < 0;

    const MIN  = 60_000;
    const HR   = 60 * MIN;
    const DAY  = 24 * HR;
    const WEEK = 7 * DAY;
    const MON  = 30 * DAY;

    let label: string;

    if (abs < 45 * 1000)       label = 'just now';
    else if (abs < HR)         label = `${Math.round(abs / MIN)} min`;
    else if (abs < DAY)        label = `${Math.round(abs / HR)} h`;
    else if (abs < WEEK)       label = `${Math.round(abs / DAY)} d`;
    else if (abs < MON)        label = `${Math.round(abs / WEEK)} wk`;
    else                       label = `${Math.round(abs / MON)} mo`;

    if (label === 'just now') return label;
    return past ? `${label} ago` : `in ${label}`;
  }
}