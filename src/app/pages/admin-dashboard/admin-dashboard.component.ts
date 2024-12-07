import { Component, inject, OnInit, ViewChild, AfterViewInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import {
  AdminControllerService,
  CourseAnalyticsDto,
  CourseControllerService,
  TopicAnalyticsDto,
  TopicControllerService,
  UserAnalyticsDto,
  UserTeacherAccessRequestDto,
} from '@ivannicksim/vlp-backend-openapi-client';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';

interface IChartData {
  name?: string;
  value?: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    NgxChartsModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private courseService = inject(CourseControllerService);
  private adminService = inject(AdminControllerService);
  private topicService = inject(TopicControllerService);

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  dataSource = signal<MatTableDataSource<UserTeacherAccessRequestDto>>(new MatTableDataSource());

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = signal(false);
  userAnalyticsData = signal<IChartData[]>([]);
  courseAnalyticsData = signal<IChartData[]>([]);
  topicAnalyticsData = signal<IChartData[]>([]);
  paginationSorting = signal({ pageNumber: 0, pageSize: 5, sortBy: 'firstName', sortDirection: 'asc' });
  isTableEmpty = computed(() => this.dataSource()?.data.length === 0);

  ngOnInit(): void {
    this.fetchUserTeacherAccessRequests();
    this.fetchCourseAnalyticsData();
    this.fetchUserAnalyticsData();
    this.fetchTopicAnalyticsData();
  }

  ngAfterViewInit(): void {
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }

  onPageChange(event: PageEvent): void {
    this.paginationSorting.update((state) => ({
      ...state,
      pageNumber: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.fetchUserTeacherAccessRequests();
  }

  onSortChange(event: Sort): void {
    this.paginator.pageIndex = 0;
    this.paginationSorting.update((state) => ({
      ...state,
      pageNumber: 0,
      sortBy: event.active,
      sortDirection: event.direction,
    }));
    this.fetchUserTeacherAccessRequests();
  }

  approveRequest(requestDto: UserTeacherAccessRequestDto): void {
    this.isLoading.set(true);
    this.adminService
      .approveTeacherAccessRequest(requestDto)
      .pipe(delay(500))
      .subscribe({
        next: () => this.handleRequestSuccess(),
        error: (err) => this.handleRequestError(err),
      });
  }

  denyRequest(requestDto: UserTeacherAccessRequestDto): void {
    this.isLoading.set(true);
    this.adminService
      .denyTeacherAccessRequest(requestDto)
      .pipe(delay(500))
      .subscribe({
        next: () => this.handleRequestSuccess(),
        error: (err) => this.handleRequestError(err),
      });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private fetchUserTeacherAccessRequests(): void {
    const { pageNumber, pageSize, sortBy, sortDirection } = this.paginationSorting();
    this.adminService.getPendingTeacherAccessRequests(pageNumber, pageSize, sortBy, sortDirection).subscribe((data) => {
      this.dataSource.set(new MatTableDataSource(data.content || []));
      this.paginator.length = data.totalElements || 0;
    });
  }

  private fetchCourseAnalyticsData() {
    this.courseService.getCourseAnalytics().subscribe((result: CourseAnalyticsDto[]) => {
      this.courseAnalyticsData.set(
        result.map((res) => ({
          name: res.difficultyLevel,
          value: res.totalCourses,
        }))
      );
    });
  }

  private fetchUserAnalyticsData() {
    this.adminService.getUserAnalytics().subscribe((result: UserAnalyticsDto[]) => {
      this.userAnalyticsData.set(
        result.map((res) => ({
          name: res.userGroup,
          value: res.totalUsers,
        }))
      );
    });
  }

  private fetchTopicAnalyticsData() {
    this.topicService.getTopicAnalytics().subscribe((result: TopicAnalyticsDto[]) => {
      this.topicAnalyticsData.set(
        result.map((res) => ({
          name: res.title,
          value: res.totalCourses,
        }))
      );
    });
  }

  private handleRequestSuccess() {
    this.isLoading.set(false);
    this.fetchUserTeacherAccessRequests();
    this.fetchUserAnalyticsData();
  }

  private handleRequestError(err: Error) {
    this.isLoading.set(false);
    console.error('Error: ', err);
  }
}
