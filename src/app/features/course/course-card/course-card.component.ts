import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CourseOverviewDto } from '@ivannicksim/vlp-backend-openapi-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, StarRatingComponent],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent implements OnInit {
  private router = inject(Router);
  course = input.required<CourseOverviewDto>();
  courseImage = input<Observable<Blob> | undefined>(undefined);
  courseImageUrl: string | undefined;
  canRateCourse = input<boolean>(false);
  isUserCourseOwner = input<boolean>(false);
  rate = output();
  delete = output();

  ngOnInit(): void {
    if (this.courseImage()) {
      this.courseImage()?.subscribe({
        next: (res) => {
          this.courseImageUrl = URL.createObjectURL(res);
        },
        error: () => {
          this.courseImageUrl = undefined;
        },
      });
    }
  }

  onRate(event: MouseEvent): void {
    event.stopPropagation();
    this.rate.emit();
  }

  editCourse(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/courses/edit', this.course().id]);
  }
  deleteCourse(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit();
  }

  openCourseDetails() {
    this.router.navigate(['/courses/', this.course().id]);
  }
}
