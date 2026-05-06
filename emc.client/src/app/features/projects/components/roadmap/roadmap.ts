// src/app/features/projects/components/roadmap/roadmap.ts
import {
  Component, Input, ChangeDetectionStrategy,
  inject, computed, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, type Project, type ProjectStep } from '../../../../core/mock/mock-data.service';
import { Pill, StatusBadge, FormatDatePipe } from "@shared";

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

  protected readonly steps = computed(() => {
    if (!this.project) return [];
    return this.data.projectSteps.filter(s => s.projectId === this.project?.id);
  });

  protected readonly now = signal(new Date());

  protected readonly timelineStart = computed(() => {
    if (!this.project) return new Date();
    return new Date(this.project.startDate);
  });

  protected readonly timelineEnd = computed(() => {
    if (!this.project) return new Date();
    return new Date(this.project.endDate);
  });

  protected readonly totalDays = computed(() => {
    const start = this.timelineStart().getTime();
    const end = this.timelineEnd().getTime();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  });

  // Calculate step position (percentage from start)
  protected stepStartPercent(step: ProjectStep): number {
    const stepStart = new Date(step.plannedStart).getTime();
    const timelineStart = this.timelineStart().getTime();
    const totalMs = this.totalDays() * 24 * 60 * 60 * 1000;
    const offset = stepStart - timelineStart;
    return Math.max(0, (offset / totalMs) * 100);
  }

  // Calculate step duration (percentage of total)
  protected stepDurationPercent(step: ProjectStep): number {
    const stepStart = new Date(step.plannedStart).getTime();
    const stepEnd = new Date(step.plannedFinish).getTime();
    const stepDuration = stepEnd - stepStart;
    const totalMs = this.totalDays() * 24 * 60 * 60 * 1000;
    return Math.max(2, (stepDuration / totalMs) * 100); // Min 2% for visibility
  }

  // Map step status to tone for styling
  protected stepTone(status: string): 'success' | 'warning' | 'danger' | 'brand' {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'brand';
      case 'At Risk':
        return 'warning';
      case 'Blocked':
        return 'danger';
      default:
        return 'brand';
    }
  }

  // Get days remaining for a step
  protected daysRemaining(endDate: string): number {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  // Get days elapsed for a step
  protected daysElapsed(startDate: string): number {
    const start = new Date(startDate).getTime();
    const now = Date.now();
    const days = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  // Check if step is overdue
  protected isOverdue(step: ProjectStep): boolean {
    const endDate = new Date(step.plannedFinish).getTime();
    return step.status === 'In Progress' && endDate < Date.now();
  }

  // Check if step is upcoming (starts in future)
  protected isUpcoming(step: ProjectStep): boolean {
    const startDate = new Date(step.plannedStart).getTime();
    return startDate > Date.now();
  }

  // Check if step is active (current)
  protected isActive(step: ProjectStep): boolean {
    const startDate = new Date(step.plannedStart).getTime();
    const endDate = new Date(step.plannedFinish).getTime();
    const now = Date.now();
    return startDate <= now && now <= endDate && step.status === 'In Progress';
  }

  // Calculate progress for step (if in progress)
  protected stepProgress(step: ProjectStep): number {
    if (step.status !== 'In Progress') {
      return step.status === 'Completed' ? 100 : 0;
    }

    const startDate = new Date(step.plannedStart).getTime();
    const endDate = new Date(step.plannedFinish).getTime();
    const now = Date.now();

    if (now < startDate) return 0;
    if (now > endDate) return 100;

    const total = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / total) * 100);
  }

  // Get week numbers for timeline header
  protected get weekNumbers(): { week: number; start: Date; percent: number }[] {
    const weeks = [];
    let current = new Date(this.timelineStart());
    let weekNum = 1;

    while (current < this.timelineEnd()) {
      const weekStart = new Date(current);
      const percent = this.calcPercent(weekStart);
      weeks.push({ week: weekNum, start: weekStart, percent });

      current.setDate(current.getDate() + 7);
      weekNum++;
    }

    return weeks;
  }

  private calcPercent(date: Date): number {
    const dateTime = date.getTime();
    const timelineStart = this.timelineStart().getTime();
    const totalMs = this.totalDays() * 24 * 60 * 60 * 1000;
    const offset = dateTime - timelineStart;
    return (offset / totalMs) * 100;
  }
}