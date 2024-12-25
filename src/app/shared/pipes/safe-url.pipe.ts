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
      console.warn('Invalid or unsafe URL: ', url);
      return null;
    }
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      console.warn('Could not extract YouTube Video ID from the URL: ', url);
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractVideoId(url: string): string | null {
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, /youtube\.com\/embed\/([^&\n?#]+)/];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }
}
