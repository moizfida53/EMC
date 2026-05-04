// src/app/features/projects/components/project-card/project-card.ts
import {
  Component, ChangeDetectionStrategy,
  input, output, inject, computed,
} from '@angular/core';
import { CommonModule }    from '@angular/common';
import { MockDataService, Project } from '../../../../core/mock/mock-data.service';
import { StatusBadge }     from '../../../../shared/ui/status-badge/status-badge';
import { MiniBar }         from '../../../../shared/ui/mini-bar/mini-bar';
import { MiniBarTone }     from '../../../../shared/ui/mini-bar/mini-bar';
import { FormatDatePipe }  from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, StatusBadge, MiniBar, FormatDatePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  project   = input.required<Project>();
  cardClick = output<void>();

  protected tone(health: string): MiniBarTone {
    if (health === 'Off Track') return 'danger';
    if (health === 'At Risk')   return 'warning';
    return 'brand';
  }

  protected ownerShort(owner: string): string {
    // "BlueLink Delivery — Karim Y." → "Karim Y."
    return owner.includes('—') ? owner.split('—').pop()!.trim() : owner;
  }
}