// src/app/features/projects/projects.ts
import {
  Component, ChangeDetectionStrategy, inject,
  signal, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Project } from '../../core/mock/mock-data.service';
import { ProjectCard } from './components/project-card/project-card';
import { Roadmap } from './components/roadmap/roadmap';
import {
  KpiCard,
  Button,
  PageHeader,
  Searchbar,
  SearchFilter,
} from '../../shared/shared';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, ProjectCard, Roadmap,
    KpiCard, Button, PageHeader, Searchbar,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private readonly data = inject(MockDataService);

  // ── Filter state ───────────────────────────────────────────
  protected readonly searchQuery  = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly healthFilter = signal('all');

  // ── Selected project (roadmap view) ────────────────────────
  protected readonly openProjectId = signal<string | null>(null);

  protected readonly projects = this.data.projects;

  protected readonly openProject = computed<Project | null>(() => {
    const id = this.openProjectId();
    return id ? this.projects.find(p => p.id === id) ?? null : null;
  });

  protected readonly filtered = computed(() => {
    const q    = this.searchQuery().toLowerCase().trim();
    const stat = this.statusFilter();
    const hlth = this.healthFilter();

    return [...this.projects]
      .filter(p => stat === 'all' || p.status === stat)
      .filter(p => hlth === 'all' || p.health === hlth)
      .filter(p => !q || (p.name + p.description).toLowerCase().includes(q))
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  });

  // ── Searchbar filter definitions ──────────────────────────
  protected readonly searchFilters: SearchFilter[] = [
    { label: 'Status', options: ['All statuses', 'Planning', 'In Progress', 'On Hold', 'Completed'] },
    { label: 'Health', options: ['All health',   'On Track', 'At Risk',     'Off Track']            },
  ];

  // ── KPI computeds ─────────────────────────────────────────
  protected readonly activeCount     = computed(() => this.projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length);
  protected readonly avgCompletion   = computed(() => {
    const all = this.projects;
    if (!all.length) return 0;
    return Math.round(all.reduce((sum, p) => sum + p.percentCompleted, 0) / all.length);
  });
  protected readonly needsAttention  = computed(() => this.projects.filter(p => p.health === 'At Risk' || p.health === 'Off Track').length);
  protected readonly deliveredYtd    = computed(() => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
    return this.projects.filter(p => p.status === 'Completed' && new Date(p.endDate).getTime() >= yearStart).length;
  });

  // ── Handlers ───────────────────────────────────────────────
  protected onSearch(q: string): void {
    this.searchQuery.set(q);
  }

  protected onFiltersChange(values: Record<string, string>): void {
    const status = values['Status'] ?? 'All statuses';
    const health = values['Health'] ?? 'All health';
    this.statusFilter.set(status === 'All statuses' ? 'all' : status);
    this.healthFilter.set(health === 'All health'   ? 'all' : health);
  }

  protected exportPortfolio(): void {
    // TODO: wire to ProjectService.exportPortfolio() once backend ships
    console.info('Export portfolio (mock)');
  }

  protected onCardClick(id: string): void {
    this.openProjectId.set(id);
  }

  protected closeRoadmap(): void {
    this.openProjectId.set(null);
  }
}
