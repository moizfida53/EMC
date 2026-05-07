// src/app/features/projects/components/roadmap/roadmap.ts
import {
  Component, Input, ChangeDetectionStrategy,
  inject, computed, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MockDataService,
  type Project,
  type ProjectStep,
  type StepStatus,
} from '../../../../core/mock/mock-data.service';
import { Pill, StatusBadge, FormatDatePipe } from '@shared';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, Pill, StatusBadge, FormatDatePipe],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Roadmap {
  @Input() project: Project | null = null;

  private readonly data = inject(MockDataService);

  // ── Steps for this project ────────────────────────────────
  protected readonly steps = computed<ProjectStep[]>(() => {
    if (!this.project) return [];
    return this.data.projectSteps
      .filter(s => s.projectId === this.project!.id)
      .sort((a, b) => new Date(a.plannedStart).getTime() - new Date(b.plannedStart).getTime());
  });

  // ── Counts (header KPI + milestones-status card) ─────────
  protected readonly milestonesCount = computed(() => this.steps().length);
  protected readonly completedCount  = computed(() => this.steps().filter(s => s.status === 'Completed').length);
  protected readonly inProgressCount = computed(() => this.steps().filter(s => s.status === 'In Progress').length);
  protected readonly delayedCount    = computed(() => this.steps().filter(s => this.isOverdue(s)).length);

  // Overall % complete: weight Completed = 100%, In Progress = stepProgress(), else 0
  protected readonly progressPct = computed(() => {
    const all = this.steps();
    if (!all.length) return 0;
    const total = all.reduce((sum, s) => {
      if (s.status === 'Completed')   return sum + 100;
      if (s.status === 'In Progress') return sum + this.stepProgress(s);
      return sum;
    }, 0);
    return Math.round(total / all.length);
  });

  // ── Window / duration ────────────────────────────────────
  protected readonly durationDays = computed(() => {
    if (!this.project) return 0;
    const start = new Date(this.project.startDate).getTime();
    const end   = new Date(this.project.endDate).getTime();
    return Math.max(0, Math.ceil((end - start) / 86400000));
  });

  // ── Owner — split "BlueLink Delivery — Karim Y." ─────────
  protected ownerOrg(owner: string): string {
    return owner.includes('—') ? owner.split('—')[0].trim() : owner;
  }
  protected ownerPerson(owner: string): string {
    return owner.includes('—') ? owner.split('—').slice(1).join('—').trim() : '';
  }

  // ── Milestone status helpers ─────────────────────────────
  protected stepIcon(status: StepStatus): string {
    switch (status) {
      case 'Completed':   return 'bi-check-circle-fill';
      case 'In Progress': return 'bi-play-circle-fill';
      case 'Delayed':     return 'bi-exclamation-circle-fill';
      default:            return 'bi-circle';
    }
  }

  protected stepIconClass(status: StepStatus): string {
    switch (status) {
      case 'Completed':   return 'roadmap__icon--completed';
      case 'In Progress': return 'roadmap__icon--in-progress';
      case 'Delayed':     return 'roadmap__icon--delayed';
      default:            return 'roadmap__icon--not-started';
    }
  }

  // Is the milestone past its planned finish but not yet completed?
  protected isOverdue(step: ProjectStep): boolean {
    if (step.status === 'Completed') return false;
    return new Date(step.plannedFinish).getTime() < Date.now();
  }

  // How many days the actual finish overran the planned finish (Completed steps only).
  protected overrunDays(step: ProjectStep): number {
    if (step.status !== 'Completed' || !step.actualFinish) return 0;
    const planned = new Date(step.plannedFinish).getTime();
    const actual  = new Date(step.actualFinish).getTime();
    const diff = actual - planned;
    return diff > 0 ? Math.ceil(diff / 86400000) : 0;
  }

  // % progress within an in-progress step (date-based)
  protected stepProgress(step: ProjectStep): number {
    if (step.status === 'Completed')   return 100;
    if (step.status !== 'In Progress') return 0;

    const start = new Date(step.plannedStart).getTime();
    const end   = new Date(step.plannedFinish).getTime();
    const now   = Date.now();
    if (now <= start) return 0;
    if (now >= end)   return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  protected hasActual(step: ProjectStep): boolean {
    return !!step.actualStart || !!step.actualFinish;
  }
}
