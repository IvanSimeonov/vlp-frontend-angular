import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CourseCardComponent, ICourse } from '../../course/course-card/course-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImg?: string;
  linkedIn?: string;
  role?: string;
  enrolledCourses?: ICourse[];
  createdCourses?: ICourse[];
}

@Component({
  selector: 'app-user-public-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTabsModule, MatPaginatorModule, CourseCardComponent],
  templateUrl: './user-public-profile.component.html',
  styleUrl: './user-public-profile.component.scss',
})
export class UserPublicProfileComponent {
  user: IUser = {
    firstName: 'Ivan',
    lastName: 'Simeonov',
    email: 'ivan@simeonov.bg',
    linkedIn: 'https://linkedin.com/',
    role: 'ROLE_TEACHER',
    enrolledCourses: [
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

      {
        id: 4,
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        id: 5,
        title: 'The Complete Python Bootcamp From Zero to Hero in Python',
        difficultyLevel: 'ADVANCED',
        image: '/images/innovation_3.jpg',
        rating: 4.6,
        totalVotes: 522235,
        author: 'Ivan Simeonov',
      },
      {
        id: 6,
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
  };
  createdCoursesPageSize = 10;
  enrolledCoursesPageSize = 10;

  paginateCreatedCourses(event: PageEvent): void {
    this.createdCoursesPageSize = event.pageSize;
  }

  paginateEnrolledCourses(event: PageEvent): void {
    this.enrolledCoursesPageSize = event.pageSize;
  }

  getUserRole() {
    return this.user.role?.split('_')[1];
  }
}
