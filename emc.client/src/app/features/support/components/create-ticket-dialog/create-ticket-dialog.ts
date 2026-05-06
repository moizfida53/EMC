// src/app/features/support/components/create-ticket-dialog/create-ticket-dialog.ts
import {
  Component, ChangeDetectionStrategy, inject,
  signal, output,
} from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { MockDataService, Case } from '../../../../core/mock/mock-data.service';
import { Button }          from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-create-ticket-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './create-ticket-dialog.html',
  styleUrl: './create-ticket-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTicketDialog {
  protected readonly data = inject(MockDataService);

  // ── Outputs ──────────────────────────────────────────────
  created = output<Case>();
  closed  = output<void>();

  // ── Form state ───────────────────────────────────────────
  protected title       = signal('');
  protected description = signal('');
  protected priority    = signal<'High' | 'Medium' | 'Low'>('Medium');
  protected subjectId   = signal(this.data.subjects[0].id);
  protected submitting  = signal(false);
  protected error       = signal<string | null>(null);

  protected readonly priorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];

  protected submit(): void {
    if (!this.title().trim()) {
      this.error.set('Please add a title for your ticket.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    // Simulate async submit — replace with real API call
    setTimeout(() => {
      const newCase: Case = {
        id:           `case-${Date.now()}`,
        ticketNumber: `BL-${Math.floor(10500 + Math.random() * 499)}`,
        title:        this.title().trim(),
        description:  this.description().trim(),
        priority:     this.priority(),
        statusReason: 'New',
        status:       'Active',
        responseBy:   new Date(Date.now() + 24 * 3600000).toISOString(),
        createdOn:    new Date().toISOString(),
        subjectId:    this.subjectId(),
        productId:    null,
        contact:      'Amelia Brooks',
      };

      this.created.emit(newCase);
      this.submitting.set(false);
      this.close();
    }, 600);
  }

  protected close(): void {
    this.title.set('');
    this.description.set('');
    this.priority.set('Medium');
    this.error.set(null);
    this.closed.emit();
  }
}