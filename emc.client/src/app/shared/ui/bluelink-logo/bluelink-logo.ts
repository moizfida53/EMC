import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-bluelink-logo',
  imports: [],
  template: ` 
  <div class="flex items-center gap-2.5">
    <img
      [src]="logoSrc()"
      alt="BlueLink Solutions"
      [style.width.px]="width()"
      [style.height.px]="height()"
    />
    @if (sublabel()) {
      <div
        class="hidden border-l pl-2.5 text-[10px] font-semibold uppercase
                    tracking-[0.18em] sm:block"
        [style.borderColor]="variant() === 'dark' ? 'rgba(255,255,255,0.25)' : '#dbe3f1'"
        [style.color]="variant() === 'dark' ? 'rgba(255,255,255,0.7)' : '#5a6477'"
      >
        {{ sublabel() }}
      </div>
    }
  </div>`,
})
export class BluelinkLogo {
  variant = input<'light' | 'dark'>('light');
  height = input<number>(28);
  sublabel = input<string | null>('Customer Portal');

  width = computed(() => Math.round(this.height() * (1600 / 351)));
  logoSrc = computed(() =>
    this.variant() === 'dark'
      ? '/assets/logos/bluelink-logo-white.png'
      : '/assets/logos/bluelink-logo.png',
  );
}
