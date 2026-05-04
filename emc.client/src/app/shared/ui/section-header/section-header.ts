// emc.client/src/app/shared/ui/section-header/section-header.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeader {
  eyebrow     = input<string | null>(null);
  title       = input.required<string>();
  description = input<string | null>(null);
}