import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuditEntityDialogComponent } from '../../../components/audit-entity-dialog/audit-entity-dialog.component';
import { AuditService } from '../../../services/audit/audit.service';

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
  imports: [CommonModule, FormsModule, MatButtonModule, MatSlideToggleModule, MatTooltipModule, MatIconModule],
  templateUrl: './course-row.component.html',
  styleUrl: './course-row.component.scss',
})
export class CourseRowComponent implements OnInit {
  course = input.required<CourseManagementDto>();
  courseImage = input<Observable<Blob> | undefined>(undefined);
  courseImageUrl: string | undefined;
  isPublished = false;
  statusChange = output<{ courseId: number; courseStatusUpdateDto: CourseStatusUpdateDto }>();
  auditDialog = inject(MatDialog);
  auditService = inject(AuditService);

  openAuditDialogForCourse() {
    this.auditService.getDemoShadows('bg.tusofia.vlp.course.domain.Course', this.course().id!).subscribe((shadows) => {
      this.auditDialog.open(AuditEntityDialogComponent, {
        data: {
          actual: this.course(),
          shadows: shadows,
        },
        width: '80%',
        maxWidth: '100vw',
        height: '80%',
        maxHeight: '100vh',
      });
    });
  }

  ngOnInit(): void {
    this.isPublished = this.course().status === CourseSearchCriteriaDto.StatusEnum.Published;
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
