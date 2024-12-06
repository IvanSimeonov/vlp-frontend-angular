import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import {
  AdminControllerService,
  CourseAnalyticsDto,
  CourseControllerService,
  TopicAnalyticsDto,
  TopicControllerService,
  UserAnalyticsDto,
} from '@ivannicksim/vlp-backend-openapi-client';

interface TeacherAccessRequest {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgxChartsModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private courseService = inject(CourseControllerService);
  private adminService = inject(AdminControllerService);
  private topicService = inject(TopicControllerService);

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  dataSource!: MatTableDataSource<TeacherAccessRequest>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  teacherAccessRequests: TeacherAccessRequest[] = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
  ];

  userAnalyticsData: { name?: string; value?: number }[] = [];
  courseAnalyticsData: { name?: string; value?: number }[] = [];
  topicAnalyticsData: { name?: string; value?: number }[] = [];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teacherAccessRequests);
    this.fetchCourseAnalyticsData();
    this.fetchUserAnalyticsData();
    this.fetchTopicAnalyticsData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  approveRequest(email: string): void {
    // TODO: Add API call
    console.log('Approve Request User Email:', email);
  }

  denyRequest(email: string): void {
    // TODO: Add API call
    console.log('Deny Request User Email:', email);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private fetchCourseAnalyticsData() {
    this.courseService.getCourseAnalytics().subscribe((result: CourseAnalyticsDto[]) => {
      this.courseAnalyticsData = result.map((res) => ({
        name: res.difficultyLevel,
        value: res.totalCourses,
      }));
    });
  }

  private fetchUserAnalyticsData() {
    this.adminService.getUserAnalytics().subscribe((result: UserAnalyticsDto[]) => {
      this.userAnalyticsData = result.map((res) => ({
        name: res.userGroup,
        value: res.totalUsers,
      }));
    });
  }

  private fetchTopicAnalyticsData() {
    this.topicService.getTopicAnalytics().subscribe((result: TopicAnalyticsDto[]) => {
      this.topicAnalyticsData = result.map((res) => ({
        name: res.title,
        value: res.totalCourses,
      }));
    });
  }
}
