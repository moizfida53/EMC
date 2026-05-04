// emc.client/src/app/shared/pipes/format-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

type FormatMode = 'date' | 'datetime' | 'time' | 'relative';

@Pipe({
  name: 'formatDate',
  standalone: true,
  pure: true,
})
export class FormatDatePipe implements PipeTransform {

  /**
   * @param value  ISO date string or Date object
   * @param mode   'date' | 'datetime' | 'time' | 'relative'
   * @returns      Formatted string
   *
   * Usage in template:
   *   {{ case.createdOn | formatDate }}              → "28 Apr 2026"
   *   {{ case.createdOn | formatDate:'datetime' }}   → "28 Apr 2026, 03:42"
   *   {{ case.createdOn | formatDate:'time' }}       → "03:42"
   *   {{ case.createdOn | formatDate:'relative' }}   → "2 h ago"
   */
  transform(value: string | Date | null | undefined, mode: FormatMode = 'date'): string {
    if (!value) return '—';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';

    switch (mode) {
      case 'datetime':
        return date.toLocaleString('en-GB', {
          year:   'numeric',
          month:  'short',
          day:    '2-digit',
          hour:   '2-digit',
          minute: '2-digit',
        });

      case 'time':
        return date.toLocaleTimeString('en-GB', {
          hour:   '2-digit',
          minute: '2-digit',
        });

      case 'relative':
        return this._relative(date);

      case 'date':
      default:
        return date.toLocaleDateString('en-GB', {
          year:  'numeric',
          month: 'short',
          day:   '2-digit',
        });
    }
  }

  private _relative(date: Date): string {
    const diff = date.getTime() - Date.now();
    const abs  = Math.abs(diff);
    const past = diff < 0;

    const MIN  = 60_000;
    const HR   = 60 * MIN;
    const DAY  = 24 * HR;
    const WEEK = 7 * DAY;

    let value: string;

    if (abs < MIN)         value = 'just now';
    else if (abs < HR)     value = `${Math.round(abs / MIN)} min`;
    else if (abs < DAY)    value = `${Math.round(abs / HR)} h`;
    else if (abs < WEEK)   value = `${Math.round(abs / DAY)} d`;
    else                   value = `${Math.round(abs / WEEK)} wk`;

    if (value === 'just now') return value;
    return past ? `${value} ago` : `in ${value}`;
  }
}