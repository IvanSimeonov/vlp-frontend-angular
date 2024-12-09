import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {
  CourseManagementDto,
  CourseSearchCriteriaDto,
  CourseStatusUpdateDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { EnumUtils } from '../../../shared/helpers/EnumUtils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [
    CommonModule,
    FormsModule,
    StarRatingComponent,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './course-row.component.html',
  styleUrl: './course-row.component.scss',
})
export class CourseRowComponent implements OnInit {
  course = input.required<CourseManagementDto>();
  isPublished = false;
  statusChange = output<{ courseId: number; courseStatusUpdateDto: CourseStatusUpdateDto }>();

  ngOnInit(): void {
    this.isPublished = this.course().status === CourseSearchCriteriaDto.StatusEnum.Published;
  }

  onStatusChange(isPublished: boolean): void {
    this.isPublished = isPublished;
    if (isPublished) {
      this.statusChange.emit({
        courseId: this.course().id!,
        courseStatusUpdateDto: { status: CourseSearchCriteriaDto.StatusEnum.Published },
      });
    } else {
      this.statusChange.emit({
        courseId: this.course().id!,
        courseStatusUpdateDto: { status: CourseSearchCriteriaDto.StatusEnum.Draft },
      });
    }
  }

  formatDifficultyLevel(difficulyLevel: CourseSearchCriteriaDto.DifficultyLevelEnum | undefined): string {
    if (difficulyLevel) {
      return EnumUtils.formatDifficultyLevel(difficulyLevel);
    }
    return '';
  }

  formatStatus(status: CourseSearchCriteriaDto.StatusEnum | undefined): string {
    if (status) {
      return EnumUtils.formatStatus(status);
    }
    return '';
  }
}
