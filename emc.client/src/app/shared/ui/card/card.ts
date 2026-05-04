// emc.client/src/app/shared/ui/card/card.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  /** Makes the card clickable — emits (cardClick) and adds hover styles */
  clickable  = input<boolean>(false);
  /** Adds a ring highlight (e.g. active/selected state) */
  highlighted = input<boolean>(false);
  /** Extra padding variant */
  padding    = input<'none' | 'sm' | 'md' | 'lg'>('md');

  cardClick = output<Event>();

  protected readonly classes = computed(() => ({
    'card':                    true,
    'card--clickable':         this.clickable(),
    'card--highlighted':       this.highlighted(),
    [`card--pad-${this.padding()}`]: true,
  }));

  protected onClick(event: Event): void {
    if (!this.clickable()) return;

    event.preventDefault();
    this.cardClick.emit(event);
  }
}