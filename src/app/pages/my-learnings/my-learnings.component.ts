import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseCardComponent, ICourse } from '../../features/course/course-card/course-card.component';
import { CourseFilterBarComponent } from '../../features/course/course-filter-bar/course-filter-bar.component';
import { ITopic } from '../../features/topic/topic-management/topic-management.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CourseRateDialogComponent } from '../../features/course/course-rate-dialog/course-rate-dialog.component';

interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImg?: string;
  linkedIn?: string;
  role?: string;
  enrolledCourses?: ICourse[];
  createdCourses?: ICourse[];
  completedCourses?: ICourse[];
}

@Component({
  selector: 'app-my-learnings',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    CourseCardComponent,
    CourseFilterBarComponent,
    MatDialogModule,
  ],
  templateUrl: './my-learnings.component.html',
  styleUrl: './my-learnings.component.scss',
})
export class MyLearningsComponent {
  user: IUser = {
    firstName: 'Ivan',
    lastName: 'Simeonov',
    email: 'ivan@simeonov.bg',
    linkedIn: 'https://linkedin.com/',
    role: 'ROLE_TEACHER',
    enrolledCourses: [
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },

      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
    ],
    createdCourses: [
      {
        id: 1,
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        id: 2,
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        id: 3,
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
    ],
    completedCourses: [
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
    ],
  };

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
  teachers = ['Jogn Doe', 'Sarah Connor'];
  statuses = ['Published', 'Draft'];

  topicsFormatted = this.topics.map((topic) => {
    return topic.title!;
  });

  activeTab = 'created';

  enrolledCourseFilters = [
    {
      id: 'topic',
      label: 'Filter by Topic',
      options: this.topicsFormatted,
    },
    { id: 'teacher', label: 'Filter by Teacher', options: this.teachers },
  ];

  createdCourseFilters = [
    {
      id: 'topic',
      label: 'Filter by Topic',
      options: this.topicsFormatted,
    },
    { id: 'status', label: 'Filter by Status', options: this.statuses },
  ];

  enrolledCourseSortOptions = [
    { id: 'title_asc', label: 'Title: A-Z' },
    { id: 'title_desc', label: 'Title: Z-A' },
    { id: 'date', label: 'Date Enrolled' },
  ];

  createdCourseSortOptions = [
    { id: 'students', label: 'Students' },
    { id: 'rating', label: 'Rating' },
  ];

  createdCoursesPageSize = 10;
  enrolledCoursesPageSize = 10;
  completedCoursesPageSize = 10;

  constructor(private dialog: MatDialog) {}

  handleTabChange(selectedIndex: number) {
    this.activeTab = selectedIndex === 0 ? 'created' : 'enrolled';
  }

  handleFiltersChange(filters: { topic?: string; teacher?: string; status?: string }) {
    console.log('Filters Change: ', filters);
  }

  handleSortChange(sortOption: string) {
    console.log('Sort Change: ', sortOption);
  }

  paginateCreatedCourses(event: PageEvent): void {
    this.createdCoursesPageSize = event.pageSize;
  }

  paginateEnrolledCourses(event: PageEvent): void {
    this.enrolledCoursesPageSize = event.pageSize;
  }

  paginateCompletedCourses(event: PageEvent): void {
    this.completedCoursesPageSize = event.pageSize;
  }

  getUserRole() {
    return this.user.role?.split('_')[1];
  }

  handleRate(course: ICourse): void {
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
}
