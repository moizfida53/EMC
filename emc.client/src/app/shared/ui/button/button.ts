// emc.client/src/app/shared/ui/button/button.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize    = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  // ── Inputs ────────────────────────────────────────────────
  variant  = input<ButtonVariant>('primary');
  size     = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  /** Native button type */
  type     = input<'button' | 'submit' | 'reset'>('button');
  /** For anchor-style usage — renders <a> instead of <button> */
  href     = input<string | null>(null);
  /** Shows a spinner and disables the button */
  loading  = input<boolean>(false);
  /** aria-label for icon-only buttons */
  ariaLabel = input<string | null>(null);

  // ── Outputs ───────────────────────────────────────────────
  clicked = output<MouseEvent>();

  // ── Computed CSS classes ──────────────────────────────────
  protected readonly classes = computed(() => ({
    'btn': true,
    [`btn--${this.variant()}`]: true,
    [`btn--${this.size()}`]:    true,
    'btn--loading':             this.loading(),
    'btn--disabled':            this.disabled() || this.loading(),
  }));

  protected readonly isDisabled = computed(
    () => this.disabled() || this.loading()
  );

  protected onClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}