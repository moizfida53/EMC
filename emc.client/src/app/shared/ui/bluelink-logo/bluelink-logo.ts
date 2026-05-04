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
  templateUrl: './bluelink-logo.html',
  styleUrl: './bluelink-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BluelinkLogo {
  /** 'light' = blue logo on light backgrounds (default)
   *  'dark'  = white logo for dark/brand panels             */
  variant  = input<'light' | 'dark'>('light');
  /** Render height in px; width derived from official aspect ratio 1600:351 */
  height   = input<number>(28);
  /** Sub-label text. Pass null to hide entirely */
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