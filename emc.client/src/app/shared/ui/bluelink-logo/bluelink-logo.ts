// emc.client/src/app/shared/ui/bluelink-logo/bluelink-logo.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bluelink-logo',
  standalone: true,
  imports: [CommonModule],
  template:`
  <div class="bluelink-logo">

  <img
    [src]="logoSrc()"
    alt="BlueLink Solutions"
    [width]="width()"
    [height]="height()"
    [style.width.px]="width()"
    [style.height.px]="height()"
    class="bluelink-logo__img"
    draggable="false" />

  <div
    *ngIf="sublabel()"
    class="bluelink-logo__sublabel"
    [ngStyle]="sublabelStyle()"
    aria-hidden="true">
    {{ sublabel() }}
  </div>

</div>`,
  styleUrl: './bluelink-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BluelinkLogo {
  variant  = input<'light' | 'dark'>('light');
  height   = input<number>(28);
  sublabel = input<string | null>('Customer Portal');

  protected readonly width = computed(() =>
    Math.round(this.height() * (1600 / 351))
  );

  protected readonly logoSrc = computed(() =>
    this.variant() === 'dark'
      ? '/bluelink.png'
      : 'bluelink-white.png'
  );

  protected readonly sublabelStyle = computed(() =>
    this.variant() === 'dark'
      ? { borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }
      : { borderColor: 'rgba(255,255,255,0.25)',                color: 'rgba(255, 255, 255, 0.7)'}
  );
}