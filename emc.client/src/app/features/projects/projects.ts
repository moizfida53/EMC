// src/app/features/projects/projects.ts
import {
  Component, ChangeDetectionStrategy, inject,
  signal, computed,
} from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MockDataService }   from '../../core/mock/mock-data.service';
import { ProjectCard }       from './components/project-card/project-card';
import { SectionHeader }     from '../../shared/ui/section-header/section-header';
import { StatusBadge }       from '../../shared/ui/status-badge/status-badge';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCard, SectionHeader],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects {
  private readonly data = inject(MockDataService);

  protected readonly statusFilter = signal('all');
  protected readonly healthFilter = signal('all');

  protected readonly projects = this.data.projects;

  protected readonly filtered = computed(() => {
    const stat = this.statusFilter();
    const hlth = this.healthFilter();

    return [...this.projects]
      .filter(p => stat === 'all' || p.status === stat)
      .filter(p => hlth === 'all' || p.health === hlth)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  });

  protected readonly statuses = ['In Progress', 'Completed', 'On Hold'];
  protected readonly healths = ['On Track', 'At Risk', 'Off Track'];

  protected readonly onTrackCount    = computed(() => this.projects.filter(p => p.health === 'On Track').length);
  protected readonly atRiskCount     = computed(() => this.projects.filter(p => p.health === 'At Risk').length);
  protected readonly offTrackCount   = computed(() => this.projects.filter(p => p.health === 'Off Track').length);
  protected readonly activeCount     = computed(() => this.projects.filter(p => p.status === 'In Progress').length);
  protected readonly avgCompletion   = computed(() => {
    const all = this.projects;
    if (!all.length) return 0;
    return Math.round(all.reduce((sum, p) => sum + p.percentCompleted, 0) / all.length);
  });

  protected onCardClick(id: string): void {
    // Navigate to project detail or open modal
    console.log('Open project:', id);
  }
}