import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseFilterComponent } from '../course-filter/course-filter.component';
import { CourseRowComponent } from '../course-row/course-row.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import {
  CourseControllerService,
  CourseManagementDto,
  CourseSearchCriteriaDto,
  CourseStatusUpdateDto,
  TopicAnalyticsDto,
  TopicControllerService,
} from '@ivannicksim/vlp-backend-openapi-client';
import { delay } from 'rxjs';

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [
    CommonModule,
    CourseFilterComponent,
    CourseRowComponent,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss',
})
export class CourseManagementComponent implements OnInit {
  private courseService = inject(CourseControllerService);
  private topicService = inject(TopicControllerService);
  courses = signal<CourseManagementDto[]>([]);
  totalCourses = signal<number>(0);
  topics = signal<TopicAnalyticsDto[]>([]);
  isLoading = signal(false);
  areFiltersVisible = signal(true);
  paginationSortingFiltering = signal<{
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
    searchTitle: string;
    searchAuthor: string;
    topic: string | undefined;
    difficultyLevel: CourseManagementDto.DifficultyLevelEnum | undefined;
    status: CourseSearchCriteriaDto.StatusEnum | undefined;
  }>({
    pageNumber: 0,
    pageSize: 5,
    sortBy: 'title',
    sortDirection: 'asc',
    searchTitle: '',
    searchAuthor: '',
    topic: '',
    difficultyLevel: undefined,
    status: undefined,
  });

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchTopics();
  }

  fetchTopics(): void {
    this.topicService.getTopicAnalytics().subscribe({
      next: (res) => {
        this.topics.set(res);
      },
      error: (err) => {
        console.error('Error: ', err);
      },
    });
  }

  fetchCourses(): void {
    this.isLoading.set(true);
    const { pageNumber, pageSize, sortBy, sortDirection, searchTitle, searchAuthor, topic, difficultyLevel, status } =
      this.paginationSortingFiltering();
    this.courseService
      .getCourseManagementOverview(
        {
          title: searchTitle,
          authorName: searchAuthor,
          difficultyLevel: difficultyLevel,
          status: status,
          topic: topic,
        },
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
      )
      .pipe(delay(300))
      .subscribe({
        next: (res) => {
          this.courses.set(res.content || []);
          this.totalCourses.set(res.totalElements || 0);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error: ', err);
          this.isLoading.set(false);
        },
      });
  }

  fetchCourseImage(course: CourseManagementDto) {
    const imgPath = course.imagePath;
    if (imgPath) {
      return this.courseService.getCourseImage(imgPath);
    }
    return undefined;
  }

  onPageChange(event: PageEvent): void {
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchCourses();
  }

  onSortChange(event: MatSelectChange): void {
    const [sortBy, sortDirection] = event.value.split(':');
    this.paginationSortingFiltering.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: sortBy,
      sortDirection: sortDirection,
    }));
    this.fetchCourses();
  }

  onCourseStatusEdit(event: { courseId: number; courseStatusUpdateDto: CourseStatusUpdateDto }) {
    this.isLoading.set(true);
    this.courseService.updateCourseStatusById(event.courseId, event.courseStatusUpdateDto).subscribe({
      next: () => {
        this.fetchCourses();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log('Error: ', err);
      },
    });
  }

  toggleFiltersVisibility(): void {
    this.areFiltersVisible.set(!this.areFiltersVisible());
  }

  applyFilters(filters: {
    title: string;
    author: string;
    topic: string | undefined;
    difficulty: CourseSearchCriteriaDto.DifficultyLevelEnum | undefined;
    status: CourseSearchCriteriaDto.StatusEnum | undefined;
  }): void {
    this.paginationSortingFiltering().searchTitle = filters.title;
    this.paginationSortingFiltering().searchAuthor = filters.author;
    this.paginationSortingFiltering().topic = filters.topic;
    this.paginationSortingFiltering().difficultyLevel = filters.difficulty;
    this.paginationSortingFiltering().status = filters.status;
    this.paginationSortingFiltering().pageNumber = 0;
    this.fetchCourses();
    console.log(filters);
  }
}
