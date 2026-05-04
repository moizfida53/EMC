// src/app/features/dashboard/dashboard.ts
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { MockDataService }    from '../../core/mock/mock-data.service';
import { WelcomeBanner }      from './components/welcome-banner/welcome-banner';
import { RetainerKpi }        from './components/retainer-kpi/retainer-kpi';
import { ProjectHealthRail }  from './components/project-health-rail/project-health-rail';
import { ActivityFeed }       from './components/activity-feed/activity-feed';
import { KpiCard }            from '../../shared/ui/kpi-card/kpi-card';
import { SectionHeader }      from '../../shared/ui/section-header/section-header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, WelcomeBanner, RetainerKpi,
    ProjectHealthRail, ActivityFeed, KpiCard, SectionHeader,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly data = inject(MockDataService);

  protected readonly activeTickets  = computed(() => this.data.cases().filter(c => c.status === 'Active').length);
  protected readonly activeProjects = computed(() => this.data.projects.filter(p => p.status === 'In Progress').length);
  protected readonly avgCompletion  = computed(() => {
    const active = this.data.projects.filter(p => p.status === 'In Progress');
    return active.length ? Math.round(active.reduce((s, p) => s + p.percentCompleted, 0) / active.length) : 0;
  });
  protected readonly expiringLicenses = computed(() => this.data.expiringLicenses(30).length);
}