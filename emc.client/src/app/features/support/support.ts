// src/app/features/support/support.ts
import {
  Component, ChangeDetectionStrategy, inject, signal, viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportStore } from './support-store';
import { TicketTable } from './components/ticket-table/ticket-table';
import { TicketDetail } from './components/ticket-detail/ticket-detail';
import { MockDataService, Case } from '../../core/mock/mock-data.service';
import {
  KpiCard,
  Button,
  PageHeader,
  Searchbar,
  Modal,
  SearchFilter,
} from '../../shared/shared';

type Priority = 'High' | 'Medium' | 'Low';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TicketTable, TicketDetail,
    KpiCard, Button, PageHeader, Searchbar, Modal,
  ],
  templateUrl: './support.html',
  styleUrl: './support.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Support {
  protected readonly store = inject(SupportStore);
  protected readonly data  = inject(MockDataService);

  // Modal reference (for open/close from buttons)
  protected readonly newTicketModal = viewChild<Modal>('newTicketModal');

  // ── New-ticket form state ───────────────────────────────────
  protected readonly nt_title       = signal('');
  protected readonly nt_description = signal('');
  protected readonly nt_priority    = signal<Priority>('Medium');
  protected readonly nt_subjectId   = signal(this.data.subjects[0].id);
  protected readonly nt_submitting  = signal(false);
  protected readonly nt_error       = signal<string | null>(null);

  protected readonly priorities: Priority[] = ['High', 'Medium', 'Low'];

  // ── Searchbar filter definitions ───────────────────────────
  protected readonly searchFilters: SearchFilter[] = [
    { label: 'Status',   options: ['All statuses',   'Active', 'Resolved', 'Closed'] },
    { label: 'Priority', options: ['All priorities', 'High',   'Medium',   'Low']    },
  ];

  // ── Handlers ───────────────────────────────────────────────
  protected onSearch(q: string): void {
    this.store.setSearch(q);
  }

  protected onFiltersChange(values: Record<string, string>): void {
    const status   = values['Status']   ?? 'All statuses';
    const priority = values['Priority'] ?? 'All priorities';
    this.store.setStatusFilter(status === 'All statuses' ? 'all' : status);
    this.store.setPriorityFilter(priority === 'All priorities' ? 'all' : priority);
  }

  protected openNewTicket(): void {
    this.resetNewTicketForm();
    this.newTicketModal()?.open();
  }

  protected submitNewTicket(): void {
    if (!this.nt_title().trim()) {
      this.nt_error.set('Please add a title for your ticket.');
      return;
    }
    this.nt_submitting.set(true);
    this.nt_error.set(null);

    // Simulate async — replace with SupportService.createCase(...) later
    setTimeout(() => {
      const newCase: Case = {
        id:           `case-${Date.now()}`,
        ticketNumber: `BL-${Math.floor(10500 + Math.random() * 499)}`,
        title:        this.nt_title().trim(),
        description:  this.nt_description().trim(),
        priority:     this.nt_priority(),
        statusReason: 'New',
        status:       'Active',
        responseBy:   new Date(Date.now() + 24 * 3600000).toISOString(),
        createdOn:    new Date().toISOString(),
        subjectId:    this.nt_subjectId(),
        productId:    null,
        contact:      'Amelia Brooks',
      };
      this.store.addCase(newCase);
      this.nt_submitting.set(false);
      this.newTicketModal()?.close();
    }, 600);
  }

  private resetNewTicketForm(): void {
    this.nt_title.set('');
    this.nt_description.set('');
    this.nt_priority.set('Medium');
    this.nt_subjectId.set(this.data.subjects[0].id);
    this.nt_error.set(null);
  }
}
