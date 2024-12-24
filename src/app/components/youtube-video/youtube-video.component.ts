import { Component, input } from '@angular/core';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-youtube-video',
  standalone: true,
  imports: [SafeUrlPipe],
  templateUrl: './youtube-video.component.html',
  styleUrl: './youtube-video.component.scss',
})
export class YoutubeVideoComponent {
  videoUrl = input<string>();
  title = input<string>();
}
