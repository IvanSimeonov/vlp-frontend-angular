import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whiteSpaceNumber',
  standalone: true,
})
export class WhiteSpaceNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }
    return value
      .toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
      .replaceAll(',', ' ');
  }
}
