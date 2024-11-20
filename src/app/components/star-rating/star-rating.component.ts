import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WhiteSpaceNumberPipe } from '../../shared/pipes/white-space-number.pipe';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule, WhiteSpaceNumberPipe],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  @Input() rating!: number;
  @Input() totalVotes!: number;

  get stars(): string[] {
    const fullStars = Math.floor(this.rating);
    const decimalPart = Number((this.rating - fullStars).toPrecision(1));
    const starIcons: string[] = [];

    for (let i = 0; i < fullStars; i++) {
      starIcons.push('star');
    }

    if (decimalPart > 0.2 && decimalPart < 0.8) {
      starIcons.push('star_half');
    }

    if (decimalPart >= 0.8) {
      starIcons.push('star');
    }

    while (starIcons.length < 5) {
      starIcons.push('star_border');
    }
    return starIcons;
  }
}
