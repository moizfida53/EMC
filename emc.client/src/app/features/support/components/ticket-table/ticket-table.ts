// src/app/features/support/components/ticket-table/ticket-table.ts
import {
  Component, ChangeDetectionStrategy, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportStore } from '../../support-store';
import { MockDataService } from '../../../../core/mock/mock-data.service';
import { Badge } from '../../../../shared/ui/badge/badge';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [CommonModule, Badge, StatusBadge, FormatDatePipe, RelativeTimePipe],
  templateUrl: './ticket-table.html',
  styleUrl: './ticket-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketTable {
  protected readonly store = inject(SupportStore);
  private readonly data = inject(MockDataService);

  protected subjectTitle(id: string): string {
    return this.data.subjects.find(s => s.id === id)?.title ?? '—';
  }

  protected toggleSort(key: any): void {
    this.store.toggleSort(key);
  }

  protected isSorted(key: string): boolean {
    return this.store.sortKey() === key;
  }

  protected sortDir(): string {
    return this.store.sortDir();
  }

  protected openTicket(id: string): void {
    const current = this.store.openCaseId();
    this.store.openTicket(current === id ? null : id);
  }

  protected isOpen(id: string): boolean {
    return this.store.openCaseId() === id;
  }

  protected pages(): number[] {
    return Array.from({ length: this.store.totalPages() }, (_, i) => i + 1);
  }
}