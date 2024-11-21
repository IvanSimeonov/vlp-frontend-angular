import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { CommonModule } from '@angular/common';

export interface ICourse {
  title?: string;
  description?: string;
  difficultyLevel?: string;
  image?: string;
  rating?: number;
  totalVotes?: number;
  author?: string;
  totalLectures?: number;
}

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, StarRatingComponent, CommonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  @Input() course?: ICourse;
}
