import { Component, signal } from '@angular/core';
import { CourseFilterComponent } from '../course-filter/course-filter.component';
import { CourseRowComponent, ICourse } from '../course-row/course-row.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

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
export class CourseManagementComponent {
  areFiltersVisible = signal(true);
  isLoading = signal(false);
  pageSize = 10;
  courses: ICourse[] = [
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      topic: 'Software Development',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      status: 'Published',
      modificationDate: '333',
      totalStudents: 346,
    },
  ];

  toggleFiltersVisibility(): void {
    this.areFiltersVisible.set(!this.areFiltersVisible());
  }

  applyFilters(filters: { title: string; author: string; difficulty: string }): void {
    console.log(filters);
  }

  resetFilters(): void {
    console.log('');
  }

  paginate(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }
}
