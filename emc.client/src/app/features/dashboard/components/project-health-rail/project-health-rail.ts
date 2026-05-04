// src/app/features/dashboard/components/project-health-rail/project-health-rail.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterModule }    from '@angular/router';
import { CommonModule }    from '@angular/common';
import { MockDataService } from '../../../../core/mock/mock-data.service';
import { StatusBadge }     from '../../../../shared/ui/status-badge/status-badge';
import { MiniBar }         from '../../../../shared/ui/mini-bar/mini-bar';
import { FormatDatePipe }  from '../../../../shared/pipes/format-date.pipe';
import { MiniBarTone }     from '../../../../shared/ui/mini-bar/mini-bar';

@Component({
  selector: 'app-project-health-rail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadge, MiniBar, FormatDatePipe],
  templateUrl: './project-health-rail.html',
  styleUrl: './project-health-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectHealthRail {
  protected readonly data = inject(MockDataService);

  // Show first 4 projects
  protected readonly projects = this.data.projects.slice(0, 4);

  protected tone(health: string): MiniBarTone {
    if (health === 'Off Track') return 'danger';
    if (health === 'At Risk')   return 'warning';
    return 'brand';
  }
}