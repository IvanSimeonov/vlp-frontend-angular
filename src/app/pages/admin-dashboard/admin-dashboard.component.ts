import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ITopic } from '../../features/topic/topic-management/topic-management.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

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
  ];
  topics: ITopic[] = [
    {
      id: 1,
      title: 'Software Development',
      description: 'Learn programming languages and tools to build efficient software solutions.',
      totalCourses: 5,
    },
    {
      id: 2,
      title: 'Science',
      description: 'Explore major scientific disciplines and discover how science explains our world.',
      totalCourses: 4,
    },
    {
      id: 3,
      title: 'Business',
      description: 'Master essential business skills from management to finance for organizational success.',
      totalCourses: 4,
    },
    {
      id: 4,
      title: 'Engineering',
      description: 'Study engineering principles and technologies across various engineering fields.',
      totalCourses: 3,
    },
    {
      id: 5,
      title: 'Personal Development',
      description: 'Develop life skills, productivity habits, and strategies for personal growth.',
      totalCourses: 4,
    },
    {
      id: 6,
      title: 'Design',
      description: 'Learn visual design principles and tools for creating compelling digital content.',
      totalCourses: 2,
    },
    {
      id: 7,
      title: 'Health & Wellness',
      description: 'Discover practices for improving physical and mental well-being.',
      totalCourses: 2,
    },
  ];

  coursesPerTopicData = this.topics.map((topic) => ({
    name: topic.title,
    value: topic.totalCourses,
  }));

  teacherRequests = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
  ];

  userAnalyticsData = [
    { name: 'Active Users', value: 155 },
    { name: 'Students', value: 120 },
    { name: 'Teachers', value: 30 },
    { name: 'Admins', value: 5 },
  ];

  courseAnalyticsData = [
    { name: 'Published', value: 40 },
    { name: 'Draft', value: 60 },
  ];

  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teacherAccessRequests);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  approveRequest(email: string): void {
    console.log('Approve Request User Email:', email);
  }

  denyRequest(email: string): void {
    console.log('Deny Request User Email:', email);
  }
}
