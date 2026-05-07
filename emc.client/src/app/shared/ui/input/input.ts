// emc.client/src/app/shared/ui/input/input.ts
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  forwardRef,
  signal,
  computed,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  // ── Native input reference ────────────────────────────────
  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  // ── Inputs ────────────────────────────────────────────────
  label        = input<string | null>(null);
  placeholder  = input<string>('');
  type         = input<string>('text');
  hint         = input<string | null>(null);
  errorMessage = input<string | null>(null);
  leadingIcon  = input<boolean>(false);  // slot for leading icon via ng-content
  trailingIcon = input<boolean>(false);  // slot for trailing icon
  required     = input<boolean>(false);
  readonly     = input<boolean>(false);
  id           = input<string>(`input-${Math.random().toString(36).slice(2, 7)}`);

  // ── Outputs ───────────────────────────────────────────────
  valueChange = output<string>();
  blurred     = output<void>();
  focused     = output<void>();

  // ── Internal state ────────────────────────────────────────
  protected readonly _value    = signal<string>('');
  protected readonly _disabled = signal<boolean>(false);
  protected readonly _touched  = signal<boolean>(false);

  protected readonly hasError = computed(
    () => !!this.errorMessage() && this._touched()
  );

  protected readonly wrapperClasses = computed(() => ({
    'input-wrapper':           true,
    'input-wrapper--leading':  this.leadingIcon(),
    'input-wrapper--trailing': this.trailingIcon(),
  }));

  // ── CVA ───────────────────────────────────────────────────
  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void         = () => {};

  writeValue(val: string): void {
    this._value.set(val ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this._disabled.set(disabled);
  }

  // ── Handlers ─────────────────────────────────────────────
  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this._value.set(val);
    this._onChange(val);
    this.valueChange.emit(val);
  }

  protected onBlur(): void {
    this._touched.set(true);
    this._onTouched();
    this.blurred.emit();
  }

  protected onFocus(): void {
    this.focused.emit();
  }

  /** Programmatic focus */
  focus(): void {
    this.inputEl()?.nativeElement.focus();
  }
}