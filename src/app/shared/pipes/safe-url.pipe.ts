import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) {
      console.log('Invalid or unsafe URL: ', url);
      return null;
    }
    const safeUrl = `https://www.youtube.com/embed/${url}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
  }
}
