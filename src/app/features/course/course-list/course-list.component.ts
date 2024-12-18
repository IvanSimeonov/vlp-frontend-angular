import { Component, inject, OnInit, signal } from '@angular/core';
import { CourseCardComponent } from '../course-card/course-card.component';
import { CourseFilterComponent } from '../course-filter/course-filter.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  CourseControllerService,
  CourseOverviewDto,
  TopicAnalyticsDto,
  TopicControllerService,
} from '@ivannicksim/vlp-backend-openapi-client';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { delay } from 'rxjs';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CourseCardComponent,
    CourseFilterComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseControllerService);
  private topicService = inject(TopicControllerService);

  courses = signal<CourseOverviewDto[]>([]);
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
    difficultyLevel: CourseOverviewDto.DifficultyLevelEnum | undefined;
  }>({
    pageNumber: 0,
    pageSize: 10,
    sortBy: 'title',
    sortDirection: 'asc',
    searchTitle: '',
    searchAuthor: '',
    topic: '',
    difficultyLevel: undefined,
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
    const { pageNumber, pageSize, sortBy, sortDirection, searchTitle, searchAuthor, topic, difficultyLevel } =
      this.paginationSortingFiltering();
    this.courseService
      .getCourseOverview(
        {
          title: searchTitle,
          authorName: searchAuthor,
          difficultyLevel: difficultyLevel,
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
          console.log(res.content);
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

  fetchCourseImage(course: CourseOverviewDto) {
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

  toggleFiltersVisibility(): void {
    this.areFiltersVisible.set(!this.areFiltersVisible());
  }

  applyFilters(filters: {
    title: string;
    author: string;
    topic: string | undefined;
    difficulty: CourseOverviewDto.DifficultyLevelEnum | undefined;
  }): void {
    this.paginationSortingFiltering().searchTitle = filters.title;
    this.paginationSortingFiltering().searchAuthor = filters.author;
    this.paginationSortingFiltering().topic = filters.topic;
    this.paginationSortingFiltering().difficultyLevel = filters.difficulty;
    this.paginationSortingFiltering().pageNumber = 0;
    this.fetchCourses();
  }
}
