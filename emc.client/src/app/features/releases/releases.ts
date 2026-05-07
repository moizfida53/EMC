// src/app/features/releases/releases.ts
import {
  Component, ChangeDetectionStrategy, inject, signal, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MockDataService, Release, ReleaseStatus, SystemComponent,
} from '../../core/mock/mock-data.service';
import {
  Pill, StatusBadge, Button, KpiCard, PageHeader,
  FormatDatePipe, RelativeTimePipe,
} from '@shared';

interface KanbanColumn {
  status: ReleaseStatus;
  label:  string;
  toneClass: string;
}

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [
    CommonModule,
    Pill, StatusBadge, Button, KpiCard, PageHeader,
    FormatDatePipe, RelativeTimePipe,
  ],
  templateUrl: './releases.html',
  styleUrl: './releases.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Releases {
  private readonly data = inject(MockDataService);

  protected readonly releases   = this.data.releases;
  protected readonly components = this.data.systemComponents;

  // ── KPIs ──────────────────────────────────────────────────
  protected readonly healthyCount = computed(() =>
    this.components.filter(c => c.productionStatus === 'Healthy').length
  );
  protected readonly degradedCount = computed(() =>
    this.components.filter(c => c.productionStatus !== 'Healthy').length
  );
  protected readonly releasesTracked = computed(() => this.releases.length);
  protected readonly upcomingCount = computed(() =>
    this.releases.filter(r =>
      r.status !== 'Released' &&
      new Date(r.targetCompletionDate).getTime() > Date.now()
    ).length
  );
  protected readonly deliveredYtd = computed(() => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
    return this.releases.filter(r =>
      r.status === 'Released' &&
      new Date(r.releaseDate).getTime() >= yearStart
    ).length;
  });

  // ── Kanban columns ────────────────────────────────────────
  protected readonly columns: KanbanColumn[] = [
    { status: 'Planned',        label: 'Planned',        toneClass: 'kanban__col--planned'    },
    { status: 'In Development', label: 'In Development', toneClass: 'kanban__col--dev'        },
    { status: 'QA',             label: 'QA',             toneClass: 'kanban__col--qa'         },
    { status: 'Staged',         label: 'Staged',         toneClass: 'kanban__col--staged'     },
    { status: 'Released',       label: 'Released',       toneClass: 'kanban__col--released'   },
  ];

  protected releasesByStatus(status: ReleaseStatus): Release[] {
    return this.releases.filter(r => r.status === status);
  }

  protected requestTypeTone(type: string): 'brand' | 'success' | 'warning' | 'muted' {
    switch (type) {
      case 'Hotfix':        return 'warning';
      case 'Feature':       return 'brand';
      case 'Release':       return 'success';
      case 'Configuration': return 'muted';
      default:              return 'muted';
    }
  }

  // ── Helpers ───────────────────────────────────────────────
  protected stripScheme(url: string): string {
    return url.replace(/^https?:\/\//, '');
  }

  /** Add a "v" prefix to a version string when it doesn't already start with one. */
  protected versionLabel(v: string): string {
    if (!v) return '';
    return /^v\d/i.test(v) ? v : `v${v}`;
  }

  /**
   * Maps an environment status to its tint modifier class.
   * Healthy → green tint, Degraded → red tint, anything else (Maintenance,
   * Down, etc.) → no tint, just the default surface.
   */
  protected envTintClass(status: string): string {
    switch ((status ?? '').toLowerCase()) {
      case 'healthy':  return 'env-card__env--healthy';
      case 'degraded': return 'env-card__env--degraded';
      default:         return '';
    }
  }

  protected onSubscribe(): void {
    console.info('Subscribe to status feed (mock)');
  }
}
