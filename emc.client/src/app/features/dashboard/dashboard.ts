// src/app/features/dashboard/dashboard.ts
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock/mock-data.service';
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
export class Dashboard {
  private readonly data = inject(MockDataService);

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
