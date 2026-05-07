// emc.client/src/app/shared/ui/searchbar/searchbar.ts
//
// Unified search row: leading search icon + text input + filter icon
// + N filter dropdowns. Matches the prototype's tickets-page searchbar.
//
// Usage:
//   <app-searchbar
//     placeholder="Search by ticket #, title, or keyword…"
//     [(query)]="searchQuery"
//     [filters]="[
//       { label: 'Status',   options: ['All statuses', 'Active', 'Resolved'] },
//       { label: 'Priority', options: ['All priorities', 'High', 'Medium', 'Low'] }
//     ]"
//     (filtersChange)="onFiltersChange($event)" />

import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SearchFilter {
  label: string;
  options: string[];
}

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Searchbar {
  // ── Inputs ─────────────────────────────────────────────────
  placeholder = input<string>('Search…');
  /** Two-way bindable search query */
  query       = model<string>('');
  /** Filter dropdown definitions (label + selectable options) */
  filters     = input<SearchFilter[]>([]);
  /** Show the funnel filter icon next to the search input */
  showFilterIcon = input<boolean>(true);

  // ── Outputs ────────────────────────────────────────────────
  /** Fires whenever any dropdown selection changes — emits the full set of selections */
  filtersChange = output<Record<string, string>>();
  /** Optional click on the funnel icon (e.g. to open an advanced filter panel) */
  filterIconClick = output<void>();

  // ── Internal state ────────────────────────────────────────
  protected readonly selections = signal<Record<string, string>>({});

  constructor() {
    // Initialize each filter to its first option (the "All …" entry)
    effect(() => {
      const initial: Record<string, string> = {};
      for (const f of this.filters()) initial[f.label] = f.options[0] ?? '';
      this.selections.set(initial);
    });
  }

  // ── Handlers ──────────────────────────────────────────────
  protected onFilterChange(label: string, value: string): void {
    this.selections.update(s => ({ ...s, [label]: value }));
    this.filtersChange.emit(this.selections());
  }

  protected onFilterIconClick(): void {
    this.filterIconClick.emit();
  }

  protected trackByLabel(_: number, f: SearchFilter): string {
    return f.label;
  }
}
