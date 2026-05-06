// src/app/features/support/components/ticket-detail/ticket-detail.ts
import {
  Component, ChangeDetectionStrategy, inject, signal, computed, OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportStore } from '../../support-store';
import { MockDataService, CaseTimeline } from '../../../../core/mock/mock-data.service';
import { Badge } from '../../../../shared/ui/badge/badge';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { Pill } from '../../../../shared/ui/pill/pill';
import { Button } from '../../../../shared/ui/button/button';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, Badge, StatusBadge, Pill, Button, FormatDatePipe],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetail {
  protected readonly store = inject(SupportStore);
  private readonly data = inject(MockDataService);

  protected readonly reply = signal('');

  protected readonly caseRow = this.store.openCase;

  protected readonly thread = computed<CaseTimeline[]>(() => {
    const c = this.caseRow();
    if (!c) return [];
    const existing = this.data.caseTimeline.filter(t => t.caseId === c.id);
    if (existing.length > 0) return existing;
    return [
      {
        id: `seed-${c.id}-1`,
        caseId: c.id,
        type: 'Customer Reply',
        description: c.description,
        createdOn: c.createdOn,
        author: c.contact,
      },
      {
        id: `seed-${c.id}-2`,
        caseId: c.id,
        type: 'System Note',
        description: `Auto-routed to ${this.subjectTitle(c.subjectId)} queue. Priority set to ${c.priority}.`,
        createdOn: new Date(new Date(c.createdOn).getTime() + 60_000).toISOString(),
        author: 'BlueLink System',
      },
    ] as CaseTimeline[];
  });

  protected readonly extraReplies = signal<CaseTimeline[]>([]);

  protected readonly allEntries = computed(() => [
    ...this.thread(),
    ...this.extraReplies(),
  ]);

  protected subjectTitle(id: string): string {
    return this.data.subjects.find(s => s.id === id)?.title ?? '—';
  }

  protected productName(id: string | null): string {
    if (!id) return '—';
    return this.data.products.find(p => p.id === id)?.name ?? '—';
  }

  protected isCustomer(type: string): boolean {
    return type === 'Customer Reply';
  }

  protected isSystem(type: string): boolean {
    return type === 'System Note' || type === 'Status Change';
  }

  protected relativeTime(iso: string): string {
    return this.data.relativeTime(iso);
  }

  protected formatDateTime(iso: string): string {
    return this.data.formatDateTime(iso);
  }

  protected send(): void {
    const text = this.reply().trim();
    if (!text) return;
    this.extraReplies.update(r => [...r, {
      id: `r-${Date.now()}`,
      caseId: this.caseRow()!.id,
      type: 'Customer Reply',
      description: text,
      createdOn: new Date().toISOString(),
      author: 'Amelia Brooks',
    } as CaseTimeline]);
    this.reply.set('');
  }

  protected close(): void {
    this.store.openTicket(null);
  }

  protected initials(author: string): string {
    return author.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}