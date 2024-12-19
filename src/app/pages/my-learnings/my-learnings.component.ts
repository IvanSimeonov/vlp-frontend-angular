import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseCardComponent } from '../../features/course/course-card/course-card.component';
import { CourseFilterBarComponent } from '../../features/course/course-filter-bar/course-filter-bar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CourseRateDialogComponent } from '../../features/course/course-rate-dialog/course-rate-dialog.component';
import {
  CourseControllerService,
  CourseOverviewDto,
  TopicAnalyticsDto,
  TopicControllerService,
} from '@ivannicksim/vlp-backend-openapi-client';
import { delay } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-learnings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    CourseCardComponent,
    CourseFilterBarComponent,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './my-learnings.component.html',
  styleUrl: './my-learnings.component.scss',
})
export class MyLearningsComponent implements OnInit {
  private authService = inject(AuthService);
  private courseService = inject(CourseControllerService);
  private topicService = inject(TopicControllerService);
  private snackBar = inject(MatSnackBar);

  enrolledCourses = signal<CourseOverviewDto[]>([]);
  totalEnrolledCourses = signal<number>(0);
  completedCourses = signal<CourseOverviewDto[]>([]);
  totalCompletedCourses = signal<number>(0);
  createdCourses = signal<CourseOverviewDto[]>([]);
  totalCreatedCourses = signal<number>(0);
  topics = signal<TopicAnalyticsDto[]>([]);
  isLoading = signal<boolean>(false);
  user = computed(() => this.authService.user());
  activeTab = 'created';

  enrolledCourseSortOptions = [
    { id: 'title:asc', label: 'Title: A-Z' },
    { id: 'title:desc', label: 'Title: Z-A' },
  ];

  createdCourseSortOptions = [
    { id: 'title:asc', label: 'Title: A-Z' },
    { id: 'title:desc', label: 'Title: Z-A' },
  ];

  completedCourseSortOptions = [
    { id: 'title:asc', label: 'Title: A-Z' },
    { id: 'title:desc', label: 'Title: Z-A' },
  ];

  paginationSortingFilteringEnrolled = signal<{
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

  paginationSortingFilteringCreated = signal<{
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

  paginationSortingFilteringCompleted = signal<{
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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchTopics();
    this.fetchEnrolledCourses();
    this.fetchCompletedCourses();
    this.fetchCreatedCourses();
  }

  handleTabChange(selectedIndex: number) {
    this.activeTab = selectedIndex === 0 ? 'created' : selectedIndex === 1 ? 'enrolled' : 'completed';
  }

  handleCreatedCoursesFiltersChange(filters: { title: string; topic: string | undefined }) {
    this.paginationSortingFilteringCreated.update((state) => ({
      ...state,
      searchTitle: filters.title,
      topic: filters.topic,
    }));
    this.fetchCreatedCourses();
  }
  handleEnrolledCoursesFiltersChange(filters: { title: string; topic: string | undefined }) {
    this.paginationSortingFilteringEnrolled.update((state) => ({
      ...state,
      searchTitle: filters.title,
      topic: filters.topic,
    }));
    this.fetchEnrolledCourses();
  }
  handleCompletedCoursesFiltersChange(filters: { title: string; topic: string | undefined }) {
    this.paginationSortingFilteringCompleted.update((state) => ({
      ...state,
      searchTitle: filters.title,
      topic: filters.topic,
    }));
    this.fetchCompletedCourses();
  }

  sortCreatedCourses(event: MatSelectChange) {
    const [sortBy, sortDirection] = event.value.split(':');
    this.paginationSortingFilteringCreated.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: sortBy,
      sortDirection: sortDirection,
    }));
    this.fetchCreatedCourses();
  }

  sortEnrolledCourses(event: MatSelectChange) {
    const [sortBy, sortDirection] = event.value.split(':');
    this.paginationSortingFilteringEnrolled.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: sortBy,
      sortDirection: sortDirection,
    }));
    this.fetchEnrolledCourses();
  }

  sortCompletedCourses(event: MatSelectChange) {
    const [sortBy, sortDirection] = event.value.split(':');
    this.paginationSortingFilteringCompleted.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: sortBy,
      sortDirection: sortDirection,
    }));
    this.fetchCompletedCourses();
  }

  paginateCreatedCourses(event: PageEvent): void {
    this.paginationSortingFilteringCreated.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchCreatedCourses();
  }

  paginateEnrolledCourses(event: PageEvent): void {
    this.paginationSortingFilteringEnrolled.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchEnrolledCourses();
  }

  paginateCompletedCourses(event: PageEvent): void {
    this.paginationSortingFilteringCompleted.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchCompletedCourses();
  }

  handleRate(course: CourseOverviewDto): void {
    const dialogRef = this.dialog.open(CourseRateDialogComponent, {
      width: '400px',
      data: { course },
    });

    dialogRef.afterClosed().subscribe((rating) => {
      if (rating) {
        console.log('Rated with: ', rating);
      }
    });
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

  fetchCompletedCourses(): void {
    this.isLoading.set(true);
    const { pageNumber, pageSize, sortBy, sortDirection, searchTitle, searchAuthor, topic, difficultyLevel } =
      this.paginationSortingFilteringCompleted();
    this.courseService
      .getUsersCompletedCourses(
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
          this.completedCourses.set(res.content || []);
          this.totalCompletedCourses.set(res.totalElements || 0);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  fetchCreatedCourses(): void {
    this.isLoading.set(true);
    const { pageNumber, pageSize, sortBy, sortDirection, searchTitle, searchAuthor, topic, difficultyLevel } =
      this.paginationSortingFilteringCreated();
    console.log(pageSize);
    this.courseService
      .getUsersCreatedCourses(
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
          console.log(res);
          this.createdCourses.set(res.content || []);
          this.totalCreatedCourses.set(res.totalElements || 0);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error: ', err);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  fetchEnrolledCourses(): void {
    this.isLoading.set(true);
    const { pageNumber, pageSize, sortBy, sortDirection, searchTitle, searchAuthor, topic, difficultyLevel } =
      this.paginationSortingFilteringEnrolled();
    this.courseService
      .getUserEnrolledCourses(
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
          this.enrolledCourses.set(res.content || []);
          this.totalEnrolledCourses.set(res.totalElements || 0);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error: ', err);
          this.isLoading.set(false);
        },
        complete: () => {
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

  isUserTeacher(): boolean {
    const userRole = this.user()?.role;
    return userRole !== undefined && userRole === 'ROLE_TEACHER';
  }

  isUserCourseOwner(course: CourseOverviewDto): boolean {
    const userId = this.user()?.id;
    const courseAuthorId = course.author?.id;
    if (userId && courseAuthorId) {
      return courseAuthorId === userId;
    }
    return false;
  }

  handleDelete(course: CourseOverviewDto) {
    const courseId = course.id;
    if (courseId) {
      this.isLoading.set(true);
      this.courseService.deleteCourseById(courseId).subscribe({
        next: () => {
          this.snackBar.open('Course deleted successfully', 'Close', { duration: 3000 });
          this.fetchCreatedCourses();
        },
        error: () => {
          this.snackBar.open('Course cannot be deleted. Students exist!', 'Close', { duration: 3000 });
          this.isLoading.set(false);
        },
      });
    }
  }
}
