// src/app/features/support/support-store.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { MockDataService, Case } from '../../core/mock/mock-data.service';

export type SortKey = 'ticketNumber' | 'title' | 'priority' | 'statusReason' | 'responseBy';
export type SortDir = 'asc' | 'desc';

@Injectable({ providedIn: 'root' })
export class SupportStore {
  private readonly mock = inject(MockDataService);

  // ── Backing data (writable so new tickets can be prepended) ──────────
  readonly cases = this.mock.cases;

  // ── Filter / sort state ──────────────────────────────────────────────
  readonly search         = signal('');
  readonly statusFilter   = signal('all');
  readonly priorityFilter = signal('all');
  readonly sortKey        = signal<SortKey>('responseBy');
  readonly sortDir        = signal<SortDir>('asc');
  readonly page           = signal(1);
  readonly pageSize       = 6;

  // ── Selected ticket for detail panel ─────────────────────────────────
  readonly openCaseId = signal<string | null>(null);
  readonly openCase   = computed(() =>
    this.cases().find(c => c.id === this.openCaseId()) ?? null
  );

  // ── Derived filtered + sorted list ───────────────────────────────────
  readonly filtered = computed(() => {
    const q   = this.search().toLowerCase().trim();
    const st  = this.statusFilter();
    const pri = this.priorityFilter();
    const key = this.sortKey();
    const dir = this.sortDir();

    return [...this.cases()]
      .filter(c => st  === 'all' || c.status   === st)
      .filter(c => pri === 'all' || c.priority === pri)
      .filter(c => !q  || (c.title + c.ticketNumber + c.description).toLowerCase().includes(q))
      .sort((a, b) => {
        const cmp = String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true });
        return dir === 'asc' ? cmp : -cmp;
      });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize))
  );

  readonly pageRows = computed(() => {
    const p = this.page();
    return this.filtered().slice((p - 1) * this.pageSize, p * this.pageSize);
  });

  // ── KPI counts ───────────────────────────────────────────────────────
  readonly activeCount    = computed(() => this.cases().filter(c => c.status === 'Active').length);
  readonly onCustomer     = computed(() => this.cases().filter(c => c.statusReason === 'On Customer').length);
  readonly breachingSoon  = computed(() =>
    this.cases().filter(c =>
      c.status === 'Active' &&
      new Date(c.responseBy).getTime() - Date.now() < 12 * 3600 * 1000
    ).length
  );
  readonly resolvedRecent = computed(() =>
    this.cases().filter(c =>
      (c.status === 'Resolved' || c.status === 'Closed') &&
      new Date(c.createdOn).getTime() > Date.now() - 14 * 86400000
    ).length
  );

  // ── Actions ──────────────────────────────────────────────────────────
  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  setSearch(v: string):         void { this.search.set(v);         this.page.set(1); }
  setStatusFilter(v: string):   void { this.statusFilter.set(v);   this.page.set(1); }
  setPriorityFilter(v: string): void { this.priorityFilter.set(v); this.page.set(1); }
  setPage(p: number):           void { this.page.set(p); }
  openTicket(id: string | null):void { this.openCaseId.set(id); }

  addCase(c: Case): void {
    this.cases.update(list => [c, ...list]);
  }
}