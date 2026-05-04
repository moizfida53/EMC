// src/app/features/support/support.ts
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { SupportStore }        from './support-store';
import { TicketTable }         from './components/ticket-table/ticket-table';
import { TicketDetail }        from './components/ticket-detail/ticket-detail';
import { CreateTicketDialog }  from './components/create-ticket-dialog/create-ticket-dialog';
import { KpiCard }             from '../../shared/ui/kpi-card/kpi-card';
import { SectionHeader }       from '../../shared/ui/section-header/section-header';
import { Button }              from '../../shared/ui/button/button';
import { Case }                from '../../core/mock/mock-data.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule, TicketTable, TicketDetail,
    CreateTicketDialog, KpiCard, SectionHeader, Button,
  ],
  templateUrl: './support.html',
  styleUrl: './support.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Support {
  protected readonly store    = inject(SupportStore);
  protected readonly creating = signal(false);

  protected onCreated(c: Case): void {
    this.store.addCase(c);
    this.creating.set(false);
  }
}