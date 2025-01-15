import { Component, inject, OnInit } from '@angular/core';
import { AuditService, CourseDto } from '../../services/audit/audit.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { LectureDto } from '@ivannicksim/vlp-backend-openapi-client';

@Component({
  selector: 'app-course-audit',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatTabsModule],
  templateUrl: './course-audit.component.html',
  styleUrl: './course-audit.component.scss',
})
export class CourseAuditComponent implements OnInit {
  private auditService = inject(AuditService);
  private route = inject(ActivatedRoute);
  isLoading = true;
  id?: number;
  version?: number;
  course?: CourseDto;
  showFullDescription = false;
  sortedLectures: LectureDto[] = [];

  userColumns = ['name', 'email', 'role'];
  lectureColumns = ['sequenceNumber', 'title', 'description'];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.version = params['version'];
    });

    this.auditService.getCourseVersion(this.id!, this.version!).subscribe((course) => {
      this.course = course;
      this.sortedLectures = course.lectures;
      this.sortedLectures.sort((a, b) => a.sequenceNumber! - b.sequenceNumber!);
      this.isLoading = false;
    });
  }

  toggleShowFullDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}
