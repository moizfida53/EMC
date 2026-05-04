// emc.client/src/app/shared/ui/product-logo/product-logo.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-logo.html',
  styleUrl: './product-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLogo {
  src  = input.required<string>();
  name = input.required<string>();
  size = input<number>(32);

  protected readonly styles = computed(() => ({
    width:  `${this.size()}px`,
    height: `${this.size()}px`,
  }));
}