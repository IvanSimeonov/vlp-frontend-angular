import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

export interface ICourse {
  id?: number;
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
  imports: [MatCardModule, MatIconModule, StarRatingComponent, CommonModule, MatButtonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  @Input() course?: ICourse = {};
  @Input() showRateBtn = false;
  @Input() isUserCourseOwner = false;
  @Output() rate = new EventEmitter<void>();

  constructor(private router: Router) {}

  onRate(): void {
    this.rate.emit();
  }

  editCourse() {
    this.router.navigate(['/courses/edit', this.course?.id]);
  }
  deleteCourse() {
    this.router.navigate(['/courses/edit', this.course?.id]);
  }

  openCourseDetails() {
    this.router.navigate(['/courses/', this.course?.id]);
  }
}
