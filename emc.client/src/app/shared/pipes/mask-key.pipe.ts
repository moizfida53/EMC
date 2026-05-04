// emc.client/src/app/shared/pipes/mask-key.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskKey',
  standalone: true,
  pure: true,
})
export class MaskKeyPipe implements PipeTransform {

  /**
   * Masks a validation / licence key, revealing only the last N characters.
   *
   * @param value      Raw key string, e.g. "GRDQ-7K3M-9P4N-A8F2-1234"
   * @param revealLast Number of trailing chars to expose (default 4)
   * @returns          Masked string, e.g. "XXXX-XXXX-XXXX-XXXX-1234"
   *
   * Usage:
   *   {{ license.validationKey | maskKey }}         → "XXXX-XXXX-XXXX-XXXX-1234"
   *   {{ license.validationKey | maskKey:8 }}       → "XXXX-XXXX-XXXX-A8F2-1234"
   */
  transform(
    value: string | null | undefined,
    revealLast: number = 4,
  ): string {
    if (!value) return '—';

    const tail  = value.slice(-revealLast);
    const head  = value.slice(0, value.length - revealLast);

    // Replace each alphanumeric char in the head with X,
    // preserve separator characters (hyphens, dots, spaces)
    const masked = head.replace(/[A-Za-z0-9]/g, 'X');

    return masked + tail;
  }
}