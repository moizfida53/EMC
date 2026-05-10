// src/app/features/dashboard/dashboard.ts
import { Component, ChangeDetectionStrategy, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock/mock-data.service';
import { DemoService } from '../../core/services/demo.service';
import { DemoItem, DemoPing } from '../../core/models/demo.model';
import { KpiCard, MiniBar } from '@shared';
import { RetainerKpi } from './components/retainer-kpi/retainer-kpi';
import { ProjectHealthRail } from '../dashboard/components/project-health-rail/project-health-rail';
import { ActivityFeed } from '../dashboard/components/activity-feed/activity-feed';
import { WelcomeBanner } from "./components/welcome-banner/welcome-banner";

interface QuickLink {
  label: string;
  url: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KpiCard,
    MiniBar,
    RetainerKpi,
    ProjectHealthRail,
    ActivityFeed,
    WelcomeBanner,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly data = inject(MockDataService);
  private readonly demo = inject(DemoService);

  // ── EMC.Server connectivity smoke test ─────────────────────────────────
  protected readonly demoLoading = signal(false);
  protected readonly demoError   = signal<string | null>(null);
  protected readonly demoPing    = signal<DemoPing | null>(null);
  protected readonly demoItems   = signal<DemoItem[]>([]);

  ngOnInit(): void {
    this.loadDemo();
  }

  protected loadDemo(): void {
    this.demoLoading.set(true);
    this.demoError.set(null);

    this.demo.ping().subscribe({
      next: (res) => this.demoPing.set(res),
      error: (err) => this.demoError.set(this.formatError(err)),
    });

    this.demo.getDemoItems().subscribe({
      next: (items) => {
        this.demoItems.set(items);
        this.demoLoading.set(false);
      },
      error: (err) => {
        this.demoError.set(this.formatError(err));
        this.demoLoading.set(false);
      },
    });
  }

  private formatError(err: any): string {
    const status = err?.status ?? '???';
    const message = err?.error?.message ?? err?.message ?? 'Unknown error';
    return `[${status}] ${message}`;
  }

  protected readonly activeTickets = computed(() => 
    this.data.cases().filter(c => c.status === 'Active').length
  );

  protected readonly activeProjectsCount = computed(() => 
    this.data.projects.filter(p => p.status === 'In Progress').length
  );

  protected readonly avgCompletion = computed(() => {
    const active = this.data.projects.filter(p => p.status === 'In Progress');
    if (active.length === 0) return 0;
    const sum = active.reduce((acc, curr) => acc + curr.percentCompleted, 0);
    return Math.round(sum / active.length);
  });

  protected readonly expiringLicenses = computed(() => 
    this.data.expiringLicenses(30).length
  );


  protected readonly quickLinks: QuickLink[] = [
    { label: 'New ticket',     url: '/support/new' },
    { label: 'Knowledge base', url: '/knowledge'   },
    { label: 'Renew licence',  url: '/licences'    },
    { label: 'Release notes',  url: '/releases'    },
  ];
}
