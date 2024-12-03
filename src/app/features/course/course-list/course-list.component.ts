import { Component } from '@angular/core';
import { CourseCardComponent, ICourse } from '../course-card/course-card.component';
import { CourseFilterComponent } from '../course-filter/course-filter.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
    CommonModule,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent {
  courses: ICourse[] = [
    {
      id: 1,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 2,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 3,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 4,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 5,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 6,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 7,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 8,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 9,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 10,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 11,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 12,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 13,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
    {
      id: 14,
      title: 'The Complete Python Bootcamp From Zero to Hero in Python',
      description:
        'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games.',
      difficultyLevel: 'ADVANCED',
      image: '/images/innovation_3.jpg',
      rating: 4.6,
      totalVotes: 522235,
      author: 'Ivan Simeonov',
      totalLectures: 3,
    },
  ];
  isLoading = false;
  isHidden = false;
  title = '';

  toggleVisibilty() {
    this.isHidden = !this.isHidden;
  }

  applyFilters(filters: { title: string; author: string; difficulty: string }) {
    console.log(filters);
    this.title = filters.title;
  }

  resetFilters() {
    console.log('');
  }
}
