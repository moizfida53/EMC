// src/app/features/dashboard/components/retainer-kpi/retainer-kpi.ts
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { MockDataService } from '../../../../core/mock/mock-data.service';
import { KpiCard, MiniBar } from '@shared';


@Component({
  selector: 'app-retainer-kpi',
  standalone: true,
  imports: [CommonModule, KpiCard, MiniBar],
  templateUrl: './retainer-kpi.html',
  styleUrl: './retainer-kpi.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetainerKpi {
  private readonly data = inject(MockDataService);

  // Use the Platinum retainer (first SA)
  protected readonly sa = this.data.serviceAgreements[0];

  protected readonly used = computed(() =>
    this.sa.contractedBalanceQty - this.sa.availableBalanceQty
  );

  protected readonly pctAvailable = computed(() =>
    Math.round((this.sa.availableBalanceQty / this.sa.contractedBalanceQty) * 100)
  );

  protected readonly tone = computed(() =>
    this.pctAvailable() < 20 ? 'warning' as const : 'brand' as const
  );

  protected readonly endDate = this.data.formatDate(this.sa.endDate);
}