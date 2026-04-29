import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskKey',
})
export class MaskKeyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
