import { Component, input, OnInit, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WhiteSpaceNumberPipe } from '../../shared/pipes/white-space-number.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule, WhiteSpaceNumberPipe, CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent implements OnInit {
  rating = input<number>(0);
  totalVotes = input<number>(0);
  editable = input<boolean>(false);
  ratingChange = output<number>();
  hoveredRating = signal<number>(0);

  ngOnInit(): void {
    console.log(this.totalVotes());
  }

  get displayStars(): string[] {
    const effectiveRating = this.editable() ? this.hoveredRating() || this.rating() : this.rating();
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(effectiveRating)) {
        return 'star';
      }
      if (i < Math.ceil(effectiveRating)) {
        return 'star_half';
      }
      return 'star_border';
    });
  }

  onHover(hoveredRating: number): void {
    if (this.editable()) {
      this.hoveredRating.set(hoveredRating);
    }
  }

  onRate(newRating: number): void {
    if (this.editable()) {
      this.rating.apply(newRating);
      this.ratingChange.emit(newRating);
    }
  }
}
