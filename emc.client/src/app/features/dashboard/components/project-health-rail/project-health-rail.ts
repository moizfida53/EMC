// src/app/features/dashboard/components/project-health-rail/project-health-rail.ts
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService ,ProjectHealth} from '../../../../../app/core/mock/mock-data.service';

@Component({
  selector: 'app-project-health-rail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-health-rail.html',
  styleUrl: './project-health-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectHealthRail {
  private readonly data = inject(MockDataService);

  protected readonly projects = computed(() => this.data.projects.slice(0, 4));

  protected tone(health: ProjectHealth): string {
    switch (health) {
      case 'Off Track': return 'off-track';
      case 'At Risk':  return 'at-risk';
      case 'On Track': return 'on-track';
      default:         return 'on-track';
    }
  }

  protected formatDate(iso: string): string {
    return this.data.formatDate(iso);
  }
}
