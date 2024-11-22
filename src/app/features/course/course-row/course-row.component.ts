import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

export interface ICourse {
  title?: string;
  topic?: string;
  difficultyLevel?: string;
  image?: string;
  rating?: number;
  totalVotes?: number;
  author?: string;
  status?: string;
  modificationDate?: string;
  totalStudents?: number;
}

@Component({
  selector: 'app-course-row',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent, MatButtonModule, MatSlideToggleModule],
  templateUrl: './course-row.component.html',
  styleUrl: './course-row.component.scss',
})
export class CourseRowComponent {
  @Input() course?: ICourse = {};
  isEnabled = true;
  isPublished = true;

  onSoftDelete(isEnabled: boolean) {
    this.isEnabled = isEnabled;
    console.log('Soft delete toggled:', isEnabled);
  }

  onStatusChange(isPublished: boolean) {
    this.isPublished = isPublished;
    if (this.course) {
      const updatedStatus = isPublished ? 'Published' : 'Draft';
      this.course.status = updatedStatus;
    }
  }
}
