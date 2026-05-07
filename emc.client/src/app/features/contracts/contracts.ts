// src/app/features/contracts/contracts.ts
import {
  Component, ChangeDetectionStrategy, inject, signal, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, ServiceAgreement } from '../../core/mock/mock-data.service';
import { MaskKeyPipe } from '../../shared/pipes/mask-key.pipe';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';
import {
  KpiCard,
  StatusBadge,
  Pill,
  MiniBar,
  Button,
  ProductLogo,
  PageHeader,
  Searchbar,
} from '../../shared/shared';

type ContractsTab = 'agreements' | 'licenses';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule,
    KpiCard, StatusBadge, Pill, MiniBar, Button, ProductLogo,
    PageHeader, Searchbar,
    MaskKeyPipe, FormatDatePipe,
  ],
  templateUrl: './contracts.html',
  styleUrl: './contracts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contracts {
  private readonly data = inject(MockDataService);

  protected readonly serviceAgreements = this.data.serviceAgreements;
  protected readonly licenses          = this.data.licenses;
  protected readonly products          = this.data.products;

  protected readonly activeTab    = signal<ContractsTab>('agreements');
  protected readonly openSaId     = signal<string | null>(this.data.serviceAgreements[0]?.id ?? null);
  protected readonly licSearch    = signal('');
  protected readonly revealedKeys = signal<Set<string>>(new Set());
  protected readonly copiedKeys   = signal<Set<string>>(new Set());

  // ── KPIs ────────────────────────────────────────────────
  protected readonly totalContracted = computed(() =>
    this.serviceAgreements.reduce((a, sa) => a + sa.contractedBalanceQty, 0)
  );
  protected readonly totalAvailable = computed(() =>
    this.serviceAgreements.reduce((a, sa) => a + sa.availableBalanceQty, 0)
  );
  protected readonly availablePct = computed(() =>
    this.totalContracted() === 0 ? 0
      : Math.round((this.totalAvailable() / this.totalContracted()) * 100)
  );
  protected readonly activeCount = computed(() =>
    this.licenses.filter(l => l.status === 'Active').length
  );
  protected readonly expiring30 = computed(() =>
    this.data.expiringLicenses(30).length
  );

  // ── Filtered licenses ─────────────────────────────────────
  protected readonly filteredLicenses = computed(() => {
    const q = this.licSearch().toLowerCase().trim();
    if (!q) return this.licenses;
    return this.licenses.filter(l => {
      const prod = this.products.find(p => p.id === l.productId)?.name ?? '';
      return (l.name + prod + l.validationKey).toLowerCase().includes(q);
    });
  });

  // ── Tabs ─────────────────────────────────────────────────
  protected setTab(tab: ContractsTab): void { this.activeTab.set(tab); }

  // ── SA accordion ─────────────────────────────────────────
  protected toggleSa(id: string): void {
    this.openSaId.update(v => v === id ? null : id);
  }

  protected isOpen(id: string): boolean { return this.openSaId() === id; }

  protected usedHours(sa: ServiceAgreement): number {
    return sa.contractedBalanceQty - sa.availableBalanceQty;
  }

  protected billingPct(sa: ServiceAgreement): number {
    return Math.round((sa.billingBalanceQty / sa.contractedBalanceQty) * 100);
  }

  protected usedPct(sa: ServiceAgreement): number {
    return Math.round((this.usedHours(sa) / sa.contractedBalanceQty) * 100);
  }

  protected availPct(sa: ServiceAgreement): number {
    return Math.round((sa.availableBalanceQty / sa.contractedBalanceQty) * 100);
  }

  protected availTone(sa: ServiceAgreement): 'brand' | 'warning' | 'success' {
    const ratio = sa.availableBalanceQty / sa.contractedBalanceQty;
    if (ratio < 0.2) return 'warning';
    if (ratio > 0.5) return 'success';
    return 'brand';
  }

  protected usedTone(sa: ServiceAgreement): 'brand' | 'warning' {
    return this.usedHours(sa) / sa.contractedBalanceQty > 0.8 ? 'warning' : 'brand';
  }

  protected availTextClass(sa: ServiceAgreement): string {
    const ratio = sa.availableBalanceQty / sa.contractedBalanceQty;
    if (ratio < 0.2) return 'contracts__avail--low';
    return 'contracts__avail--ok';
  }

  // ── Key reveal/copy ──────────────────────────────────────
  protected isRevealed(id: string): boolean { return this.revealedKeys().has(id); }

  protected toggleReveal(id: string): void {
    this.revealedKeys.update(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  protected copyKey(id: string, key: string): void {
    navigator.clipboard.writeText(key).catch(() => {});
    this.copiedKeys.update(s => new Set([...s, id]));
    setTimeout(() => {
      this.copiedKeys.update(s => {
        const n = new Set(s); n.delete(id); return n;
      });
    }, 1500);
  }

  protected isCopied(id: string): boolean { return this.copiedKeys().has(id); }

  protected productFor(productId: string) {
    return this.products.find(p => p.id === productId);
  }

  protected endDateClass(status: string): string {
    if (status === 'Expired')  return 'contracts__lic-end--expired';
    if (status === 'Expiring') return 'contracts__lic-end--expiring';
    return '';
  }

  // ── Searchbar handler (licenses tab) ─────────────────────
  protected onLicenseSearch(q: string): void {
    this.licSearch.set(q);
  }
}
